/* ============================================================================
 *  FV-CHECK · GD ENGENHARIA — Verificação Estrutural Expressa p/ FV em Telhado
 *  draw.js — Figuras técnicas em SVG (isométrico, corte, vento, perfil)
 *  Geração por string pura (funciona no navegador e no Node p/ testes).
 * ========================================================================== */
(function (root) {
  'use strict';

  var CORES = {
    parede: '#e3ebf3', empena: '#cfdbe8', telhado: '#b7c6d6', telhado2: '#a9bacc',
    modulo: '#16324f', moduloBorda: '#3d6b9e', moduloBrilho: '#274d75',
    linha: '#1f3a5f', cota: '#c0392b', texto: '#333', muted: '#6b7280',
    vento: '#2a5a8f', succao: '#c0392b', solo: '#8a9199'
  };

  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function svg(vb, conteudo, titulo) {
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="' + vb + '" role="img" font-family="Segoe UI, Arial, sans-serif">' +
      (titulo ? '<title>' + esc(titulo) + '</title>' : '') + conteudo + '</svg>';
  }
  function poly(pts, fill, stroke, sw, extra) {
    return '<polygon points="' + pts.map(function (p) { return p[0].toFixed(1) + ',' + p[1].toFixed(1); }).join(' ') +
      '" fill="' + fill + '" stroke="' + (stroke || CORES.linha) + '" stroke-width="' + (sw == null ? 1 : sw) + '"' + (extra || '') + '/>';
  }
  function linha(x1, y1, x2, y2, cor, sw, extra) {
    return '<line x1="' + x1.toFixed(1) + '" y1="' + y1.toFixed(1) + '" x2="' + x2.toFixed(1) + '" y2="' + y2.toFixed(1) +
      '" stroke="' + (cor || CORES.linha) + '" stroke-width="' + (sw || 1) + '"' + (extra || '') + '/>';
  }
  function txt(x, y, s, tam, cor, anchor, extra) {
    return '<text x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" font-size="' + (tam || 11) + '" fill="' + (cor || CORES.texto) +
      '" text-anchor="' + (anchor || 'middle') + '"' + (extra || '') + '>' + esc(s) + '</text>';
  }
  /* cota horizontal com setas */
  function cotaH(x1, x2, y, rotulo) {
    var s = linha(x1, y, x2, y, CORES.cota, 0.8) +
      linha(x1, y - 4, x1, y + 4, CORES.cota, 0.8) + linha(x2, y - 4, x2, y + 4, CORES.cota, 0.8) +
      txt((x1 + x2) / 2, y - 4, rotulo, 10, CORES.cota);
    return s;
  }
  function cotaV(x, y1, y2, rotulo) {
    return linha(x, y1, x, y2, CORES.cota, 0.8) +
      linha(x - 4, y1, x + 4, y1, CORES.cota, 0.8) + linha(x - 4, y2, x + 4, y2, CORES.cota, 0.8) +
      txt(x - 6, (y1 + y2) / 2, rotulo, 10, CORES.cota, 'end');
  }
  function seta(x1, y1, x2, y2, cor, sw) {
    var ang = Math.atan2(y2 - y1, x2 - x1), L = 7;
    return linha(x1, y1, x2, y2, cor, sw || 1.6) +
      linha(x2, y2, x2 - L * Math.cos(ang - 0.45), y2 - L * Math.sin(ang - 0.45), cor, sw || 1.6) +
      linha(x2, y2, x2 - L * Math.cos(ang + 0.45), y2 - L * Math.sin(ang + 0.45), cor, sw || 1.6);
  }

  /* ------------------- Figura 1: isométrico do galpão + FV --------------- */
  function figIsometrica(m) {
    var a = m.inp.comprimento, b = m.inp.largura, h = m.inp.peDireito, hc = m.zCumeeira;
    var esc3 = 220 / Math.max(a, b + 8, hc * 2);
    function P(x, y, z) { // isometria simples
      return [(x - z) * 0.866 * esc3 + 260, 210 - y * esc3 + (x + z) * 0.5 * esc3 - (a + b) * 0.25 * esc3];
    }
    var s = '';
    // solo
    s += poly([P(-3, 0, -3), P(a + 3, 0, -3), P(a + 3, 0, b + 3), P(-3, 0, b + 3)], '#f0f3f6', '#d5dbe2', 1);
    // parede lateral (z=0)
    s += poly([P(0, 0, 0), P(a, 0, 0), P(a, h, 0), P(0, h, 0)], CORES.parede);
    // empena (x=a)
    s += poly([P(a, 0, 0), P(a, 0, b), P(a, h, b), P(a, hc, b / 2), P(a, h, 0)], CORES.empena);
    // água de trás (visível pouco) e água da frente
    s += poly([P(0, h, b), P(a, h, b), P(a, hc, b / 2), P(0, hc, b / 2)], CORES.telhado2);
    s += poly([P(0, h, 0), P(a, h, 0), P(a, hc, b / 2), P(0, hc, b / 2)], CORES.telhado);
    // módulos na água da frente (grade paramétrica sobre o plano)
    var nx = Math.min(14, Math.max(3, Math.round(a / 2.4))), nz = Math.min(6, Math.max(2, Math.round(b / 2 / 1.4)));
    var frac = Math.min(0.92, Math.max(0.25, m.cobertura * 1.6));
    var nxU = Math.max(2, Math.round(nx * frac)), nzU = Math.max(1, Math.round(nz * 0.9));
    function R(u, v) { // ponto no plano da água: u∈[0,1] ao longo de a; v∈[0,1] beiral→cumeeira
      return P(u * a, h + v * (hc - h), v * b / 2);
    }
    var mg = 0.035;
    for (var i = 0; i < nxU; i++) {
      for (var j = 0; j < nzU; j++) {
        var u0 = 0.04 + i / nx * 0.92, u1 = u0 + 0.92 / nx - mg / 2;
        var v0 = 0.08 + j / nz * 0.84, v1 = v0 + 0.84 / nz - mg;
        s += poly([R(u0, v0), R(u1, v0), R(u1, v1), R(u0, v1)], CORES.modulo, CORES.moduloBorda, 0.7);
        s += linha.apply(null, R((u0 + u1) / 2, v0).concat(R((u0 + u1) / 2, v1)).concat([CORES.moduloBrilho, 0.5]));
      }
    }
    // arestas
    s += linha.apply(null, P(0, h, 0).concat(P(0, hc, b / 2)).concat([CORES.linha, 1]));
    s += linha.apply(null, P(0, hc, b / 2).concat(P(a, hc, b / 2)).concat([CORES.linha, 1.2]));
    // cotas
    var pA0 = P(0, 0, 0), pA1 = P(a, 0, 0);
    s += cotaH(pA0[0], pA1[0], Math.max(pA0[1], pA1[1]) + 26, 'comprimento ' + a.toFixed(1) + ' m');
    var pE = P(a, 0, b), pE2 = P(a, 0, 0);
    s += txt((pE[0] + pE2[0]) / 2 + 26, (pE[1] + pE2[1]) / 2 + 14, 'largura ' + b.toFixed(1) + ' m', 10, CORES.cota);
    s += txt(30, 26, m.kwp.toFixed(1) + ' kWp · ' + m.inp.numModulos + ' módulos · cobertura ' + (m.cobertura * 100).toFixed(0) + '%', 11.5, CORES.linha, 'start', ' font-weight="700"');
    return svg('0 0 520 270', s, 'Vista isométrica do galpão com a usina fotovoltaica');
  }

  /* ------------------------ Figura 2: corte transversal ------------------ */
  function figCorte(m) {
    var b = m.inp.largura, h = m.inp.peDireito, hc = m.zCumeeira;
    var escl = 380 / b, escv = Math.min(escl, 150 / hc);
    var e = Math.min(escl, escv);
    var X0 = 70, Y0 = 240;
    function P(x, y) { return [X0 + x * e, Y0 - y * e]; }
    var s = '';
    // solo
    s += linha(20, Y0, 500, Y0, CORES.solo, 2);
    // pilares
    s += poly([P(0, 0), P(0.25, 0), P(0.25, h), P(0, h)], '#9fb2c4');
    s += poly([P(b - 0.25, 0), P(b, 0), P(b, h), P(b - 0.25, h)], '#9fb2c4');
    // banzos (duas águas)
    var duas = m.duasAguas;
    var cume = duas ? P(b / 2, hc) : P(b, hc);
    s += linha.apply(null, P(0, h).concat(cume).concat([CORES.linha, 3]));
    if (duas) s += linha.apply(null, P(b, h).concat(cume).concat([CORES.linha, 3]));
    // terças (quadradinhos ao longo da água) + telha + módulos
    function agua(x0, y0, x1, y1, comModulos) {
      var dx = x1 - x0, dy = y1 - y0, len = Math.sqrt(dx * dx + dy * dy);
      var ux = dx / len, uy = dy / len, nx = -uy, ny = ux; // normal p/ cima
      var st = m.s * e, n = Math.max(2, Math.floor(len / st));
      var out = '';
      for (var i = 0; i <= n; i++) {
        var cx = x0 + ux * i * st, cy = y0 + uy * i * st;
        out += poly([[cx - 3, cy - 3], [cx + 3, cy - 3], [cx + 3, cy + 3], [cx - 3, cy + 3]], '#fff', CORES.linha, 1.2);
      }
      // telha
      out += linha(x0 + nx * 5, y0 + ny * 5, x1 + nx * 5, y1 + ny * 5, '#7d8b99', 1.6);
      // módulos coplanares
      if (comModulos) {
        var m0 = 0.12 * len, m1 = 0.92 * len;
        out += linha(x0 + ux * m0 + nx * 11, y0 + uy * m0 + ny * 11, x0 + ux * m1 + nx * 11, y0 + uy * m1 + ny * 11, CORES.modulo, 5);
        for (var k = 0; k < 4; k++) {
          var mk = m0 + (m1 - m0) * (0.12 + k * 0.25);
          out += linha(x0 + ux * mk + nx * 5, y0 + uy * mk + ny * 5, x0 + ux * mk + nx * 11, y0 + uy * mk + ny * 11, CORES.moduloBorda, 1.5);
        }
      }
      return out;
    }
    var pB = P(0, h);
    s += agua(pB[0], pB[1], cume[0], cume[1], true);
    if (duas) { var pB2 = P(b, h); s += agua(pB2[0], pB2[1], cume[0], cume[1], false); }
    // cotas
    s += cotaH(P(0, 0)[0], P(b, 0)[0], Y0 + 22, 'largura ' + b.toFixed(1) + ' m');
    s += cotaV(P(0, 0)[0] - 26, P(0, h)[1], Y0, 'pé-direito ' + h.toFixed(1) + ' m');
    s += cotaV(P(b, 0)[0] + 30, cume[1], Y0, (duas ? 'cumeeira ' : 'topo ') + hc.toFixed(2) + ' m');
    s += txt((pB[0] + cume[0]) / 2, (pB[1] + cume[1]) / 2 - 26, 'θ = ' + m.thetaGraus.toFixed(1) + '° (' + m.inp.inclinacao + '%)', 10.5, CORES.linha);
    s += txt(260, 22, 'Terças ' + esc(m.perfil.nome) + ' @ ' + m.s.toFixed(2) + ' m · vão ' + m.L.toFixed(1) + ' m (entre pórticos)', 11, CORES.linha, 'middle', ' font-weight="700"');
    s += txt(260, 38, 'Telha: ' + esc(m.telha.nome) + ' · módulos coplanares fixados ' + (m.inp.fixacao === 'telha' ? 'na telha' : 'nas terças'), 10, CORES.muted);
    return svg('0 0 520 280', s, 'Corte transversal com terças, telha e módulos');
  }

  /* ------------------------ Figura 3: pressões de vento ------------------ */
  function figVento(m) {
    var b = m.inp.largura, h = m.inp.peDireito, hc = m.zCumeeira;
    var e = Math.min(300 / b, 130 / hc), X0 = 130, Y0 = 215;
    function P(x, y) { return [X0 + x * e, Y0 - y * e]; }
    var s = '';
    s += linha(20, Y0, 500, Y0, CORES.solo, 2);
    var duas = m.duasAguas;
    var cume = duas ? P(b / 2, hc) : P(b, hc);
    // contorno
    s += poly([P(0, 0), P(b, 0), P(b, h), cume, P(0, h)], '#f4f7fa', CORES.linha, 2);
    // vento incidente
    s += seta(28, P(0, h * 0.7)[1], X0 - 8, P(0, h * 0.7)[1], CORES.vento, 2.2);
    s += txt(30, P(0, h * 0.7)[1] - 10, 'Vento — Vk = ' + m.vento.VkLocal.toFixed(1) + ' m/s · q = ' + m.vento.qLocal.toFixed(2) + ' kN/m²', 10.5, CORES.vento, 'start', ' font-weight="700"');
    // sucções nas águas
    function succoes(p0, p1, ce, lado) {
      var dx = p1[0] - p0[0], dy = p1[1] - p0[1], len = Math.sqrt(dx * dx + dy * dy);
      var nx = dy / len, ny = -dx / len; // normal externa (p/ cima)
      if (ny > 0) { nx = -nx; ny = -ny; }
      var out = '';
      for (var i = 1; i <= 4; i++) {
        var f = i / 5, cx = p0[0] + dx * f, cy = p0[1] + dy * f;
        out += seta(cx, cy, cx + nx * 26, cy + ny * 26, CORES.succao, 1.6);
      }
      out += txt(p0[0] + dx * 0.5 + nx * 44, p0[1] + dy * 0.5 + ny * 44, 'Ce ' + lado + ' = ' + ce.toFixed(2), 10.5, CORES.succao, 'middle', ' font-weight="700"');
      return out;
    }
    s += succoes(P(0, h), cume, m.vento.ce90.EF, 'EF');
    if (duas) s += succoes(cume, P(b, h), m.vento.ce90.GH, 'GH');
    // pressão interna
    var ci = P(b * 0.5, h * 0.45);
    s += seta(ci[0], ci[1], ci[0], ci[1] - 22, CORES.vento, 1.4);
    s += seta(ci[0], ci[1], ci[0] - 22, ci[1], CORES.vento, 1.4);
    s += seta(ci[0], ci[1], ci[0] + 22, ci[1], CORES.vento, 1.4);
    s += txt(ci[0], ci[1] + 16, 'Ci = +' + m.vento.ciPos.toFixed(1), 10.5, CORES.vento);
    // resumo
    s += txt(260, 22, 'Sucção efetiva de projeto no telhado: ΔP = (Ce − Ci)·q = ' + m.vento.dpSuc.toFixed(2) + ' kN/m²', 11.5, CORES.succao, 'middle', ' font-weight="700"');
    s += txt(260, 40, 'NBR 6123: V0=' + m.inp.v0 + ' m/s · S1=' + m.s1.valor.toFixed(2) + ' · S2=' + m.vento.S2Local.toFixed(3) + ' (cat. ' + m.inp.categoria + ', cl. A) · S3=' + m.s3.valor.toFixed(2) + ' · zonas de borda: Ce até ' + m.vento.ceLocalBorda.toFixed(1), 9.5, CORES.muted);
    return svg('0 0 520 250', s, 'Diagrama de pressões de vento (NBR 6123)');
  }

  /* ------------------------ Figura 4: seção do perfil -------------------- */
  function figPerfil(m) {
    var sp = m.perfil, sec = m.sec;
    var s = '', cx = 190, cy = 130;
    function shape() {
      var t;
      if (sec.tipo === 'W') {
        // desenho esquemático de I
        var d = 200, bf = 120; t = 12;
        return poly([[cx - bf / 2, cy - d / 2], [cx + bf / 2, cy - d / 2], [cx + bf / 2, cy - d / 2 + t], [cx + 6, cy - d / 2 + t], [cx + 6, cy + d / 2 - t], [cx + bf / 2, cy + d / 2 - t], [cx + bf / 2, cy + d / 2], [cx - bf / 2, cy + d / 2], [cx - bf / 2, cy + d / 2 - t], [cx - 6, cy + d / 2 - t], [cx - 6, cy - d / 2 + t], [cx - bf / 2, cy - d / 2 + t]], '#dfe7f0', CORES.linha, 1.5);
      }
      var escp = Math.min(200 / sp.bw, 140 / Math.max(sp.bf * (sec.tipo === 'Z' ? 2 : 1), 40));
      var bw = sp.bw * escp, bf = sp.bf * escp, D = (sp.D || 0) * escp;
      t = Math.max(3, sp.t * escp);
      var x0 = sec.tipo === 'Z' ? cx : cx - bf / 2, y0 = cy - bw / 2;
      var out = '';
      function rect(x, y, w, hh) { return poly([[x, y], [x + w, y], [x + w, y + hh], [x, y + hh]], '#dfe7f0', CORES.linha, 1.2); }
      if (sec.tipo === 'TR') {
        out += poly([[cx - bf / 2, y0], [cx + bf / 2, y0], [cx + bf / 2, y0 + bw], [cx - bf / 2, y0 + bw]], '#dfe7f0', CORES.linha, 1.5);
        out += poly([[cx - bf / 2 + t, y0 + t], [cx + bf / 2 - t, y0 + t], [cx + bf / 2 - t, y0 + bw - t], [cx - bf / 2 + t, y0 + bw - t]], '#fff', CORES.linha, 1);
      } else if (sec.tipo === 'Z') {
        out += rect(x0 - t / 2, y0, t, bw);                       // alma
        out += rect(x0 + t / 2, y0, bf - t, t);                   // mesa sup →
        out += rect(x0 + bf - t / 2 - t, y0, t, D);               // enrijecedor sup
        out += rect(x0 - bf + t / 2, y0 + bw - t, bf - t, t);     // mesa inf ←
        out += rect(x0 - bf + t / 2, y0 + bw - D, t, D);          // enrijecedor inf
      } else { // U / UE
        out += rect(x0, y0, t, bw);
        out += rect(x0 + t, y0, bf - t, t);
        out += rect(x0 + t, y0 + bw - t, bf - t, t);
        if (sec.tipo === 'UE') {
          out += rect(x0 + bf - t, y0, t, D);
          out += rect(x0 + bf - t, y0 + bw - D, t, D);
        }
      }
      return out;
    }
    s += shape();
    s += txt(cx, 24, esc(sp.nome) + ' — aço ' + esc(m.aco.nome) + ' (fy = ' + m.aco.fy + ' MPa)', 12, CORES.linha, 'middle', ' font-weight="700"');
    var props = [
      'A = ' + sec.A.toFixed(2) + ' cm²',
      'Ix = ' + sec.Ix.toFixed(0) + ' cm⁴ · Wx = ' + sec.Wx.toFixed(1) + ' cm³',
      'Iy = ' + sec.Iy.toFixed(0) + ' cm⁴ · Wy = ' + sec.Wy.toFixed(1) + ' cm³',
      'peso = ' + sec.pesoKgM.toFixed(2) + ' kg/m',
      sec.rho < 1 ? 'ρ (larguras efetivas) = ' + sec.rho.toFixed(2) : 'seção totalmente efetiva (ρ = 1,0)'
    ];
    props.forEach(function (p, i) { s += txt(330, 84 + i * 20, p, 11, CORES.texto, 'start'); });
    return svg('0 0 520 260', s, 'Seção transversal da terça e propriedades');
  }

  var Draw = { figIsometrica: figIsometrica, figCorte: figCorte, figVento: figVento, figPerfil: figPerfil, CORES: CORES };

  root.FV = root.FV || {};
  root.FV.Draw = Draw;
  if (typeof module !== 'undefined' && module.exports) module.exports = Draw;
})(typeof self !== 'undefined' ? self : (typeof globalThis !== 'undefined' ? globalThis : this));
