/* ============================================================================
 *  TESTES AUTOMATIZADOS — Memorial, figuras e laudo do FV-CHECK
 *  Executar:  node tests/report.test.js
 * ========================================================================== */
'use strict';
var Dados = require('../app/js/core/dados.js');
var Validate = require('../app/js/core/validate.js');
var Engine = require('../app/js/core/engine.js');
var Draw = require('../app/js/report/draw.js');
var Laudo = require('../app/js/report/laudo.js');
var Memorial = require('../app/js/report/memorial.js');

var passes = 0, fails = 0;
function eq(name, got, exp) {
  var okv = got === exp;
  if (okv) { passes++; console.log('  ✓ ' + name); }
  else { fails++; console.log('  ✗ ' + name + '  esperado ' + exp + ', obtido ' + got); }
}
function ok(name, cond) { eq(name, !!cond, true); }
function contem(name, texto, trecho) { ok(name, String(texto).indexOf(trecho) >= 0); }
function approx(name, got, exp, tol) {
  tol = tol == null ? 1e-6 : tol;
  ok(name, isFinite(got) && Math.abs(got - exp) <= tol * Math.max(1, Math.abs(exp)));
}
function head(t) { console.log('\n=== ' + t + ' ==='); }

var R = Engine.verificar(Validate.validar(Dados.EXEMPLO).inp);
var RC = Engine.verificar(Validate.validar(Dados.EXEMPLO_CRITICO).inp);

// ---------------------------------------------------------------------------
head('1 · Memorial expresso — estrutura e conteúdo');
var html = Memorial.gerar(R, { numero: 'TST-001', data: '01/07/2026' });
contem('título do documento', html, 'MEMORIAL DE VERIFICAÇÃO EXPRESSA Nº TST-001');
contem('projeto identificado', html, 'Galpão Exemplo');
contem('semáforo VERDE no cabeçalho', html, 'VERDE — APTO PELO MÉTODO EXPRESSO');
contem('seção de vento', html, 'Ação do vento — NBR 6123');
contem('fórmula do Vk', html, 'Vk = V0·S1·S2·S3');
contem('fórmula da pressão dinâmica', html, 'q = 0,613·Vk²');
contem('combinação de levantamento', html, '1,0·G + 1,4·W⁻');
contem('sobrecarga de 0,25 kN/m² citada', html, '0,25 kN/m²');
contem('flecha L/180', html, 'L/180');
contem('limitações do método', html, 'Limitações do método expresso');
contem('não substitui laudo/ART', html, 'NÃO substitui laudo/projeto assinado com ART');
contem('CTA do laudo com preço', html, 'Laudo estrutural assinado');
contem('responsável técnico da rede', html, 'CREA 140.964-D/PR');
ok('todas as 7+ verificações listadas', R.itens.every(function (it) { return html.indexOf(it.id) >= 0; }));
ok('sem “undefined” no documento', html.indexOf('undefined') < 0);
ok('sem “NaN” no documento', html.indexOf('NaN') < 0);
contem('data controlada aplicada', html, '01/07/2026');
var htmlTrial = Memorial.gerar(R, { trial: true });
contem('marca de licença de avaliação no trial', htmlTrial, 'LICENÇA DE AVALIAÇÃO');
var htmlC = Memorial.gerar(RC, {});
contem('caso crítico: banner vermelho', htmlC, 'VERMELHO — REPROVADO PELO MÉTODO EXPRESSO');
contem('caso crítico: alerta de estrutura já deficitária', htmlC, 'nem mesmo SEM os módulos');

// ---------------------------------------------------------------------------
head('2 · Figuras SVG — boa formação');
var figs = Memorial.figuras(R);
var chaves = ['croquiPlanta', 'croquiCorte', 'iso3d', 'plantaModulos', 'cargas', 'vento', 'perfil'];
chaves.forEach(function (k) {
  var svg = figs[k];
  ok('fig ' + k + ': inicia com <svg', svg.indexOf('<svg') === 0);
  ok('fig ' + k + ': fecha </svg>', svg.lastIndexOf('</svg>') === svg.length - 6);
  ok('fig ' + k + ': sem NaN', svg.indexOf('NaN') < 0);
  ok('fig ' + k + ': sem undefined', svg.indexOf('undefined') < 0);
  ok('fig ' + k + ': tem título acessível', svg.indexOf('<title>') > 0);
});
// desenhos de conferência COTADOS: devem conter as medidas do usuário
contem('planta cota o comprimento', figs.croquiPlanta, 'comprimento ' + fmtm(R.modelo.inp.comprimento) + ' m');
contem('planta cota o vão entre treliças', figs.croquiPlanta, 'entre treliças ' + fmtm(R.modelo.inp.vaoTerca) + ' m');
contem('corte cota o pé-direito', figs.croquiCorte, 'pé-direito ' + fmtm(R.modelo.inp.peDireito) + ' m');
contem('corte cota a largura', figs.croquiCorte, 'largura ' + fmtm(R.modelo.inp.largura) + ' m');
contem('isométrico 3D cota as três medidas', figs.iso3d, 'pé-direito ' + fmtm(R.modelo.inp.peDireito) + ' m');
contem('planta de módulos mostra zonas de borda', figs.plantaModulos, 'zona de borda');
contem('diagrama de esforços mostra o momento', figs.cargas, 'M de cálculo');
var fconf = Memorial.figurasConferencia(R);
ok('figurasConferencia devolve os 3 croquis', !!(fconf.croquiPlanta && fconf.croquiCorte && fconf.iso3d));
contem('memorial embute a conferência de medidas', html, 'Conferência de medidas');
// uma água também desenha, sem NaN
var R1a = Engine.verificar(Validate.validar(Object.assign({}, Dados.EXEMPLO, { tipoTelhado: '1agua', inclinacao: 6 })).inp);
var f1a = Memorial.figuras(R1a);
ok('figuras para telhado de uma água sem NaN', chaves.every(function (k) { return f1a[k].indexOf('NaN') < 0; }));

function fmtm(x) { return (Math.round(x * 100) / 100).toString().replace('.', ','); }

// ---------------------------------------------------------------------------
head('3 · Laudo — orçamento, dossiê e e-mail');
var orc500 = Laudo.orcamento(500);
approx('até 500 m² cobra só a base', orc500.total, Dados.PRECOS.laudo.base);
var orc1000 = Laudo.orcamento(1000);
approx('1000 m² = base + 500×adicional', orc1000.total, Dados.PRECOS.laudo.base + 500 * Dados.PRECOS.laudo.adicionalM2);
ok('prazo informado', orc500.prazoDias > 0);
var dossie = Laudo.dossie({}, R);
eq('dossiê identifica o app', dossie.app, 'FV-CHECK');
eq('dossiê carrega a entrada completa', dossie.entrada.nome, R.modelo.inp.nome);
eq('dossiê traz o semáforo', dossie.resumoExpresso.semaforo, 'verde');
ok('dossiê lista todos os itens', dossie.resumoExpresso.itens.length === R.itens.length);
eq('calculista da rede definido', dossie.calculista.email, 'Gdestrutural@hotmail.com');
ok('dossiê serializável (JSON)', JSON.stringify(dossie).length > 500);
var corpo = Laudo.corpoEmail({}, R, orc500, 'FV-2026-0001');
contem('e-mail tem protocolo', corpo, 'FV-2026-0001');
contem('e-mail tem kWp', corpo, R.modelo.kwp.toFixed(1) + ' kWp');
var mailto = Laudo.linkMailto({}, R, orc500, 'FV-2026-0001');
ok('mailto endereçado ao calculista', mailto.indexOf('mailto:Gdestrutural@hotmail.com') === 0);
contem('mailto com assunto codificado', mailto, 'subject=');

// ---------------------------------------------------------------------------
head('4 · Precificação e planos');
ok('3 planos definidos', Dados.PRECOS.planos.length === 3);
ok('todo plano tem recursos e preços', Dados.PRECOS.planos.every(function (p) { return p.mensal > 0 && p.anual > 0 && p.recursos.length >= 3; }));
ok('anual dá desconto vs 12× mensal', Dados.PRECOS.planos.every(function (p) { return p.anual < 12 * p.mensal; }));

console.log('\n' + passes + ' verificações passaram, ' + fails + ' falharam.');
if (fails > 0) process.exit(1);
