/* ============================================================================
 *  FV-CHECK · GD ENGENHARIA — Verificação Estrutural Expressa p/ FV em Telhado
 *  audit.js — Trilha de auditoria com encadeamento de hashes (SHA-256)
 *
 *  Cada evento guarda o hash do anterior; adulterar um registro quebra a
 *  cadeia inteira — verificável por peritos/seguradoras via verificarCadeia().
 * ========================================================================== */
(function (root) {
  'use strict';

  var K = 'fvcheck.auditoria';
  var GENESIS = 'FVCHECK-GENESIS';

  function ler() {
    try { var v = localStorage.getItem(K); return v ? JSON.parse(v) : []; }
    catch (e) { return []; }
  }
  function gravar(lista) { localStorage.setItem(K, JSON.stringify(lista)); }

  function corpo(ev) {
    return [ev.ts, ev.usuario, ev.evento, JSON.stringify(ev.dados || {}), ev.hashAnterior].join('|');
  }

  var fila = Promise.resolve();

  var Audit = {
    registrar: function (evento, dados) {
      var Crypto = root.FV.Crypto, Auth = root.FV.Auth;
      if (!Crypto || !Crypto.disponivel()) return Promise.resolve(null);
      // fila serializada para manter a cadeia íntegra com eventos simultâneos
      fila = fila.then(function () {
        var lista = ler();
        var ev = {
          ts: new Date().toISOString(),
          usuario: (Auth && Auth.sessaoAtual) ? Auth.sessaoAtual.login : '(sistema)',
          evento: String(evento),
          dados: dados || {},
          hashAnterior: lista.length ? lista[lista.length - 1].hash : GENESIS
        };
        return Crypto.sha256(corpo(ev)).then(function (h) {
          ev.hash = h;
          lista.push(ev);
          if (lista.length > 5000) lista = lista.slice(-5000); // rotação
          gravar(lista);
          return ev;
        });
      });
      return fila;
    },

    eventos: function () { return ler(); },

    verificarCadeia: function () {
      var Crypto = root.FV.Crypto;
      var lista = ler();
      if (!lista.length) return Promise.resolve({ integra: true, total: 0 });
      var i = 0;
      function passo() {
        if (i >= lista.length) return Promise.resolve({ integra: true, total: lista.length });
        var ev = lista[i];
        var esperadoAnterior = i === 0 ? GENESIS : lista[i - 1].hash;
        if (ev.hashAnterior !== esperadoAnterior) return Promise.resolve({ integra: false, total: lista.length, quebraEm: i });
        return Crypto.sha256(corpo(ev)).then(function (h) {
          if (h !== ev.hash) return { integra: false, total: lista.length, quebraEm: i };
          i++;
          return passo();
        });
      }
      return passo();
    },

    limpar: function () { gravar([]); }
  };

  root.FV = root.FV || {};
  root.FV.Audit = Audit;
  if (typeof module !== 'undefined' && module.exports) module.exports = Audit;
})(typeof self !== 'undefined' ? self : (typeof globalThis !== 'undefined' ? globalThis : this));
