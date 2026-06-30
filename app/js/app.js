/* ============================================================================
 *  LINHA DE VIDA · GD ENGENHARIA
 *  app.js — Inicialização da aplicação
 * ========================================================================== */
(function (root) {
  'use strict';
  function start() {
    if (!root.LV || !root.LV.UI) { document.getElementById('app').innerHTML = '<div class="erro-fatal">Falha ao carregar os módulos do sistema.</div>'; return; }
    // Verificação de ambiente seguro (Web Crypto)
    if (!(root.crypto && root.crypto.subtle)) {
      document.getElementById('app').innerHTML = '<div class="erro-fatal">Este navegador não suporta Web Crypto (necessário para a segurança de acesso).<br>Abra o sistema por <b>http(s)://</b> ou use um navegador atual (Chrome, Edge, Firefox).</div>';
      return;
    }
    root.LV.UI.boot();
    // mantém a sessão "viva" enquanto há atividade
    ['click', 'keydown'].forEach(function (ev) {
      document.addEventListener(ev, function () { if (root.LV.Auth && root.LV.Auth.sessaoAtual) root.LV.Auth.registrarAtividade(); });
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})(typeof self !== 'undefined' ? self : this);
