/* ============================================================================
 *  LINHA DE VIDA · GD ENGENHARIA
 *  units.js — Conversão de unidades SI ↔ Imperial (clientes internacionais)
 * ========================================================================== */
(function (root) {
  'use strict';
  var LV = root.LV = root.LV || {};

  var FAT = {
    kN_to_lbf: 224.809, kN_to_kgf: 101.972,
    m_to_ft: 3.28084, mm_to_in: 0.0393701,
    kNm_to_lbf_ft: 737.562, mps_to_mph: 2.23694,
    MPa_to_ksi: 0.145038
  };

  function fmt(x, dec) { if (x == null || !isFinite(x)) return '—'; return Number(x).toFixed(dec == null ? 2 : dec).replace('.', ','); }

  // Converte um par (valor, unidade SI) para também o equivalente imperial (string)
  function dual(valor, unidade) {
    if (valor == null || !isFinite(valor)) return '—';
    var si = fmt(valor) + ' ' + unidade;
    var imp = '';
    switch (unidade) {
      case 'kN': imp = fmt(valor * FAT.kN_to_lbf, 0) + ' lbf'; break;
      case 'm': imp = fmt(valor * FAT.m_to_ft) + ' ft'; break;
      case 'mm': imp = fmt(valor * FAT.mm_to_in) + ' in'; break;
      case 'kN·m': imp = fmt(valor * FAT.kNm_to_lbf_ft, 0) + ' lbf·ft'; break;
      case 'm/s': imp = fmt(valor * FAT.mps_to_mph, 0) + ' mph'; break;
      case 'MPa': imp = fmt(valor * FAT.MPa_to_ksi) + ' ksi'; break;
      default: return si;
    }
    return si + ' (' + imp + ')';
  }

  function conv(valor, unidade, sistema) {
    if (sistema !== 'imperial') return { valor: valor, unidade: unidade };
    switch (unidade) {
      case 'kN': return { valor: valor * FAT.kN_to_lbf, unidade: 'lbf' };
      case 'm': return { valor: valor * FAT.m_to_ft, unidade: 'ft' };
      case 'mm': return { valor: valor * FAT.mm_to_in, unidade: 'in' };
      case 'kN·m': return { valor: valor * FAT.kNm_to_lbf_ft, unidade: 'lbf·ft' };
      case 'm/s': return { valor: valor * FAT.mps_to_mph, unidade: 'mph' };
      case 'MPa': return { valor: valor * FAT.MPa_to_ksi, unidade: 'ksi' };
      default: return { valor: valor, unidade: unidade };
    }
  }

  LV.Units = { dual: dual, conv: conv, FAT: FAT };
  if (typeof module !== 'undefined' && module.exports) module.exports = LV.Units;
})(typeof self !== 'undefined' ? self : (typeof globalThis !== 'undefined' ? globalThis : this));
