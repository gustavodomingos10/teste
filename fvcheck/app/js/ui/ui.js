/* ============================================================================
 *  FV-CHECK · GD ENGENHARIA — Verificação Estrutural Expressa p/ FV em Telhado
 *  ui.js — Infraestrutura da interface: roteador hash, toast, impressão
 * ========================================================================== */
(function (root) {
  'use strict';

  var UI = {
    raiz: null,

    boot: function () {
      UI.raiz = document.getElementById('app');
      window.addEventListener('hashchange', UI.rotear);
      UI.rotear();
    },

    /* ------------- roteador ------------- */
    rotear: function () {
      var Auth = root.FV.Auth, Views = root.FV.Views;
      var hash = location.hash.replace(/^#\/?/, '') || '';
      var partes = hash.split('/');
      var rota = partes[0] || '';

      // modo demonstração
      if (/[?&]demo=1/.test(location.search) && !Auth.sessaoAtual && !UI._demoIniciado) {
        UI._demoIniciado = true;
        return Views.iniciarDemo();
      }

      var publicas = ['', 'landing', 'entrar', 'registro', 'planos-publico'];
      if (publicas.indexOf(rota) >= 0 && !Auth.sessaoValida()) {
        if (rota === 'entrar') return Views.entrar();
        if (rota === 'registro') return Views.registro();
        return Views.landing();
      }
      if (!Auth.sessaoValida()) { location.hash = '#/entrar'; return Views.entrar(); }

      // licença expirada → só planos/conta
      var lic = Auth.estadoLicenca();
      if (!lic.ok && ['planos', 'conta'].indexOf(rota) < 0) { location.hash = '#/planos'; return; }

      switch (rota) {
        case 'app': case 'landing': case '': return Views.painel();
        case 'nova': return Views.wizard(partes[1] || null);
        case 'projeto': return Views.resultado(partes[1]);
        case 'laudos': return Views.laudos();
        case 'planos': return Views.planos();
        case 'conta': return Views.conta();
        case 'normas': return Views.normas();
        default: return Views.painel();
      }
    },

    ir: function (rota) {
      if (('#' + rota) === location.hash || ('#/' + rota) === location.hash) UI.rotear();
      else location.hash = rota.charAt(0) === '/' ? '#' + rota : '#/' + rota;
    },

    render: function (html) {
      UI.raiz.innerHTML = html;
      window.scrollTo(0, 0);
    },

    el: function (id) { return document.getElementById(id); },
    val: function (id) { var e = UI.el(id); return e ? e.value : ''; },

    on: function (id, evento, fn) {
      var e = UI.el(id);
      if (e) e.addEventListener(evento, fn);
    },

    /* ------------- toast ------------- */
    toast: function (msg, tipo) {
      var t = document.querySelector('.toast');
      if (!t) {
        t = document.createElement('div');
        t.className = 'toast';
        document.body.appendChild(t);
      }
      t.textContent = msg;
      t.className = 'toast ' + (tipo || 'info');
      requestAnimationFrame(function () { t.classList.add('show'); });
      clearTimeout(UI._toastTimer);
      UI._toastTimer = setTimeout(function () { t.classList.remove('show'); }, 3600);
    },

    /* ------------- impressão ------------- */
    imprimir: function (html) {
      var area = document.getElementById('print-area');
      if (!area) {
        area = document.createElement('div');
        area.id = 'print-area';
        document.body.appendChild(area);
      }
      area.innerHTML = html;
      document.body.classList.add('imprimindo');
      setTimeout(function () {
        window.print();
        setTimeout(function () { document.body.classList.remove('imprimindo'); }, 400);
      }, 60);
    },

    /* ------------- download ------------- */
    baixar: function (nome, conteudo, mime) {
      var blob = new Blob([conteudo], { type: mime || 'application/json;charset=utf-8' });
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = nome;
      document.body.appendChild(a);
      a.click();
      setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 800);
    },

    /* ------------- formatação ------------- */
    dinheiro: function (v) { return 'R$ ' + Number(v).toLocaleString('pt-BR'); },
    dataBr: function (iso) { return iso ? new Date(iso).toLocaleDateString('pt-BR') : '—'; },
    esc: function (s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  };

  root.FV = root.FV || {};
  root.FV.UI = UI;
})(typeof self !== 'undefined' ? self : this);
