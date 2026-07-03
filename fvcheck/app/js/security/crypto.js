/* ============================================================================
 *  FV-CHECK · GD ENGENHARIA — Verificação Estrutural Expressa p/ FV em Telhado
 *  crypto.js — Primitivas criptográficas (Web Crypto API)
 *
 *  · PBKDF2-HMAC-SHA256 (120.000 iterações) para derivação de senhas
 *  · SHA-256 para a cadeia de auditoria
 *  · Comparação em tempo constante
 *  Nenhuma senha é armazenada em claro; apenas salt + hash derivado.
 * ========================================================================== */
(function (root) {
  'use strict';

  var subtle = root.crypto && root.crypto.subtle;
  var ITERACOES = 120000;

  function bytesParaHex(buf) {
    var b = new Uint8Array(buf), s = '';
    for (var i = 0; i < b.length; i++) s += ('0' + b[i].toString(16)).slice(-2);
    return s;
  }
  function hexParaBytes(hex) {
    var b = new Uint8Array(hex.length / 2);
    for (var i = 0; i < b.length; i++) b[i] = parseInt(hex.substr(i * 2, 2), 16);
    return b;
  }
  function salt() {
    var b = new Uint8Array(16);
    root.crypto.getRandomValues(b);
    return bytesParaHex(b);
  }

  function derivar(senha, saltHex, iteracoes) {
    var enc = new TextEncoder();
    return subtle.importKey('raw', enc.encode(senha), 'PBKDF2', false, ['deriveBits'])
      .then(function (chave) {
        return subtle.deriveBits(
          { name: 'PBKDF2', salt: hexParaBytes(saltHex), iterations: iteracoes || ITERACOES, hash: 'SHA-256' },
          chave, 256);
      })
      .then(bytesParaHex);
  }

  function sha256(texto) {
    var enc = new TextEncoder();
    return subtle.digest('SHA-256', enc.encode(texto)).then(bytesParaHex);
  }

  function igualConstante(a, b) {
    if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false;
    var dif = 0;
    for (var i = 0; i < a.length; i++) dif |= a.charCodeAt(i) ^ b.charCodeAt(i);
    return dif === 0;
  }

  /* força da senha: 0..4 */
  function forcaSenha(s) {
    if (!s) return 0;
    var p = 0;
    if (s.length >= 8) p++;
    if (s.length >= 12) p++;
    if (/[a-z]/.test(s) && /[A-Z]/.test(s)) p++;
    if (/\d/.test(s) && /[^a-zA-Z0-9]/.test(s)) p++;
    return p;
  }

  var Crypto = {
    ITERACOES: ITERACOES, salt: salt, derivar: derivar, sha256: sha256,
    igualConstante: igualConstante, forcaSenha: forcaSenha,
    disponivel: function () { return !!subtle; }
  };

  root.FV = root.FV || {};
  root.FV.Crypto = Crypto;
  if (typeof module !== 'undefined' && module.exports) module.exports = Crypto;
})(typeof self !== 'undefined' ? self : (typeof globalThis !== 'undefined' ? globalThis : this));
