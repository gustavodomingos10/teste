/* ============================================================================
 *  LINHA DE VIDA · GD ENGENHARIA
 *  qr.js — Gerador de QR Code (modo byte, nível M, versões 1–4) em SVG
 *
 *  Sem dependências externas. Usado na plaqueta de identificação para
 *  rastreabilidade do sistema (gestão de ativos em plantas industriais).
 *  Algoritmo conforme ISO/IEC 18004 (campo de Galois GF(256), Reed-Solomon,
 *  máscara ótima por penalidade). Validado por decodificação (tests/qr.test.js).
 * ========================================================================== */
(function (root) {
  'use strict';
  var LV = root.LV = root.LV || {};

  // ---- GF(256) ----
  var EXP = new Array(256), LOG = new Array(256);
  (function () {
    for (var i = 0; i < 8; i++) EXP[i] = 1 << i;
    for (i = 8; i < 256; i++) EXP[i] = EXP[i - 4] ^ EXP[i - 5] ^ EXP[i - 6] ^ EXP[i - 8];
    for (i = 0; i < 255; i++) LOG[EXP[i]] = i;
  })();
  function gexp(n) { while (n < 0) n += 255; while (n >= 255) n -= 255; return EXP[n]; }
  function glog(n) { return LOG[n]; }

  function polyMul(a, b) {
    var r = new Array(a.length + b.length - 1);
    for (var i = 0; i < r.length; i++) r[i] = 0;
    for (i = 0; i < a.length; i++) for (var j = 0; j < b.length; j++)
      if (a[i] && b[j]) r[i + j] ^= gexp(glog(a[i]) + glog(b[j]));
    return r;
  }
  function genPoly(ec) { var g = [1]; for (var i = 0; i < ec; i++) g = polyMul(g, [1, gexp(i)]); return g; }
  function rsEncode(data, ec) {
    var gen = genPoly(ec);
    var res = data.concat(new Array(ec).fill(0));
    for (var i = 0; i < data.length; i++) {
      var coef = res[i];
      if (coef !== 0) for (var j = 0; j < gen.length; j++) res[i + j] ^= gexp(glog(gen[j]) + glog(coef));
    }
    return res.slice(data.length);
  }

  // ---- Tabela RS (nível M) versões 1–4: [nBlocos, totalPorBloco, dadosPorBloco] ----
  var RSM = { 1: [1, 26, 16], 2: [1, 44, 28], 3: [1, 70, 44], 4: [2, 50, 32] };
  var CAP_M = { 1: 16, 2: 28, 3: 44, 4: 64 };   // bytes de dados utilizáveis
  var ALIGN = { 1: [], 2: [6, 18], 3: [6, 22], 4: [6, 26] };

  function pickVersion(nBytes) {
    for (var v = 1; v <= 4; v++) if (nBytes + 2 <= CAP_M[v]) return v;  // +2 margem
    return 4;
  }

  // ---- Codificação de dados (modo byte) ----
  function encodeData(bytes, version) {
    var bb = [];
    function put(num, len) { for (var i = len - 1; i >= 0; i--) bb.push((num >>> i) & 1); }
    put(4, 4);                              // modo byte = 0100
    put(bytes.length, 8);                   // contador (8 bits p/ v1–9)
    for (var i = 0; i < bytes.length; i++) put(bytes[i], 8);
    var cap = CAP_M[version] * 8;
    // terminador
    for (i = 0; i < 4 && bb.length < cap; i++) bb.push(0);
    while (bb.length % 8 !== 0) bb.push(0);
    // bytes de preenchimento
    var pads = [0xEC, 0x11], pi = 0;
    while (bb.length < cap) { put(pads[pi % 2], 8); pi++; }
    // para bytes
    var data = [];
    for (i = 0; i < bb.length; i += 8) { var b = 0; for (var k = 0; k < 8; k++) b = (b << 1) | bb[i + k]; data.push(b); }
    return data;
  }

  function buildCodewords(dataBytes, version) {
    var spec = RSM[version], nb = spec[0], total = spec[1], dataPer = spec[2], ec = total - dataPer;
    var blocks = [];
    for (var i = 0; i < nb; i++) {
      var d = dataBytes.slice(i * dataPer, (i + 1) * dataPer);
      blocks.push({ data: d, ec: rsEncode(d, ec) });
    }
    var out = [];
    for (var c = 0; c < dataPer; c++) for (i = 0; i < nb; i++) out.push(blocks[i].data[c]);
    for (c = 0; c < ec; c++) for (i = 0; i < nb; i++) out.push(blocks[i].ec[c]);
    return out;
  }

  // ---- Matriz ----
  function makeMatrix(codewords, version, mask) {
    var n = 17 + version * 4;
    var m = []; for (var r = 0; r < n; r++) { m.push([]); for (var c = 0; c < n; c++) m[r].push(null); }
    function setFinder(or, oc) {
      for (var r = -1; r <= 7; r++) for (var c = -1; c <= 7; c++) {
        var rr = or + r, cc = oc + c; if (rr < 0 || rr >= n || cc < 0 || cc >= n) continue;
        var dark = (0 <= r && r <= 6 && (c === 0 || c === 6)) || (0 <= c && c <= 6 && (r === 0 || r === 6)) || (2 <= r && r <= 4 && 2 <= c && c <= 4);
        m[rr][cc] = dark;
      }
    }
    setFinder(0, 0); setFinder(0, n - 7); setFinder(n - 7, 0);
    // timing
    for (var i = 8; i < n - 8; i++) { if (m[6][i] === null) m[6][i] = (i % 2 === 0); if (m[i][6] === null) m[i][6] = (i % 2 === 0); }
    // alignment
    var ap = ALIGN[version];
    for (var a = 0; a < ap.length; a++) for (var b = 0; b < ap.length; b++) {
      var ar = ap[a], ac = ap[b]; if (m[ar][ac] !== null) continue;
      for (r = -2; r <= 2; r++) for (c = -2; c <= 2; c++)
        m[ar + r][ac + c] = (Math.max(Math.abs(r), Math.abs(c)) !== 1);
    }
    // dark module + informação de formato (marcada ANTES dos dados — padrão ISO)
    m[n - 8][8] = true;
    setFormat(m, n, mask);
    // dados (zigzag), pulando módulos já preenchidos (função + formato)
    var dir = -1, row = n - 1, bit = 0, byteIdx = 0;
    for (var col = n - 1; col > 0; col -= 2) {
      if (col === 6) col--;
      while (true) {
        for (var x = 0; x < 2; x++) {
          var cc2 = col - x;
          if (m[row][cc2] === null) {
            var dark2 = false;
            if (byteIdx < codewords.length) { dark2 = ((codewords[byteIdx] >>> (7 - bit)) & 1) === 1; }
            if (applyMask(mask, row, cc2)) dark2 = !dark2;   // máscara só nos dados
            m[row][cc2] = dark2;
            bit++; if (bit === 8) { bit = 0; byteIdx++; }
          }
        }
        row += dir;
        if (row < 0 || row >= n) { row -= dir; dir = -dir; break; }
      }
    }
    return m;
  }

  function applyMask(mask, r, c) {
    switch (mask) {
      case 0: return (r + c) % 2 === 0;
      case 1: return r % 2 === 0;
      case 2: return c % 3 === 0;
      case 3: return (r + c) % 3 === 0;
      case 4: return (Math.floor(r / 2) + Math.floor(c / 3)) % 2 === 0;
      case 5: return ((r * c) % 2) + ((r * c) % 3) === 0;
      case 6: return (((r * c) % 2) + ((r * c) % 3)) % 2 === 0;
      case 7: return (((r + c) % 2) + ((r * c) % 3)) % 2 === 0;
    }
    return false;
  }

  // BCH para info de formato
  function bchFormat(data) {
    var d = data << 10, g = 0x537;
    while (bitLen(d) - bitLen(g) >= 0) d ^= g << (bitLen(d) - bitLen(g));
    return ((data << 10) | d) ^ 0x5412;
  }
  function bitLen(x) { var l = 0; while (x !== 0) { l++; x >>>= 1; } return l; }

  // Informação de formato (15 bits) — mapeamento ISO/IEC 18004 (conforme Arase)
  function setFormat(m, n, mask) {
    var fmt = bchFormat((0 << 3) | mask);    // nível de correção M = 0
    for (var i = 0; i < 15; i++) {
      var b = ((fmt >> i) & 1) === 1;
      // cópia vertical (coluna 8) + horizontal inferior-esquerda
      if (i < 6) m[i][8] = b;
      else if (i < 8) m[i + 1][8] = b;
      else m[n - 15 + i][8] = b;
      // cópia horizontal (linha 8) + vertical superior-direita
      if (i < 8) m[8][n - i - 1] = b;
      else if (i < 9) m[8][7] = b;
      else m[8][14 - i] = b;
    }
    m[n - 8][8] = true;                      // módulo escuro fixo
  }

  // Penalidade (regra 1 simplificada: corridas) p/ escolher máscara
  function penalty(m, n) {
    var p = 0, r, c, run;
    for (r = 0; r < n; r++) { run = 1; for (c = 1; c < n; c++) { if (m[r][c] === m[r][c-1]) { run++; if (run === 5) p += 3; else if (run > 5) p++; } else run = 1; } }
    for (c = 0; c < n; c++) { run = 1; for (r = 1; r < n; r++) { if (m[r][c] === m[r-1][c]) { run++; if (run === 5) p += 3; else if (run > 5) p++; } else run = 1; } }
    return p;
  }

  function generateMatrix(text) {
    var bytes = utf8(text);
    var version = pickVersion(bytes.length);
    var data = encodeData(bytes, version);
    var cw = buildCodewords(data, version);
    var best = null, bestP = Infinity;
    for (var mask = 0; mask < 8; mask++) {
      var m = makeMatrix(cw, version, mask);
      var p = penalty(m, m.length);
      if (p < bestP) { bestP = p; best = m; }
    }
    return best;
  }

  function utf8(str) {
    var out = [], i, c;
    for (i = 0; i < str.length; i++) {
      c = str.charCodeAt(i);
      if (c < 128) out.push(c);
      else if (c < 2048) { out.push(192 | (c >> 6), 128 | (c & 63)); }
      else { out.push(224 | (c >> 12), 128 | ((c >> 6) & 63), 128 | (c & 63)); }
    }
    return out;
  }

  // ---- SVG ----
  function svg(text, opts) {
    opts = opts || {};
    var m = generateMatrix(text), n = m.length;
    var quiet = 4, px = opts.px || 4, size = (n + quiet * 2) * px;
    var s = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + size + ' ' + size + '" width="' + (opts.width || size) + '" height="' + (opts.width || size) + '" shape-rendering="crispEdges">';
    s += '<rect width="' + size + '" height="' + size + '" fill="#fff"/>';
    s += '<path fill="#000" d="';
    for (var r = 0; r < n; r++) for (var c = 0; c < n; c++) if (m[r][c]) {
      var x = (c + quiet) * px, y = (r + quiet) * px;
      s += 'M' + x + ' ' + y + 'h' + px + 'v' + px + 'h' + (-px) + 'z';
    }
    s += '"/></svg>';
    return s;
  }

  LV.QR = { svg: svg, generateMatrix: generateMatrix, _utf8: utf8 };
  if (typeof module !== 'undefined' && module.exports) module.exports = LV.QR;
})(typeof self !== 'undefined' ? self : (typeof globalThis !== 'undefined' ? globalThis : this));
