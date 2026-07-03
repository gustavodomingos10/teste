/* ============================================================================
 *  FV-CHECK · GD ENGENHARIA — Verificação Estrutural Expressa p/ FV em Telhado
 *  auth.js — Contas, sessão, licença (trial/planos) e proteção de acesso
 *
 *  · Primeira conta criada vira ADMINISTRADORA e ativa o trial (14 dias)
 *  · Senhas: PBKDF2 (crypto.js); bloqueio progressivo anti-força-bruta
 *  · Sessão com expiração por inatividade (30 min)
 *  · Licença: TRIAL → plano mensal/anual por chave de ativação
 *    (chave mock GD-FV-…: em produção a validação é feita pelo backend)
 * ========================================================================== */
(function (root) {
  'use strict';

  var Crypto = root.FV && root.FV.Crypto;
  var Dados = root.FV && root.FV.Dados;
  var K = { contas: 'fvcheck.contas', licenca: 'fvcheck.licenca', tent: 'fvcheck.tentativas' };
  var SESSAO_MIN = 30;

  function ler(k, padrao) {
    try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : padrao; }
    catch (e) { return padrao; }
  }
  function gravar(k, v) { localStorage.setItem(k, JSON.stringify(v)); }

  var Auth = {
    sessaoAtual: null,

    /* ---------------- contas ---------------- */
    contas: function () { return ler(K.contas, []); },
    temContas: function () { return Auth.contas().length > 0; },

    criarConta: function (dados) {
      var contas = Auth.contas();
      var login = String(dados.login || '').trim().toLowerCase();
      if (!/^[a-z0-9._@-]{3,60}$/.test(login)) return Promise.reject(new Error('Login inválido (mínimo 3 caracteres, sem espaços).'));
      if (contas.some(function (c) { return c.login === login; })) return Promise.reject(new Error('Já existe uma conta com este login.'));
      if (Crypto.forcaSenha(dados.senha) < 2) return Promise.reject(new Error('Senha fraca: use ao menos 8 caracteres, misturando maiúsculas, minúsculas e números.'));
      var salt = Crypto.salt();
      return Crypto.derivar(dados.senha, salt).then(function (hash) {
        var conta = {
          id: 'u' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
          login: login, nome: String(dados.nome || '').trim() || login,
          empresa: String(dados.empresa || '').trim(),
          email: String(dados.email || '').trim(),
          papel: contas.length === 0 ? 'admin' : (dados.papel || 'user'),
          salt: salt, hash: hash, iter: Crypto.ITERACOES,
          criadoEm: new Date().toISOString()
        };
        contas.push(conta);
        gravar(K.contas, contas);
        if (contas.length === 1 && !Auth.licenca()) Auth.iniciarTrial();
        return conta;
      });
    },

    /* bloqueio anti-força-bruta: 5 falhas → 5 min */
    _bloqueio: function (login) {
      var t = ler(K.tent, {});
      var reg = t[login];
      if (reg && reg.n >= 5 && (Date.now() - reg.ts) < 5 * 60 * 1000) {
        return Math.ceil((5 * 60 * 1000 - (Date.now() - reg.ts)) / 60000);
      }
      return 0;
    },
    _registrarFalha: function (login) {
      var t = ler(K.tent, {});
      var reg = t[login] || { n: 0, ts: 0 };
      if (Date.now() - reg.ts > 5 * 60 * 1000) reg.n = 0;
      reg.n++; reg.ts = Date.now();
      t[login] = reg; gravar(K.tent, t);
    },
    _limparFalhas: function (login) {
      var t = ler(K.tent, {}); delete t[login]; gravar(K.tent, t);
    },

    entrar: function (login, senha) {
      login = String(login || '').trim().toLowerCase();
      var conta = Auth.contas().filter(function (c) { return c.login === login; })[0];
      var min = Auth._bloqueio(login);
      if (min > 0) return Promise.reject(new Error('Conta temporariamente bloqueada por tentativas falhas. Tente novamente em ' + min + ' min.'));
      if (!conta) { Auth._registrarFalha(login); return Promise.reject(new Error('Login ou senha incorretos.')); }
      return Crypto.derivar(senha, conta.salt, conta.iter).then(function (hash) {
        if (!Crypto.igualConstante(hash, conta.hash)) {
          Auth._registrarFalha(login);
          throw new Error('Login ou senha incorretos.');
        }
        Auth._limparFalhas(login);
        Auth.sessaoAtual = { login: conta.login, nome: conta.nome, papel: conta.papel, id: conta.id, inicio: Date.now(), ultimaAtividade: Date.now() };
        if (root.FV.Audit) root.FV.Audit.registrar('login', { login: conta.login });
        return Auth.sessaoAtual;
      });
    },

    sair: function () {
      if (Auth.sessaoAtual && root.FV.Audit) root.FV.Audit.registrar('logout', { login: Auth.sessaoAtual.login });
      Auth.sessaoAtual = null;
    },

    registrarAtividade: function () {
      if (Auth.sessaoAtual) Auth.sessaoAtual.ultimaAtividade = Date.now();
    },
    sessaoValida: function () {
      var s = Auth.sessaoAtual;
      if (!s) return false;
      if (Date.now() - s.ultimaAtividade > SESSAO_MIN * 60 * 1000) { Auth.sessaoAtual = null; return false; }
      return true;
    },

    trocarSenha: function (login, senhaAtual, senhaNova) {
      return Auth.entrar(login, senhaAtual).then(function () {
        if (Crypto.forcaSenha(senhaNova) < 2) throw new Error('Senha nova fraca: use ao menos 8 caracteres variados.');
        var salt = Crypto.salt();
        return Crypto.derivar(senhaNova, salt).then(function (hash) {
          var contas = Auth.contas();
          contas.forEach(function (c) { if (c.login === login) { c.salt = salt; c.hash = hash; c.iter = Crypto.ITERACOES; } });
          gravar(K.contas, contas);
          if (root.FV.Audit) root.FV.Audit.registrar('troca_senha', { login: login });
          return true;
        });
      });
    },

    /* ---------------- licença ---------------- */
    licenca: function () { return ler(K.licenca, null); },

    iniciarTrial: function () {
      var dias = (Dados && Dados.PRECOS.trialDias) || 14;
      var lic = {
        tipo: 'trial', plano: 'TRIAL',
        inicio: new Date().toISOString(),
        fim: new Date(Date.now() + dias * 86400000).toISOString()
      };
      gravar(K.licenca, lic);
      return lic;
    },

    /* chave mock: GD-FV-<PLANO>-<MESES>-<CHECK> ; ex.: GD-FV-INTEGRADOR-12-7C
     * (em produção: validação/assinatura no backend de cobrança) */
    validarChave: function (chave) {
      var m = /^GD-FV-([A-Z_]+)-(\d{1,2})-([0-9A-F]{2})$/.exec(String(chave || '').trim().toUpperCase());
      if (!m) return null;
      var plano = m[1], meses = parseInt(m[2], 10);
      var corpo = 'GD-FV-' + plano + '-' + m[2];
      var soma = 0;
      for (var i = 0; i < corpo.length; i++) soma = (soma * 31 + corpo.charCodeAt(i)) % 251;
      var check = ('0' + soma.toString(16).toUpperCase()).slice(-2);
      if (check !== m[3]) return null;
      var planoOk = Dados && Dados.PRECOS.planos.some(function (p) { return p.id === plano; });
      if (!planoOk || !(meses >= 1 && meses <= 24)) return null;
      return { plano: plano, meses: meses };
    },
    gerarChave: function (plano, meses) { // utilitário do admin/testes
      var corpo = 'GD-FV-' + plano + '-' + meses;
      var soma = 0;
      for (var i = 0; i < corpo.length; i++) soma = (soma * 31 + corpo.charCodeAt(i)) % 251;
      return corpo + '-' + ('0' + soma.toString(16).toUpperCase()).slice(-2);
    },

    ativarLicenca: function (chave) {
      var v = Auth.validarChave(chave);
      if (!v) throw new Error('Chave de ativação inválida.');
      var lic = {
        tipo: 'assinatura', plano: v.plano,
        inicio: new Date().toISOString(),
        fim: new Date(Date.now() + v.meses * 30 * 86400000).toISOString(),
        chave: chave.trim().toUpperCase()
      };
      gravar(K.licenca, lic);
      if (root.FV.Audit) root.FV.Audit.registrar('licenca_ativada', { plano: v.plano, meses: v.meses });
      return lic;
    },

    estadoLicenca: function () {
      var lic = Auth.licenca();
      if (!lic) return { ok: false, motivo: 'sem_licenca', diasRestantes: 0, lic: null };
      var dias = Math.ceil((new Date(lic.fim).getTime() - Date.now()) / 86400000);
      if (dias <= 0) return { ok: false, motivo: 'expirada', diasRestantes: 0, lic: lic };
      return { ok: true, diasRestantes: dias, lic: lic, trial: lic.tipo === 'trial' };
    }
  };

  root.FV = root.FV || {};
  root.FV.Auth = Auth;
  if (typeof module !== 'undefined' && module.exports) module.exports = Auth;
})(typeof self !== 'undefined' ? self : (typeof globalThis !== 'undefined' ? globalThis : this));
