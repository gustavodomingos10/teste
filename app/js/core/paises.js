/* ============================================================================
 *  LINHA DE VIDA · GD ENGENHARIA
 *  paises.js — Perfis por PAÍS / REGIÃO (normas, unidades, idioma, critérios)
 *
 *  Ao selecionar o país, o software ajusta automaticamente:
 *   · o conjunto normativo citado nos relatórios;
 *   · o sistema de unidades (SI ou Imperial);
 *   · o idioma padrão;
 *   · os CRITÉRIOS de verificação (força máxima no trabalhador, resistência
 *     mínima da ancoragem), que variam entre OSHA/EN/NR.
 *
 *  O Brasil (BR) é o padrão e reproduz exatamente o comportamento validado.
 * ========================================================================== */
(function (root) {
  'use strict';
  var LV = root.LV = root.LV || {};

  var PAISES = {
    BR: {
      nome: 'Brasil', nomeEn: 'Brazil', bandeira: '🇧🇷', idioma: 'pt', unidades: 'SI',
      normas: ['NR-35', 'NR-18', 'ABNT NBR 16325-1/2', 'ABNT NBR 8800', 'NBR 6120', 'NBR 6123'],
      forcaTrabalhadorMax: 6, ancoragemMin: 15, fsCaboMin: 2,
      refForca: 'NR-35.6.7 (≤ 6 kN)', refAncoragem: 'NR-18 18.12.12.2 (≥ 15 kN)', refLinha: 'ABNT NBR 16325-2 (tipo C)',
      tipoDispositivo: 'NBR 16325 tipo C'
    },
    US: {
      nome: 'Estados Unidos', nomeEn: 'United States', bandeira: '🇺🇸', idioma: 'en', unidades: 'imperial',
      normas: ['OSHA 29 CFR 1926.502', 'ANSI/ASSP Z359.6', 'ASCE 7', 'AISC 360'],
      forcaTrabalhadorMax: 8, ancoragemMin: 22.24, fsCaboMin: 2,
      refForca: 'OSHA 1926.502(d)(16) (≤ 1,800 lbf ≈ 8 kN)', refAncoragem: 'OSHA 1926.502(d)(15) (5,000 lbf ≈ 22.2 kN) or DF ≥ 2', refLinha: 'ANSI Z359.6 (engineered HLL)',
      tipoDispositivo: 'ANSI Z359.6 HLL'
    }
  };

  function get(codigo) { return PAISES[codigo] || PAISES.BR; }
  function lista() { return Object.keys(PAISES).map(function (k) { return { codigo: k, nome: PAISES[k].nome, nomeEn: PAISES[k].nomeEn, bandeira: PAISES[k].bandeira }; }); }

  // Seleção persistente (definida na tela inicial). Retorna null se ainda não escolhido.
  function getSelecionado() { try { if (typeof localStorage !== 'undefined') return localStorage.getItem('lv_pais'); } catch (e) {} return null; }
  function setSelecionado(c) { try { if (typeof localStorage !== 'undefined') localStorage.setItem('lv_pais', c); } catch (e) {} return c; }

  LV.Paises = { PAISES: PAISES, get: get, lista: lista, getSelecionado: getSelecionado, setSelecionado: setSelecionado };
  if (typeof module !== 'undefined' && module.exports) module.exports = LV.Paises;
})(typeof self !== 'undefined' ? self : (typeof globalThis !== 'undefined' ? globalThis : this));
