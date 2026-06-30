/* ============================================================================
 *  TESTES — Geração de memoriais, prontuário e figuras (headless)
 *  Executar: node tests/report.test.js
 * ========================================================================== */
'use strict';
// Carrega os módulos na ordem (cada um se registra em globalThis.LV)
require('../app/js/core/sections.js');
require('../app/js/core/data.js');
require('../app/js/core/norms.js');
require('../app/js/core/compat.js');
require('../app/js/core/validate.js');
require('../app/js/core/engine.js');
require('../app/js/report/draw.js');
require('../app/js/report/report.js');
require('../app/js/report/prontuario.js');
var LV = globalThis.LV;

var passes = 0, fails = 0;
function ok(n, c) { if (c) { passes++; console.log('  ✓ ' + n); } else { fails++; console.log('  ✗ ' + n); } }

var entrada = {
  obra: 'Cobertura metálica — Maxi Limpeza', local: 'Cornélio Procópio/PR', responsavel: 'Eng. Gustavo Domingos',
  cenario: 'Cobertura', substrato: 'Telha trapezoidal metálica', ambiente: 'C4 — Alta',
  L: 10, nVaos: 3, h: 1.2, peDireito: 8.5, caboMaterial: 'Inox AISI 316', caboDiametro: 10, T0: 1,
  nUsuarios: 1, Ft: 6, H_ql: 1.5, H_fr: 1.75, temAbsorvedor: 'Sim', F_abs: 12, cursoAbsorvedor: 0.5,
  posteperfil: 'SHS 100x100x6,3', acoNome: 'ASTM A572 Gr.50', gamaF: 1.4, nChumbadores: 4, bracoChumbadores: 0.18
};
var R = LV.Engine.calcular(entrada);
var proj = { id: 'p_teste01', nome: 'Projeto Teste', revisao: 'R00', entrada: entrada, registros: {} };
var cfg = { empresa: 'GD ENGENHARIA', cnpj: '54.705.748/0001-19', responsavel: 'Eng. Gustavo Domingos', crea: 'CREA 140.964-D/PR', contato: '(43) 9 9925-9577', cidade: 'Cornélio Procópio/PR' };

console.log('=== Figuras (SVG) ===');
['iso3D', 'elevacaoZLQ', 'planta', 'esforcosPoste'].forEach(function (fn) {
  var svg = LV.Draw[fn](R);
  ok(fn + ' gera SVG válido', typeof svg === 'string' && svg.indexOf('<svg') === 0 && svg.indexOf('</svg>') > 0 && svg.indexOf('NaN') === -1);
});

console.log('\n=== Memorial de cálculo ===');
var mc = LV.Report.memorialCalculo(R, proj, cfg);
ok('contém APROVADO', mc.indexOf('APROVADO') !== -1);
ok('cita NR-35.6.7 (6 kN)', mc.indexOf('6 kN') !== -1 || mc.indexOf('35.6.7') !== -1);
ok('estrutura NR-35 Anexo II 5.1.1 (a/b/c)', mc.indexOf('5.1.1 (a)') !== -1 && mc.indexOf('Zona Livre de Queda') !== -1);
ok('mostra ZLQ', mc.indexOf('ZLQ') !== -1);
ok('embute figura SVG', mc.indexOf('<svg') !== -1);
ok('sem NaN', mc.indexOf('NaN') === -1);

console.log('\n=== Memorial descritivo ===');
var md = LV.Report.memorialDescritivo(R, proj, cfg);
ok('descreve sistema tipo C', md.indexOf('tipo C') !== -1);
ok('sem NaN', md.indexOf('NaN') === -1);

console.log('\n=== Prontuário (18 seções) ===');
var pr = LV.Prontuario.gerar(R, proj, cfg);
['PRONTUÁRIO', 'Memorial de cálculo', 'Análise Preliminar de Risco', 'ensaio de carga', 'emergência e resgate',
 'Plaqueta de identificação', '18.12.12.3', 'Compatibilidade', 'Referências normativas'].forEach(function (t) {
  ok('contém «' + t + '»', pr.indexOf(t) !== -1);
});
ok('prontuário sem NaN', pr.indexOf('NaN') === -1);
ok('quantitativo: postes = nVaos+1', LV.Prontuario.quantitativo(entrada).materiais[0][1] === 4);

console.log('\n' + '='.repeat(50));
console.log('RELATÓRIOS: ' + passes + ' aprovados, ' + fails + ' falhos.');
process.exit(fails === 0 ? 0 : 1);
