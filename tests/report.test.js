/* ============================================================================
 *  TESTES — Memoriais, prontuário, figuras e BILINGUE/INTERNACIONAL (headless)
 *  Executar: node tests/report.test.js
 * ========================================================================== */
'use strict';
require('../app/js/core/sections.js');
require('../app/js/core/data.js');
require('../app/js/core/norms.js');
require('../app/js/core/compat.js');
require('../app/js/core/validate.js');
require('../app/js/core/paises.js');
require('../app/js/core/i18n.js');
require('../app/js/core/units.js');
require('../app/js/core/engine.js');
require('../app/js/report/draw.js');
require('../app/js/report/qr.js');
require('../app/js/report/report.js');
require('../app/js/report/prontuario.js');
var LV = globalThis.LV;

var passes = 0, fails = 0;
function ok(n, c) { if (c) { passes++; console.log('  ✓ ' + n); } else { fails++; console.log('  ✗ ' + n); } }

var entradaBase = {
  obra: 'Cobertura metálica — Maxi Limpeza', local: 'Cornélio Procópio/PR', responsavel: 'Eng. Gustavo Domingos',
  cenario: 'Cobertura', substrato: 'Telha trapezoidal metálica', ambiente: 'C4 — Alta',
  L: 10, nVaos: 3, h: 1.2, peDireito: 8.5, caboMaterial: 'Inox AISI 316', caboDiametro: 10, T0: 1,
  nUsuarios: 1, Ft: 6, H_ql: 1.5, H_fr: 1.75, temAbsorvedor: 'Sim', F_abs: 12, cursoAbsorvedor: 0.5,
  posteperfil: 'SHS 100x100x6,3', acoNome: 'ASTM A572 Gr.50', gamaF: 1.4, nChumbadores: 4, bracoChumbadores: 0.18
};
var cfg = { empresa: 'GD ENGENHARIA', cnpj: '54.705.748/0001-19', responsavel: 'Eng. Gustavo Domingos', crea: 'CREA 140.964-D/PR', contato: '(43) 9 9925-9577', cidade: 'Cornélio Procópio/PR' };
function proj(e) { return { id: 'p_teste01', nome: 'Projeto Teste', revisao: 'R00', entrada: e, registros: {} }; }

// ---- BRASIL (PT / SI) ----
var eBR = Object.assign({}, entradaBase, { pais: 'BR' });
var RBR = LV.Engine.calcular(eBR);
console.log('=== Figuras (SVG) ===');
['iso3D', 'elevacaoZLQ', 'planta', 'esforcosPoste'].forEach(function (fn) {
  var svg = LV.Draw[fn](RBR);
  ok(fn, typeof svg === 'string' && svg.indexOf('<svg') === 0 && svg.indexOf('</svg>') > 0 && svg.indexOf('NaN') === -1);
});

console.log('\n=== Memorial de cálculo (PT-BR) ===');
var mc = LV.Report.memorialCalculo(RBR, proj(eBR), cfg);
ok('contém MEMORIAL DE CÁLCULO', mc.indexOf('MEMORIAL DE CÁLCULO') !== -1);
ok('contém APROVADO', mc.indexOf('APROVADO') !== -1);
ok('cita força 6 kN / NR-35.6.7', mc.indexOf('6 kN') !== -1 || mc.indexOf('35.6.7') !== -1);
ok('estrutura (a)/(b)/(c)', mc.indexOf('(a)') !== -1 && mc.indexOf('(b)') !== -1 && mc.indexOf('(c)') !== -1);
ok('mostra Zona Livre de Queda', mc.indexOf('Zona Livre de Queda') !== -1);
ok('embute figura SVG', mc.indexOf('<svg') !== -1);
ok('decimal PT (vírgula)', /\d,\d/.test(mc));
ok('sem NaN', mc.indexOf('NaN') === -1);

console.log('\n=== Prontuário (PT-BR) ===');
var pr = LV.Prontuario.gerar(RBR, proj(eBR), cfg);
['PRONTUÁRIO', 'Memorial de cálculo', 'Análise Preliminar de Risco', 'ensaio de carga', 'emergência e resgate',
 'Plaqueta de identificação', 'Equivalência normativa internacional', 'Compatibilidade', 'Referências normativas'].forEach(function (t) {
  ok('contém «' + t + '»', pr.indexOf(t) !== -1);
});
ok('plaqueta tem QR Code (SVG)', pr.indexOf('class="qr"') !== -1 && pr.indexOf('<svg') !== -1);
ok('prontuário sem NaN', pr.indexOf('NaN') === -1);
ok('quantitativo: postes = nVaos+1', LV.Prontuario.quantitativo(eBR).materiais[0][1] === 4);

// ---- ESTADOS UNIDOS (EN / Imperial / OSHA) ----
console.log('\n=== Internacional: Estados Unidos (EN-US / Imperial / OSHA) ===');
var eUS = Object.assign({}, entradaBase, { pais: 'US' });
var RUS = LV.Engine.calcular(eUS);
ok('critério US: força ≤ 8 kN', RUS.trabalhador.check_Ft.exigido === 8);
ok('critério US: ancoragem ≈ 22,2 kN', Math.abs(RUS.ancoragem.check_15kN.exigido - 22.24) < 0.1);
var mcUS = LV.Report.memorialCalculo(RUS, proj(eUS), cfg);
ok('memorial em INGLÊS (CALCULATION REPORT)', mcUS.indexOf('CALCULATION REPORT') !== -1);
ok('inglês: APPROVED', mcUS.indexOf('APPROVED') !== -1);
ok('cita OSHA', mcUS.indexOf('OSHA') !== -1);
ok('unidades imperiais (lbf)', mcUS.indexOf('lbf') !== -1);
ok('unidades imperiais (ft)', mcUS.indexOf('ft') !== -1);
ok('decimal EN (ponto)', /\d\.\d/.test(mcUS));
ok('sem texto PT vazado (Vão/Veredito)', mcUS.indexOf('Veredito') === -1 && mcUS.indexOf('Vão entre') === -1);
ok('US sem NaN', mcUS.indexOf('NaN') === -1);
var prUS = LV.Prontuario.gerar(RUS, proj(eUS), cfg);
ok('prontuário US em inglês (TECHNICAL FILE)', prUS.indexOf('TECHNICAL FILE') !== -1);
ok('prontuário US cita ANSI', prUS.indexOf('ANSI') !== -1);
ok('prontuário US sem NaN', prUS.indexOf('NaN') === -1);

// ---- Correções da auditoria: sem vazamento de PT em modo EN ----
console.log('\n=== Auditoria: i18n do memorial/prontuário em EN ===');
ok('EN: não vaza "máx("', mcUS.indexOf('máx(') === -1);
ok('EN: não vaza "mín("', mcUS.indexOf('mín(') === -1);
ok('EN: usa "max(" no cálculo da ancoragem', mcUS.indexOf('max(') !== -1);
ok('EN: não vaza "γ_aço"', mcUS.indexOf('γ_aço') === -1);
ok('EN: rótulo do método com ponto (sem "2,0")', mcUS.indexOf('2,0') === -1);
ok('EN: ZLQ sem literais "1,5"/"1,0"', mcUS.indexOf(' 1,5 ') === -1 && mcUS.indexOf(' 1,0 ') === -1);
ok('EN: indicador de ancoragem com ponto (22.2)', RUS.veredito.indicadores.some(function (i) { return /Anchorage/.test(i.nomeEn) && /22\.2/.test(i.nomeEn); }));
ok('EN: coluna Topic traduzida (Anchorage strength)', prUS.indexOf('Anchorage strength') !== -1);
ok('EN: prontuário não vaza rótulo "Cenário"', prUS.indexOf('Cenário') === -1);
ok('EN: quantitativo traduzido (Anchor post)', prUS.indexOf('Anchor post') !== -1);
// PT permanece correto (máx/mín em português)
ok('PT: memorial usa "máx(" na ancoragem', mc.indexOf('máx(') !== -1);

// ---- Compatibilidade: todo substrato dos cenários tem recomendação ----
console.log('\n=== Auditoria: matriz de compatibilidade completa ===');
var semRec = 0;
Object.keys(LV.Data.SCENARIOS).forEach(function (cen) {
  LV.Data.SCENARIOS[cen].forEach(function (sub) { if (!LV.Compat.recomendadas(sub).length) semRec++; });
});
ok('todos os substratos têm ancoragem recomendada', semRec === 0);

console.log('\n' + '='.repeat(50));
console.log('RELATÓRIOS: ' + passes + ' aprovados, ' + fails + ' falhos.');
process.exit(fails === 0 ? 0 : 1);
