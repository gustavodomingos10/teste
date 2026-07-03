/* ============================================================================
 *  FV-CHECK · GD ENGENHARIA — Verificação Estrutural Expressa p/ FV em Telhado
 *  engine.js — Motor de verificação e semáforo
 *
 *  Verificações do método expresso (terça crítica sob os módulos):
 *   V1 Flexão gravitacional (C1)      — NBR 14762 9.8.2 / NBR 8800 5.4.2
 *   V2 Flexão sob levantamento (C3)   — fator R (NBR 14762 9.8.2.2 / AISI D6.1.2)
 *   V3 Força cortante                 — NBR 14762 9.8.3
 *   V4 Flecha (ELS, L/180)            — NBR 8800 Anexo C
 *   V5 Telha (vão e carga)            — triagem c/ dados típicos de fabricante
 *   V6 Fixação dos módulos            — demanda de arrancamento (zona de borda)
 *   V7 Acréscimo global de carga      — impacto na estrutura principal (pórticos)
 *
 *  Semáforo por item e global:
 *   VERDE      razão ≤ 0,85 e sem ressalvas
 *   ATENÇÃO    0,85 < razão ≤ 1,00, ou ressalva qualitativa (laudo recomendado)
 *   REPROVADO  razão > 1,00 ou condição fora do escopo do método expresso
 *
 *  O método expresso é uma TRIAGEM: não substitui laudo assinado com ART.
 * ========================================================================== */
(function (root) {
  'use strict';

  var isNode = (typeof module !== 'undefined' && module.exports);
  var Norms = isNode ? require('./norms.js') : root.FV.Norms;
  var Dados = isNode ? require('./dados.js') : root.FV.Dados;
  var Sections = isNode ? require('./sections.js') : root.FV.Sections;
  var Vento = isNode ? require('./vento.js') : root.FV.Vento;
  var Acoes = isNode ? require('./acoes.js') : root.FV.Acoes;
  var P = Norms.PARAM;

  /* ---------- coeficientes por condição de apoio ------------------------- */
  var APOIO = {
    biapoiada: { kM: 0.125, kV: 0.500, kD: 5 / 384, nome: 'Biapoiada (1 vão)' },
    continua2: { kM: 0.125, kV: 0.625, kD: 0.00541, nome: 'Contínua (2 vãos)' },
    continua3: { kM: 0.105, kV: 0.600, kD: 0.00688, nome: 'Contínua (≥ 3 vãos)' }
  };

  /* Fator R — NBR 14762 9.8.2.2 / AISI D6.1.2 (flange conectado à telha por
   * parafusos passantes, flange livre comprimido sob levantamento) */
  function fatorR(tipoPerfil, continuidade, telhaZipada) {
    if (tipoPerfil === 'TR') return { R: 1.0, nota: 'Seção tubular fechada: dispensada a FLT (alta rigidez à torção).' };
    var continua = continuidade !== 'biapoiada';
    var R;
    if (tipoPerfil === 'Z') R = continua ? 0.70 : 0.50;
    else if (tipoPerfil === 'W') R = 0.50; // envoltória conservadora p/ laminado sem contenção do flange inferior
    else R = continua ? 0.60 : 0.40;       // U / Ue
    var nota = 'Fator R = ' + R.toFixed(2) + ' (NBR 14762 9.8.2.2 — flange conectado à telha, levantamento).';
    if (telhaZipada) { R = R * 0.5; nota += ' Telha zipada (clips): fator reduzido à metade — o sistema exige ensaio específico.'; }
    return { R: R, nota: nota };
  }

  function statusPorRatio(r) {
    if (r <= P.SEMAFORO.verde) return 'verde';
    if (r <= P.SEMAFORO.atencao) return 'atencao';
    return 'reprovado';
  }
  var RANK = { verde: 0, atencao: 1, reprovado: 2 };
  function pior(a, b) { return RANK[a] >= RANK[b] ? a : b; }

  /* ---------- resolução do modelo a partir da entrada -------------------- */
  function montarModelo(inp) {
    var avisos = [];

    var aco = inp.acoCustomFy ? { id: 'CUSTOM', nome: 'Aço personalizado', fy: inp.acoCustomFy } : Dados.aco(inp.acoId);
    if (!aco) throw new Error('Aço não encontrado: ' + inp.acoId);
    if (aco.atencao) avisos.push({ tipo: 'atencao', msg: aco.atencao });

    var perfilSpec;
    if (inp.perfilId === 'CUSTOM' || inp.perfilCustom) {
      var pc = inp.perfilCustom || {};
      perfilSpec = { id: 'CUSTOM', type: pc.type, nome: 'Personalizado ' + pc.type + ' ' + pc.bw + '×' + pc.bf + (pc.D ? '×' + pc.D : '') + '×' + pc.t, bw: pc.bw, bf: pc.bf, D: pc.D, t: pc.t };
    } else {
      perfilSpec = Dados.perfil(inp.perfilId);
      if (!perfilSpec) throw new Error('Perfil não encontrado: ' + inp.perfilId);
    }
    var sec = Sections.props(perfilSpec, aco.fy);
    sec.avisos.forEach(function (a) { avisos.push({ tipo: 'info', msg: a }); });

    var telha = Dados.telha(inp.telhaId);
    if (!telha) throw new Error('Telha não encontrada: ' + inp.telhaId);
    if (telha.obs) avisos.push({ tipo: 'info', msg: telha.nome + ': ' + telha.obs });

    var mod = inp.moduloCustom ? inp.moduloCustom : Dados.modulo(inp.moduloId);
    if (!mod || !(mod.comp > 0 && mod.larg > 0 && mod.kg > 0)) throw new Error('Módulo FV inválido');
    var areaMod = mod.comp * mod.larg;
    var trilhos = (inp.trilhos != null) ? inp.trilhos : Dados.TRILHOS_PADRAO;
    var gFv = (mod.kg * 9.81e-3) / areaMod + trilhos; // kN/m² sobre a área com módulos

    var conserv = Dados.porId(Dados.CONSERVACAO, inp.conservacao || 'bom') || Dados.CONSERVACAO[0];
    if (conserv.atencao) avisos.push({ tipo: conserv.reprova ? 'erro' : 'atencao', msg: conserv.atencao });

    var theta = Math.atan((inp.inclinacao || 0) / 100);
    var thetaGraus = theta * 180 / Math.PI;
    var duasAguas = inp.tipoTelhado !== '1agua';
    var zCumeeira = inp.peDireito + (duasAguas ? (inp.largura / 2) : inp.largura) * Math.tan(theta);
    var areaSuperficie = inp.comprimento * inp.largura / Math.cos(theta);
    var areaModulosTotal = (inp.numModulos || 0) * areaMod;
    var cobertura = Math.min(1, areaModulosTotal / areaSuperficie); // fração da área do telhado
    var kwp = (inp.numModulos || 0) * (mod.wp || 0) / 1000;

    var s1 = Dados.porId(Dados.S1_OPCOES, inp.s1 || 'plano') || Dados.S1_OPCOES[0];
    if (s1.atencao) avisos.push({ tipo: 'atencao', msg: s1.atencao });
    var s3 = Dados.porId(Dados.S3_OPCOES, inp.s3 || 'g2') || Dados.S3_OPCOES[0];

    var vento = Vento.calcular({
      v0: inp.v0, s1Valor: s1.valor, s3Valor: s3.valor,
      categoria: inp.categoria || 'II',
      zCumeeira: zCumeeira,
      maiorDimGlobal: Math.max(inp.comprimento, inp.largura, zCumeeira),
      thetaGraus: thetaGraus,
      hRelativo: inp.peDireito / inp.largura,
      permeabilidade: inp.permeabilidade || 'normal'
    });
    vento.avisos.forEach(function (a) { avisos.push({ tipo: 'atencao', msg: a }); });

    var apoio = APOIO[inp.continuidade || 'biapoiada'] || APOIO.biapoiada;
    var nc = Math.max(0, Math.min(3, Math.round(inp.correntes || 0)));
    var Ly = inp.vaoTerca / (nc + 1);

    return {
      inp: inp, aco: aco, perfil: perfilSpec, sec: sec, telha: telha, mod: mod,
      conserv: conserv, s1: s1, s3: s3, vento: vento, avisos: avisos,
      theta: theta, thetaGraus: thetaGraus, zCumeeira: zCumeeira,
      duasAguas: duasAguas, areaSuperficie: areaSuperficie,
      areaModulosTotal: areaModulosTotal, cobertura: cobertura, kwp: kwp,
      gFv: gFv, trilhos: trilhos, areaMod: areaMod,
      apoio: apoio, nc: nc, L: inp.vaoTerca, Ly: Ly, s: inp.espacamento,
      pesoTerca: sec.pesoKgM * 9.81e-3 // kN/m
    };
  }

  /* ---------- verificações numéricas para um dado gFv -------------------- */
  function calcularChecks(m, gFv) {
    var sec = m.sec, fy = m.aco.fy, fator = m.conserv.fator;
    var gama = 1.10; // NBR 14762 Tab.5 / NBR 8800 γa1
    var acoes = Acoes.calcular({
      theta: m.theta, s: m.s, gTelha: m.telha.peso, gFv: gFv,
      pesoTerca: m.pesoTerca, dpSuc: m.vento.dpSuc, dpPos: m.vento.dpPos
    });

    var L = m.L, Ly = m.Ly, ap = m.apoio;
    var EIx = P.E * sec.Ix * 1e-5; // kN·m²

    // Resistências (kN·m, kN)
    var MrdX = sec.WxEf * fy / gama / 1000 * fator;
    var MrdY = sec.WyEf * fy / gama / 1000 * fator;
    var fr = fatorR(sec.tipo, m.inp.continuidade || 'biapoiada', !!m.telha.zipada);
    var MrdXup = fr.R * sec.WxEf * fy / gama / 1000 * fator;

    // Cortante (NBR 14762 9.8.3, kv=5; W laminado: 0,6·fy·Aw)
    var hw = sec.hwFlat, tw = sec.t, kv = 5.0;
    var lim1 = 1.08 * Math.sqrt(P.E * kv / fy), lim2 = 1.4 * Math.sqrt(P.E * kv / fy);
    var ht = hw / tw, Vn;
    if (sec.laminado || ht <= lim1) Vn = 0.6 * fy * hw * tw / 1000;
    else if (ht <= lim2) Vn = 0.65 * tw * tw * Math.sqrt(kv * fy * P.E) / 1000;
    else Vn = 0.905 * P.E * kv * Math.pow(tw, 3) / hw / 1000;
    var Vrd = Vn / gama * fator;

    // ---- V1 flexão gravitacional (C1) ----
    var MxC1 = ap.kM * acoes.C1.n * L * L;
    var MyC1 = 0.125 * Math.abs(acoes.C1.t) * Ly * Ly; // subvãos ≈ biapoiados (conservador)
    var rV1 = MxC1 / MrdX + (MrdY > 0 ? MyC1 / MrdY : 0);

    // ---- V2 levantamento (C3) ----
    var rV2 = 0, MxC3 = 0, MyC3 = 0;
    if (acoes.temLevantamento) {
      MxC3 = ap.kM * Math.abs(acoes.C3.n) * L * L;
      MyC3 = 0.125 * Math.abs(acoes.C3.t) * Ly * Ly;
      rV2 = MxC3 / MrdXup + (MrdY > 0 ? MyC3 / MrdY : 0);
    }

    // ---- V2b sobrepressão (C2) — governa só p/ θ alto ----
    var rV2b = 0, MxC2 = 0;
    if (acoes.temSobrepressao) {
      MxC2 = ap.kM * acoes.C2.n * L * L;
      rV2b = MxC2 / MrdX + (MrdY > 0 ? 0.125 * Math.abs(acoes.C2.t) * Ly * Ly / MrdY : 0);
    }

    // ---- V3 cortante ----
    var Vsd = ap.kV * Math.max(acoes.C1.n, Math.abs(acoes.C3.n), acoes.C2.n) * L;
    var rV3 = Vsd / Vrd;

    // ---- V4 flecha (ELS raras) ----
    var dS1 = ap.kD * acoes.S1.n * Math.pow(L, 4) / EIx;               // m
    var dS2 = ap.kD * Math.abs(Math.min(acoes.S2.n, 0)) * Math.pow(L, 4) / EIx;
    var dLim = L / P.FLECHA_TERCA;
    var rV4 = Math.max(dS1, dS2) / dLim;

    // ---- V5 telha ----
    // Capacidade corrigida para o vão real (flexão de chapa ∝ 1/L², limitada a 4×)
    var qAdmEf = m.telha.qAdm * Math.min(4, Math.pow(m.telha.vaoMax / m.s, 2));
    var rVaoTelha = m.s / m.telha.vaoMax;
    // Gravitacional: manutenção (0,25 kN/m²) + FV somente se apoiado/fixado na telha
    var fvNaTelha = m.inp.fixacao === 'telha';
    var qTelhaGrav = P.SC_COBERTURA * Math.cos(m.theta) + (fvNaTelha ? gFv : 0);
    // Vento: condição preexistente (coplanar fixado na terça não agrava a telha);
    // com fixação na telha, a sucção dos módulos é transferida a ela
    var qTelhaVento = Math.abs(m.vento.dpSuc);
    var rCargaTelha = qTelhaGrav / qAdmEf;
    var rVentoTelha = qTelhaVento / qAdmEf;
    var rV5 = Math.max(rVaoTelha, rCargaTelha, fvNaTelha ? rVentoTelha : 0);
    var telhaVentoPreexistente = !fvNaTelha && rVentoTelha > 1;

    return {
      acoes: acoes, gama: gama, fatorConserv: fator, fr: fr,
      MrdX: MrdX, MrdY: MrdY, MrdXup: MrdXup, Vrd: Vrd, Vn: Vn, ht: ht, lim1: lim1, lim2: lim2,
      MxC1: MxC1, MyC1: MyC1, rV1: rV1,
      MxC3: MxC3, MyC3: MyC3, rV2: rV2,
      MxC2: MxC2, rV2b: rV2b,
      Vsd: Vsd, rV3: rV3,
      dS1: dS1, dS2: dS2, dLim: dLim, rV4: rV4,
      rVaoTelha: rVaoTelha, qAdmEf: qAdmEf, qTelhaGrav: qTelhaGrav, qTelhaVento: qTelhaVento,
      rCargaTelha: rCargaTelha, rVentoTelha: rVentoTelha, rV5: rV5,
      telhaVentoPreexistente: telhaVentoPreexistente, fvNaTelha: fvNaTelha,
      EIx: EIx
    };
  }

  /* ---------- reserva de capacidade (checks lineares em gFv) ------------- */
  function reservaCapacidade(m) {
    var d = 0.05; // kN/m² de perturbação
    var r0 = calcularChecks(m, m.gFv), r1 = calcularChecks(m, m.gFv + d);
    var checks = [
      { a: r0.rV1, b: r1.rV1 }, { a: r0.rV3, b: r1.rV3 },
      { a: r0.rV4, b: r1.rV4 }, { a: r0.rCargaTelha, b: r1.rCargaTelha }
    ];
    var gMax = Infinity;
    checks.forEach(function (c) {
      var slope = (c.b - c.a) / d;
      if (slope > 1e-9) gMax = Math.min(gMax, m.gFv + (1 - c.a) / slope);
    });
    if (!isFinite(gMax)) return null;
    return {
      gFvMax: Math.max(0, gMax),
      margemKgM2: (gMax - m.gFv) * 1000 / 9.81 // kgf/m² adicionais sobre a área c/ módulos
    };
  }

  /* ---------- verificação completa ---------------------------------------- */
  function verificar(inp) {
    var m = montarModelo(inp);
    var c = calcularChecks(m, m.gFv);
    var c0 = calcularChecks(m, 0); // diagnóstico: estrutura SEM o sistema FV
    var itens = [];

    function item(id, titulo, ratio, ref, detalhe, capMin) {
      var st = statusPorRatio(ratio);
      if (capMin) st = pior(st, capMin);
      itens.push({ id: id, titulo: titulo, ratio: ratio, status: st, ref: ref, detalhe: detalhe });
      return st;
    }

    // V1 — flexão gravitacional
    item('V1', 'Flexão da terça — cargas gravitacionais (C1)', c.rV1,
      'NBR 14762 9.8.2 · NBR 8800 Tab.1',
      'Mx,Sd = ' + c.MxC1.toFixed(2) + ' kN·m ≤ Mx,Rd = ' + c.MrdX.toFixed(2) + ' kN·m · My,Sd = ' + c.MyC1.toFixed(2) + ' ≤ My,Rd = ' + c.MrdY.toFixed(2) + ' kN·m (interação linear)');

    // V2 — levantamento
    if (c.acoes.temLevantamento) {
      item('V2', 'Flexão da terça — levantamento pelo vento (C3)', c.rV2,
        'NBR 14762 9.8.2.2 (fator R) · NBR 6123',
        'Mx,Sd = ' + c.MxC3.toFixed(2) + ' kN·m ≤ Mx,Rd,up = ' + c.MrdXup.toFixed(2) + ' kN·m. ' + c.fr.nota);
    } else {
      item('V2', 'Flexão da terça — levantamento pelo vento (C3)', 0,
        'NBR 6123', 'Sem levantamento líquido: o peso permanente supera a sucção do vento.');
    }

    // V2b — sobrepressão (só quando existe)
    if (c.acoes.temSobrepressao) {
      item('V2b', 'Flexão da terça — sobrepressão de vento (C2)', c.rV2b,
        'NBR 6123 Tabela 5', 'Mx,Sd = ' + c.MxC2.toFixed(2) + ' kN·m ≤ Mx,Rd = ' + c.MrdX.toFixed(2) + ' kN·m');
    }

    // V3 — cortante
    item('V3', 'Cisalhamento da alma da terça', c.rV3,
      'NBR 14762 9.8.3', 'Vsd = ' + c.Vsd.toFixed(2) + ' kN ≤ Vrd = ' + c.Vrd.toFixed(2) + ' kN (h/t = ' + c.ht.toFixed(1) + ')');

    // V4 — flecha
    item('V4', 'Flecha da terça (ELS — L/' + P.FLECHA_TERCA + ')', c.rV4,
      'NBR 8800 Anexo C Tab. C.1',
      'δ = ' + (Math.max(c.dS1, c.dS2) * 1000).toFixed(1) + ' mm ≤ δlim = ' + (c.dLim * 1000).toFixed(1) + ' mm');

    // V5 — telha
    var capTelha = null;
    if (m.telha.naoSuportada) capTelha = 'reprovado';
    else if (m.telha.forcaAtencao || c.telhaVentoPreexistente) capTelha = 'atencao';
    item('V5', 'Telha — vão entre terças e carga', c.rV5,
      'Dados típicos de fabricante (triagem)',
      'Vão: ' + m.s.toFixed(2) + ' m ≤ ' + m.telha.vaoMax.toFixed(2) + ' m · carga gravitacional: ' + c.qTelhaGrav.toFixed(2) + ' ≤ ' + c.qAdmEf.toFixed(2) + ' kN/m² (capacidade corrigida p/ o vão real). A tabela do fabricante prevalece.' +
      (c.telhaVentoPreexistente ? ' NOTA: a sucção de vento de norma (' + c.qTelhaVento.toFixed(2) + ' kN/m²) já supera a capacidade típica da telha — condição PREEXISTENTE, não agravada pelo FV coplanar fixado nas terças, mas que merece avaliação.' : ''), capTelha);

    // V6 — fixação dos módulos (demanda de arrancamento por ponto, zona de borda)
    var nFix = 4;
    var Fborda = Math.abs(m.vento.dpSucLocal) * m.areaMod / nFix;
    var Fcentro = Math.abs(m.vento.dpSuc) * m.areaMod / nFix;
    var stFix = (inp.fixacao === 'telha' && !m.telha.fixDireta) ? 'reprovado'
      : (inp.fixacao === 'telha' || m.telha.zipada) ? 'atencao' : 'verde';
    itens.push({
      id: 'V6', titulo: 'Fixação dos módulos — arrancamento', ratio: null, status: stFix,
      ref: 'NBR 6123 (coef. locais de borda) · ensaio do fabricante',
      detalhe: 'Demanda por ponto (4 fixações/módulo): centro ' + Fcentro.toFixed(2) + ' kN · bordas/cumeeira ' + Fborda.toFixed(2) + ' kN. Exigir do fornecedor resistência de arrancamento ensaiada ≥ estes valores' + (inp.fixacao === 'telha' ? ' — fixação na telha declarada: comprovação por ensaio é OBRIGATÓRIA.' : '.')
    });

    // V7 — acréscimo global sobre a estrutura principal (pórticos/tesouras)
    // Compara o acréscimo de cálculo (1,35·gFv·cobertura) com o caso de
    // dimensionamento GOVERNANTE da cobertura (gravitacional C1 ou sucção C3,
    // com S2/classe da edificação) — prática de avaliação de estruturas
    // existentes (limiar 5%/10%, cf. IEBC 502.4 e literatura de retrofit).
    var gPerm = m.telha.peso + m.pesoTerca / m.s;                       // kN/m² superfície
    var pC1frame = 1.35 * gPerm + 1.5 * P.SC_COBERTURA * Math.cos(m.theta);
    var dpSucGlobal = (m.vento.ceSuc - m.vento.ciPos) * m.vento.qGlobal;
    var pC3frame = Math.abs(1.4 * dpSucGlobal + gPerm * Math.cos(m.theta));
    var pGovernante = Math.max(pC1frame, pC3frame);
    var deltaFv = 1.35 * m.gFv * m.cobertura;
    var acrescimo = deltaFv / pGovernante * 100;
    var stV7 = acrescimo <= P.ACRESCIMO.verde ? 'verde' : 'atencao';
    var laudoObrigatorio = acrescimo > P.ACRESCIMO.atencao;
    itens.push({
      id: 'V7', titulo: 'Estrutura principal — acréscimo de carga', ratio: acrescimo / P.ACRESCIMO.atencao, status: stV7,
      ref: 'Prática de avaliação de estruturas existentes (≤ ' + P.ACRESCIMO.verde + '% desprezível · ≤ ' + P.ACRESCIMO.atencao + '% verificar)',
      detalhe: 'Estrutura principal ' + (m.inp.estruturaPrincipal === 'concreto' ? 'de concreto armado/pré-moldado' : 'metálica') + '. Acréscimo de cálculo de ' + acrescimo.toFixed(1) + '% sobre o caso governante do pórtico (' + (pC1frame >= pC3frame ? 'gravitacional' : 'sucção de vento') + ', ' + pGovernante.toFixed(2) + ' kN/m²). Sistema FV: ' + (m.gFv * 1000 / 9.81).toFixed(1) + ' kgf/m² em ' + (m.cobertura * 100).toFixed(0) + '% da área. ' +
        (laudoObrigatorio ? 'Acréscimo RELEVANTE: pórticos/tesouras, ligações, contraventamentos e fundações devem ser verificados em laudo antes da instalação.'
          : acrescimo > P.ACRESCIMO.verde ? 'Acréscimo moderado: recomenda-se a verificação da estrutura principal no laudo assinado.'
            : 'Acréscimo desprezível pela prática de avaliação; a estrutura principal não é recalculada pelo método expresso.'),
      dados: { pC1frame: pC1frame, pC3frame: pC3frame, deltaFv: deltaFv, acrescimo: acrescimo }
    });

    // agregação
    var semaforo = 'verde';
    itens.forEach(function (it) { semaforo = pior(semaforo, it.status); });
    if (m.conserv.reprova) semaforo = 'reprovado';
    else if (m.conserv.id === 'regular') semaforo = pior(semaforo, 'atencao');
    if (laudoObrigatorio) semaforo = pior(semaforo, 'atencao');

    // diagnóstico: estrutura já insuficiente sem o FV?
    var jaCritica = (c0.rV1 > 1 || c0.rV2 > 1 || c0.rV3 > 1 || c0.rV4 > 1);
    if (jaCritica) m.avisos.push({ tipo: 'erro', msg: 'A cobertura NÃO atende às verificações nem mesmo SEM os módulos FV (estrutura existente já deficitária pelos critérios atuais). O problema não é o sistema fotovoltaico — trate como avaliação estrutural da edificação (laudo).' });

    var reserva = reservaCapacidade(m);

    return {
      versaoMetodo: '1.0',
      modelo: m, checks: c, checksSemFv: c0, itens: itens,
      semaforo: semaforo, laudoObrigatorio: laudoObrigatorio || semaforo !== 'verde',
      jaCriticaSemFv: jaCritica,
      reserva: reserva,
      avisos: m.avisos
    };
  }

  var Engine = {
    verificar: verificar, montarModelo: montarModelo, calcularChecks: calcularChecks,
    fatorR: fatorR, statusPorRatio: statusPorRatio, APOIO: APOIO, pior: pior
  };

  root.FV = root.FV || {};
  root.FV.Engine = Engine;
  if (typeof module !== 'undefined' && module.exports) module.exports = Engine;
})(typeof self !== 'undefined' ? self : (typeof globalThis !== 'undefined' ? globalThis : this));
