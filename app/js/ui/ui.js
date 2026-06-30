/* ============================================================================
 *  LINHA DE VIDA · GD ENGENHARIA
 *  ui.js — Núcleo da interface: helpers de DOM, shell, login e navegação
 * ========================================================================== */
(function (root) {
  'use strict';
  var LV = root.LV = root.LV || {};

  // ---- Helpers de DOM ----
  function h(tag, attrs, children) {
    var el = document.createElement(tag);
    attrs = attrs || {};
    Object.keys(attrs).forEach(function (k) {
      if (k === 'class') el.className = attrs[k];
      else if (k === 'html') el.innerHTML = attrs[k];
      else if (k === 'text') el.textContent = attrs[k];
      else if (k.slice(0, 2) === 'on' && typeof attrs[k] === 'function') el.addEventListener(k.slice(2), attrs[k]);
      else if (k === 'value') el.value = attrs[k];
      else if (attrs[k] != null) el.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function (c) { if (c == null) return; el.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
    return el;
  }
  function qs(sel, ctx) { return (ctx || document).querySelector(sel); }
  function clear(el) { while (el.firstChild) el.removeChild(el.firstChild); return el; }
  function toast(msg, tipo) {
    var t = h('div', { class: 'toast ' + (tipo || 'info'), text: msg });
    document.body.appendChild(t);
    setTimeout(function () { t.classList.add('show'); }, 10);
    setTimeout(function () { t.classList.remove('show'); setTimeout(function () { t.remove(); }, 300); }, 3200);
  }
  function confirmar(msg) { return window.confirm(msg); }

  // ---- Estado da aplicação ----
  var state = { rota: 'painel', projetoId: null, resultado: null };
  LV.state = state;

  function T(k) { return LV.I18n ? LV.I18n.t(k) : k; }

  // ---- Boot ----
  function boot() {
    var app = qs('#app');
    // Seleção de país/idioma na primeira execução
    if (LV.Paises && !LV.Paises.getSelecionado()) return telaPais();
    if (LV.Paises && LV.I18n) LV.I18n.setLang(LV.Paises.get(LV.Paises.getSelecionado()).idioma);
    LV.Auth.init().then(function () {
      var lic = LV.Auth.licencaAtual();
      if (!lic) return telaLicenca();
      return LV.Auth.licencaValida().then(function (r) {
        if (!r.ok) return telaLicenca(r.erro);
        var sess = LV.Auth.sessaoAtual();
        if (!sess) return telaLogin();
        if (sess.mustChange) return telaTrocaSenha(sess);
        montarApp();
      });
    }).catch(function (e) { app.innerHTML = '<div class="erro-fatal">Erro ao iniciar: ' + e.message + '</div>'; });
  }

  // ---- Tela de seleção de país / idioma ----
  function telaPais() {
    var app = clear(qs('#app'));
    function escolher(cod) {
      LV.Paises.setSelecionado(cod);
      if (LV.I18n) LV.I18n.setLang(LV.Paises.get(cod).idioma);
      boot();
    }
    var paises = LV.Paises.lista();
    app.appendChild(h('div', { class: 'auth-wrap' }, [
      h('div', { class: 'auth-card pais-card' }, [
        marca(),
        h('h2', { text: 'Selecione o país / Select country' }),
        h('p', { class: 'muted', text: 'O software ajusta normas, unidades e idioma automaticamente. / The software adapts standards, units and language automatically.' }),
        h('div', { class: 'pais-grid' }, paises.map(function (p) {
          return h('button', { class: 'pais-btn', onclick: function () { escolher(p.codigo); } }, [
            h('span', { class: 'pais-flag', text: p.bandeira }),
            h('span', { class: 'pais-nome', text: p.nome }),
            h('span', { class: 'pais-sub', text: p.codigo === 'BR' ? 'Português · SI · NR-35/NBR' : 'English · Imperial · OSHA/ANSI' })
          ]);
        })),
        rodapeMarca()
      ])
    ]));
  }

  // ---- Tela de licença ----
  function telaLicenca(erro) {
    var app = clear(qs('#app'));
    var inp;
    app.appendChild(h('div', { class: 'auth-wrap' }, [
      h('div', { class: 'auth-card' }, [
        marca(),
        h('h2', { text: 'Ativação do software' }),
        erro ? h('div', { class: 'auth-erro', text: erro }) : null,
        h('p', { class: 'muted', text: 'Informe a chave de licença fornecida pela GD Engenharia ou inicie uma avaliação de 30 dias.' }),
        inp = h('input', { class: 'inp', placeholder: 'GDLV-CLIENTE-AAAAMMDD-PLANO-ASSINATURA', spellcheck: 'false' }),
        h('button', { class: 'btn primary block', text: 'Ativar licença', onclick: function () {
          LV.Auth.ativar(inp.value).then(function (r) { if (r.ok) { toast('Licença ativada para ' + r.cliente, 'ok'); boot(); } else toast(r.erro, 'erro'); });
        } }),
        h('button', { class: 'btn ghost block', text: 'Iniciar avaliação (30 dias)', onclick: function () {
          var d = new Date(Date.now() + 30 * 864e5);
          var vd = d.getFullYear() + ('0' + (d.getMonth() + 1)).slice(-2) + ('0' + d.getDate()).slice(-2);
          LV.Auth.gerarChave('AVALIACAO', vd, 'TRIAL').then(function (k) { return LV.Auth.ativar(k); }).then(function () { toast('Avaliação iniciada (30 dias).', 'ok'); boot(); });
        } }),
        rodapeMarca()
      ])
    ]));
  }

  // ---- Tela de login ----
  function telaLogin(erro) {
    var app = clear(qs('#app'));
    var u, p;
    function entrar() {
      LV.Auth.login(u.value, p.value).then(function (r) {
        if (!r.ok) { toast(r.erro, 'erro'); return; }
        LV.Audit.registrar('login', { usuario: r.sessao.username, role: r.sessao.role }).catch(function(){});
        if (r.sessao.mustChange) return telaTrocaSenha(r.sessao);
        montarApp();
      });
    }
    app.appendChild(h('div', { class: 'auth-wrap' }, [
      h('div', { class: 'auth-card' }, [
        marca(),
        h('h2', { text: 'Acesso ao sistema' }),
        erro ? h('div', { class: 'auth-erro', text: erro }) : null,
        rotulo('Usuário'),
        u = h('input', { class: 'inp', placeholder: 'usuário', autofocus: 'true' }),
        rotulo('Senha'),
        p = h('input', { class: 'inp', type: 'password', placeholder: 'senha', onkeydown: function (e) { if (e.key === 'Enter') entrar(); } }),
        h('button', { class: 'btn primary block', text: 'Entrar', onclick: entrar }),
        h('p', { class: 'muted small', html: 'Primeiro acesso: usuário <b>admin</b> · senha <b>GD-altura@2026</b> (troca obrigatória).' }),
        rodapeMarca()
      ])
    ]));
  }

  // ---- Troca de senha obrigatória ----
  function telaTrocaSenha(sess) {
    var app = clear(qs('#app'));
    var atual, n1, n2, barra;
    function avaliar() { var fz = LV.Crypto.forcaSenha(n1.value); barra.style.width = (fz.score * 25) + '%'; barra.className = 'forca-bar s' + fz.score; }
    function trocar() {
      if (n1.value !== n2.value) { toast('As senhas não conferem.', 'erro'); return; }
      LV.Auth.trocarSenha(sess.username, atual.value, n1.value).then(function () {
        toast('Senha alterada com sucesso.', 'ok'); montarApp();
      }).catch(function (e) { toast(e.message, 'erro'); });
    }
    app.appendChild(h('div', { class: 'auth-wrap' }, [
      h('div', { class: 'auth-card' }, [
        marca(), h('h2', { text: 'Defina sua nova senha' }),
        h('p', { class: 'muted', text: 'Por segurança, é necessário alterar a senha no primeiro acesso.' }),
        rotulo('Senha atual'), atual = h('input', { class: 'inp', type: 'password' }),
        rotulo('Nova senha'), n1 = h('input', { class: 'inp', type: 'password', oninput: avaliar }),
        h('div', { class: 'forca-wrap' }, [barra = h('div', { class: 'forca-bar s0' })]),
        h('div', { class: 'muted small', text: 'Mínimo 8 caracteres, com maiúscula, minúscula e número.' }),
        rotulo('Confirmar nova senha'), n2 = h('input', { class: 'inp', type: 'password', onkeydown: function (e) { if (e.key === 'Enter') trocar(); } }),
        h('button', { class: 'btn primary block', text: 'Salvar nova senha', onclick: trocar })
      ])
    ]));
  }

  // ---- Shell principal ----
  function montarApp() {
    var sess = LV.Auth.sessaoAtual();
    if (!sess) return telaLogin();
    LV.Auth.registrarAtividade();
    var app = clear(qs('#app'));
    var lic = LV.Auth.licencaAtual();
    var nav = navItens(sess);
    var sidebar = h('aside', { class: 'sidebar' }, [
      h('div', { class: 'sb-marca', html: '<b>Linha de Vida</b><span>GD Engenharia</span>' }),
      h('nav', { class: 'sb-nav' }, nav.map(function (it) {
        return h('a', { class: 'sb-link' + (state.rota === it.rota ? ' ativo' : ''), href: '#', onclick: function (e) { e.preventDefault(); irPara(it.rota); } }, [
          h('span', { class: 'ico', text: it.ico }), h('span', { text: it.nome })
        ]);
      })),
      h('div', { class: 'sb-rodape' }, [
        h('div', { class: 'sb-user' }, [h('b', { text: sess.nome }), h('span', { text: T('role.' + sess.role) })]),
        h('div', { class: 'sb-lic small', text: 'Licença: ' + (lic ? lic.cliente + (lic.plano === 'TRIAL' ? ' (avaliação)' : '') : '—') }),
        h('button', { class: 'sb-pais', title: 'Trocar país / Change country', onclick: function () { trocarPais(); } }, [
          h('span', { text: nomePaisAtual() })
        ]),
        h('button', { class: 'btn ghost block small', text: T('app.sair'), onclick: function () { LV.Auth.logout(); toast('Sessão encerrada.', 'info'); telaLogin(); } })
      ])
    ]);
    var main = h('main', { class: 'conteudo', id: 'conteudo' });
    app.appendChild(h('div', { class: 'shell' }, [sidebar, main]));
    renderRota();
  }

  function navItens(sess) {
    var itens = [{ rota: 'painel', nome: T('app.painel'), ico: '▤' }];
    if (LV.Auth.pode('editar_projeto', sess)) itens.push({ rota: 'projeto', nome: T('app.projeto'), ico: '✎' });
    if (LV.Auth.pode('calcular', sess)) itens.push({ rota: 'resultados', nome: T('app.resultados'), ico: '∑' });
    if (LV.Auth.pode('emitir_prontuario', sess)) itens.push({ rota: 'prontuario', nome: T('app.prontuario'), ico: '◳' });
    if (LV.Auth.pode('registrar_inspecao', sess)) itens.push({ rota: 'conformidade', nome: T('app.conformidade'), ico: '◎' });
    if (LV.Auth.pode('registrar_inspecao', sess)) itens.push({ rota: 'registros', nome: T('app.registros'), ico: '☑' });
    if (LV.Auth.pode('gerenciar_usuarios', sess)) itens.push({ rota: 'admin', nome: T('app.admin'), ico: '⚙' });
    return itens;
  }

  function irPara(rota) { state.rota = rota; montarApp(); }
  function renderRota() {
    var alvo = qs('#conteudo'); if (!alvo) return;
    clear(alvo);
    var V = LV.Views;
    var sess = LV.Auth.sessaoAtual();
    try {
      switch (state.rota) {
        case 'painel': V.painel(alvo); break;
        case 'projeto': V.projeto(alvo); break;
        case 'resultados': V.resultados(alvo); break;
        case 'prontuario': V.prontuario(alvo); break;
        case 'conformidade': V.conformidade(alvo); break;
        case 'registros': V.registros(alvo); break;
        case 'admin': V.admin(alvo); break;
        default: V.painel(alvo);
      }
    } catch (e) { alvo.appendChild(h('div', { class: 'erro-fatal', text: 'Erro ao renderizar: ' + e.message })); }
  }

  function nomePaisAtual() {
    if (!LV.Paises) return '';
    var p = LV.Paises.get(LV.Paises.getSelecionado());
    var nm = (LV.I18n && LV.I18n.getLang() === 'en' && p.nomeEn) ? p.nomeEn : p.nome;
    return (p.bandeira || '') + ' ' + nm;
  }
  function trocarPais() {
    var atualP = LV.Paises.getSelecionado();
    var novo = atualP === 'BR' ? 'US' : 'BR';
    if (!confirmar('Trocar para ' + LV.Paises.get(novo).nome + '? (normas, unidades e idioma) / Switch to ' + LV.Paises.get(novo).nome + '?')) return;
    LV.Paises.setSelecionado(novo);
    if (LV.I18n) LV.I18n.setLang(LV.Paises.get(novo).idioma);
    montarApp();
  }

  // ---- Auxiliares visuais ----
  function marca() { return h('div', { class: 'auth-marca', html: '<div class="am-titulo">LINHA DE VIDA</div><div class="am-sub">Dimensionamento &amp; Prontuário · GD Engenharia</div>' }); }
  function rodapeMarca() { return h('div', { class: 'auth-rodape', html: 'GD Engenharia e Perícia Ltda · CNPJ 54.705.748/0001-19' }); }
  function rotulo(t) { return h('label', { class: 'rot', text: t }); }

  LV.UI = {
    h: h, qs: qs, clear: clear, toast: toast, confirmar: confirmar, boot: boot, T: T,
    irPara: irPara, montarApp: montarApp, rotulo: rotulo, renderRota: renderRota
  };
})(typeof self !== 'undefined' ? self : this);
