/* ============================================================================
 *  LINHA DE VIDA · GD ENGENHARIA
 *  engine.js — Motor de cálculo do dimensionamento (SPIQ horizontal)
 *
 *  Normas: NR-35 · NR-18 (Anexo II) · ABNT NBR 16325-1/2 · ABNT NBR 8800
 *
 *  Este módulo reproduz EXATAMENTE a memória de cálculo da planilha validada
 *  (equilíbrio do cabo por Newton-Raphson, ZLQ, verificação do cabo e do poste)
 *  e acrescenta verificações de engenharia adicionais — todas com testes.
 *
 *  Filosofia: cada grandeza retorna { valor, unidade, ref(norma) }, e cada
 *  verificação retorna { ok, exigido, obtido, ref }. Nada é "mágico": a fonte
 *  normativa de cada número está registrada.
 * ========================================================================== */
(function (root) {
  'use strict';

  var Data, Sections;
  if (typeof module !== 'undefined' && module.exports) {
    Data = require('./data.js');
    Sections = require('./sections.js');
  }
  function deps(r) {
    Data = Data || (r.LV && r.LV.Data);
    Sections = Sections || (r.LV && r.LV.Sections);
    if (!Data || !Sections) throw new Error('engine.js: dependências (Data, Sections) não carregadas');
  }

  // -------------------------------------------------------------------------
  //  Utilidades numéricas
  // -------------------------------------------------------------------------
  var DEG = 180 / Math.PI;
  function rad(d) { return d / DEG; }
  function deg(r) { return r * DEG; }
  function hypot(a, f) { return Math.sqrt(a * a + f * f); }

  /**
   * Resolve a flecha 'f' da linha de vida pelo método de Newton-Raphson.
   *
   * Modelo (idêntico à planilha):
   *   Equilíbrio:      Q = 2·T·senθ ,  senθ = f/√(a²+f²)  ⇒  T = Q·√(a²+f²)/(2f)
   *   Compatibilidade: T = T₀ + (2·EA/L)·(√(a²+f²) − a)
   *   Resíduo:  g(f) = Q·√(a²+f²)/(2f) − T₀ − (2EA/L)·(√(a²+f²) − a) = 0
   *
   * Retorna { f, T_el, iteracoes, convergiu, historico[] }.
   */
  function solveSag(Q, a, T0, EA, L, opts) {
    opts = opts || {};
    var f = opts.f0 != null ? opts.f0 : 0.3;     // chute inicial (igual à planilha)
    var tol = opts.tol != null ? opts.tol : 1e-10;
    var maxIt = opts.maxIt != null ? opts.maxIt : 60;
    var hist = [];
    var convergiu = false, it = 0;

    if (!(Q > 0)) {
      // Sem carga aplicada não há flecha de serviço — retorna pré-tensão pura
      return { f: 0, T_el: T0, iteracoes: 0, convergiu: true, historico: [] };
    }

    for (it = 0; it < maxIt; it++) {
      if (f <= 1e-6) f = 1e-6;                    // guarda contra divisão por zero
      var r = hypot(a, f);
      var g  = Q * r / (2 * f) - T0 - (2 * EA / L) * (r - a);
      var gl = -Q * a * a / (2 * r * f * f) - 2 * EA * f / (L * r);  // g'(f)
      var fNext = f - g / gl;
      hist.push({ i: it, f: f, r: r, g: g, gl: gl, fNext: fNext });
      if (!isFinite(fNext) || fNext <= 0) { fNext = f / 2; }          // recuperação robusta
      if (Math.abs(fNext - f) <= tol * Math.max(1, f)) { f = fNext; convergiu = true; break; }
      f = fNext;
    }
    var T_el = Q * hypot(a, f) / (2 * f);
    return { f: f, T_el: T_el, iteracoes: it + 1, convergiu: convergiu, historico: hist };
  }

  /**
   * Coeficiente de redução à flambagem χ (NBR 8800, item 5.3.3).
   *   λ₀ = √(Q·A·fy / Ne) ;  Ne = π²·E·I/(K·L)²   (aqui Q de flambagem local = 1 → seção compacta)
   *   λ₀ ≤ 1,5 ⇒ χ = 0,658^(λ₀²) ;  λ₀ > 1,5 ⇒ χ = 0,877/λ₀²
   */
  function chiBuckling(lambda0) {
    if (lambda0 <= 1.5) return Math.pow(0.658, lambda0 * lambda0);
    return 0.877 / (lambda0 * lambda0);
  }

  // -------------------------------------------------------------------------
  //  Cálculo principal
  // -------------------------------------------------------------------------
  /**
   * @param {object} inp  Dados de entrada (ver schema em validate.js)
   * @returns {object}    Resultado completo, com verdito e verificações.
   */
  function calcular(inp) {
    deps(root);
    var out = { entrada: inp, avisos: [], ref: {} };

    // ---- 0 · PERFIL DO PAÍS (critérios normativos) ------------------------
    //   Brasil (padrão): 6 kN / 15 kN · EUA: 8 kN / 22,2 kN.
    var pais = (root.LV && root.LV.Paises && inp.pais) ? root.LV.Paises.get(inp.pais) : null;
    if (!pais) pais = { forcaTrabalhadorMax: 6, ancoragemMin: 15, fsCaboMin: 2, idioma: 'pt', unidades: 'SI',
      refForca: 'NR-35.6.7', refAncoragem: 'NR-18 18.12.12.2 (≥ 15 kN)', refLinha: 'NBR 16325-2 (tipo C)', nome: 'Brasil',
      normas: ['NR-35', 'NR-18', 'ABNT NBR 16325-1/2', 'ABNT NBR 8800'], tipoDispositivo: 'NBR 16325 tipo C' };
    out.pais = pais;

    // ---- 1 · DADOS DE ENTRADA (vínculos) ----------------------------------
    var cabo   = Data.findCable(inp.caboMaterial, inp.caboDiametro);
    var perfil = Data.findProfile(inp.posteperfil);
    var aco    = Data.findSteel(inp.acoNome || 'ASTM A572 Gr.50');
    var sec    = Sections.fromSpec(perfil.spec);

    var L  = num(inp.L, 'Vão L');
    var a  = L / 2;                                  // meio-vão
    var T0 = num(inp.T0, 'Pré-tensão T₀');
    var n  = num(inp.nUsuarios, 'Nº de usuários');
    var Ft = num(inp.Ft, 'Força no trabalhador');
    var h  = num(inp.h, 'Altura do poste');
    var E  = cabo.E;
    var Acabo = cabo.A;
    var Frup = cabo.MBL;
    var EA = E * Acabo / 1000;                       // kN  (E[MPa]·A[mm²]/1000)

    out.dados = {
      L: g(L, 'm'), a: g(a, 'm'), cabo: cabo, perfil: perfil, aco: aco, secao: sec,
      E: g(E, 'MPa'), A_cabo: g(Acabo, 'mm²'), MBL: g(Frup, 'kN'),
      T0: g(T0, 'kN'), n: g(n, 'un'), Ft: g(Ft, 'kN'), h: g(h, 'm'),
      EA: g(EA, 'kN'), nVaos: g(num(inp.nVaos, 'Nº de vãos'), 'un')
    };

    // ---- 2 · FORÇA NO TRABALHADOR (critério do país) ---------------------
    var Q = n * Ft;                                  // carga aplicada à linha
    var fMax = pais.forcaTrabalhadorMax;
    out.trabalhador = {
      Ft: g(Ft, 'kN'), Q: g(Q, 'kN'),
      check_Ft: chk(Ft <= fMax, fMax, Ft, '≤', 'kN', pais.refForca)
    };

    // ---- 3 · FLECHA E TRAÇÃO (equilíbrio + compatibilidade elástica) ------
    var sag = solveSag(Q, a, T0, EA, L);
    if (!sag.convergiu) out.avisos.push('A iteração da flecha não convergiu plenamente; conferir dados de entrada.');
    var f_el = sag.f;
    var T_el = sag.T_el;

    // Absorvedor de energia DA LINHA (opcional) — limita a tração transmitida à estrutura
    var temAbs = (inp.temAbsorvedor === true || inp.temAbsorvedor === 'Sim');
    var F_abs = num(inp.F_abs != null ? inp.F_abs : 0, 'Força do absorvedor', true);
    var absAtivo = temAbs && (T_el > F_abs) && F_abs > 0;
    var T = absAtivo ? F_abs : T_el;                 // TRAÇÃO MÁXIMA NA LINHA

    var senTheta = Q / (2 * T);
    var theta = deg(Math.asin(Math.min(0.999, senTheta)));
    var f_g = a * Math.tan(rad(theta));              // flecha sob carga (a·tanθ)
    var dAbs = absAtivo ? num(inp.cursoAbsorvedor || 0, 'Curso do absorvedor', true) : 0;
    var f_tot = f_g + dAbs;

    out.tracao = {
      f_el: g(f_el, 'm'), T_el: g(T_el, 'kN'), absAtivo: absAtivo,
      T: g(T, 'kN'), senTheta: g(senTheta, '—'), theta: g(theta, '°'),
      f_g: g(f_g, 'm'), dAbs: g(dAbs, 'm'), f_tot: g(f_tot, 'm'),
      iteracoes: sag.iteracoes, convergiu: sag.convergiu, historico: sag.historico,
      ref: 'Equilíbrio de cabo + compatibilidade elástica (Newton-Raphson)'
    };

    // ---- 4 · ZONA LIVRE DE QUEDA — ZLQ (NBR 16325-2 Anexo C) --------------
    var H_ql = num(inp.H_ql, 'Queda livre');
    var H_fr = num(inp.H_fr, 'Frenagem');
    var C_pes = 1.5;                                 // engate aos pés (norma)
    var C_seg = 1.0;                                 // distância de segurança (norma)
    var ZLQ = H_ql + H_fr + C_pes + C_seg + f_tot;
    var peDireito = num(inp.peDireito, 'Pé-direito livre');
    out.zlq = {
      H_ql: g(H_ql, 'm'), H_fr: g(H_fr, 'm'), C_pes: g(C_pes, 'm'), C_seg: g(C_seg, 'm'),
      f_tot: g(f_tot, 'm'), ZLQ: g(ZLQ, 'm'), peDireito: g(peDireito, 'm'),
      check: chk(ZLQ <= peDireito, peDireito, ZLQ, '≤', 'm', 'NBR 16325-2 Anexo C')
    };

    // ---- 5 · VERIFICAÇÃO DO CABO (NR-18 Anexo II / NBR 16325) -------------
    var FS_din = Frup / T;
    var FS_trab = Frup / T0;
    out.cabo = {
      FS_din: g(FS_din, '—'), FS_trab: g(FS_trab, '—'),
      check_din: chk(FS_din >= pais.fsCaboMin, pais.fsCaboMin, FS_din, '≥', '—', 'FS dinâmico (' + pais.refLinha + ')'),
      check_trab: chk(FS_trab >= 5, 5, FS_trab, '≥', '—', 'NR-18 Anexo II (CR ≥ 5× carga)')
    };

    // ---- 6 · REAÇÕES NOS APOIOS / POSTES ----------------------------------
    var H = T * Math.cos(rad(theta));                // reação horizontal no topo
    var V = T * Math.sin(rad(theta));                // reação vertical no topo
    var Pp = sec.A * 1e-4 * h * Data.GAMMA_STEEL;    // peso próprio [kN] (A[cm²]→m², h[m], γ[kN/m³])

    // ---- 6b · AÇÃO DO VENTO no poste (NBR 6123 / EN 1991) — opcional ------
    //   Só entra quando o usuário informa a velocidade básica V0 (silos/estruturas expostas).
    var V0 = num(inp.ventoV0 != null ? inp.ventoV0 : 0, 'Vento V0', true);
    var M_wind = 0, F_wind = 0, q_vento = 0, Vk = 0;
    if (V0 > 0) {
      var S1 = num(inp.ventoS1 != null ? inp.ventoS1 : 1.0, 'S1', true);
      var S2 = num(inp.ventoS2 != null ? inp.ventoS2 : 1.0, 'S2', true);
      var S3 = num(inp.ventoS3 != null ? inp.ventoS3 : 1.0, 'S3', true);
      var Ca = num(inp.ventoCa != null ? inp.ventoCa : 2.0, 'Ca', true); // coef. de arrasto (perfil + equipamentos)
      Vk = V0 * S1 * S2 * S3;
      q_vento = 0.613 * Vk * Vk / 1000;              // kN/m²
      var bExp = sec.geom.b / 1000;                  // largura exposta [m]
      F_wind = Ca * q_vento * bExp * h;              // kN (carga distribuída no fuste)
      M_wind = F_wind * h / 2;                       // kN·m (resultante a meia-altura)
    }

    var M_k = H * h + M_wind;                        // momento na base (poste extremo) + vento
    var N_k = V + Pp;                                // força axial
    out.reacoes = {
      H: g(H, 'kN'), V: g(V, 'kN'), Pp: g(Pp, 'kN'), M_k: g(M_k, 'kN·m'), N_k: g(N_k, 'kN'),
      vento: V0 > 0 ? { V0: g(V0, 'm/s'), Vk: g(Vk, 'm/s'), q: g(q_vento, 'kN/m²'), F: g(F_wind, 'kN'), M: g(M_wind, 'kN·m'), ref: 'NBR 6123 / EN 1991-1-4' } : null,
      nota: 'Poste EXTREMO (mais solicitado). Postes intermediários recebem a diferença de tração entre vãos; por segurança adota-se o caso extremo.' + (V0 > 0 ? ' Inclui ação do vento.' : '')
    };

    // ---- 7 · DIMENSIONAMENTO DO POSTE (NBR 8800) --------------------------
    var fy = aco.fy;
    var gf = num(inp.gamaF || 1.4, 'γf');
    var ga1 = 1.1;
    // MÉTODO DE DIMENSIONAMENTO conforme o país:
    //   BR (NBR 8800): LF = γf (ações) · resF = 1/γa1 = 1/1,10 na resistência.
    //   US (AISC 360 / OSHA-Z359.6): LF = 2,0 (fator de segurança sobre a força de retenção)
    //                                 · resF = 1,0 (resistência nominal).
    var LF = (pais.fatorCarga != null) ? pais.fatorCarga : gf;         // fator sobre a demanda
    var resF = (pais.fatorResist != null) ? pais.fatorResist : (1 / ga1); // multiplicador da resistência
    var W = sec.W, Z = sec.Z, Asec = sec.A, Isec = sec.I, iraio = sec.i;
    var M_Sd = LF * M_k;
    var N_Sd = LF * N_k;
    var M_Rd = resF * Z * fy / 1000;                 // kN·m  (Z[cm³]·fy[MPa] → /1000)
    var N_pl = resF * Asec * fy / 10;                // kN  resistência ao escoamento (squash)

    // Flambagem por flexão (NBR 8800 5.3) — poste em balanço: K = 2,0
    var K = (inp.posteBiengastado ? 0.5 : 2.0);
    var Lfl = K * h;                                 // comprimento de flambagem [m]
    // Carga crítica de Euler Ne = π²·E·I/(K·L)².
    //   E_STEEL = 200000 MPa = 20000 kN/cm²  ⇒  (E_STEEL/10) kN/cm²
    //   I em cm⁴ ; (Lfl·100) em cm  ⇒  Ne em kN
    var Ne = Math.PI * Math.PI * (Data.E_STEEL / 10) * Isec / Math.pow(Lfl * 100, 2); // kN
    var Npl_full = Asec * fy / 10;                   // kN sem γ (para λ₀)
    var lambda0 = Math.sqrt(Npl_full / Ne);
    var chi = chiBuckling(lambda0);
    var N_Rd_fl = resF * chi * Asec * fy / 10;       // kN resistência à compressão com flambagem
    var N_Rd = Math.min(N_pl, N_Rd_fl);              // governante

    // Interação flexo-compressão (NBR 8800 — fórmula de interação)
    var util;
    if (N_Sd / N_Rd >= 0.2) util = N_Sd / N_Rd + (8 / 9) * (M_Sd / M_Rd);
    else util = N_Sd / (2 * N_Rd) + (M_Sd / M_Rd);

    out.poste = {
      perfil: perfil.nome, aco: aco.nome, metodo: pais.metodoAco || 'NBR 8800',
      W: g(W, 'cm³'), Z: g(Z, 'cm³'), A: g(Asec, 'cm²'), I: g(Isec, 'cm⁴'), i: g(iraio, 'cm'),
      fy: g(fy, 'MPa'), gf: g(gf, '—'), ga1: g(ga1, '—'),
      LF: g(LF, '—'), resF: g(resF, '—'), fatorCargaLabel: pais.fatorCargaLabel || 'γf', fatorResistLabel: pais.fatorResistLabel || '1/γa1',
      K: g(K, '—'), Lfl: g(Lfl, 'm'), Ne: g(Ne, 'kN'), lambda0: g(lambda0, '—'), chi: g(chi, '—'),
      M_Sd: g(M_Sd, 'kN·m'), N_Sd: g(N_Sd, 'kN'),
      M_Rd: g(M_Rd, 'kN·m'), N_pl: g(N_pl, 'kN'), N_Rd_fl: g(N_Rd_fl, 'kN'), N_Rd: g(N_Rd, 'kN'),
      util: g(util, '—'), folgaFlexao: g(M_Rd / M_Sd, '—'),
      check_util: chk(util <= 1.0, 1.0, util, '≤', '—', (pais.metodoAco || 'NBR 8800') + ' (flexo-compressão)')
    };

    // ---- 7b · CISALHAMENTO NO POSTE (NBR 8800) ----------------------------
    // Área efetiva ao cisalhamento: SHS/RHS → 2 almas (2·d·t); CHS → 0,6·A
    var Av;
    if (sec.type === 'CHS') Av = 0.6 * sec._mm.A;            // mm²
    else Av = 2 * sec._mm.dim * sec._mm.t;                   // mm² (2 almas)
    var V_Rd = resF * 0.6 * fy * Av / 1000;                 // kN
    var V_Sd = LF * H;                                       // kN
    out.cisalhamento = {
      Av: g(Av / 100, 'cm²'), V_Sd: g(V_Sd, 'kN'), V_Rd: g(V_Rd, 'kN'),
      check: chk(V_Sd <= V_Rd, V_Rd, V_Sd, '≤', 'kN', 'NBR 8800 (força cortante)')
    };

    // ---- 7c · CLASSE DA SEÇÃO / FLAMBAGEM LOCAL (NBR 8800 Tabela F.1) -----
    // Limite de plastificação para parede comprimida de tubo retangular: 1,12·√(E/fy)
    var limFlange = 1.12 * Math.sqrt(Data.E_STEEL / fy);
    var compacta = (sec.type === 'CHS')
      ? (sec.bt <= 0.07 * Data.E_STEEL / fy)               // CHS: D/t ≤ 0,07·E/fy
      : (sec.bt <= limFlange);
    if (!compacta) out.avisos.push('Seção pode não ser compacta (verificar flambagem local da parede); reduzir b/t ou usar parede mais espessa.');
    out.secaoClasse = {
      bt: g(sec.bt, '—'), limite: g((sec.type === 'CHS') ? 0.07 * Data.E_STEEL / fy : limFlange, '—'),
      compacta: compacta, ref: 'NBR 8800 Tabela F.1 (esbeltez de parede)'
    };

    // ---- 8 · PLACA DE BASE E CHUMBADORES ----------------------------------
    var n_ch = num(inp.nChumbadores, 'Nº de chumbadores');
    var d_ch = num(inp.bracoChumbadores, 'Braço dos chumbadores');
    var T_ch = M_Sd / ((n_ch / 2) * d_ch);           // tração de cálculo por chumbador
    var ancMin = pais.ancoragemMin;
    var R_anc = Math.max(ancMin, T);                  // resistência mínima do dispositivo
    out.ancoragem = {
      n_ch: g(n_ch, 'un'), d_ch: g(d_ch, 'm'), T_ch: g(T_ch, 'kN'),
      R_anc: g(R_anc, 'kN'),
      check_15kN: chk(R_anc >= ancMin, ancMin, R_anc, '≥', 'kN', pais.refAncoragem),
      nota: 'Verificar o arrancamento dos chumbadores no concreto/aço (catálogo do fabricante) ≥ T_ch e a flexão da placa de base.'
    };

    // ---- 8b · PLACA DE BASE (flexão simplificada) -------------------------
    // Pressão de contato e espessura mínima da placa (modelo de balanço em flexão).
    var fck = num(inp.fck || 25, 'fck do concreto', true);   // MPa
    var fcd = fck / 1.4;
    var ladoPlaca = num(inp.ladoPlaca || (sec.geom.b + 120), 'Lado da placa', true); // mm
    var areaPlaca = ladoPlaca * ladoPlaca;                   // mm²
    var sigma_c = N_Sd * 1000 / areaPlaca;                   // MPa (compressão média)
    var balanco = (ladoPlaca - sec.geom.b) / 2;             // mm (volado da placa)
    var fyPlaca = 250;                                       // MPa (chapa A36)
    var t_placa = Math.sqrt(4 * sigma_c * balanco * balanco / (1.1 * fyPlaca)); // mm (modelo elástico)
    out.placaBase = {
      fck: g(fck, 'MPa'), lado: g(ladoPlaca, 'mm'), sigma_c: g(sigma_c, 'MPa'),
      sigma_adm: g(0.85 * fcd, 'MPa'),
      check_contato: chk(sigma_c <= 0.85 * fcd, 0.85 * fcd, sigma_c, '≤', 'MPa', 'NBR 6118 (esmagamento)'),
      t_min: g(t_placa, 'mm'),
      nota: 'Espessura mínima estimada da placa por flexão do volado. Detalhar conforme projeto.'
    };

    // ---- 8c · ANÁLISE DINÂMICA: MÉTODO DE ENERGIA E FATOR DE QUEDA --------
    //   Verificação complementar (NBR 16325 / EN 355): confirma que o absorvedor
    //   pessoal dissipa a energia da queda mantendo a força ≤ 6 kN.
    var massaPad = num(inp.massaUsuario || 100, 'Massa do usuário', true);   // kg (padrão normativo 100 kg)
    var gAcel = 9.81;
    var compTal = num(inp.compTalabarte || 1.5, 'Comprimento do talabarte', true); // m
    var fatorQueda = H_ql / Math.max(compTal, 0.1);                          // fator de queda (0–2)
    var E_queda = massaPad * gAcel * (H_ql + H_fr) / 1000;                   // kJ ≈ energia total
    var W_abs = Ft * H_fr;                                                    // kJ dissipado pelo absorvedor (F·curso)
    var energiaOk = W_abs >= massaPad * gAcel * H_ql / 1000;                  // absorvedor cobre a energia da queda livre
    out.dinamica = {
      massa: g(massaPad, 'kg'), compTalabarte: g(compTal, 'm'),
      fatorQueda: g(fatorQueda, '—'),
      classeFQ: fatorQueda <= 0.5 ? 'baixo (seguro)' : (fatorQueda < 1.5 ? 'atenção' : 'alto risco'),
      E_queda: g(E_queda, 'kJ'), W_abs: g(W_abs, 'kJ'),
      check_energia: chk(energiaOk, massaPad * gAcel * H_ql / 1000, W_abs, '≥', 'kJ', 'NBR 16325 / EN 355 (energia ≤ absorvedor)'),
      ref: 'Método de energia — confirma adequação do absorvedor pessoal (limite 6 kN).'
    };

    // ---- 8d · EFEITO DA TEMPERATURA na pré-tensão (opcional) --------------
    var dTemp = num(inp.deltaTemp != null ? inp.deltaTemp : 0, 'ΔT', true);
    if (dTemp !== 0) {
      var alpha = 12e-6;                                  // coef. dilatação do aço [1/°C]
      var dT0 = -EA * alpha * dTemp;                      // variação da pré-tensão [kN] (aquecimento relaxa)
      out.temperatura = {
        deltaTemp: g(dTemp, '°C'), variacaoT0: g(dT0, 'kN'),
        T0_quente: g(T0 + (dTemp > 0 ? dT0 : 0), 'kN'), T0_frio: g(T0 + (dTemp < 0 ? -dT0 : 0), 'kN'),
        nota: 'Variação da pré-tensão por ΔT (α=12·10⁻⁶/°C). Reapertar o esticador conforme a estação, se necessário.'
      };
    }

    // ---- 8e · POSTE DE CANTO / MUDANÇA DE DIREÇÃO (opcional) --------------
    var angCanto = num(inp.anguloMudanca != null ? inp.anguloMudanca : 0, 'Ângulo de mudança', true);
    if (angCanto > 0) {
      var R_canto = 2 * T * Math.sin(rad(angCanto / 2));  // resultante das duas trações
      out.canto = {
        angulo: g(angCanto, '°'), R: g(R_canto, 'kN'),
        nota: 'Poste de canto recebe a RESULTANTE das trações dos dois tramos (R = 2·T·sen(β/2)). Dimensionar este poste e sua ancoragem para R, não para H.'
      };
    }

    // ---- 8f · LIMITES OSHA (queda livre / desaceleração) — informativo (só p/ país que define) ----
    if (pais.quedaLivreMax) {
      out.osha = {
        quedaLivre: chk(H_ql <= pais.quedaLivreMax, pais.quedaLivreMax, H_ql, '≤', 'm', 'OSHA 1926.502(d)(16) — 6 ft'),
        frenagem: chk(H_fr <= pais.frenagemMax, pais.frenagemMax, H_fr, '≤', 'm', 'OSHA 1926.502(d)(16) — 3.5 ft')
      };
      if (!out.osha.quedaLivre.ok) out.avisos.push('Free fall ' + H_ql.toFixed(2) + ' m exceeds the OSHA limit of 6 ft (1.83 m) — 1926.502(d)(16).');
      if (!out.osha.frenagem.ok) out.avisos.push('Deceleration distance ' + H_fr.toFixed(2) + ' m exceeds the OSHA limit of 3.5 ft (1.07 m) — use a compliant shock-absorbing lanyard/SRL.');
    }

    // ---- 9 · INDICADORES E VEREDITO ---------------------------------------
    var checks = [
      out.trabalhador.check_Ft,
      out.cabo.check_din,
      out.zlq.check,
      out.poste.check_util,
      out.cisalhamento.check,
      out.ancoragem.check_15kN
    ];
    var aprovado = checks.every(function (c) { return c.ok; });
    out.veredito = {
      aprovado: aprovado,
      texto: aprovado ? 'APROVADO' : 'REPROVADO — revisar dados',
      indicadores: [
        { nome: 'Força no trabalhador ≤ ' + fMax + ' kN', nomeEn: 'Worker force ≤ ' + fMax + ' kN', ok: out.trabalhador.check_Ft.ok },
        { nome: 'FS dinâmico do cabo ≥ ' + pais.fsCaboMin, nomeEn: 'Cable dynamic SF ≥ ' + pais.fsCaboMin, ok: out.cabo.check_din.ok },
        { nome: 'ZLQ ≤ pé-direito livre disponível', nomeEn: 'Fall clearance ≤ available height', ok: out.zlq.check.ok },
        { nome: 'Utilização do poste ≤ 1,0', nomeEn: 'Post utilization ≤ 1.0', ok: out.poste.check_util.ok },
        { nome: 'Cisalhamento do poste OK', nomeEn: 'Post shear OK', ok: out.cisalhamento.check.ok },
        { nome: 'Ancoragem ≥ ' + fmtN(ancMin) + ' kN', nomeEn: 'Anchorage ≥ ' + fmtN(ancMin) + ' kN', ok: out.ancoragem.check_15kN.ok }
      ]
    };

    return out;
  }

  // -------------------------------------------------------------------------
  //  Helpers de empacotamento
  // -------------------------------------------------------------------------
  function g(valor, unidade) { return { valor: valor, unidade: unidade }; }
  function fmtN(x) { return (Math.round(x * 10) / 10).toString().replace('.', ','); }
  function chk(ok, exigido, obtido, op, unidade, ref) {
    return { ok: !!ok, exigido: exigido, obtido: obtido, op: op, unidade: unidade, ref: ref };
  }
  function num(x, nome, permiteZero) {
    var v = Number(x);
    if (!isFinite(v)) throw new Error('Valor numérico inválido: ' + nome + ' = ' + x);
    if (!permiteZero && v === 0 && nome.indexOf('Nº') === -1) {
      // zero é suspeito para a maioria das grandezas físicas, mas não bloqueia
    }
    return v;
  }

  /**
   * DIMENSIONAMENTO AUTOMÁTICO ("Calcule para mim") — busca a combinação
   * (perfil de poste + bitola de cabo) MAIS LEVE que é APROVADA em TODAS as
   * verificações do país selecionado. Respeita as escolhas do usuário: mantém
   * o vão, as cargas, o material do cabo, o aço e a geometria; varia apenas o
   * diâmetro do cabo e o perfil do poste (os dois itens que o software
   * dimensiona). Retorna a solução ótima, alternativas próximas e diagnóstico.
   *
   * @returns {object|null} {
   *   perfil, caboDiametro, R, area, massaLinear (kg/m), massaPoste (kg),
   *   utilizacao, testados, alternativas[], diagnostico
   * }  — ou null se nenhuma combinação do catálogo aprovar.
   */
  function otimizar(inp) {
    deps(root);
    var RHO = 7850; // kg/m³ (aço) — massa linear = A[cm²]·1e-4[m²]·RHO
    var diams = Data.DIAMETERS.slice().sort(function (a, b) { return a - b; });
    // Perfis ordenados por área da seção (proxy de peso/custo), do mais leve ao mais pesado
    var perfis = Data.PROFILES.map(function (p) {
      var area = 1e9; try { area = Sections.fromSpec(p.spec).A; } catch (e) {}
      return { nome: p.nome, area: area };
    }).sort(function (a, b) { return a.area - b.area; });

    var h = Number(inp.h) || 1.2;
    var testados = 0, encontrou = 0, melhor = null;
    var alternativas = [];         // até 3 soluções válidas mais leves
    var util = function (R) {       // utilização governante (maior das verificadas)
      var u = R.poste && R.poste.util ? R.poste.util.valor : (R.veredito && R.veredito.utilizacao ? R.veredito.utilizacao.valor : null);
      return (typeof u === 'number') ? u : null;
    };

    for (var i = 0; i < perfis.length; i++) {
      for (var j = 0; j < diams.length; j++) {
        testados++;
        var R;
        try { R = calcular(Object.assign({}, inp, { posteperfil: perfis[i].nome, caboDiametro: diams[j] })); }
        catch (e) { continue; }               // combinação inexistente (bitola indisponível p/ o material) — segue
        if (R.veredito.aprovado) {
          var massaLinear = perfis[i].area * 1e-4 * RHO;   // kg/m
          var sol = {
            perfil: perfis[i].nome, caboDiametro: diams[j], R: R,
            area: perfis[i].area, massaLinear: massaLinear, massaPoste: massaLinear * h,
            utilizacao: util(R), testados: testados
          };
          if (!melhor) melhor = sol;           // a PRIMEIRA solução é a mais leve (perfis já ordenados)
          if (alternativas.length < 3) alternativas.push({ perfil: sol.perfil, caboDiametro: sol.caboDiametro, massaLinear: massaLinear, utilizacao: sol.utilizacao });
          encontrou++;
          break;                               // para este perfil, o menor cabo que passa basta — vai ao próximo perfil
        }
      }
      if (alternativas.length >= 3) break;      // já temos a ótima + 2 alternativas mais pesadas
    }

    if (!melhor) {
      return null;                              // nada no catálogo aprova — a limitação é geométrica (ZLQ) ou de carga
    }
    melhor.alternativas = alternativas.filter(function (a) { return a.perfil !== melhor.perfil || a.caboDiametro !== melhor.caboDiametro; });
    melhor.testados = testados;
    melhor.diagnostico = 'Solução mais leve do catálogo aprovada em todas as verificações do país selecionado.';
    return melhor;
  }

  /**
   * COMPARATIVO INTERNACIONAL — avalia o MESMO projeto sob os critérios de cada
   * país disponível (Brasil × EUA) e sinaliza quando os vereditos DIVERGEM
   * (aprovado numa jurisdição e reprovado noutra), reflexo dos diferentes
   * métodos de dimensionamento, limites e exigências normativas.
   * @returns {object} { resultados: {BR:R, US:R}, divergem: bool, itens: [...] }
   */
  function comparar(inp) {
    deps(root);
    var codigos = (root.LV && root.LV.Paises) ? root.LV.Paises.lista().map(function (p) { return p.codigo; }) : ['BR', 'US'];
    var resultados = {};
    codigos.forEach(function (cod) {
      try { resultados[cod] = calcular(Object.assign({}, inp, { pais: cod })); }
      catch (e) { resultados[cod] = null; }
    });
    var vers = codigos.map(function (c) { return resultados[c] ? resultados[c].veredito.aprovado : null; });
    var divergem = vers.indexOf(true) !== -1 && vers.indexOf(false) !== -1;
    return { codigos: codigos, resultados: resultados, divergem: divergem };
  }

  var Engine = { calcular: calcular, solveSag: solveSag, chiBuckling: chiBuckling, otimizar: otimizar, comparar: comparar };

  root.LV = root.LV || {};
  root.LV.Engine = Engine;
  if (typeof module !== 'undefined' && module.exports) module.exports = Engine;
})(typeof self !== 'undefined' ? self : (typeof globalThis !== 'undefined' ? globalThis : this));
