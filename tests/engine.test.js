/* ============================================================================
 *  TESTES AUTOMATIZADOS — Motor de cálculo Linha de Vida
 *  Executar:  node tests/engine.test.js
 *
 *  Objetivo: garantir RIGOR DE ENGENHARIA — reproduzir EXATAMENTE os valores
 *  da planilha validada e conferir as verificações acrescentadas com valores
 *  calculados à mão. Qualquer divergência faz o processo falhar (exit 1).
 * ========================================================================== */
'use strict';
var Sections = require('../app/js/core/sections.js');
var Data = require('../app/js/core/data.js');
var Engine = require('../app/js/core/engine.js');

var passes = 0, fails = 0;
function approx(name, got, exp, tol) {
  tol = tol == null ? 1e-3 : tol;
  var ok = Math.abs(got - exp) <= tol * Math.max(1, Math.abs(exp));
  if (ok) { passes++; console.log('  ✓ ' + name + '  (' + fmt(got) + ')'); }
  else { fails++; console.log('  ✗ ' + name + '  esperado ' + fmt(exp) + ', obtido ' + fmt(got)); }
}
function eq(name, got, exp) {
  var ok = got === exp;
  if (ok) { passes++; console.log('  ✓ ' + name + '  (' + got + ')'); }
  else { fails++; console.log('  ✗ ' + name + '  esperado ' + exp + ', obtido ' + got); }
}
function fmt(x) { return (typeof x === 'number') ? x.toFixed(4) : String(x); }
function head(t) { console.log('\n=== ' + t + ' ==='); }

// ---------------------------------------------------------------------------
head('1 · Propriedades de seção (sections.js) vs. tabela da planilha');
// SHS 100x100x6,3 → tabela: W=69,4 cm³  Z=83,1 cm³  A=23,6 cm²
var s1 = Sections.shs(100, 6.3);
approx('SHS100x6,3 · A', s1.A, 23.6, 2e-3);
approx('SHS100x6,3 · W', s1.W, 69.4, 2e-3);
approx('SHS100x6,3 · Z', s1.Z, 83.1, 2e-3);
// SHS 80x80x6,3 → W=42,3  Z=51,5  A=18,6
var s2 = Sections.shs(80, 6.3);
approx('SHS80x6,3 · A', s2.A, 18.6, 3e-3);
approx('SHS80x6,3 · W', s2.W, 42.3, 3e-3);
approx('SHS80x6,3 · Z', s2.Z, 51.5, 3e-3);
// SHS 150x150x10 → W=245,2  Z=294,5  A=56,0
var s3 = Sections.shs(150, 10);
approx('SHS150x10 · A', s3.A, 56.0, 5e-3);
approx('SHS150x10 · W', s3.W, 245.2, 5e-3);
approx('SHS150x10 · Z', s3.Z, 294.5, 5e-3);
// SHS 120x120x8 → W=125,5  Z=150,8  A=35,8
var s4 = Sections.shs(120, 8);
approx('SHS120x8 · W', s4.W, 125.5, 5e-3);
approx('SHS120x8 · Z', s4.Z, 150.8, 5e-3);
approx('SHS120x8 · A', s4.A, 35.8, 5e-3);
// raio de giração coerente (i = √(I/A))
approx('SHS100x6,3 · i', s1.i, Math.sqrt(s1.I / s1.A), 1e-6);

// ---------------------------------------------------------------------------
head('2 · Newton-Raphson — solveSag (convergência)');
// Caso sem absorvedor, cabo rígido: deve convergir e dar T_el alto
var sag = Engine.solveSag(6, 5, 1, 5640, 10);
eq('convergiu', sag.convergiu, true);
console.log('    f convergida = ' + fmt(sag.f) + ' m ; T_el = ' + fmt(sag.T_el) + ' kN ; iter=' + sag.iteracoes);
// Verifica o resíduo da equação no ponto convergido (deve ser ~0)
var a = 5, Q = 6, T0 = 1, EA = 5640, L = 10, f = sag.f, r = Math.sqrt(a * a + f * f);
var resid = Q * r / (2 * f) - T0 - (2 * EA / L) * (r - a);
approx('resíduo g(f) ≈ 0', resid, 0, 1e-6);

// ---------------------------------------------------------------------------
head('3 · Caso-exemplo completo da planilha (cobertura · Inox Ø10 · c/ absorvedor)');
var inp = {
  L: 10, nVaos: 3, h: 1.2, peDireito: 8.5,
  caboMaterial: 'Inox AISI 316', caboDiametro: 10, T0: 1,
  nUsuarios: 1, Ft: 6, H_ql: 1.5, H_fr: 1.75,
  temAbsorvedor: 'Sim', F_abs: 12, cursoAbsorvedor: 0.5,
  posteperfil: 'SHS 100x100x6,3', acoNome: 'ASTM A572 Gr.50',
  gamaF: 1.4, nChumbadores: 4, bracoChumbadores: 0.18
};
var R = Engine.calcular(inp);
approx('EA do cabo', R.dados.EA.valor, 5640, 1e-6);             // 120000·47/1000
approx('Q = n·Ft', R.trabalhador.Q.valor, 6, 1e-9);
eq('Absorvedor ativo', R.tracao.absAtivo, true);
approx('T (tração máx., limitada pelo absorvedor)', R.tracao.T.valor, 12, 1e-9);
approx('senθ = Q/(2T)', R.tracao.senTheta.valor, 0.25, 1e-9);
approx('θ', R.tracao.theta.valor, 14.4775, 1e-3);
approx('f_g = a·tanθ', R.tracao.f_g.valor, 5 * Math.tan(14.4775 / 180 * Math.PI), 1e-3);
approx('f_tot = f_g + curso', R.tracao.f_tot.valor, 5 * Math.tan(14.4775 / 180 * Math.PI) + 0.5, 1e-3);
approx('ZLQ', R.zlq.ZLQ.valor, 1.5 + 1.75 + 1.5 + 1.0 + R.tracao.f_tot.valor, 1e-6);
eq('ZLQ ≤ pé-direito (OK)', R.zlq.check.ok, true);
approx('FS dinâmico = MBL/T', R.cabo.FS_din.valor, 63 / 12, 1e-6);
eq('FS dinâmico ≥ 2', R.cabo.check_din.ok, true);
approx('FS serviço = MBL/T₀', R.cabo.FS_trab.valor, 63, 1e-6);

head('   Reações e poste');
var H = 12 * Math.cos(14.4775 / 180 * Math.PI);
approx('H = T·cosθ', R.reacoes.H.valor, H, 1e-3);
approx('V = T·senθ', R.reacoes.V.valor, 3.0, 1e-3);
approx('M_k = H·h', R.reacoes.M_k.valor, H * 1.2, 1e-3);
approx('M_Sd = γf·M_k', R.poste.M_Sd.valor, 1.4 * H * 1.2, 1e-3);
approx('M_Rd = Z·fy/γa1/1000', R.poste.M_Rd.valor, 83.1 * 345 / 1.1 / 1000, 5e-3);
console.log('    Utilização do poste = ' + fmt(R.poste.util.valor) + ' (esperado ≈ 0,75)');
approx('Utilização ≈ 0,75', R.poste.util.valor, 0.752, 2e-2);
eq('Utilização ≤ 1,0 (OK)', R.poste.check_util.ok, true);

head('   Veredito');
eq('Sistema APROVADO', R.veredito.aprovado, true);
eq('Texto do veredito', R.veredito.texto, 'APROVADO');

// ---------------------------------------------------------------------------
head('4 · Verificações acrescentadas (flambagem, cisalhamento, classe)');
console.log('    λ₀=' + fmt(R.poste.lambda0.valor) + '  χ=' + fmt(R.poste.chi.valor) +
            '  N_Rd_fl=' + fmt(R.poste.N_Rd_fl.valor) + ' kN  N_Rd=' + fmt(R.poste.N_Rd.valor) + ' kN');
eq('χ ≤ 1', R.poste.chi.valor <= 1.0, true);
eq('Cisalhamento OK', R.cisalhamento.check.ok, true);
eq('Seção compacta', R.secaoClasse.compacta, true);
console.log('    V_Sd=' + fmt(R.cisalhamento.V_Sd.valor) + ' kN  V_Rd=' + fmt(R.cisalhamento.V_Rd.valor) + ' kN');
console.log('    R_anc=' + fmt(R.ancoragem.R_anc.valor) + ' kN (≥15)  T_ch=' + fmt(R.ancoragem.T_ch.valor) + ' kN');
eq('Ancoragem ≥ 15 kN', R.ancoragem.check_15kN.ok, true);

// ---------------------------------------------------------------------------
head('5 · Caso de REPROVAÇÃO (vão exagerado, sem absorvedor)');
var inp2 = Object.assign({}, inp, { temAbsorvedor: 'Não', F_abs: 0, cursoAbsorvedor: 0, L: 20, peDireito: 5 });
var R2 = Engine.calcular(inp2);
console.log('    T=' + fmt(R2.tracao.T.valor) + ' kN  ZLQ=' + fmt(R2.zlq.ZLQ.valor) +
            ' m  FS_din=' + fmt(R2.cabo.FS_din.valor) + '  util=' + fmt(R2.poste.util.valor));
eq('Sistema REPROVADO', R2.veredito.aprovado, false);

// ---------------------------------------------------------------------------
head('6 · Dimensionamento automático (otimizar) e comparativo internacional');
require('../app/js/core/paises.js');   // habilita critérios BR/US para comparar()
var inpOt = { L: 10, nVaos: 3, h: 1.5, peDireito: 12, caboMaterial: 'Inox AISI 316', caboDiametro: 12, T0: 1,
  nUsuarios: 1, Ft: 6, H_ql: 1.0, H_fr: 1.0, temAbsorvedor: 'Sim', F_abs: 12, cursoAbsorvedor: 0.5,
  posteperfil: 'SHS 250x250x12,5', acoNome: 'ASTM A572 Gr.50', gamaF: 1.4, nChumbadores: 4, bracoChumbadores: 0.18, pais: 'BR' };
var ot = Engine.otimizar(inpOt);
eq('otimizar retorna solução', !!ot, true);
eq('solução ótima é APROVADA', ot.R.veredito.aprovado, true);
eq('massa linear positiva', ot.massaLinear > 0, true);
eq('massa por poste = massa linear × h', Math.abs(ot.massaPoste - ot.massaLinear * 1.5) < 1e-6, true);
console.log('    ótimo: ' + ot.perfil + ' Ø' + ot.caboDiametro + ' · ' + ot.massaLinear.toFixed(1) + ' kg/m · util ' + (ot.utilizacao * 100).toFixed(0) + '%');

// otimizar retorna null quando a limitação é geométrica (ZLQ > pé-direito)
var inpSem = Object.assign({}, inpOt, { peDireito: 4 });
eq('otimizar retorna null sem solução geométrica', Engine.otimizar(inpSem), null);

// comparativo internacional: mesmo projeto APROVADO no BR e REPROVADO nos EUA
var inpCmp = Object.assign({}, inpOt, { posteperfil: 'SHS 100x100x6,3', caboDiametro: 10 });
var cmp = Engine.comparar(inpCmp);
eq('comparar avalia BR e US', cmp.codigos.length >= 2, true);
eq('BR aprovado', cmp.resultados.BR.veredito.aprovado, true);
eq('US reprovado (método mais conservador)', cmp.resultados.US.veredito.aprovado, false);
eq('divergência de veredito detectada', cmp.divergem, true);
console.log('    BR util ' + cmp.resultados.BR.poste.util.valor.toFixed(3) + ' × US util ' + cmp.resultados.US.poste.util.valor.toFixed(3));
eq('US mais conservador (util maior)', cmp.resultados.US.poste.util.valor > cmp.resultados.BR.poste.util.valor, true);

// ---------------------------------------------------------------------------
console.log('\n' + '='.repeat(60));
console.log('RESULTADO: ' + passes + ' aprovados, ' + fails + ' falhos.');
console.log('='.repeat(60));
process.exit(fails === 0 ? 0 : 1);
