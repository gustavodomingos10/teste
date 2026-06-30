/* ============================================================================
 *  LINHA DE VIDA · GD ENGENHARIA
 *  draw.js — Geração de figuras técnicas em SVG (vetorial, imprime nítido)
 *
 *  Todas as figuras são PARAMÉTRICAS: desenhadas a partir do objeto-resultado
 *  do motor de cálculo. Imagem comunica mais que texto — essencial para o
 *  prontuário lido por peritos e seguradoras.
 *
 *    iso3D(R)        — 3D isométrico simplificado: postes, cabo com flecha,
 *                      trabalhadores conectados e cota da ZLQ.
 *    elevacaoZLQ(R)  — elevação cotada: queda livre→frenagem→flecha→folga.
 *    planta(R)       — planta dos vãos e postes.
 *    esforcosPoste(R)— diagrama de corpo livre do poste extremo (H, V, M).
 * ========================================================================== */
(function (root) {
  'use strict';

  // ---- Paleta ----
  var COR = {
    estrutura: '#5b6470', poste: '#3a4250', cabo: '#c0392b', caboOk: '#1e8449',
    piso: '#9aa4b2', cota: '#1f3a5f', cotaTxt: '#1f3a5f', trabalhador: '#11457e',
    ok: '#1e8449', falha: '#c0392b', solo: '#cdb892', fundo: '#ffffff',
    grade: '#dfe4ea', destaque: '#e67e22', texto: '#222'
  };
  var ISO = Math.PI / 6;           // 30°
  var COS = Math.cos(ISO), SIN = Math.sin(ISO);

  // ---- Helpers SVG ----
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function n2(x) { return (Math.round(x * 100) / 100).toFixed(2).replace('.', ','); }
  function line(x1, y1, x2, y2, cor, w, dash) {
    return '<line x1="' + x1.toFixed(1) + '" y1="' + y1.toFixed(1) + '" x2="' + x2.toFixed(1) + '" y2="' + y2.toFixed(1) +
      '" stroke="' + cor + '" stroke-width="' + (w || 1) + '"' + (dash ? ' stroke-dasharray="' + dash + '"' : '') + ' stroke-linecap="round"/>';
  }
  function poly(pts, cor, w, fill, dash) {
    var d = pts.map(function (p) { return p[0].toFixed(1) + ',' + p[1].toFixed(1); }).join(' ');
    return '<polyline points="' + d + '" fill="' + (fill || 'none') + '" stroke="' + cor + '" stroke-width="' + (w || 1) +
      '"' + (dash ? ' stroke-dasharray="' + dash + '"' : '') + ' stroke-linejoin="round"/>';
  }
  function polygon(pts, fill, cor, w, op) {
    var d = pts.map(function (p) { return p[0].toFixed(1) + ',' + p[1].toFixed(1); }).join(' ');
    return '<polygon points="' + d + '" fill="' + fill + '"' + (op != null ? ' fill-opacity="' + op + '"' : '') +
      ' stroke="' + (cor || 'none') + '" stroke-width="' + (w || 0) + '"/>';
  }
  function circle(x, y, r, fill, cor, w) {
    return '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="' + r + '" fill="' + (fill || 'none') + '" stroke="' + (cor || 'none') + '" stroke-width="' + (w || 0) + '"/>';
  }
  function text(x, y, s, opt) {
    opt = opt || {};
    return '<text x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" font-family="' + (opt.font || 'Segoe UI, Arial, sans-serif') +
      '" font-size="' + (opt.size || 12) + '" fill="' + (opt.cor || COR.texto) + '"' +
      (opt.anchor ? ' text-anchor="' + opt.anchor + '"' : '') +
      (opt.weight ? ' font-weight="' + opt.weight + '"' : '') +
      (opt.rot ? ' transform="rotate(' + opt.rot + ' ' + x.toFixed(1) + ' ' + y.toFixed(1) + ')"' : '') +
      '>' + esc(s) + '</text>';
  }
  function wrap(vb, inner, extra) {
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="' + vb + '" ' + (extra || '') +
      ' font-family="Segoe UI, Arial, sans-serif"><rect x="' + vb.split(' ')[0] + '" y="' + vb.split(' ')[1] +
      '" width="' + vb.split(' ')[2] + '" height="' + vb.split(' ')[3] + '" fill="' + COR.fundo + '"/>' + inner + '</svg>';
  }

  // Stick-figure de trabalhador (em projeção, posição base px,py "no chão", altura hpx)
  function trabalhador(px, py, hpx, cor) {
    cor = cor || COR.trabalhador;
    var head = hpx * 0.16, body = hpx * 0.42, leg = hpx * 0.42;
    var hx = px, hyTop = py - hpx;                       // topo da cabeça
    var neck = hyTop + head * 2;
    var hip = neck + body;
    var s = '';
    s += circle(hx, hyTop + head, head, cor, cor, 0);    // cabeça
    s += line(hx, neck, hx, hip, cor, 2.4);              // tronco
    s += line(hx, neck + body * 0.3, hx - hpx * 0.16, neck + body * 0.62, cor, 2.4); // braço esq
    s += line(hx, neck + body * 0.3, hx + hpx * 0.16, neck + body * 0.62, cor, 2.4); // braço dir
    s += line(hx, hip, hx - hpx * 0.13, hip + leg, cor, 2.4);  // perna esq
    s += line(hx, hip, hx + hpx * 0.13, hip + leg, cor, 2.4);  // perna dir
    return { svg: s, ombro: [hx, neck + body * 0.3], cabeca: [hx, hyTop + head] };
  }

  // ======================================================================
  //  1 · 3D ISOMÉTRICO SIMPLIFICADO
  // ======================================================================
  function iso3D(R) {
    var L = num(R.dados.L.valor, 10), h = num(R.dados.h.valor, 1.2);
    var nVaos = Math.max(1, Math.round(num(R.dados.nVaos.valor, 1)));
    var f = num(R.tracao.f_tot.valor, 0.3);
    var ZLQ = num(R.zlq.ZLQ.valor, 0), peDir = num(R.zlq.peDireito.valor, 0);
    var nUsers = Math.max(1, Math.round(num(R.dados.n.valor, 1)));
    var aprovado = R.veredito.aprovado;
    var spans = Math.min(nVaos, 2);                       // mostra até 2 vãos (auto-ajuste)
    var sc = 40;                                          // px por metro (plano horizontal)
    var scZ = sc * 2.0;                                   // escala vertical EXAGERADA (esquemático)
    var dy = Math.max(2.6, L * 0.34);                     // "profundidade" da estrutura
    var hVis = Math.max(h, 1.0);                           // altura visual mínima dos postes
    var corCabo = aprovado ? COR.caboOk : COR.cabo;

    function P(x, y, z) { return [(x - y) * COS * sc, (x + y) * SIN * sc - z * scZ]; }
    // --- bbox automático: registra todo ponto desenhado ---
    var minX = 1e9, minY = 1e9, maxX = -1e9, maxY = -1e9;
    function rec(p) { if (p[0] < minX) minX = p[0]; if (p[0] > maxX) maxX = p[0]; if (p[1] < minY) minY = p[1]; if (p[1] > maxY) maxY = p[1]; return p; }

    var s = '';
    var x0 = 0, x1 = spans * L, yc = dy * 0.5;

    // Plano da estrutura (laje/telhado) sombreado, com leve espessura 3D
    var A = rec(P(x0, 0, 0)), B = rec(P(x1, 0, 0)), C = rec(P(x1, dy, 0)), D = rec(P(x0, dy, 0));
    var esp = 0.12 * sc;                                   // espessura aparente da laje
    s += polygon([[A[0], A[1] + esp], [B[0], B[1] + esp], [B[0], B[1]], [A[0], A[1]]], '#d7dce3', '#9aa4b2', 0.8, 1);
    s += polygon([[B[0], B[1] + esp], [C[0], C[1] + esp], [C[0], C[1]], [B[0], B[1]]], '#c7cdd6', '#9aa4b2', 0.8, 1);
    s += polygon([A, B, C, D], '#eef1f5', COR.estrutura, 1.4, 1);
    for (var gx = 0; gx <= spans; gx++) s += line.apply(null, P(gx * L, 0, 0).concat(P(gx * L, dy, 0)).concat([COR.grade, 1]));

    // Postes + cabo
    var tops = [];
    for (var i = 0; i <= spans; i++) {
      var x = i * L, base = rec(P(x, yc, 0)), top = rec(P(x, yc, hVis));
      s += polygon([P(x - 0.2, yc - 0.2, 0), P(x + 0.2, yc - 0.2, 0), P(x + 0.2, yc + 0.2, 0), P(x - 0.2, yc + 0.2, 0)], COR.poste, '#222', 0.6, 1);
      s += line(base[0], base[1], top[0], top[1], COR.poste, 7);
      s += circle(top[0], top[1], 4, COR.destaque, '#7a4', 0.6);
      tops.push(top);
    }
    var cablePts = [];
    for (var j = 0; j <= spans; j++) {
      cablePts.push(tops[j]);
      if (j < spans) { var sag = (j === 0) ? Math.max(Math.min(hVis * 0.85, f), 0.4) : 0.12; cablePts.push(rec(P((j + 0.5) * L, yc, hVis - sag))); }
    }
    s += poly(cablePts, corCabo, 3.2, 'none');

    // Trabalhador no vão carregado (suspenso na flecha)
    var sagW = Math.max(Math.min(hVis * 0.85, f), 0.4);
    var cabopt = rec(P(0.5 * L, yc, hVis - sagW));
    var chao = P(0.5 * L, yc, 0);
    var fig = trabalhador(chao[0], chao[1], hVis * scZ * 0.95, COR.trabalhador);
    rec([fig.cabeca[0], fig.cabeca[1] - 4]); rec([chao[0], chao[1]]);
    s += line(cabopt[0], cabopt[1], fig.ombro[0], fig.ombro[1], '#444', 1.8, '4 2');
    s += circle(cabopt[0], cabopt[1], 3, '#fff', corCabo, 2);
    s += fig.svg;
    // Segundo trabalhador, se houver
    if (nUsers > 1 && spans > 1) {
      var cab2 = rec(P(1.5 * L, yc, hVis - 0.25)), ch2 = P(1.5 * L, yc, 0);
      var fig2 = trabalhador(ch2[0], ch2[1], hVis * scZ * 0.95, '#2e7d32');
      rec([fig2.cabeca[0], fig2.cabeca[1] - 4]);
      s += line(cab2[0], cab2[1], fig2.ombro[0], fig2.ombro[1], '#444', 1.8, '4 2');
      s += circle(cab2[0], cab2[1], 3, '#fff', corCabo, 2);
      s += fig2.svg;
    }

    // Chamada (callout) da ZLQ junto ao trabalhador carregado
    var calloutX = cabopt[0] - 150, calloutY = cabopt[1] + 18;
    s += line(cabopt[0], cabopt[1], calloutX + 140, calloutY - 4, COR.cota, 0.8, '3 2');
    s += text(calloutX, calloutY, 'ZLQ = ' + n2(ZLQ) + ' m ' + (R.zlq.check.ok ? '≤' : '>') + ' ' + n2(peDir) + ' m', { size: 11, weight: 'bold', cor: R.zlq.check.ok ? COR.ok : COR.falha });
    rec([calloutX - 4, calloutY + 6]); rec([calloutX, calloutY - 14]);

    // --- Moldura automática + título/legenda no topo ---
    var pad = 16, topo = 56;
    var vbX = minX - pad, vbY = minY - topo, vbW = (maxX - minX) + 2 * pad, vbH = (maxY - minY) + topo + pad;
    var head = '';
    head += text(vbX + 6, vbY + 20, 'LINHA DE VIDA HORIZONTAL — vista isométrica simplificada', { size: 13, weight: 'bold' });
    head += text(vbX + 6, vbY + 37, spans + ' vão(s) de ' + n2(L) + ' m · poste h = ' + n2(h) + ' m · flecha f = ' + n2(f) + ' m · ' + nUsers + ' usuário(s)', { size: 10.5, cor: '#555' });
    head += '<rect x="' + (vbX + vbW - 156) + '" y="' + (vbY + 8) + '" width="148" height="22" rx="4" fill="' + (aprovado ? COR.ok : COR.falha) + '"/>';
    head += text(vbX + vbW - 148, vbY + 23, aprovado ? 'SISTEMA APROVADO' : 'SISTEMA REPROVADO', { size: 11, cor: '#fff', weight: 'bold' });
    var notaEsq = 'esquemático — fora de escala' + (nVaos > spans ? ' · ' + nVaos + ' vãos no total' : '');
    head += text(vbX + 6, vbY + vbH - 8, '(' + notaEsq + ')', { size: 10, cor: '#888' });

    return wrap(vbX.toFixed(0) + ' ' + vbY.toFixed(0) + ' ' + vbW.toFixed(0) + ' ' + vbH.toFixed(0), head + s, 'width="100%"');
  }

  // ======================================================================
  //  2 · ELEVAÇÃO COTADA DA ZLQ
  // ======================================================================
  function elevacaoZLQ(R) {
    var H_ql = num(R.zlq.H_ql.valor, 1.5), H_fr = num(R.zlq.H_fr.valor, 1.75);
    var Cpes = num(R.zlq.C_pes.valor, 1.5), Cseg = num(R.zlq.C_seg.valor, 1.0);
    var fl = num(R.zlq.f_tot.valor, 0.3), ZLQ = num(R.zlq.ZLQ.valor, 0), peDir = num(R.zlq.peDireito.valor, 0);
    var aprovado = R.zlq.check.ok;
    var W = 620, Hh = 470, topo = 60, esq = 220;
    var maxm = Math.max(ZLQ, peDir) * 1.05;
    var sc = (Hh - topo - 40) / maxm;                     // px por metro

    var segs = [
      { nome: 'Queda livre (H_ql)', v: H_ql, cor: '#e67e22' },
      { nome: 'Frenagem do absorvedor (H_fr)', v: H_fr, cor: '#d35400' },
      { nome: 'Flecha da linha (f)', v: fl, cor: '#c0392b' },
      { nome: 'Engate aos pés (norma 1,5 m)', v: Cpes, cor: '#8e44ad' },
      { nome: 'Distância de segurança (norma 1,0 m)', v: Cseg, cor: '#2c3e50' }
    ];
    var s = '';
    s += text(20, 30, 'ZONA LIVRE DE QUEDA (ZLQ) — NBR 16325-2 Anexo C.2', { size: 13, weight: 'bold' });
    // linha da ancoragem
    var y = topo;
    s += line(esq - 150, y, esq + 120, y, COR.cota, 1.5);
    s += text(esq - 150, y - 6, 'Nível da ancoragem / cabo', { size: 11, cor: COR.cota });
    // segmentos empilhados
    segs.forEach(function (seg) {
      var hpx = seg.v * sc;
      s += '<rect x="' + esq + '" y="' + y + '" width="40" height="' + hpx + '" fill="' + seg.cor + '" fill-opacity="0.85"/>';
      // cota lateral
      s += line(esq - 10, y, esq - 10, y + hpx, seg.cor, 1.2);
      s += line(esq - 14, y, esq - 6, y, seg.cor, 1.2);
      s += line(esq - 14, y + hpx, esq - 6, y + hpx, seg.cor, 1.2);
      s += text(esq - 18, y + hpx / 2 + 4, seg.nome + ' = ' + n2(seg.v) + ' m', { size: 10.5, cor: '#333', anchor: 'end' });
      y += hpx;
    });
    var yZLQ = y;
    // total ZLQ (chave à direita)
    s += line(esq + 60, topo, esq + 60, yZLQ, aprovado ? COR.ok : COR.falha, 1.5);
    s += line(esq + 54, topo, esq + 66, topo, aprovado ? COR.ok : COR.falha, 1.5);
    s += line(esq + 54, yZLQ, esq + 66, yZLQ, aprovado ? COR.ok : COR.falha, 1.5);
    s += text(esq + 70, (topo + yZLQ) / 2, 'ZLQ = ' + n2(ZLQ) + ' m', { size: 12.5, weight: 'bold', cor: aprovado ? COR.ok : COR.falha });
    // pé-direito disponível (referência)
    var yPe = topo + peDir * sc;
    s += line(esq - 60, yPe, esq + 120, yPe, COR.piso, 2, '6 3');
    s += text(esq + 122, yPe + 4, 'piso/obstáculo a ' + n2(peDir) + ' m', { size: 10.5, cor: COR.piso });
    // trabalhador suspenso na cota da flecha
    var fig = trabalhador(esq + 20, topo + (H_ql + H_fr + fl) * sc + 0.0, 70, COR.trabalhador);
    s += fig.svg;
    // veredito
    s += '<rect x="20" y="' + (Hh - 34) + '" width="' + (W - 40) + '" height="26" rx="5" fill="' + (aprovado ? '#e8f6ee' : '#fdecea') + '" stroke="' + (aprovado ? COR.ok : COR.falha) + '"/>';
    s += text(30, Hh - 16, (aprovado ? '✔ ' : '✘ ') + 'ZLQ ' + n2(ZLQ) + ' m ' + (aprovado ? '≤' : '>') + ' ' + n2(peDir) + ' m disponível — ' +
      (aprovado ? 'CONDIÇÃO ATENDIDA' : 'NÃO ATENDIDA: rever vão, absorvedor ou ponto de ancoragem'),
      { size: 11.5, weight: 'bold', cor: aprovado ? COR.ok : COR.falha });
    return wrap('0 0 ' + W + ' ' + Hh, s, 'width="100%"');
  }

  // ======================================================================
  //  3 · PLANTA DOS VÃOS
  // ======================================================================
  function planta(R) {
    var L = num(R.dados.L.valor, 10), nVaos = Math.max(1, Math.round(num(R.dados.nVaos.valor, 1)));
    var W = 680, Hh = 200, mx = 60, y = 110;
    var total = nVaos * L;
    var sc = (W - 2 * mx) / total;
    var s = '';
    s += text(20, 30, 'PLANTA — DISTRIBUIÇÃO DOS POSTES E VÃOS', { size: 13, weight: 'bold' });
    s += line(mx, y, mx + total * sc, y, COR.cabo, 2.5);              // cabo
    for (var i = 0; i <= nVaos; i++) {
      var x = mx + i * L * sc;
      s += circle(x, y, 6, (i === 0 || i === nVaos) ? COR.poste : '#fff', COR.poste, 2);
      s += text(x, y - 14, (i === 0 || i === nVaos) ? 'P' + (i + 1) + ' (extremo)' : 'P' + (i + 1), { size: 9.5, anchor: 'middle', cor: '#333' });
      if (i < nVaos) {
        var xm = mx + (i + 0.5) * L * sc;
        s += line(mx + i * L * sc, y + 22, mx + (i + 1) * L * sc, y + 22, COR.cota, 1);
        s += text(xm, y + 36, 'L = ' + n2(L) + ' m', { size: 10, anchor: 'middle', cor: COR.cota });
      }
    }
    s += text(mx + total * sc / 2, Hh - 16, 'Comprimento total da linha = ' + n2(total) + ' m  ·  ' + (nVaos + 1) + ' postes  ·  ' + nVaos + ' vão(s)', { size: 11, anchor: 'middle', weight: 'bold', cor: '#333' });
    return wrap('0 0 ' + W + ' ' + Hh, s, 'width="100%"');
  }

  // ======================================================================
  //  4 · ESFORÇOS NO POSTE EXTREMO
  // ======================================================================
  function esforcosPoste(R) {
    var h = num(R.dados.h.valor, 1.2);
    var H = num(R.reacoes.H.valor, 0), V = num(R.reacoes.V.valor, 0), M = num(R.reacoes.M_k.valor, 0);
    var util = num(R.poste.util.valor, 0); var ok = R.poste.check_util.ok;
    var W = 520, Hh = 420, baseX = 200, baseY = 330, sc = 170 / Math.max(0.6, h);
    var topY = baseY - h * sc;
    var s = '';
    s += text(20, 30, 'ESFORÇOS NO POSTE EXTREMO (NBR 8800)', { size: 13, weight: 'bold' });
    s += text(20, 48, 'Perfil ' + esc(R.poste.perfil) + ' · aço ' + esc(R.poste.aco), { size: 10.5, cor: '#555' });
    // solo/base
    s += line(baseX - 70, baseY, baseX + 70, baseY, COR.solo, 6);
    for (var i = -60; i <= 60; i += 14) s += line(baseX + i, baseY, baseX + i - 8, baseY + 9, COR.solo, 2);
    // poste
    s += line(baseX, baseY, baseX, topY, COR.poste, 9);
    s += polygon([[baseX - 22, baseY], [baseX + 22, baseY], [baseX + 22, baseY + 7], [baseX - 22, baseY + 7]], COR.poste, '#222', 0.6, 1); // placa de base
    // seta H (horizontal no topo)
    s += seta(baseX, topY, baseX + 90, topY, COR.cabo, 3);
    s += text(baseX + 96, topY + 4, 'H = ' + n2(H) + ' kN', { size: 11.5, weight: 'bold', cor: COR.cabo });
    // seta V (vertical baixo no topo)
    s += seta(baseX, topY, baseX, topY + 46, '#8e44ad', 3);
    s += text(baseX + 6, topY + 40, 'V = ' + n2(V) + ' kN', { size: 11, cor: '#8e44ad' });
    // momento na base (arco)
    s += '<path d="M ' + (baseX - 34) + ' ' + (baseY - 26) + ' A 34 34 0 0 1 ' + (baseX + 4) + ' ' + (baseY - 40) + '" fill="none" stroke="' + COR.cota + '" stroke-width="2.4"/>';
    s += seta(baseX + 0, baseY - 40, baseX + 10, baseY - 36, COR.cota, 2.4);
    s += text(baseX - 150, baseY - 16, 'M = H·h = ' + n2(M) + ' kN·m', { size: 11.5, weight: 'bold', cor: COR.cota });
    // cota da altura
    s += line(baseX - 95, topY, baseX - 95, baseY, '#555', 1);
    s += text(baseX - 100, (topY + baseY) / 2, 'h = ' + n2(h) + ' m', { size: 10.5, anchor: 'end', cor: '#555', rot: -90 });
    // barra de utilização
    var bx = 345, bw = 150, by = 150;
    s += text(bx, by - 10, 'Utilização (flexo-compressão)', { size: 11, weight: 'bold' });
    s += '<rect x="' + bx + '" y="' + by + '" width="' + bw + '" height="18" rx="3" fill="#eee" stroke="#ccc"/>';
    s += '<rect x="' + bx + '" y="' + by + '" width="' + (Math.min(1, util) * bw).toFixed(1) + '" height="18" rx="3" fill="' + (ok ? COR.ok : COR.falha) + '"/>';
    s += line(bx + bw, by - 3, bx + bw, by + 21, '#333', 1.2);
    s += text(bx + bw + 4, by + 13, '1,0', { size: 10, cor: '#333' });
    s += text(bx, by + 38, 'índice = ' + n2(util) + (ok ? '  ✔ ≤ 1,0' : '  ✘ > 1,0'), { size: 11.5, weight: 'bold', cor: ok ? COR.ok : COR.falha });
    // mini quadro de resistências
    s += text(bx, by + 70, 'M_Rd = ' + n2(num(R.poste.M_Rd.valor)) + ' kN·m', { size: 10.5, cor: '#333' });
    s += text(bx, by + 88, 'N_Rd = ' + n2(num(R.poste.N_Rd.valor)) + ' kN (c/ flambagem χ=' + n2(num(R.poste.chi.valor)) + ')', { size: 10.5, cor: '#333' });
    s += text(bx, by + 106, 'V_Rd = ' + n2(num(R.cisalhamento.V_Rd.valor)) + ' kN', { size: 10.5, cor: '#333' });
    return wrap('0 0 ' + W + ' ' + Hh, s, 'width="100%"');
  }

  function seta(x1, y1, x2, y2, cor, w) {
    var ang = Math.atan2(y2 - y1, x2 - x1), L = 9;
    var s = line(x1, y1, x2, y2, cor, w);
    s += polygon([[x2, y2], [x2 - L * Math.cos(ang - 0.4), y2 - L * Math.sin(ang - 0.4)], [x2 - L * Math.cos(ang + 0.4), y2 - L * Math.sin(ang + 0.4)]], cor, cor, 0, 1);
    return s;
  }
  function num(x, d) { var v = Number(x); return isFinite(v) ? v : (d || 0); }

  var Draw = { iso3D: iso3D, elevacaoZLQ: elevacaoZLQ, planta: planta, esforcosPoste: esforcosPoste, COR: COR };
  root.LV = root.LV || {};
  root.LV.Draw = Draw;
  if (typeof module !== 'undefined' && module.exports) module.exports = Draw;
})(typeof self !== 'undefined' ? self : (typeof globalThis !== 'undefined' ? globalThis : this));
