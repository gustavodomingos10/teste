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
      normas: ['NR-35 (Trabalho em Altura)', 'NR-18 (18.12.12)', 'ABNT NBR 16325-1', 'ABNT NBR 16325-2', 'ABNT NBR 16489', 'ABNT NBR 8800', 'ABNT NBR 6120', 'ABNT NBR 6123', 'ABNT NBR 6118', 'ISO 12944-2'],
      forcaTrabalhadorMax: 6, ancoragemMin: 15, fsCaboMin: 2, quedaLivreMax: null, frenagemMax: null,
      // Método de dimensionamento do aço (NBR 8800): γf nas ações (entrada) · γa1=1,10 na resistência
      fatorCarga: null, fatorResist: 1 / 1.1, metodoAco: 'ABNT NBR 8800', fatorCargaLabel: 'γf', fatorResistLabel: '1/γa1 (γa1=1,10)',
      refForca: 'NR-35.6.7 (≤ 6 kN)', refAncoragem: 'NR-18 18.12.12.2 (≥ 15 kN)', refLinha: 'ABNT NBR 16325-2 (tipo C)',
      tipoDispositivo: 'NBR 16325 tipo C'
    },
    US: {
      nome: 'Estados Unidos', nomeEn: 'United States', bandeira: '🇺🇸', idioma: 'en', unidades: 'imperial',
      normas: ['OSHA 29 CFR 1910.140 (General Industry)', 'OSHA 29 CFR 1926.502 (Subpart M)', 'ANSI/ASSP Z359.6 (engineered systems)', 'ANSI/ASSP Z359.11 (harnesses)', 'ANSI/ASSP Z359.13 (energy absorbers)', 'ANSI/ASSP Z359.14 (SRLs)', 'ANSI/ASSP Z359.15 (single anchor/vertical)', 'ASCE 7 (wind)', 'AISC 360', 'ACI 318'],
      forcaTrabalhadorMax: 8, ancoragemMin: 22.24, fsCaboMin: 2, quedaLivreMax: 1.83, frenagemMax: 1.07,
      // Método de dimensionamento do aço (AISC 360 / OSHA-Z359.6): FS = 2,0 sobre a força de
      // retenção contra a resistência nominal (rota "engineered system" da OSHA 1926.502(d)(15)).
      fatorCarga: 2.0, fatorResist: 1.0, metodoAco: 'AISC 360 · OSHA/Z359.6 (FS = 2)', fatorCargaLabel: 'FS = 2,0 (OSHA)', fatorResistLabel: 'φ = 1,0 (nominal)',
      refForca: 'OSHA 1926.502(d)(16) / Z359.6 — MAF ≤ 1,800 lbf (8 kN)', refAncoragem: 'OSHA 1926.502(d)(15) — 5,000 lbf (22.2 kN)/worker or engineered (PE)', refLinha: 'ANSI/ASSP Z359.6 (engineered HLL — deflection & anchor loads)',
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
