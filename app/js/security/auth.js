/* ============================================================================
 *  LINHA DE VIDA · GD ENGENHARIA
 *  auth.js — Autenticação, perfis de acesso (RBAC), sessões e licença
 *
 *  Controla QUEM acessa o software e O QUE pode fazer — requisito para a
 *  comercialização. Recursos:
 *    · usuários com senha protegida por PBKDF2 (crypto.js)
 *    · perfis (admin, engenheiro, inspetor, leitor) com permissões
 *    · bloqueio temporário após tentativas falhas (anti força-bruta)
 *    · sessões com expiração e tempo de inatividade
 *    · licença/ativação do produto (controle comercial)
 *
 *  Backend de armazenamento é injetável (localStorage no navegador; objeto em
 *  memória nos testes). Para SaaS multiempresa, ver docs/SEGURANCA.md.
 * ========================================================================== */
(function (root) {
  'use strict';

  var Crypto;
  if (typeof module !== 'undefined' && module.exports) Crypto = require('./crypto.js');
  function deps() { Crypto = Crypto || (root.LV && root.LV.Crypto); if (!Crypto) throw new Error('auth.js: crypto.js não carregado'); }

  // ---- Perfis e permissões -------------------------------------------------
  var PERMISSOES = {
    admin:      ['gerenciar_usuarios', 'gerenciar_licenca', 'configurar', 'editar_projeto', 'calcular', 'emitir_prontuario', 'registrar_inspecao', 'assinar_rt', 'ver'],
    engenheiro: ['editar_projeto', 'calcular', 'emitir_prontuario', 'registrar_inspecao', 'assinar_rt', 'ver'],
    inspetor:   ['registrar_inspecao', 'ver'],
    leitor:     ['ver']
  };
  var PERFIS = {
    admin: 'Administrador', engenheiro: 'Engenheiro (RT)', inspetor: 'Inspetor', leitor: 'Leitor'
  };

  // ---- Parâmetros de segurança --------------------------------------------
  var MAX_TENTATIVAS = 5;
  var BLOQUEIO_MS = 15 * 60 * 1000;          // 15 min
  var SESSAO_MS = 8 * 60 * 60 * 1000;        // expira em 8 h
  var INATIVIDADE_MS = 30 * 60 * 1000;       // 30 min de inatividade

  var K_USERS = 'lv_users', K_SESSION = 'lv_session', K_LICENSE = 'lv_license';

  // ---- Backend de armazenamento -------------------------------------------
  var store = null;
  function memStore() {
    var m = {};
    return { getItem: function (k) { return k in m ? m[k] : null; }, setItem: function (k, v) { m[k] = String(v); }, removeItem: function (k) { delete m[k]; } };
  }
  function setStore(s) { store = s; }
  function ensureStore() {
    if (store) return store;
    if (typeof localStorage !== 'undefined') store = localStorage; else store = memStore();
    return store;
  }
  function load(key, def) { try { var v = ensureStore().getItem(key); return v ? JSON.parse(v) : def; } catch (e) { return def; } }
  function save(key, obj) { ensureStore().setItem(key, JSON.stringify(obj)); }

  // ---- Relógio injetável (testes determinísticos) -------------------------
  var clock = function () { return Date.now(); };
  function setClock(fn) { clock = fn; }

  // ---- Inicialização -------------------------------------------------------
  /**
   * Inicializa o módulo. Cria o administrador padrão na primeira execução
   * (usuário "admin", senha inicial "GD-altura@2026"), exigindo troca no
   * primeiro acesso. Documentado em docs/SEGURANCA.md.
   */
  function init(opts) {
    deps();
    opts = opts || {};
    if (opts.store) setStore(opts.store);
    if (opts.clock) setClock(opts.clock);
    var users = load(K_USERS, null);
    if (!users || Object.keys(users).length === 0) {
      return Crypto.hashSenha(opts.senhaAdminInicial || 'GD-altura@2026').then(function (reg) {
        var u = {};
        u['admin'] = {
          username: 'admin', nome: 'Administrador', role: 'admin', senha: reg,
          ativo: true, mustChange: true, criadoEm: clock(), falhas: 0, bloqueadoAte: 0
        };
        save(K_USERS, u);
        return { criouAdmin: true };
      });
    }
    return Promise.resolve({ criouAdmin: false });
  }

  // ---- Usuários ------------------------------------------------------------
  function listarUsuarios() {
    var u = load(K_USERS, {});
    return Object.keys(u).map(function (k) {
      var x = u[k];
      return { username: x.username, nome: x.nome, role: x.role, ativo: x.ativo, mustChange: x.mustChange, bloqueado: x.bloqueadoAte > clock() };
    });
  }

  function criarUsuario(dados) {
    deps();
    var u = load(K_USERS, {});
    var username = String(dados.username || '').trim().toLowerCase();
    if (!username) return Promise.reject(new Error('Usuário inválido.'));
    if (u[username]) return Promise.reject(new Error('Usuário já existe: ' + username));
    if (!PERMISSOES[dados.role]) return Promise.reject(new Error('Perfil inválido: ' + dados.role));
    var f = Crypto.forcaSenha(dados.senha || '');
    if (!f.aceitavel) return Promise.reject(new Error('Senha fraca: mínimo 8 caracteres, com maiúscula, minúscula e número.'));
    return Crypto.hashSenha(dados.senha).then(function (reg) {
      u[username] = {
        username: username, nome: dados.nome || username, role: dados.role, senha: reg,
        ativo: true, mustChange: !!dados.mustChange, criadoEm: clock(), falhas: 0, bloqueadoAte: 0
      };
      save(K_USERS, u);
      return { ok: true, username: username };
    });
  }

  function removerUsuario(username) {
    var u = load(K_USERS, {});
    username = String(username || '').toLowerCase();
    if (username === 'admin') throw new Error('O administrador padrão não pode ser removido.');
    delete u[username];
    save(K_USERS, u);
    return { ok: true };
  }

  function definirAtivo(username, ativo) {
    var u = load(K_USERS, {});
    username = String(username || '').toLowerCase();
    if (!u[username]) throw new Error('Usuário inexistente.');
    u[username].ativo = !!ativo;
    save(K_USERS, u);
    return { ok: true };
  }

  // ---- Login / Logout ------------------------------------------------------
  function login(username, senha) {
    deps();
    username = String(username || '').trim().toLowerCase();
    var u = load(K_USERS, {});
    var user = u[username];
    if (!user) return Promise.resolve({ ok: false, erro: 'Usuário ou senha inválidos.' });
    if (!user.ativo) return Promise.resolve({ ok: false, erro: 'Usuário desativado. Procure o administrador.' });
    if (user.bloqueadoAte > clock()) {
      var min = Math.ceil((user.bloqueadoAte - clock()) / 60000);
      return Promise.resolve({ ok: false, erro: 'Conta bloqueada por tentativas. Tente novamente em ' + min + ' min.' });
    }
    return Crypto.verificarSenha(senha, user.senha).then(function (ok) {
      if (!ok) {
        user.falhas = (user.falhas || 0) + 1;
        if (user.falhas >= MAX_TENTATIVAS) { user.bloqueadoAte = clock() + BLOQUEIO_MS; user.falhas = 0; }
        save(K_USERS, u);
        return { ok: false, erro: 'Usuário ou senha inválidos.' };
      }
      user.falhas = 0; user.bloqueadoAte = 0; user.ultimoAcesso = clock();
      save(K_USERS, u);
      var agora = clock();
      var sessao = {
        username: user.username, nome: user.nome, role: user.role,
        criadaEm: agora, expiraEm: agora + SESSAO_MS, ultimaAtividade: agora,
        token: Crypto.randomHex(24), mustChange: user.mustChange
      };
      save(K_SESSION, sessao);
      return { ok: true, sessao: sessao };
    });
  }

  function logout() { ensureStore().removeItem(K_SESSION); return { ok: true }; }

  /** Sessão atual válida (verifica expiração e inatividade) ou null. */
  function sessaoAtual() {
    var s = load(K_SESSION, null);
    if (!s) return null;
    var agora = clock();
    if (agora > s.expiraEm || (agora - s.ultimaAtividade) > INATIVIDADE_MS) { logout(); return null; }
    return s;
  }

  function registrarAtividade() {
    var s = load(K_SESSION, null);
    if (s) { s.ultimaAtividade = clock(); save(K_SESSION, s); }
  }

  // ---- Permissões ----------------------------------------------------------
  function pode(acao, sessao) {
    sessao = sessao || sessaoAtual();
    if (!sessao) return false;
    var perms = PERMISSOES[sessao.role] || [];
    return perms.indexOf(acao) !== -1;
  }

  // ---- Troca de senha ------------------------------------------------------
  function trocarSenha(username, senhaAtual, novaSenha) {
    deps();
    username = String(username || '').toLowerCase();
    var u = load(K_USERS, {});
    var user = u[username];
    if (!user) return Promise.reject(new Error('Usuário inexistente.'));
    var f = Crypto.forcaSenha(novaSenha);
    if (!f.aceitavel) return Promise.reject(new Error('Senha fraca: mínimo 8 caracteres, com maiúscula, minúscula e número.'));
    return Crypto.verificarSenha(senhaAtual, user.senha).then(function (ok) {
      if (!ok) throw new Error('Senha atual incorreta.');
      return Crypto.hashSenha(novaSenha);
    }).then(function (reg) {
      user.senha = reg; user.mustChange = false;
      save(K_USERS, u);
      var s = sessaoAtual(); if (s && s.username === username) { s.mustChange = false; save(K_SESSION, s); }
      return { ok: true };
    });
  }

  /** Reset de senha por administrador (gera nova senha temporária). */
  function resetarSenha(username, novaSenhaTemp) {
    deps();
    username = String(username || '').toLowerCase();
    var u = load(K_USERS, {});
    var user = u[username];
    if (!user) return Promise.reject(new Error('Usuário inexistente.'));
    return Crypto.hashSenha(novaSenhaTemp).then(function (reg) {
      user.senha = reg; user.mustChange = true; user.falhas = 0; user.bloqueadoAte = 0;
      save(K_USERS, u);
      return { ok: true };
    });
  }

  // ---- Licença / ativação --------------------------------------------------
  /**
   * Validação de licença offline. A chave tem o formato:
   *   GDLV-<cliente>-<AAAAMMDD validade>-<plano>-<assinatura>
   * onde assinatura = SHA-256(payload + segredo do produto) truncado.
   * Observação: por ser verificação local, é um CONTROLE COMERCIAL, não uma
   * barreira criptográfica forte — o caminho para verificação em servidor está
   * descrito em docs/SEGURANCA.md.
   */
  var SEGREDO_PRODUTO = 'GD-ENGENHARIA-LV-2026';
  function validarChave(chave) {
    deps();
    chave = String(chave || '').trim().toUpperCase();
    var p = chave.split('-');
    if (p.length < 5 || p[0] !== 'GDLV') return Promise.resolve({ ok: false, erro: 'Formato de chave inválido.' });
    var cliente = p[1], validade = p[2], plano = p[3], assinf = p.slice(4).join('-');
    var payload = ['GDLV', cliente, validade, plano].join('-');
    return Crypto.sha256(payload + '|' + SEGREDO_PRODUTO).then(function (h) {
      var esperado = h.slice(0, 12).toUpperCase();
      if (!Crypto.timingSafeEqual(esperado, assinf)) return { ok: false, erro: 'Assinatura da licença inválida.' };
      var hoje = clock();
      var venc = Date.UTC(+validade.slice(0, 4), +validade.slice(4, 6) - 1, +validade.slice(6, 8), 23, 59, 59);
      if (isFinite(venc) && hoje > venc) return { ok: false, erro: 'Licença expirada em ' + validade + '.', cliente: cliente, validade: validade };
      return { ok: true, cliente: cliente, validade: validade, plano: plano };
    });
  }

  function ativar(chave) {
    return validarChave(chave).then(function (r) {
      if (r.ok) save(K_LICENSE, { chave: chave, cliente: r.cliente, validade: r.validade, plano: r.plano, ativadoEm: clock() });
      return r;
    });
  }
  function licencaAtual() { return load(K_LICENSE, null); }
  function licencaValida() {
    var l = licencaAtual();
    if (!l) return Promise.resolve({ ok: false, erro: 'Sem licença ativada.' });
    return validarChave(l.chave);
  }
  /** Utilitário para o vendedor/admin gerar uma chave para um cliente. */
  function gerarChave(cliente, validadeAAAAMMDD, plano) {
    deps();
    cliente = String(cliente).toUpperCase().replace(/[^A-Z0-9]/g, '');
    plano = String(plano || 'PRO').toUpperCase();
    var payload = ['GDLV', cliente, validadeAAAAMMDD, plano].join('-');
    return Crypto.sha256(payload + '|' + SEGREDO_PRODUTO).then(function (h) {
      return payload + '-' + h.slice(0, 12).toUpperCase();
    });
  }

  var Auth = {
    init: init, setStore: setStore, setClock: setClock, memStore: memStore,
    PERMISSOES: PERMISSOES, PERFIS: PERFIS,
    listarUsuarios: listarUsuarios, criarUsuario: criarUsuario, removerUsuario: removerUsuario, definirAtivo: definirAtivo,
    login: login, logout: logout, sessaoAtual: sessaoAtual, registrarAtividade: registrarAtividade, pode: pode,
    trocarSenha: trocarSenha, resetarSenha: resetarSenha,
    validarChave: validarChave, ativar: ativar, licencaAtual: licencaAtual, licencaValida: licencaValida, gerarChave: gerarChave
  };
  root.LV = root.LV || {};
  root.LV.Auth = Auth;
  if (typeof module !== 'undefined' && module.exports) module.exports = Auth;
})(typeof self !== 'undefined' ? self : (typeof globalThis !== 'undefined' ? globalThis : this));
