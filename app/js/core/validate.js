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

  // Helper de tradução local. Usa LV.I18n quando disponível; padrão = português
  // (os testes em Node dependem do português quando LV.I18n está ausente).
  function tl(pt, en) {
    return (root.LV && root.LV.I18n && root.LV.I18n.getLang() === 'en') ? en : pt;
  }

  // Faixas plausíveis de engenharia (min, max). Fora da faixa → aviso ou erro.
  // 'nome' fica em PT (chave canônica exibida por padrão); 'nomeEn' é a tradução
  // para exibição. O nome mostrado é resolvido em tempo de validação via tl(),
  // para refletir o idioma ativo no momento da chamada.
  var FAIXAS = {
    L:            { min: 1,   max: 30,  unidade: 'm',  nome: 'Vão entre postes (L)',                   nomeEn: 'Span between posts (L)' },
    nVaos:        { min: 1,   max: 50,  unidade: 'un', nome: 'Nº de vãos',                             nomeEn: 'No. of spans' },
    h:            { min: 0.3, max: 3.0, unidade: 'm',  nome: 'Altura do poste (h)',                    nomeEn: 'Post height (h)' },
    peDireito:    { min: 0.5, max: 100, unidade: 'm',  nome: 'Pé-direito livre disponível',            nomeEn: 'Available clear headroom' },
    caboDiametro: { min: 6,   max: 16,  unidade: 'mm', nome: 'Diâmetro do cabo',                       nomeEn: 'Cable diameter' },
    T0:           { min: 0.5, max: 10,  unidade: 'kN', nome: 'Pré-tensão de instalação (T₀)',          nomeEn: 'Installation pre-tension (T₀)' },
    nUsuarios:    { min: 1,   max: 10,  unidade: 'un', nome: 'Nº de usuários simultâneos',             nomeEn: 'No. of simultaneous users' },
    Ft:           { min: 1,   max: 6,   unidade: 'kN', nome: 'Força de impacto no trabalhador (Fₜ)',   nomeEn: 'Impact force on worker (Fₜ)' },
    H_ql:         { min: 0,   max: 6,   unidade: 'm',  nome: 'Queda livre (H_ql)',                     nomeEn: 'Free fall (H_ql)' },
    H_fr:         { min: 0,   max: 6,   unidade: 'm',  nome: 'Frenagem do absorvedor (H_fr)',          nomeEn: 'Absorber deceleration (H_fr)' },
    F_abs:        { min: 0,   max: 25,  unidade: 'kN', nome: 'Força de atuação do absorvedor de linha', nomeEn: 'Line absorber activation force' },
    cursoAbsorvedor: { min: 0, max: 2, unidade: 'm',  nome: 'Curso do absorvedor de linha',           nomeEn: 'Line absorber travel' },
    gamaF:        { min: 1.0, max: 1.6, unidade: '—',  nome: 'Coef. de ponderação das ações (γf)',     nomeEn: 'Load factor (γf)' },
    nChumbadores: { min: 2,   max: 12,  unidade: 'un', nome: 'Nº de chumbadores',                      nomeEn: 'No. of anchor bolts' },
    bracoChumbadores: { min: 0.05, max: 1.0, unidade: 'm', nome: 'Braço dos chumbadores (d)',          nomeEn: 'Anchor bolt lever arm (d)' }
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

      var nome = tl(f.nome, f.nomeEn);
      if (!isNum(v)) { erros.push(tl('Campo «' + nome + '» ausente ou não numérico.', 'Field “' + nome + '” is missing or not numeric.')); return; }
      v = Number(v);
      if (v < f.min || v > f.max) {
        avisos.push(tl(
          '«' + nome + '» = ' + v + ' ' + f.unidade + ' está fora da faixa usual (' + f.min + '–' + f.max + ' ' + f.unidade + '). Confirmar.',
          '“' + nome + '” = ' + v + ' ' + f.unidade + ' is outside the usual range (' + f.min + '–' + f.max + ' ' + f.unidade + '). Please confirm.'
        ));
      }
    });

    // 2) Regras de coerência física e normativa
    // Limite NR-35/EN = 6 kN (erro se ultrapassar); a OSHA admite até 8 kN.
    // 6 < Fₜ ≤ 8 → apenas AVISO; Fₜ > 8 → ERRO.
    if (isNum(inp.Ft) && Number(inp.Ft) > 8) {
      erros.push(tl(
        'Força no trabalhador Fₜ > 8 kN excede o limite máximo admitido (OSHA 8 kN). Use talabarte com absorvedor de energia.',
        'Worker arrest force Fₜ > 8 kN exceeds the maximum allowable limit (OSHA 8 kN). Use a shock-absorbing lanyard.'
      ));
    } else if (isNum(inp.Ft) && Number(inp.Ft) > 6) {
      avisos.push(tl(
        'Força no trabalhador Fₜ > 6 kN: 6 kN é o limite da NR-35/EN; a OSHA admite até 8 kN. Confirme o critério normativo aplicável.',
        'Worker arrest force Fₜ > 6 kN: 6 kN is the NR-35/EN limit; OSHA allows up to 8 kN. Confirm the applicable regulatory criterion.'
      ));
    }
    if (isNum(inp.caboDiametro) && Number(inp.caboDiametro) < 8) {
      avisos.push(tl(
        'Cabo com Ø < 8 mm: verificar carga de ruptura e compatibilidade com o trava-quedas.',
        'Cable with Ø < 8 mm: check breaking strength and compatibility with the fall arrester.'
      ));
    }
    var temAbs = (inp.temAbsorvedor === true || inp.temAbsorvedor === 'Sim');
    if (temAbs && isNum(inp.F_abs) && isNum(inp.T0) && Number(inp.F_abs) <= Number(inp.T0)) {
      avisos.push(tl(
        'Força do absorvedor de linha ≤ pré-tensão T₀: o absorvedor não atuará como esperado.',
        'Line absorber force ≤ pre-tension T₀: the absorber will not activate as expected.'
      ));
    }
    if (isNum(inp.nChumbadores) && Number(inp.nChumbadores) % 2 !== 0) {
      avisos.push(tl(
        'Nº de chumbadores ímpar: o cálculo de tração por chumbador assume pares (n/2) tracionados.',
        'Odd number of anchor bolts: the per-bolt tension calculation assumes pairs (n/2) in tension.'
      ));
    }
    if (isNum(inp.peDireito) && isNum(inp.H_ql) && isNum(inp.H_fr) &&
        Number(inp.peDireito) < Number(inp.H_ql) + Number(inp.H_fr) + 2.5) {
      avisos.push(tl(
        'Pé-direito disponível possivelmente insuficiente para a ZLQ — verificar o resultado da ZLQ.',
        'Available headroom possibly insufficient for the fall clearance zone — check the clearance result.'
      ));
    }

    // 3) Campos de texto obrigatórios para a rastreabilidade do prontuário
    [['obra', tl('Obra / Cliente', 'Project / Client')], ['local', tl('Local', 'Location')], ['responsavel', tl('Responsável técnico', 'Engineer of record')]].forEach(function (p) {
      if (!inp[p[0]] || String(inp[p[0]]).trim() === '') avisos.push(tl(
        'Preencha «' + p[1] + '» (rastreabilidade do prontuário).',
        'Fill in “' + p[1] + '” (technical file traceability).'
      ));
    });

    // 4) Valores fisicamente inválidos → ERRO bloqueante (evitam NaN/∞ no cálculo
    //    e resultado sem sentido num prontuário auditado).
    [['L', 0, 'Vão entre postes (L)', 'Span between posts (L)'],
     ['h', 0, 'Altura do poste (h)', 'Post height (h)'],
     ['T0', 0, 'Pré-tensão de instalação (T₀)', 'Installation pre-tension (T₀)'],
     ['nUsuarios', 0, 'Nº de usuários simultâneos', 'No. of simultaneous users'],
     ['bracoChumbadores', 0, 'Braço dos chumbadores (d)', 'Anchor bolt lever arm (d)']
    ].forEach(function (b) {
      if (isNum(inp[b[0]]) && Number(inp[b[0]]) <= b[1]) erros.push(tl(
        '«' + b[2] + '» deve ser maior que ' + b[1] + '.', '“' + b[3] + '” must be greater than ' + b[1] + '.'));
    });
    if (isNum(inp.nChumbadores) && Number(inp.nChumbadores) < 2) erros.push(tl(
      'Nº de chumbadores deve ser ≥ 2.', 'Number of anchor bolts must be ≥ 2.'));

    // Absorvedor de linha precisa equilibrar a carga: F_abs ≥ Q/2 (senão senθ > 1, equilíbrio impossível)
    var Qv = (isNum(inp.nUsuarios) && isNum(inp.Ft)) ? Number(inp.nUsuarios) * Number(inp.Ft) : 0;
    if (temAbs && isNum(inp.F_abs) && Qv > 0 && Number(inp.F_abs) < Qv / 2) erros.push(tl(
      'Força do absorvedor de linha (' + inp.F_abs + ' kN) menor que metade da carga aplicada Q/2 = ' + (Qv / 2).toFixed(1) + ' kN: o cabo não atinge equilíbrio (senθ > 1). Aumente F_abs.',
      'Line absorber force (' + inp.F_abs + ' kN) is below half the applied load Q/2 = ' + (Qv / 2).toFixed(1) + ' kN: the cable cannot reach equilibrium (sinθ > 1). Increase F_abs.'));

    return { ok: erros.length === 0, erros: erros, avisos: avisos };
  }

  var Validate = { validar: validar, FAIXAS: FAIXAS };
  root.LV = root.LV || {};
  root.LV.Validate = Validate;
  if (typeof module !== 'undefined' && module.exports) module.exports = Validate;
})(typeof self !== 'undefined' ? self : (typeof globalThis !== 'undefined' ? globalThis : this));
