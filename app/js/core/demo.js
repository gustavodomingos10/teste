/* ============================================================================
 *  LINHA DE VIDA · GD ENGENHARIA
 *  demo.js — MODO DEMONSTRAÇÃO (amostra pública para o site)
 *
 *  Ativa quando a URL tem ?demo=1 ou quando window.LV_DEMO === true
 *  (ver o arquivo demo.html). Neste modo:
 *    · a pessoa NAVEGA e VÊ tudo o que o software produz (veredito, figuras,
 *      memorial, prontuário) — provando que funciona;
 *    · MAS os dados que valem (materiais, cabo, chumbadores, espaçadores,
 *      quantitativos) ficam cobertos por TARJAS DE CENSURA enormes com o texto
 *      "VERSÃO DEMONSTRATIVA · SEM VALIDADE LEGAL · NECESSÁRIO ADQUIRIR LICENÇA";
 *    · nada é salvo (memória — recarregar zera); salvar/exportar/imprimir
 *      ficam BLOQUEADOS; clique-direito/cópia/atalhos são inibidos.
 *
 *  IMPORTANTE: nenhuma página web impede uma foto de tela — as tarjas garantem
 *  que qualquer captura saia sem os dados essenciais e sem validade legal.
 * ========================================================================== */
(function (root) {
  'use strict';
  var LV = root.LV = root.LV || {};
  var busca = (typeof location !== 'undefined' && location.search) ? location.search : '';
  LV.DEMO = /[?&]demo=1/i.test(busca) || root.LV_DEMO === true;
  if (!LV.DEMO) return;

  // 1) Nada persiste: injeta armazenamento em memória em Storage e Auth.
  var mem = {};
  var memStore = {
    getItem: function (k) { return k in mem ? mem[k] : null; },
    setItem: function (k, v) { mem[k] = String(v); },
    removeItem: function (k) { delete mem[k]; }
  };
  if (LV.Storage && LV.Storage.setStore) LV.Storage.setStore(memStore);
  if (LV.Auth && LV.Auth.setStore) LV.Auth.setStore(memStore);

  // 2) Textos e aviso padrão ao tentar uma ação bloqueada (abre os planos).
  LV.demoContato = 'GD Engenharia · (43) 9 9925-9577';
  LV.demoTexto = 'VERSÃO DEMONSTRATIVA · SEM VALIDADE LEGAL · NECESSÁRIO ADQUIRIR LICENÇA';
  LV.demoAviso = function () {
    if (typeof LV.demoPlanos === 'function') return LV.demoPlanos();
    if (LV.UI && LV.UI.toast) LV.UI.toast('🔒 ' + LV.demoTexto + ' — ' + LV.demoContato, 'aviso');
    return false;
  };

  // 3) TARJAS: cobre os elementos com dados essenciais (tabelas, plaqueta,
  //    comparativo, dimensionamento) de um documento/tela já renderizado.
  LV.aplicarTarjas = function (container) {
    if (!container || !LV.DEMO) return;
    var els = container.querySelectorAll('table.tab, .plaqueta, .ci-tab, .auto-tab');
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      if (el.getAttribute('data-tarja')) continue;
      el.setAttribute('data-tarja', '1');
      var w = document.createElement('div');
      w.className = 'tarjado';
      el.parentNode.insertBefore(w, el);
      w.appendChild(el);
    }
  };

  // 4) Marca d'água, faixa e anti-cópia — instalados quando o DOM está pronto.
  function tileSvg() {
    var svg = "<svg xmlns='http://www.w3.org/2000/svg' width='430' height='150'>" +
      "<text x='8' y='96' fill='rgba(192,20,15,0.13)' font-size='15.5' font-family='Arial, sans-serif' " +
      "font-weight='800' transform='rotate(-24 8 96)'>VERSÃO DEMONSTRATIVA · SEM VALIDADE LEGAL</text></svg>";
    return "url(\"data:image/svg+xml;utf8," + encodeURIComponent(svg) + "\")";
  }
  function instalar() {
    if (!document || !document.body) { return setTimeout(instalar, 30); }
    document.body.classList.add('demo-mode');
    if (!document.querySelector('.demo-watermark')) {
      var wm = document.createElement('div');
      wm.className = 'demo-watermark';
      wm.setAttribute('aria-hidden', 'true');
      wm.style.backgroundImage = tileSvg();
      document.body.appendChild(wm);
    }
    if (!document.querySelector('.demo-faixa')) {
      var f = document.createElement('div');
      f.className = 'demo-faixa';
      var txt = document.createElement('span');
      txt.textContent = '⛔ VERSÃO DEMONSTRAÇÃO · sem salvar / exportar / imprimir · dados essenciais ocultos';
      var b = document.createElement('button');
      b.className = 'demo-lic-btn';
      b.textContent = 'Adquirir licença';
      b.addEventListener('click', function () { if (typeof LV.demoPlanos === 'function') LV.demoPlanos(); });
      f.appendChild(txt); f.appendChild(b);
      document.body.appendChild(f);
    }
    ['contextmenu', 'copy', 'cut', 'dragstart', 'selectstart'].forEach(function (ev) {
      document.addEventListener(ev, function (e) { e.preventDefault(); }, true);
    });
    document.addEventListener('keydown', function (e) {
      var k = (e.key || '').toLowerCase();
      if ((e.ctrlKey || e.metaKey) && ['s', 'p', 'c', 'u', 'a'].indexOf(k) !== -1) { e.preventDefault(); LV.demoAviso(); }
      if (k === 'f12') { e.preventDefault(); }
    }, true);
  }
  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', instalar);
    else instalar();
  }
})(typeof self !== 'undefined' ? self : this);
