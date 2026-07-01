/* ============================================================================
 *  LINHA DE VIDA · GD ENGENHARIA
 *  compat.js — Matriz de compatibilidade SUBSTRATO × ANCORAGEM
 *  (reproduz a aba «Compatibilidade» da planilha validada + notas normativas)
 * ========================================================================== */
(function (root) {
  'use strict';

  var ANCORAGENS = [
    'Suporte parafusado à terça/estrutura',
    'Chapa/olhal SOLDADO (aço)',
    'Grampo / braçadeira (clamp)',
    'Chumbador QUÍMICO (concreto)',
    'Chumbador mecânico (concreto)',
    'Bloco de fundação (concreto)',
    'Poste cravado / estaiado'
  ];

  // ✔ recomendado · ✔* recomendado só com reforço · ⚠ com restrição · ✗ não permitido · – não aplicável
  var MATRIZ = {
    'Telha trapezoidal metálica':      ['✔', '⚠', '⚠', '–', '–', '–', '–'],
    'Telha fibrocimento (frágil)':     ['✔*', '–', '–', '–', '–', '–', '–'],
    'Telha cerâmica (frágil)':         ['✔*', '–', '–', '–', '–', '–', '–'],
    'Telha termoacústica (sanduíche)': ['✔', '⚠', '⚠', '–', '–', '–', '–'],
    'Membrana TPO (termoplástica)':    ['✔', '⚠', '–', '⚠', '–', '–', '–'],
    'Membrana EPDM (borracha)':        ['✔', '⚠', '–', '⚠', '–', '–', '–'],
    'Laje de concreto':                ['✔', '–', '–', '✔', '⚠', '–', '–'],
    'Viga metálica (perfil I/H)':      ['✔', '✔', '✔', '–', '–', '–', '–'],
    'Viga metálica (tubular)':         ['✔', '✔', '⚠', '–', '–', '–', '–'],
    'Pilar de concreto':               ['⚠', '–', '–', '✔', '⚠', '–', '–'],
    'Terça metálica':                  ['✔', '⚠', '✔', '–', '–', '–', '–'],
    'Solo coesivo':                    ['–', '–', '–', '–', '–', '✔', '⚠'],
    'Solo arenoso':                    ['–', '–', '–', '–', '–', '✔', '✗'],
    'Rocha':                           ['–', '–', '–', '✔', '⚠', '✔', '–'],
    'Talude protegido':                ['–', '–', '–', '–', '–', '✔', '⚠'],
    'Poste cravado':                   ['–', '–', '–', '–', '–', '✔', '✔'],
    // Silo / industrial (estruturas metálicas): suporte parafusado/soldado à estrutura resistente
    'Teto de silo metálico (cônico)':  ['✔', '✔', '⚠', '–', '–', '–', '–'],
    'Costado de silo (chapa)':         ['✔', '✔', '⚠', '–', '–', '–', '–'],
    'Anel de reforço do silo':         ['✔', '✔', '⚠', '–', '–', '–', '–'],
    'Passarela / galeria de correia':  ['✔', '✔', '⚠', '–', '–', '–', '–'],
    'Estrutura de torre de elevador':  ['✔', '✔', '⚠', '–', '–', '–', '–'],
    'Tremonta / cobertura de armazém': ['✔', '⚠', '⚠', '–', '–', '–', '–']
  };
  // Índice normalizado (sem qualificadores entre parênteses) para casar os nomes
  // descritivos dos cenários com as chaves da matriz (ex.: 'Solo coesivo (bloco
  // concreto)' → 'Solo coesivo'; 'Telha fibrocimento' → 'Telha fibrocimento (frágil)').
  function _norm(s) { return String(s || '').toLowerCase().replace(/\([^)]*\)/g, '').replace(/\s+/g, ' ').trim(); }
  var _MATRIZ_NORM = null;
  function _matrizNorm() { if (!_MATRIZ_NORM) { _MATRIZ_NORM = {}; Object.keys(MATRIZ).forEach(function (k) { _MATRIZ_NORM[_norm(k)] = MATRIZ[k]; }); } return _MATRIZ_NORM; }

  var LEGENDA = {
    '✔':  'Recomendado — solução usual e segura',
    '✔*': 'Recomendado SOMENTE com reforço sob a telha (a telha não recebe carga)',
    '⚠':  'Com restrição — exige verificação adicional / detalhe específico',
    '✗':  'Não permitido para esse substrato',
    '–':  'Não aplicável'
  };

  var NOTAS = [
    'Telhas frágeis (fibrocimento, cerâmica) NÃO podem receber carga concentrada — NR-18 18.7.8.2. A ancoragem deve transpassar a cobertura e fixar-se em estrutura resistente (terça/madeiramento/laje).',
    'Em telha trapezoidal metálica, o suporte é parafusado à TERÇA (estrutura), nunca apenas à telha; usar vedação tipo EPDM nas perfurações e fixar na onda alta.',
    'Concentração de carga em telhado/cobertura só é admitida se autorizada por profissional legalmente habilitado.',
    'Dispositivos de ancoragem devem resistir a ≥ 15 kN (NR-18 18.12.12.2) e à força máxima aplicável (NR-35 Anexo II 3.1.1).',
    'Em aço, a chapa/olhal soldado deve ser executado por soldador qualificado, com solda dimensionada; o grampo (clamp) exige verificação de escorregamento.',
    'Em concreto, o chumbador químico (epóxi) deve respeitar profundidade e distância de borda do fabricante; verificar arrancamento (cone de concreto).',
    'Em solo/talude, os postes devem ser ancorados em blocos de fundação dimensionados ao tombamento/arrancamento; em solo arenoso evitar postes simplesmente cravados.',
    'Materiais resistentes às intempéries: aço inoxidável AISI 316 ou equivalente — NR-18 18.12.12.2 (d).',
    'Coberturas de membrana (TPO/EPDM): o poste transpassa a membrana e fixa-se à estrutura/deck resistente abaixo; usar bota de vedação (flashing) soldada/colada à membrana para estanqueidade.'
  ];

  /** Linha da matriz para um substrato (com os símbolos por ancoragem). */
  function paraSubstrato(substrato) {
    var linha = MATRIZ[substrato] || _matrizNorm()[_norm(substrato)];
    if (!linha) return null;
    return ANCORAGENS.map(function (anc, i) {
      return { ancoragem: anc, simbolo: linha[i], descricao: LEGENDA[linha[i]] };
    });
  }

  /** Lista das ancoragens recomendadas (✔ ou ✔*) para um substrato. */
  function recomendadas(substrato) {
    var l = paraSubstrato(substrato);
    if (!l) return [];
    return l.filter(function (x) { return x.simbolo === '✔' || x.simbolo === '✔*'; });
  }

  var Compat = {
    ANCORAGENS: ANCORAGENS, MATRIZ: MATRIZ, LEGENDA: LEGENDA, NOTAS: NOTAS,
    paraSubstrato: paraSubstrato, recomendadas: recomendadas
  };
  root.LV = root.LV || {};
  root.LV.Compat = Compat;
  if (typeof module !== 'undefined' && module.exports) module.exports = Compat;
})(typeof self !== 'undefined' ? self : (typeof globalThis !== 'undefined' ? globalThis : this));
