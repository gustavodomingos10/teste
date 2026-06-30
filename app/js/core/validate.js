/* ============================================================================
 *  LINHA DE VIDA · GD ENGENHARIA
 *  validate.js — Validação robusta dos dados de entrada
 *
 *  Impede que o cálculo prossiga com dados fisicamente inconsistentes — uma
 *  defesa importante contra erros que um auditor/seguradora poderia apontar.
 *  Retorna { ok, erros[], avisos[] }. Erros bloqueiam; avisos apenas alertam.
 * ========================================================================== */
(function (root) {
  'use strict';

  // Faixas plausíveis de engenharia (min, max). Fora da faixa → aviso ou erro.
  var FAIXAS = {
    L:            { min: 1,   max: 30,  unidade: 'm',  nome: 'Vão entre postes (L)' },
    nVaos:        { min: 1,   max: 50,  unidade: 'un', nome: 'Nº de vãos' },
    h:            { min: 0.3, max: 3.0, unidade: 'm',  nome: 'Altura do poste (h)' },
    peDireito:    { min: 0.5, max: 100, unidade: 'm',  nome: 'Pé-direito livre disponível' },
    caboDiametro: { min: 6,   max: 16,  unidade: 'mm', nome: 'Diâmetro do cabo' },
    T0:           { min: 0.5, max: 10,  unidade: 'kN', nome: 'Pré-tensão de instalação (T₀)' },
    nUsuarios:    { min: 1,   max: 10,  unidade: 'un', nome: 'Nº de usuários simultâneos' },
    Ft:           { min: 1,   max: 6,   unidade: 'kN', nome: 'Força de impacto no trabalhador (Fₜ)' },
    H_ql:         { min: 0,   max: 6,   unidade: 'm',  nome: 'Queda livre (H_ql)' },
    H_fr:         { min: 0,   max: 6,   unidade: 'm',  nome: 'Frenagem do absorvedor (H_fr)' },
    F_abs:        { min: 0,   max: 25,  unidade: 'kN', nome: 'Força de atuação do absorvedor de linha' },
    cursoAbsorvedor: { min: 0, max: 2, unidade: 'm',  nome: 'Curso do absorvedor de linha' },
    gamaF:        { min: 1.0, max: 1.6, unidade: '—',  nome: 'Coef. de ponderação das ações (γf)' },
    nChumbadores: { min: 2,   max: 12,  unidade: 'un', nome: 'Nº de chumbadores' },
    bracoChumbadores: { min: 0.05, max: 1.0, unidade: 'm', nome: 'Braço dos chumbadores (d)' }
  };

  function isNum(x) { return typeof x === 'number' ? isFinite(x) : (x !== '' && x != null && isFinite(Number(x))); }

  function validar(inp) {
    var erros = [], avisos = [];

    // 1) Campos numéricos presentes e dentro de faixa
    Object.keys(FAIXAS).forEach(function (k) {
      var f = FAIXAS[k];
      var v = inp[k];
      // Campos do absorvedor só são obrigatórios se houver absorvedor
      var absOpcional = (k === 'F_abs' || k === 'cursoAbsorvedor');
      var temAbs = (inp.temAbsorvedor === true || inp.temAbsorvedor === 'Sim');
      if (absOpcional && !temAbs) return;

      if (!isNum(v)) { erros.push('Campo «' + f.nome + '» ausente ou não numérico.'); return; }
      v = Number(v);
      if (v < f.min || v > f.max) {
        avisos.push('«' + f.nome + '» = ' + v + ' ' + f.unidade + ' está fora da faixa usual (' + f.min + '–' + f.max + ' ' + f.unidade + '). Confirmar.');
      }
    });

    // 2) Regras de coerência física e normativa
    if (isNum(inp.Ft) && Number(inp.Ft) > 6) {
      erros.push('Força no trabalhador Fₜ > 6 kN viola a NR-35.6.7 (máximo 6 kN). Use talabarte com absorvedor de energia.');
    }
    if (isNum(inp.caboDiametro) && Number(inp.caboDiametro) < 8) {
      avisos.push('Cabo com Ø < 8 mm: verificar carga de ruptura e compatibilidade com o trava-quedas.');
    }
    var temAbs = (inp.temAbsorvedor === true || inp.temAbsorvedor === 'Sim');
    if (temAbs && isNum(inp.F_abs) && isNum(inp.T0) && Number(inp.F_abs) <= Number(inp.T0)) {
      avisos.push('Força do absorvedor de linha ≤ pré-tensão T₀: o absorvedor não atuará como esperado.');
    }
    if (isNum(inp.nChumbadores) && Number(inp.nChumbadores) % 2 !== 0) {
      avisos.push('Nº de chumbadores ímpar: o cálculo de tração por chumbador assume pares (n/2) tracionados.');
    }
    if (isNum(inp.peDireito) && isNum(inp.H_ql) && isNum(inp.H_fr) &&
        Number(inp.peDireito) < Number(inp.H_ql) + Number(inp.H_fr) + 2.5) {
      avisos.push('Pé-direito disponível possivelmente insuficiente para a ZLQ — verificar o resultado da ZLQ.');
    }

    // 3) Campos de texto obrigatórios para a rastreabilidade do prontuário
    [['obra', 'Obra / Cliente'], ['local', 'Local'], ['responsavel', 'Responsável técnico']].forEach(function (p) {
      if (!inp[p[0]] || String(inp[p[0]]).trim() === '') avisos.push('Preencha «' + p[1] + '» (rastreabilidade do prontuário).');
    });

    return { ok: erros.length === 0, erros: erros, avisos: avisos };
  }

  var Validate = { validar: validar, FAIXAS: FAIXAS };
  root.LV = root.LV || {};
  root.LV.Validate = Validate;
  if (typeof module !== 'undefined' && module.exports) module.exports = Validate;
})(typeof self !== 'undefined' ? self : (typeof globalThis !== 'undefined' ? globalThis : this));
