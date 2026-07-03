/* ============================================================================
 *  TESTES AUTOMATIZADOS — Motor de cálculo FV-CHECK
 *  Executar:  node tests/engine.test.js
 *
 *  Rigor de engenharia: os valores esperados foram calculados de forma
 *  INDEPENDENTE (integração numérica por grade p/ seções e cadeia de cálculo
 *  manual em Python p/ vento/ações). Divergência ⇒ exit 1.
 * ========================================================================== */
'use strict';
var Norms = require('../app/js/core/norms.js');
var Dados = require('../app/js/core/dados.js');
var Sections = require('../app/js/core/sections.js');
var Vento = require('../app/js/core/vento.js');
var Acoes = require('../app/js/core/acoes.js');
var Engine = require('../app/js/core/engine.js');
var Validate = require('../app/js/core/validate.js');

var passes = 0, fails = 0;
function approx(name, got, exp, tol) {
  tol = tol == null ? 1e-3 : tol;
  var ok = isFinite(got) && Math.abs(got - exp) <= tol * Math.max(1, Math.abs(exp));
  if (ok) { passes++; console.log('  ✓ ' + name + '  (' + fmt(got) + ')'); }
  else { fails++; console.log('  ✗ ' + name + '  esperado ' + fmt(exp) + ', obtido ' + fmt(got)); }
}
function eq(name, got, exp) {
  var ok = got === exp;
  if (ok) { passes++; console.log('  ✓ ' + name + '  (' + got + ')'); }
  else { fails++; console.log('  ✗ ' + name + '  esperado ' + exp + ', obtido ' + got); }
}
function ok(name, cond) { eq(name, !!cond, true); }
function fmt(x) { return (typeof x === 'number') ? x.toFixed(5) : String(x); }
function head(t) { console.log('\n=== ' + t + ' ==='); }

// ---------------------------------------------------------------------------
head('1 · Propriedades de seção vs. integração numérica independente (Python)');
var u = Sections.props({ type: 'U', bw: 150, bf: 50, t: 3 }, 250);
approx('U150×50×3 · A (7,32 cm²)', u.A, 7.32, 5e-3);
approx('U150×50×3 · Ix (236,7 cm⁴)', u.Ix, 236.74, 5e-3);
approx('U150×50×3 · Iy (16,06 cm⁴)', u.Iy, 16.06, 1e-2);
var ue = Sections.props({ type: 'UE', bw: 200, bf: 75, D: 20, t: 2.65 }, 280);
approx('Ue200×75×20×2,65 · A (10,05 cm²)', ue.A, 10.054, 5e-3);
approx('Ue200×75×20×2,65 · Ix (622,6 cm⁴)', ue.Ix, 622.587, 5e-3);
approx('Ue200×75×20×2,65 · Iy (74,8 cm⁴)', ue.Iy, 74.822, 1e-2);
var z = Sections.props({ type: 'Z', bw: 200, bf: 75, D: 20, t: 2.65 }, 280);
approx('Ze200 · A igual ao Ue (10,05 cm²)', z.A, 10.054, 5e-3);
approx('Ze200 · Ix igual ao Ue (622,6 cm⁴)', z.Ix, 622.587, 5e-3);
approx('Ze200 · Iy (118,8 cm⁴ — abas opostas)', z.Iy, 118.82, 1e-2);
var tr = Sections.props({ type: 'TR', bw: 100, bf: 50, t: 3 }, 250);
approx('Tubo100×50×3 · A (8,64 cm²)', tr.A, 8.64, 1e-3);
approx('Tubo100×50×3 · Ix (112,1 cm⁴)', tr.Ix, 112.119, 1e-3);
approx('Tubo100×50×3 · Iy (37,44 cm⁴)', tr.Iy, 37.439, 1e-3);
// caso degenerado analítico: U com mesa=t → retângulo puro (Ix = t·bw³/12)
var ret = Sections.props({ type: 'U', bw: 100, bf: 3.0001, t: 3 }, 250);
approx('U degenerado ≈ chapa · Ix = t·bw³/12', ret.Ix, 3 * Math.pow(100, 3) / 12 / 1e4, 2e-3);
// consistência: ry = √(Iy/A) e peso = 0,785·A
approx('ry = √(Iy/A)', ue.ry, Math.sqrt(ue.Iy / ue.A), 1e-9);
approx('peso Ue200 (kg/m) = 0,785·A', ue.pesoKgM, 0.785 * ue.A, 1e-9);
// W de tabela (Gerdau W150x13)
var w = Sections.props(Dados.perfil('W150x13'), 345);
approx('W150×13 · Wx de tabela', w.Wx, 88.8, 1e-6);
eq('W laminado: seção compacta (ρ=1)', w.rho, 1);

// ---------------------------------------------------------------------------
head('2 · Flambagem local — curva de Winter (NBR 14762 9.2)');
var rw = Sections.rhoWinter(60, 4, 250);
approx('λp (b/t=60, k=4, fy=250)', rw.lp, 1.11648, 1e-4);
approx('ρ de Winter', rw.rho, 0.71918, 1e-4);
eq('elemento curto: totalmente efetivo', Sections.rhoWinter(20, 4, 250).rho, 1);
// sem piso artificial: elemento patológico (b/t=249, AL) deve dar ρ≈0,066
var rwx = Sections.rhoWinter(249, 0.43, 250);
ok('elemento extremo: ρ < 0,10 (sem piso)', rwx.rho < 0.10 && rwx.rho > 0.03);
ok('Ue esbelto detectado (t=2,0 · fy=345)', Sections.props({ type: 'UE', bw: 300, bf: 85, D: 25, t: 2.0 }, 345).esbelto);

// ---------------------------------------------------------------------------
head('3 · Vento NBR 6123 — S2, Ce, q');
approx('S2 cat II cl A z=10 → 1,0', Vento.s2(10, 'II', 'A'), 1.0, 1e-9);
approx('S2 cat III cl B z=15', Vento.s2(15, 'III', 'B'), 0.96127, 1e-4);
approx('S2 cat IV cl C z=8', Vento.s2(8, 'IV', 'C'), 0.77432, 1e-4);
approx('S2 abaixo de 5 m usa z=5', Vento.s2(2, 'II', 'A'), 0.94278, 1e-4);
eq('classe por dimensão: 18 m → A', Vento.classePorDimensao(18), 'A');
eq('classe por dimensão: 40 m → B', Vento.classePorDimensao(40), 'B');
eq('classe por dimensão: 80 m → C', Vento.classePorDimensao(80), 'C');
approx('Ce Tabela 5: θ=10° → EF=−1,2', Vento.ceTab5(10).EF, -1.2, 1e-9);
approx('Ce Tabela 5: θ=12,5° (interp.) → −1,1', Vento.ceTab5(12.5).EF, -1.1, 1e-9);
approx('Ce Tabela 5: θ=0° → −0,8', Vento.ceTab5(0).EF, -0.8, 1e-9);
approx('Ce Tabela 5: θ≥60° → +0,7', Vento.ceTab5(75).EF, 0.7, 1e-9);
// q = 0,613·Vk²
var vres = Vento.calcular({ v0: 40, s1Valor: 1, s3Valor: 1, categoria: 'II', zCumeeira: 10, maiorDimGlobal: 18, thetaGraus: 0, hRelativo: 0.3, permeabilidade: 'normal' });
approx('q (Vk=40) = 0,9808 kN/m²', vres.qLocal, 0.9808, 1e-6);
approx('ΔPsuc = (−0,8−0,2)·q', vres.dpSuc, -0.9808, 1e-6);
var vab = Vento.calcular({ v0: 40, s1Valor: 1, s3Valor: 1, categoria: 'II', zCumeeira: 10, maiorDimGlobal: 18, thetaGraus: 0, hRelativo: 0.3, permeabilidade: 'dominante' });
approx('aberto: Ci = +0,8', vab.ciPos, 0.8, 1e-9);

// ---------------------------------------------------------------------------
head('4 · Cadeia completa do caso-exemplo (verificada à mão em Python)');
var val = Validate.validar(Dados.EXEMPLO);
eq('exemplo validado sem erros', val.ok, true);
var R = Engine.verificar(val.inp);
var m = R.modelo;
approx('θ = 5,7106°', m.thetaGraus, 5.7106, 1e-4);
approx('z cumeeira = 7,0 m', m.zCumeeira, 7.0, 1e-4);
approx('S2 local (cl A) = 0,97014', m.vento.S2Local, 0.97014, 1e-4);
approx('Vk = 38,806 m/s', m.vento.VkLocal, 38.8055, 1e-4);
approx('q = 0,9231 kN/m²', m.vento.qLocal, 0.9231, 2e-4);
approx('Ce envoltória = −0,94264', m.vento.ceSuc, -0.94264, 1e-4);
approx('ΔPsuc = −1,05476 kN/m²', m.vento.dpSuc, -1.05476, 2e-4);
approx('gFv = 0,147724 kN/m²', m.gFv, 0.147724, 1e-5);
approx('peso da terça = 0,07743 kN/m', m.pesoTerca, 0.07743, 2e-3);
approx('C1 normal = 0,96517 kN/m', R.checks.acoes.C1.n, 0.96517, 2e-3);
approx('C3 normal = −1,64414 kN/m (levantamento)', R.checks.acoes.C3.n, -1.64414, 2e-3);
approx('Mx C1 = 0,107·w·L² = 2,5818 kN·m', R.checks.MxC1, 2.58183, 2e-3);
approx('Mx C3 = 4,3981 kN·m', R.checks.MxC3, 4.39807, 2e-3);
// resistências
approx('MRd,x = Wx·fy/1,10 (kN·m)', R.checks.MrdX, m.sec.WxEf * 280 / 1.10 / 1000, 1e-9);
approx('MRd,x,up = 0,60·MRd,x (Ue contínua)', R.checks.MrdXup, 0.6 * R.checks.MrdX, 1e-9);
eq('semáforo do exemplo = VERDE', R.semaforo, 'verde');
ok('todas as razões ≤ 0,85', R.itens.every(function (it) { return it.ratio == null || it.ratio <= 0.85; }));
ok('reserva de capacidade positiva', R.reserva && R.reserva.margemKgM2 > 0);

// flecha: δ = kD·w·L⁴/EI conferida por fórmula direta
var EIx = 200000 * m.sec.Ix * 1e-5;
approx('flecha ELS = 0,00688·w·L⁴/EI', R.checks.dS1, 0.00688 * R.checks.acoes.S1.n * Math.pow(5, 4) / EIx, 1e-9);

// consistência da reserva (bisseção): na carga-limite a pior razão
// gravitacional (incluindo a combinação C2) é ≈ 1,00
var c2 = Engine.calcularChecks(m, R.reserva.gFvMax);
var pioresGrav = Math.max(c2.rV1, c2.rV2b, c2.rV3, c2.rV4, c2.rCargaTelha);
approx('na carga-limite a pior razão gravitacional ≈ 1,00', pioresGrav, 1.0, 5e-3);

// ---------------------------------------------------------------------------
head('5 · Fator R (NBR 14762 9.8.2.2) e cortante');
eq('U biapoiada → R=0,40', Engine.fatorR('U', 'biapoiada', false).R, 0.4);
eq('Ue contínua → R=0,60', Engine.fatorR('UE', 'continua3', false).R, 0.6);
eq('Z biapoiada → R=0,50', Engine.fatorR('Z', 'biapoiada', false).R, 0.5);
eq('Z contínua → R=0,70', Engine.fatorR('Z', 'continua2', false).R, 0.7);
eq('Tubo → R=1,0 (FLT dispensada)', Engine.fatorR('TR', 'biapoiada', false).R, 1);
approx('zipada reduz R à metade', Engine.fatorR('UE', 'continua3', true).R, 0.3, 1e-9);
// W laminado sob levantamento: limitado ao Mcr elástico (limite inferior)
// W150×13 (Iy=82,9 cm⁴, J=1,15 cm⁴), L=5 m: Mcr = (π/L)·√(E·Iy·G·J) = 7,615 kN·m
var vW = Validate.validar(Object.assign({}, Dados.EXEMPLO, { perfilId: 'W150x13', acoId: 'A572_50' }));
var rW = Engine.verificar(vW.inp);
var McrEsp = Math.PI / 5000 * Math.sqrt(200000 * 82.9e4 * 77000 * 1.15e4) / 1e6;
approx('Mcr,LB do W150×13 em 5 m = 7,615 kN·m', McrEsp, 7.615, 2e-3);
approx('MRd,up do W = Mcr/γ (governa sobre R·W·fy)', rW.checks.MrdXup, McrEsp / 1.10, 2e-3);
ok('Mcr governa (R·W·fy seria maior)', 0.5 * rW.modelo.sec.WxEf * 345 / 1.10 / 1000 > McrEsp / 1.10);
// cortante (NBR 14762 9.8.3): alma do Ue200×2,65 cai no ramo de TRANSIÇÃO
// h/t = 73,5 · 1,08√(E·kv/fy) = 64,5 · 1,4√ = 83,7  →  Vn = 0,65·t²·√(kv·fy·E)
var ht = (200 - 2 * 2.65) / 2.65;
ok('h/t no ramo de transição', ht > 1.08 * Math.sqrt(200000 * 5 / 280) && ht <= 1.4 * Math.sqrt(200000 * 5 / 280));
approx('VRd exemplo = 0,65·t²·√(kv·fy·E)/1,10', R.checks.Vrd, 0.65 * 2.65 * 2.65 * Math.sqrt(5 * 280 * 200000) / 1000 / 1.10, 1e-9);
// e um caso curto em escoamento puro: U100 (h/t=35,6 < 1,08√(E·kv/250)=68,3)
var vU100 = Validate.validar(Object.assign({}, Dados.EXEMPLO, { perfilId: 'U100x50x3.00', acoId: 'A36' }));
var rU100 = Engine.verificar(vU100.inp);
approx('VRd U100 (escoamento) = 0,6·fy·h·t/1,10', rU100.checks.Vrd, 0.6 * 250 * (100 - 6) * 3 / 1000 / 1.10, 1e-9);

// ---------------------------------------------------------------------------
head('6 · Semáforo e agregação');
eq('razão 0,85 → verde', Engine.statusPorRatio(0.85), 'verde');
eq('razão 0,86 → atenção', Engine.statusPorRatio(0.86), 'atencao');
eq('razão 1,001 → reprovado', Engine.statusPorRatio(1.001), 'reprovado');
eq('pior(verde, atencao) = atencao', Engine.pior('verde', 'atencao'), 'atencao');
eq('pior(atencao, reprovado) = reprovado', Engine.pior('atencao', 'reprovado'), 'reprovado');

var valC = Validate.validar(Dados.EXEMPLO_CRITICO);
eq('caso crítico validado', valC.ok, true);
var RC = Engine.verificar(valC.inp);
eq('caso crítico = REPROVADO', RC.semaforo, 'reprovado');
ok('crítico: levantamento (V2) reprova', RC.itens.some(function (it) { return it.id === 'V2' && it.status === 'reprovado'; }));
ok('crítico: estrutura já deficitária sem FV sinalizada', RC.jaCriticaSemFv === true);
ok('crítico: laudo obrigatório', RC.laudoObrigatorio);

// conservação ruim reprova
var vr = Validate.validar(Object.assign({}, Dados.EXEMPLO, { conservacao: 'ruim' }));
eq('conservação ruim → reprovado', Engine.verificar(vr.inp).semaforo, 'reprovado');
// topo de morro: envoltória S1=1,75 e nunca melhor que ATENÇÃO
var vt = Validate.validar(Object.assign({}, Dados.EXEMPLO, { s1: 'talude' }));
var RT = Engine.verificar(vt.inp);
approx('S1 envoltória de morro = 1,75', RT.modelo.s1.valor, 1.75, 1e-9);
ok('morro nunca sai VERDE no expresso', RT.semaforo !== 'verde');
// V7: acréscimo > 10% → item REPROVADO (não instale sem laudo)
var vg = Validate.validar(Object.assign({}, Dados.EXEMPLO, { numModulos: 290, moduloId: 'M615' }));
var RG = Engine.verificar(vg.inp);
var v7 = RG.itens.filter(function (it) { return it.id === 'V7'; })[0];
ok('V7 com acréscimo alto (' + (v7.dados ? v7.dados.acrescimo.toFixed(1) : '?') + '%) → reprovado', v7.dados.acrescimo > 10 && v7.status === 'reprovado');
// abertura dominante: envoltórias Ci = +0,8 e −0,9
var va = Validate.validar(Object.assign({}, Dados.EXEMPLO, { fechamento: 'aberto' }));
var RA = Engine.verificar(va.inp);
approx('aberto: Ci⁺ = 0,8', RA.modelo.vento.ciPos, 0.8, 1e-9);
approx('aberto: Ci⁻ = −0,9 (sobrepressão)', RA.modelo.vento.ciNeg, -0.9, 1e-9);
// V5 sem bônus de vão curto na sucção com FV fixado na telha
var v5t = Validate.validar(Object.assign({}, Dados.EXEMPLO, { fixacao: 'telha', espacamento: 0.8 }));
var R5 = Engine.verificar(v5t.inp);
approx('sucção na telha comparada ao qAdm de catálogo (sem ×vão)', R5.checks.rVentoTelha, Math.abs(R5.modelo.vento.dpSuc) / R5.modelo.telha.qAdm, 1e-9);
// fixação na telha de fibrocimento é bloqueada (V6 reprovado)
var vf = Validate.validar(Object.assign({}, Dados.EXEMPLO, { fixacao: 'telha', telhaId: 'FIBRO6' }));
var RF = Engine.verificar(vf.inp);
ok('fixação na telha de fibrocimento → V6 reprovado', RF.itens.some(function (it) { return it.id === 'V6' && it.status === 'reprovado'; }));

// ---------------------------------------------------------------------------
head('7 · Validação de entradas (linguagem simples → parâmetros)');
var e1 = Validate.validar({});
eq('entrada vazia rejeitada', e1.ok, false);
ok('mensagens em PT-BR', e1.erros.every(function (s) { return /[a-zçãõéê]/i.test(s); }));
var e2 = Validate.validar(Object.assign({}, Dados.EXEMPLO, { ambiente: 'cidade' }));
eq('ambiente “cidade” → categoria IV', e2.inp.categoria, 'IV');
var e3 = Validate.validar(Object.assign({}, Dados.EXEMPLO, { fechamento: 'aberto' }));
eq('barracão aberto → permeabilidade dominante', e3.inp.permeabilidade, 'dominante');
var e4 = Validate.validar(Object.assign({}, Dados.EXEMPLO, { v0: null }));
approx('V0 automático pela UF (SP=42)', e4.inp.v0, 42, 1e-9);
eq('terça de concreto bloqueada', Validate.validar(Object.assign({}, Dados.EXEMPLO, { tercaMaterial: 'concreto' })).ok, false);
eq('estrutura de madeira bloqueada', Validate.validar(Object.assign({}, Dados.EXEMPLO, { estruturaPrincipal: 'madeira' })).ok, false);
eq('montagem inclinada bloqueada', Validate.validar(Object.assign({}, Dados.EXEMPLO, { montagem: 'inclinada' })).ok, false);
eq('módulos além da área do telhado bloqueados', Validate.validar(Object.assign({}, Dados.EXEMPLO, { numModulos: 1000 })).ok, false);
var e5 = Validate.validar(Object.assign({}, Dados.EXEMPLO, { inclinacao: 2 }));
ok('inclinação 2%: passa com aviso de empoçamento', e5.ok && e5.avisos.some(function (a) { return /empoçamento/i.test(a); }));

// ---------------------------------------------------------------------------
head('8 · Varredura de robustez (sem NaN/exceção)');
var telhas = ['FIBRO6', 'TP40_043', 'TP40_050', 'SAND30', 'ZIP065', 'FIBROESTR'];
var perfis = ['U150x50x3.00', 'UE150x60x20x2.00', 'UE200x75x20x2.65', 'Z200x75x20x2.65', 'TR120x60x3.00', 'W150x13'];
var combos = 0, falhas = 0;
[30, 40, 50].forEach(function (v0) {
  [4, 6, 9].forEach(function (vao) {
    [1.0, 1.7].forEach(function (espac) {
      [5, 20, 45].forEach(function (incl) {
        ['biapoiada', 'continua3'].forEach(function (cont) {
          telhas.forEach(function (telha) {
            perfis.forEach(function (perfil) {
              combos++;
              var raw = Object.assign({}, Dados.EXEMPLO, {
                v0: v0, vaoTerca: vao, espacamento: espac, inclinacao: incl,
                continuidade: cont, telhaId: telha, perfilId: perfil, numModulos: 40
              });
              try {
                var vv = Validate.validar(raw);
                if (!vv.ok) return; // rejeição legítima
                var rr = Engine.verificar(vv.inp);
                var nums = [rr.checks.rV1, rr.checks.rV2, rr.checks.rV3, rr.checks.rV4, rr.checks.rV5];
                if (!nums.every(isFinite)) throw new Error('NaN em razões');
                if (['verde', 'atencao', 'reprovado'].indexOf(rr.semaforo) < 0) throw new Error('semáforo inválido');
              } catch (err) { falhas++; console.log('    falha em', JSON.stringify({ v0: v0, vao: vao, espac: espac, incl: incl, cont: cont, telha: telha, perfil: perfil }), '→', err.message); }
            });
          });
        });
      });
    });
  });
});
eq('varredura de ' + combos + ' combinações sem erro numérico', falhas, 0);

// ---------------------------------------------------------------------------
console.log('\n' + passes + ' verificações passaram, ' + fails + ' falharam.');
if (fails > 0) process.exit(1);
