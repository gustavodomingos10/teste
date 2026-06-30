/* ============================================================================
 *  LINHA DE VIDA · GD ENGENHARIA
 *  audit.js — Trilha de auditoria à prova de adulteração (cadeia de hash)
 *
 *  Cada evento relevante (login, cálculo, emissão de prontuário, inspeção,
 *  alteração de usuário) é registrado encadeando o hash do evento anterior —
 *  como em um livro-razão. Assim, qualquer alteração retroativa quebra a
 *  cadeia e fica evidente em uma perícia.
 * ========================================================================== */
(function (root) {
  'use strict';

  var Crypto;
  if (typeof module !== 'undefined' && module.exports) Crypto = require('./crypto.js');
  function deps() { Crypto = Crypto || (root.LV && root.LV.Crypto); if (!Crypto) throw new Error('audit.js: crypto.js não carregado'); }

  var K_LOG = 'lv_audit';
  var store = null, clock = function () { return Date.now(); };
  function setStore(s) { store = s; }
  function setClock(fn) { clock = fn; }
  function ensureStore() {
    if (store) return store;
    if (typeof localStorage !== 'undefined') store = localStorage;
    else { var m = {}; store = { getItem: function (k) { return k in m ? m[k] : null; }, setItem: function (k, v) { m[k] = String(v); }, removeItem: function (k) { delete m[k]; } }; }
    return store;
  }
  function load() { try { var v = ensureStore().getItem(K_LOG); return v ? JSON.parse(v) : []; } catch (e) { return []; } }
  function save(arr) { ensureStore().setItem(K_LOG, JSON.stringify(arr)); }

  /**
   * Registra um evento. Retorna a entrada criada (com seu hash).
   * @param {string} acao   ex.: 'login', 'calculo', 'prontuario', 'inspecao'
   * @param {object} dados  detalhes (usuário, projeto, veredito, etc.)
   */
  function registrar(acao, dados) {
    deps();
    var log = load();
    var anterior = log.length ? log[log.length - 1].hash : 'GENESIS';
    var entrada = {
      seq: log.length + 1,
      ts: clock(),
      acao: acao,
      dados: dados || {},
      anterior: anterior
    };
    var corpo = JSON.stringify({ seq: entrada.seq, ts: entrada.ts, acao: entrada.acao, dados: entrada.dados, anterior: entrada.anterior });
    return Crypto.sha256(corpo).then(function (h) {
      entrada.hash = h;
      log.push(entrada);
      save(log);
      return entrada;
    });
  }

  /** Verifica a integridade de toda a cadeia. Retorna { ok, rompidaEm }. */
  function verificarIntegridade() {
    deps();
    var log = load();
    var anterior = 'GENESIS';
    var i = 0;
    function passo() {
      if (i >= log.length) return Promise.resolve({ ok: true, total: log.length });
      var e = log[i];
      if (e.anterior !== anterior) return Promise.resolve({ ok: false, rompidaEm: e.seq, motivo: 'encadeamento' });
      var corpo = JSON.stringify({ seq: e.seq, ts: e.ts, acao: e.acao, dados: e.dados, anterior: e.anterior });
      return Crypto.sha256(corpo).then(function (h) {
        if (h !== e.hash) return { ok: false, rompidaEm: e.seq, motivo: 'hash' };
        anterior = e.hash; i++;
        return passo();
      });
    }
    return passo();
  }

  function listar(limite) {
    var log = load();
    if (limite) return log.slice(-limite).reverse();
    return log.slice().reverse();
  }
  function exportar() { return JSON.stringify(load(), null, 2); }

  var Audit = {
    setStore: setStore, setClock: setClock,
    registrar: registrar, verificarIntegridade: verificarIntegridade, listar: listar, exportar: exportar
  };
  root.LV = root.LV || {};
  root.LV.Audit = Audit;
  if (typeof module !== 'undefined' && module.exports) module.exports = Audit;
})(typeof self !== 'undefined' ? self : (typeof globalThis !== 'undefined' ? globalThis : this));
