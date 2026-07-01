/* ============================================================================
 *  LINHA DE VIDA · GD ENGENHARIA
 *  demo.js — MODO DEMONSTRAÇÃO (amostra pública para o site)
 *
 *  Ativa quando a URL tem ?demo=1 ou quando window.LV_DEMO === true
 *  (ver o arquivo demo.html). Neste modo:
 *    · nada é salvo (armazenamento em memória — recarregar zera tudo);
 *    · salvar/exportar (Word/PDF/Excel)/imprimir ficam BLOQUEADOS;
 *    · marca d'água "AMOSTRA · GD ENGENHARIA" cobre a tela e as capturas;
 *    · clique-direito, seleção/cópia e atalhos (Ctrl+S/P/C…) são inibidos.
 *
 *  IMPORTANTE: nenhuma página web consegue IMPEDIR uma foto de tela (câmera do
 *  celular, Print Screen do sistema). A marca d'água garante que qualquer
 *  captura saia identificada como amostra e sem valor de documento oficial.
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

  // 2) Aviso padrão ao tentar uma ação bloqueada.
  LV.demoContato = 'GD Engenharia · (43) 9 9925-9577';
  LV.demoAviso = function () {
    var en = LV.I18n && LV.I18n.getLang && LV.I18n.getLang() === 'en';
    var msg = en
      ? '🔒 Available only in the full (licensed) version. Contact: ' + LV.demoContato
      : '🔒 Disponível apenas na versão completa (licenciada). Contato: ' + LV.demoContato;
    if (LV.UI && LV.UI.toast) LV.UI.toast(msg, 'aviso'); else if (typeof alert === 'function') alert(msg);
    return false;
  };

  // 3) Marca d'água, faixa e anti-cópia — instalados quando o DOM está pronto.
  function tileSvg() {
    var svg = "<svg xmlns='http://www.w3.org/2000/svg' width='330' height='190'>" +
      "<text x='6' y='120' fill='rgba(31,58,95,0.09)' font-size='17' font-family='Arial, sans-serif' " +
      "font-weight='700' transform='rotate(-28 6 120)'>AMOSTRA · GD ENGENHARIA</text></svg>";
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
      f.setAttribute('aria-hidden', 'true');
      f.textContent = 'VERSÃO DEMONSTRAÇÃO · sem salvar / exportar / imprimir · ' + LV.demoContato;
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
