/* ============================================================================
 *  LINHA DE VIDA · GD ENGENHARIA
 *  crypto.js — Primitivas criptográficas (Web Crypto API)
 *
 *  Senhas NUNCA são guardadas em texto puro: usa-se PBKDF2-SHA-256 com sal
 *  aleatório e alto número de iterações. Também fornece hash SHA-256 (para a
 *  cadeia de auditoria) e geração de tokens/identificadores aleatórios.
 *
 *  Funciona no navegador (window.crypto.subtle) e no Node 22+ (globalThis.crypto).
 * ========================================================================== */
(function (root) {
  'use strict';

  var g = (typeof globalThis !== 'undefined') ? globalThis : root;
  var subtle = g.crypto && g.crypto.subtle ? g.crypto.subtle : null;
  var getRandom = (g.crypto && g.crypto.getRandomValues)
    ? function (arr) { return g.crypto.getRandomValues(arr); }
    : null;

  var ITERACOES = 210000;           // OWASP 2023+ recomenda ≥ 210k para PBKDF2-SHA256
  var TAM_SAL = 16;                 // bytes
  var TAM_CHAVE = 32;              // bytes (256 bits)

  function assert() {
    if (!subtle || !getRandom) throw new Error('Web Crypto indisponível neste ambiente.');
  }

  // ---- utilidades hex/base ----
  function bytesToHex(buf) {
    var b = new Uint8Array(buf), s = '';
    for (var i = 0; i < b.length; i++) s += b[i].toString(16).padStart(2, '0');
    return s;
  }
  function hexToBytes(hex) {
    var arr = new Uint8Array(hex.length / 2);
    for (var i = 0; i < arr.length; i++) arr[i] = parseInt(hex.substr(i * 2, 2), 16);
    return arr;
  }
  function strToBytes(s) { return new TextEncoder().encode(s); }

  /** Gera bytes aleatórios em hexadecimal. */
  function randomHex(nBytes) {
    assert();
    var a = new Uint8Array(nBytes || 16);
    getRandom(a);
    return bytesToHex(a.buffer);
  }

  /** SHA-256 de uma string → hex. */
  function sha256(str) {
    assert();
    return subtle.digest('SHA-256', strToBytes(str)).then(bytesToHex);
  }

  /** Deriva a chave PBKDF2 a partir de senha + sal (hex). Retorna hex. */
  function pbkdf2(senha, salHex, iteracoes) {
    assert();
    iteracoes = iteracoes || ITERACOES;
    return subtle.importKey('raw', strToBytes(senha), { name: 'PBKDF2' }, false, ['deriveBits'])
      .then(function (key) {
        return subtle.deriveBits({
          name: 'PBKDF2', salt: hexToBytes(salHex), iterations: iteracoes, hash: 'SHA-256'
        }, key, TAM_CHAVE * 8);
      })
      .then(bytesToHex);
  }

  /**
   * Cria um registro de senha: { algo, sal, iteracoes, hash }.
   * Guardar este objeto; nunca a senha.
   */
  function hashSenha(senha) {
    var sal = randomHex(TAM_SAL);
    return pbkdf2(senha, sal, ITERACOES).then(function (hash) {
      return { algo: 'PBKDF2-SHA256', sal: sal, iteracoes: ITERACOES, hash: hash };
    });
  }

  /** Verifica a senha contra o registro salvo (comparação em tempo ~constante). */
  function verificarSenha(senha, registro) {
    if (!registro || !registro.sal || !registro.hash) return Promise.resolve(false);
    return pbkdf2(senha, registro.sal, registro.iteracoes || ITERACOES).then(function (hash) {
      return timingSafeEqual(hash, registro.hash);
    });
  }

  function timingSafeEqual(a, b) {
    if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false;
    var r = 0;
    for (var i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
    return r === 0;
  }

  /** Avaliação simples de robustez de senha (0–4) + requisitos. */
  function forcaSenha(senha) {
    senha = senha || '';
    var req = {
      tamanho: senha.length >= 8,
      maiuscula: /[A-Z]/.test(senha),
      minuscula: /[a-z]/.test(senha),
      numero: /[0-9]/.test(senha),
      especial: /[^A-Za-z0-9]/.test(senha)
    };
    var score = (req.tamanho ? 1 : 0) + (req.maiuscula && req.minuscula ? 1 : 0) +
                (req.numero ? 1 : 0) + (req.especial ? 1 : 0);
    if (senha.length >= 12) score = Math.min(4, score + 1);
    return { score: score, requisitos: req, aceitavel: req.tamanho && req.maiuscula && req.minuscula && req.numero };
  }

  var Crypto = {
    randomHex: randomHex, sha256: sha256, pbkdf2: pbkdf2,
    hashSenha: hashSenha, verificarSenha: verificarSenha,
    forcaSenha: forcaSenha, timingSafeEqual: timingSafeEqual, ITERACOES: ITERACOES
  };
  root.LV = root.LV || {};
  root.LV.Crypto = Crypto;
  if (typeof module !== 'undefined' && module.exports) module.exports = Crypto;
})(typeof self !== 'undefined' ? self : (typeof globalThis !== 'undefined' ? globalThis : this));
