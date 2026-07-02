/* ============================================================================
 *  LINHA DE VIDA · GD ENGENHARIA
 *  sections.js — Propriedades geométricas de seções tubulares (exatas)
 *
 *  Calcula área (A), inércia (I), módulo elástico (W), módulo plástico (Z) e
 *  raio de giração (i) a partir da geometria — sem depender de tabelas. Isso
 *  torna o sistema robusto: qualquer perfil tubular pode ser dimensionado, e os
 *  valores conferem exatamente com as tabelas comerciais.
 *
 *  Tipos suportados:
 *    SHS — tubo quadrado            (b, t)
 *    RHS — tubo retangular          (b = largura, d = altura, t)   flexão eixo x (d)
 *    CHS — tubo circular            (D = diâmetro externo, t)
 *
 *  Unidades de ENTRADA: milímetros.
 *  Unidades de SAÍDA  : A [cm²], I [cm⁴], W [cm³], Z [cm³], i [cm].
 * ========================================================================== */
(function (root) {
  'use strict';

  // Conversões a partir de mm
  var MM2_TO_CM2 = 1e-2;   // mm² → cm²
  var MM4_TO_CM4 = 1e-4;   // mm⁴ → cm⁴
  var MM3_TO_CM3 = 1e-3;   // mm³ → cm³
  var MM_TO_CM   = 1e-1;   // mm  → cm

  function num(x, name) {
    var v = Number(x);
    if (!isFinite(v)) throw new Error('Parâmetro de seção inválido: ' + name + ' = ' + x);
    return v;
  }

  /** Tubo quadrado SHS — lado b, espessura t (mm). */
  function shs(b, t) {
    b = num(b, 'b'); t = num(t, 't');
    if (t <= 0 || b <= 0) throw new Error('SHS: b e t devem ser > 0');
    if (2 * t >= b) throw new Error('SHS: espessura 2t deve ser menor que o lado b');
    var bi = b - 2 * t;                              // lado interno
    var A  = b * b - bi * bi;                        // mm²
    var I  = (Math.pow(b, 4) - Math.pow(bi, 4)) / 12;// mm⁴
    var W  = 2 * I / b;                              // mm³
    var Z  = (Math.pow(b, 3) - Math.pow(bi, 3)) / 4; // mm³
    return finalize('SHS', { b: b, d: b, t: t }, A, I, W, Z, b, t);
  }

  /** Tubo retangular RHS — largura b, altura d, espessura t (mm). Flexão no eixo de maior altura (d). */
  function rhs(b, d, t) {
    b = num(b, 'b'); d = num(d, 'd'); t = num(t, 't');
    if (t <= 0 || b <= 0 || d <= 0) throw new Error('RHS: dimensões devem ser > 0');
    if (2 * t >= Math.min(b, d)) throw new Error('RHS: espessura 2t deve ser menor que a menor dimensão');
    var bi = b - 2 * t, di = d - 2 * t;
    var A  = b * d - bi * di;                                   // mm²
    var I  = (b * Math.pow(d, 3) - bi * Math.pow(di, 3)) / 12;  // mm⁴ (eixo x, altura d)
    var W  = 2 * I / d;                                         // mm³
    var Z  = (b * d * d - bi * di * di) / 4;                    // mm³
    return finalize('RHS', { b: b, d: d, t: t }, A, I, W, Z, d, t);
  }

  /** Tubo circular CHS — diâmetro externo D, espessura t (mm). */
  function chs(D, t) {
    D = num(D, 'D'); t = num(t, 't');
    if (t <= 0 || D <= 0) throw new Error('CHS: D e t devem ser > 0');
    if (2 * t >= D) throw new Error('CHS: espessura 2t deve ser menor que o diâmetro D');
    var Di = D - 2 * t;
    var A  = Math.PI / 4 * (D * D - Di * Di);                   // mm²
    var I  = Math.PI / 64 * (Math.pow(D, 4) - Math.pow(Di, 4)); // mm⁴
    var W  = 2 * I / D;                                         // mm³
    var Z  = (Math.pow(D, 3) - Math.pow(Di, 3)) / 6;            // mm³ (plástico de seção tubular circular)
    return finalize('CHS', { b: D, d: D, t: t }, A, I, W, Z, D, t);
  }

  // Monta o objeto final com unidades em cm e dados para verificação de esbeltez local
  function finalize(type, geom, A_mm2, I_mm4, W_mm3, Z_mm3, dimFlex_mm, t_mm) {
    var i_mm = Math.sqrt(I_mm4 / A_mm2);             // raio de giração (mm)
    return {
      type: type,
      geom: geom,
      A: A_mm2 * MM2_TO_CM2,       // cm²
      I: I_mm4 * MM4_TO_CM4,       // cm⁴
      W: W_mm3 * MM3_TO_CM3,       // cm³
      Z: Z_mm3 * MM3_TO_CM3,       // cm³
      i: i_mm  * MM_TO_CM,         // cm
      // Esbeltez local de parede (NBR 8800 Tabela F.1). Para SHS/RHS a MESA
      // comprimida é a face de largura b (perpendicular ao eixo de flexão d);
      // a ALMA é a face de altura d. CHS usa D/t. (largura de parede plana ≈ dim − 3t)
      bt: (type === 'CHS') ? (dimFlex_mm / t_mm) : ((geom.b - 3 * t_mm) / t_mm),     // esbeltez da MESA (b)
      btWeb: (type === 'CHS') ? null : ((geom.d - 3 * t_mm) / t_mm),                  // esbeltez da ALMA (d)
      // dados crus em mm (uso interno). dim = altura de flexão (d) — usada no cisalhamento (2 almas)
      _mm: { A: A_mm2, I: I_mm4, W: W_mm3, Z: Z_mm3, i: i_mm, t: t_mm, dim: dimFlex_mm }
    };
  }

  /**
   * Constrói as propriedades a partir de uma definição de catálogo:
   *   { type:'SHS', b, t } | { type:'RHS', b, d, t } | { type:'CHS', D, t }
   */
  function fromSpec(spec) {
    if (!spec || !spec.type) throw new Error('Especificação de perfil ausente');
    switch (String(spec.type).toUpperCase()) {
      case 'SHS': return shs(spec.b, spec.t);
      case 'RHS': return rhs(spec.b, spec.d, spec.t);
      case 'CHS': return chs(spec.D != null ? spec.D : spec.b, spec.t);
      default: throw new Error('Tipo de perfil não suportado: ' + spec.type);
    }
  }

  var Sections = { shs: shs, rhs: rhs, chs: chs, fromSpec: fromSpec };

  root.LV = root.LV || {};
  root.LV.Sections = Sections;
  if (typeof module !== 'undefined' && module.exports) module.exports = Sections;
})(typeof self !== 'undefined' ? self : (typeof globalThis !== 'undefined' ? globalThis : this));
