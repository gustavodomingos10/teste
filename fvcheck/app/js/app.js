/* ============================================================================
 *  FV-CHECK · GD ENGENHARIA — Verificação Estrutural Expressa p/ FV em Telhado
 *  app.js — Inicialização da aplicação
 * ========================================================================== */
(function (root) {
  'use strict';
  function start() {
    var el = document.getElementById('app');
    if (!root.FV || !root.FV.UI || !root.FV.Engine) {
      el.innerHTML = '<div class="erro-fatal">Falha ao carregar os módulos do sistema. Recarregue a página.</div>';
      return;
    }
    if (!(root.crypto && root.crypto.subtle)) {
      el.innerHTML = '<div class="erro-fatal">Este navegador não suporta Web Crypto (necessário para a segurança de acesso).<br>Abra o sistema por <b>http(s)://</b> ou use um navegador atual (Chrome, Edge, Firefox).</div>';
      return;
    }
    root.FV.UI.boot();
    // mantém a sessão viva enquanto há atividade
    ['click', 'keydown'].forEach(function (ev) {
      document.addEventListener(ev, function () {
        if (root.FV.Auth && root.FV.Auth.sessaoAtual) root.FV.Auth.registrarAtividade();
      });
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})(typeof self !== 'undefined' ? self : this);
