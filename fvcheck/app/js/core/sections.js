/* ============================================================================
 *  FV-CHECK · GD ENGENHARIA — Verificação Estrutural Expressa p/ FV em Telhado
 *  sections.js — Propriedades geométricas de perfis de terça
 *
 *  Modelo: decomposição em retângulos com cantos retos (desprezando os raios
 *  de dobra), prática usual e levemente conservadora para triagem de perfis
 *  formados a frio. Perfis W laminados usam propriedades nominais de tabela.
 *
 *  Unidades: entrada em mm · saída em cm (A cm², I cm⁴, W cm³, r cm).
 *
 *  Triagem de flambagem local (NBR 14762 9.2 — método das larguras efetivas):
 *  para cada elemento comprimido calcula-se λp = (b/t) / [0,95·√(k·E/fy)] e
 *  ρ = (1 − 0,22/λp)/λp  (λp > 0,673). O menor ρ é aplicado ao módulo W
 *  inteiro (Wef ≈ ρmin·W) — simplificação CONSERVADORA do método expresso.
 *    k = 4,0  elemento AA (apoiado-apoiado: alma comprimida uniforme, mesa com
 *             enrijecedor de borda adequado)
 *    k = 0,43 elemento AL (apoiado-livre: mesa de U simples, enrijecedor)
 *    k = 24   alma em flexão (gradiente de tensões ψ = −1)
 * ========================================================================== */
(function (root) {
  'use strict';

  var Norms = root.FV && root.FV.Norms ? root.FV.Norms : (typeof require !== 'undefined' ? require('./norms.js') : null);
  var E_ACO = Norms ? Norms.PARAM.E : 200000; // MPa

  /* ---------- núcleo: soma de retângulos [x0,y0,largura,altura] em mm ---- */
  function somaRetangulos(rects) {
    var A = 0, Sx = 0, Sy = 0;
    rects.forEach(function (r) {
      var a = r.w * r.h, cx = r.x + r.w / 2, cy = r.y + r.h / 2;
      A += a; Sx += a * cy; Sy += a * cx;
    });
    var ybar = Sx / A, xbar = Sy / A, Ix = 0, Iy = 0;
    rects.forEach(function (r) {
      var a = r.w * r.h, cx = r.x + r.w / 2, cy = r.y + r.h / 2;
      Ix += r.w * Math.pow(r.h, 3) / 12 + a * Math.pow(cy - ybar, 2);
      Iy += r.h * Math.pow(r.w, 3) / 12 + a * Math.pow(cx - xbar, 2);
    });
    var xmax = -Infinity, xmin = Infinity, ymax = -Infinity, ymin = Infinity;
    rects.forEach(function (r) {
      xmin = Math.min(xmin, r.x); xmax = Math.max(xmax, r.x + r.w);
      ymin = Math.min(ymin, r.y); ymax = Math.max(ymax, r.y + r.h);
    });
    return {
      A: A, Ix: Ix, Iy: Iy, xbar: xbar, ybar: ybar,
      Wx: Ix / Math.max(ymax - ybar, ybar - ymin),
      Wy: Iy / Math.max(xmax - xbar, xbar - xmin)
    };
  }

  /* ---------- geometrias (mm) — web vertical em x=0..t ------------------- */
  function retsU(bw, bf, t) {
    return [
      { x: 0, y: 0, w: t, h: bw },                    // alma
      { x: t, y: bw - t, w: bf - t, h: t },           // mesa superior
      { x: t, y: 0, w: bf - t, h: t }                 // mesa inferior
    ];
  }
  function retsUE(bw, bf, D, t) {
    return retsU(bw, bf, t).concat([
      { x: bf - t, y: bw - D, w: t, h: D - t },       // enrijecedor superior
      { x: bf - t, y: t, w: t, h: D - t }             // enrijecedor inferior
    ]);
  }
  function retsZ(bw, bf, D, t) {
    // ponto-simétrico: mesa superior para +x, inferior para −x
    return [
      { x: -t / 2, y: 0, w: t, h: bw },
      { x: t / 2, y: bw - t, w: bf - t, h: t },
      { x: bf - t / 2 - t, y: bw - D, w: t, h: D - t },
      { x: -t / 2 - (bf - t), y: 0, w: bf - t, h: t },
      { x: -(bf - t / 2), y: t, w: t, h: D - t }
    ];
  }

  /* ---------- λp/ρ de Winter (NBR 14762 9.2) ----------------------------- */
  function rhoWinter(bt, k, fy) {
    var lp = bt / (0.95 * Math.sqrt(k * E_ACO / fy));
    if (lp <= 0.673) return { lp: lp, rho: 1 };
    var rho = (1 - 0.22 / lp) / lp;
    return { lp: lp, rho: Math.max(0.15, Math.min(1, rho)) };
  }

  /* ---------- montagem por tipo ------------------------------------------ */
  function props(spec, fy) {
    fy = fy || 250;
    if (!spec || !spec.type) throw new Error('Especificação de perfil ausente');
    var tipo = String(spec.type).toUpperCase();
    var bw = spec.bw, bf = spec.bf, D = spec.D || 0, t = spec.t;
    var out, elementos = [], avisos = [];

    if (tipo === 'W') {
      var p = spec.props;
      if (!p) throw new Error('Perfil W sem propriedades de tabela');
      out = {
        tipo: 'W', A: p.A, Ix: p.Ix, Wx: p.Wx, Iy: p.Iy, Wy: p.Wy,
        ry: p.ry, hwFlat: p.hw, tw: p.tw, t: p.tw,
        pesoKgM: spec.peso || p.A * 0.785,
        rho: 1, WxEf: p.Wx, WyEf: p.Wy, esbelto: false,
        elementos: [], avisos: ['Perfil laminado: seção compacta admitida para fy ≤ 345 MPa (NBR 8800 Tabela G.1).'],
        fechado: false, laminado: true
      };
      return out;
    }

    if (tipo === 'TR') {
      if (!(bw > 0 && bf > 0 && t > 0 && bw > 2 * t && bf > 2 * t)) throw new Error('Dimensões inválidas do tubo');
      var A = 2 * t * (bw + bf - 2 * t);
      var Ix = (bf * Math.pow(bw, 3) - (bf - 2 * t) * Math.pow(bw - 2 * t, 3)) / 12;
      var Iy = (bw * Math.pow(bf, 3) - (bw - 2 * t) * Math.pow(bf - 2 * t, 3)) / 12;
      elementos = [
        { nome: 'mesa (AA)', bt: (bf - 2 * t) / t, k: 4 },
        { nome: 'alma em flexão', bt: (bw - 2 * t) / t, k: 24 }
      ];
      out = {
        tipo: tipo, A: A / 100, Ix: Ix / 10000, Iy: Iy / 10000,
        Wx: Ix / (bw / 2) / 1000, Wy: Iy / (bf / 2) / 1000,
        hwFlat: bw - 2 * t, t: t, fechado: true, laminado: false
      };
    } else {
      var rects;
      if (tipo === 'U') {
        if (!(bw > 0 && bf > t && t > 0)) throw new Error('Dimensões inválidas do perfil U');
        rects = retsU(bw, bf, t);
        elementos = [
          { nome: 'mesa (AL)', bt: (bf - t) / t, k: 0.43 },
          { nome: 'alma em flexão', bt: (bw - 2 * t) / t, k: 24 }
        ];
      } else if (tipo === 'UE' || tipo === 'Z') {
        if (!(bw > 0 && bf > t && D > t && t > 0)) throw new Error('Dimensões inválidas do perfil');
        rects = tipo === 'UE' ? retsUE(bw, bf, D, t) : retsZ(bw, bf, D, t);
        var lipOk = D >= 0.2 * bf; // adequação simplificada do enrijecedor de borda
        if (!lipOk) avisos.push('Enrijecedor de borda curto (D < 0,2·bf): mesa tratada como não enrijecida (conservador).');
        elementos = [
          { nome: 'mesa comprimida', bt: (bf - 2 * t) / t, k: lipOk ? 4 : 0.43 },
          { nome: 'enrijecedor (AL)', bt: (D - t) / t, k: 0.43 },
          { nome: 'alma em flexão', bt: (bw - 2 * t) / t, k: 24 }
        ];
      } else {
        throw new Error('Tipo de perfil não suportado: ' + tipo);
      }
      var g = somaRetangulos(rects);
      out = {
        tipo: tipo, A: g.A / 100, Ix: g.Ix / 10000, Iy: g.Iy / 10000,
        Wx: g.Wx / 1000, Wy: g.Wy / 1000,
        hwFlat: bw - 2 * t, t: t, fechado: false, laminado: false
      };
      if (tipo === 'Z') avisos.push('Perfil Z: propriedades em eixos geométricos — admite telha conectada restringindo a flexão assimétrica (prática usual p/ terças).');
    }

    // triagem de flambagem local
    var rhoMin = 1, lpMax = 0;
    elementos.forEach(function (el) {
      var r = rhoWinter(el.bt, el.k, fy);
      el.lp = r.lp; el.rho = r.rho;
      if (r.rho < rhoMin) rhoMin = r.rho;
      if (r.lp > lpMax) lpMax = r.lp;
    });
    out.elementos = elementos;
    out.rho = rhoMin;
    out.WxEf = out.Wx * rhoMin;
    out.WyEf = out.Wy * rhoMin;
    out.esbelto = rhoMin < 1;
    if (out.esbelto) avisos.push('Flambagem local: seção com elementos esbeltos — módulo resistente reduzido por ρ = ' + rhoMin.toFixed(2) + ' (larguras efetivas simplificadas, NBR 14762 9.2). O cálculo exato da seção efetiva integra o laudo.');
    out.ry = Math.sqrt(out.Iy / out.A);
    out.pesoKgM = out.A * 0.785; // 7850 kg/m³
    out.avisos = avisos;
    return out;
  }

  var Sections = { props: props, rhoWinter: rhoWinter, somaRetangulos: somaRetangulos };

  root.FV = root.FV || {};
  root.FV.Sections = Sections;
  if (typeof module !== 'undefined' && module.exports) module.exports = Sections;
})(typeof self !== 'undefined' ? self : (typeof globalThis !== 'undefined' ? globalThis : this));
