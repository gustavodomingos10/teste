/* ============================================================================
 *  LINHA DE VIDA · GD ENGENHARIA
 *  report.js — Memoriais BILÍNGUES (PT-BR / EN-US) com unidades automáticas
 *
 *  O idioma e o sistema de unidades seguem o PAÍS selecionado (R.pais):
 *    Brasil  → Português, SI, NR-35/NR-18/NBR.
 *    EUA     → Inglês, Imperial, OSHA/ANSI.
 *  A estrutura do memorial de cálculo segue a NR-35 Anexo II 5.1.1
 *  (força de impacto → esforços → ZLQ) — equivalente a ANSI Z359.6.
 * ========================================================================== */
(function (root) {
  'use strict';

  function dep(n) { var x = root.LV && root.LV[n]; if (!x) throw new Error('report.js: módulo ' + n + ' não carregado'); return x; }

  // ---- Estado de locale (definido por contexto em cada chamada pública) ----
  var _lang = 'pt', _imp = false;
  function setCtx(R) {
    var p = R && R.pais ? R.pais : {};
    _lang = (p.idioma === 'en') ? 'en' : 'pt';
    _imp = (p.unidades === 'imperial');
  }
  function L(pt, en) { return _lang === 'en' ? en : pt; }

  // ---- Formatação numérica + unidades ----
  function fnum(x, dec) {
    if (x == null || !isFinite(x)) return '—';
    dec = dec == null ? 2 : dec;
    var s = Number(x).toFixed(dec);
    return _lang === 'en' ? s : s.replace('.', ',');
  }
  function f(x, dec) { return fnum(x, dec); }
  // Converte e formata um objeto {valor, unidade}
  function U(o, dec) {
    if (!o) return '—';
    var val = o.valor, un = o.unidade;
    if (_imp && root.LV.Units && un) { var c = root.LV.Units.conv(val, un, 'imperial'); val = c.valor; un = c.unidade; }
    var d = dec;
    if (d == null) d = (un === 'lbf' || un === 'lbf·ft' || un === 'mph') ? 0 : 2;
    return fnum(val, d) + (un && un !== '—' ? ' ' + un : '');
  }
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function dataBR(ts) { if (!ts) return '—'; var d = new Date(ts); var dd = ('0' + d.getDate()).slice(-2), mm = ('0' + (d.getMonth() + 1)).slice(-2), yy = d.getFullYear(); return _lang === 'en' ? (mm + '/' + dd + '/' + yy) : (dd + '/' + mm + '/' + yy); }

  function chkBadge(ok) { return '<span class="badge ' + (ok ? 'ok' : 'fail') + '">' + (ok ? '✔ ' + L('ATENDE', 'PASS') : '✘ ' + L('NÃO ATENDE', 'FAIL')) + '</span>'; }
  function linha(simb, desc, formula, valor, ref, ok) {
    return '<tr><td class="sym">' + esc(simb) + '</td><td>' + esc(desc) + (formula ? '<div class="fml">' + formula + '</div>' : '') +
      '</td><td class="val">' + valor + '</td><td class="ref">' + esc(ref || '') + (ok != null ? '<br>' + chkBadge(ok) : '') + '</td></tr>';
  }

  function cabecalho(cfg, titulo, subt, proj) {
    return '<div class="rep-head"><div class="rh-emp">' + esc(cfg.empresa) + '</div>' +
      '<div class="rh-sub">' + esc(cfg.responsavel) + ' · ' + esc(cfg.crea) + ' · CNPJ ' + esc(cfg.cnpj) + ' · ' + esc(cfg.contato) + '</div>' +
      '<h1>' + esc(titulo) + '</h1>' + (subt ? '<div class="rh-norma">' + esc(subt) + '</div>' : '') +
      (proj ? '<div class="rh-proj">' + L('Obra', 'Project') + ': <b>' + esc((proj.entrada || {}).obra || proj.nome) + '</b> · ' +
        L('Local', 'Site') + ': ' + esc((proj.entrada || {}).local || '—') + ' · ' + L('Rev.', 'Rev.') + ' ' + esc(proj.revisao || 'R00') +
        ' · ' + L('Emissão', 'Issued') + ': ' + dataBR(Date.now()) + '</div>' : '') + '</div>';
  }

  function assinatura(cfg, proj) {
    var resp = (proj && proj.entrada && proj.entrada.responsavel) || cfg.responsavel;
    return '<div class="assin"><div class="loc">' + esc(cfg.cidade) + ', ' + dataBR(Date.now()) + '.</div>' +
      '<div class="linha-assin">__________________________________________</div><div>' + esc(resp) + '</div>' +
      '<div class="cargo">' + L('Engenheiro Civil — Responsável Técnico', 'Civil Engineer — Engineer of Record') + '</div>' +
      '<div class="cargo">' + L('ART nº', 'PE Stamp / License') + ' ____________________ · ' + esc(cfg.crea) + '</div></div>';
  }

  // =======================================================================
  //  MEMORIAL DE CÁLCULO
  // =======================================================================
  function memorialCalculo(R, proj, cfg) {
    setCtx(R);
    var Norms = dep('Norms').NORMS;
    var pais = R.pais || {};
    var Draw = root.LV.Draw;
    var s = '<div class="report memorial-calc">';
    s += cabecalho(cfg, L('MEMORIAL DE CÁLCULO', 'CALCULATION REPORT'),
      L('Linha de Vida Horizontal (SPIQ) · ', 'Horizontal Lifeline (PFAS) · ') + (pais.normas ? pais.normas.join(' · ') : ''), proj);
    s += '<div class="verdito ' + (R.veredito.aprovado ? 'ok' : 'fail') + '">' + L('VEREDITO DO SISTEMA', 'SYSTEM VERDICT') + ': ' +
      L(R.veredito.aprovado ? 'APROVADO' : 'REPROVADO — revisar dados', R.veredito.aprovado ? 'APPROVED' : 'FAILED — review data') + '</div>';

    // 1 Premissas
    s += '<h2>1 · ' + L('Premissas e critérios normativos', 'Assumptions and code criteria') + '</h2><ul class="prem">' +
      '<li>' + L('Força de impacto no trabalhador', 'Worker arrest force') + ' ≤ ' + f(pais.forcaTrabalhadorMax) + ' kN — ' + esc(pais.refForca || '') + '</li>' +
      '<li>' + L('Estrutura/ancoragem resiste à força máxima aplicável', 'Structure/anchorage resists the maximum applicable force') + ' — ' + esc(pais.refAncoragem || '') + '</li>' +
      '<li>' + L('Fator de segurança dinâmico do cabo', 'Cable dynamic safety factor') + ' ≥ ' + f(pais.fsCaboMin) + '</li>' +
      '<li>' + L('Dimensionamento determina: (a) força de impacto; (b) esforços em cada parte; (c) zona livre de queda.',
        'Design determines: (a) arrest force; (b) forces in each part; (c) required fall clearance.') + ' ' + L('(NR-35 Anexo II 5.1.1 / ANSI Z359.6)', '(ANSI Z359.6 / NR-35 Annex II 5.1.1)') + '</li></ul>';

    // 2 Dados
    s += '<h2>2 · ' + L('Dados de entrada', 'Input data') + '</h2><table class="tab"><tbody>';
    s += linha('L', L('Vão entre postes', 'Span between posts'), '', U(R.dados.L), L('projeto', 'project'));
    s += linha('—', L('Nº de vãos', 'Number of spans'), '', U(R.dados.nVaos), L('projeto', 'project'));
    s += linha(L('cabo', 'cable'), L('Cabo da linha de vida', 'Lifeline cable'), '', esc(R.dados.cabo.material) + ' Ø' + R.dados.cabo.d + ' mm (' + esc(R.dados.cabo.construcao) + ')', L('catálogo', 'catalog'));
    s += linha('E', L('Módulo de elasticidade do cabo', 'Cable elastic modulus'), '', U(R.dados.E), L('catálogo', 'catalog'));
    s += linha('A', L('Área metálica do cabo', 'Cable metallic area'), '', U(R.dados.A_cabo), L('catálogo', 'catalog'));
    s += linha('F_rup', L('Carga de ruptura do cabo (MBL)', 'Cable breaking load (MBL)'), '', U(R.dados.MBL), L('catálogo', 'catalog'));
    s += linha('T₀', L('Pré-tensão de instalação', 'Installation pretension'), '', U(R.dados.T0), L('projeto', 'project'));
    s += linha('n', L('Nº de usuários simultâneos', 'Simultaneous users'), '', U(R.dados.n), L('projeto', 'project'));
    s += linha('Fₜ', L('Força de impacto no trabalhador', 'Worker arrest force'), '', U(R.dados.Ft), esc(pais.refForca || ''));
    s += linha('h', L('Altura do poste', 'Post height'), '', U(R.dados.h), L('projeto', 'project'));
    s += linha(L('perfil', 'profile'), L('Perfil do poste', 'Post profile'), '', esc(R.poste.perfil) + ' · ' + esc(R.poste.aco) + ' (fy=' + U(R.poste.fy) + ')', L('projeto', 'project'));
    s += '</tbody></table>';

    // 3 (a) Força de impacto
    s += '<h2>3 · (a) ' + L('Força de impacto de retenção', 'Fall arrest force') + '</h2><table class="tab"><tbody>';
    s += linha('Fₜ', L('Força transmitida ao trabalhador', 'Force transmitted to worker'), L('limite ≤ ', 'limit ≤ ') + f(pais.forcaTrabalhadorMax) + ' kN', U(R.trabalhador.Ft), esc(pais.refForca || ''), R.trabalhador.check_Ft.ok);
    s += linha('Q', L('Carga aplicada à linha', 'Load applied to the line'), 'Q = n · Fₜ', U(R.trabalhador.Q), L('impactos simultâneos', 'simultaneous impacts'));
    s += '</tbody></table>';

    // 4 (b) Tração e flecha
    s += '<h2>4 · (b) ' + L('Tração e flecha da linha', 'Line tension and sag') + ' <span class="micro">— Newton-Raphson</span></h2>';
    s += '<p class="nota">' + L('Resolve', 'Solves') + ' <span class="mono">Q = 2·T·senθ</span> ' + L('com', 'with') +
      ' <span class="mono">T = T₀ + (2·EA/L)·(√(a²+f²) − a)</span>. ' + L('Convergiu em', 'Converged in') + ' ' + R.tracao.iteracoes + ' ' + L('iterações', 'iterations') + '.</p>';
    s += '<table class="tab"><tbody>';
    s += linha('T_el', L('Tração elástica', 'Elastic tension'), 'Q·√(a²+f²)/(2f)', U(R.tracao.T_el), '');
    s += linha(L('abs', 'abs'), L('Absorvedor de energia da linha', 'In-line energy absorber'), '', R.tracao.absAtivo ? L('ATIVO — limita T', 'ACTIVE — limits T') : L('não atuante', 'inactive'), L('NBR 16325 / EN 795', 'EN 795 / ANSI Z359.6'));
    s += linha('T', L('TRAÇÃO MÁXIMA NA LINHA', 'MAXIMUM LINE TENSION'), '', '<b>' + U(R.tracao.T) + '</b>', L('esforço de projeto', 'design force'));
    s += linha('θ', L('Ângulo da linha', 'Line angle'), 'senθ = Q/(2T)', U(R.tracao.theta), '');
    s += linha('f_tot', L('FLECHA TOTAL', 'TOTAL SAG'), '', '<b>' + U(R.tracao.f_tot) + '</b>', '');
    s += '</tbody></table>';

    // 5 (b) Poste
    s += '<h2>5 · (b) ' + L('Esforços nos postes e dimensionamento', 'Post forces and design') + ' <span class="micro">— ' + L('NBR 8800', 'AISC 360 / NBR 8800') + '</span></h2><table class="tab"><tbody>';
    s += linha('H', L('Reação horizontal no topo', 'Horizontal reaction at top'), 'H = T·cosθ', U(R.reacoes.H), '');
    s += linha('V', L('Reação vertical no topo', 'Vertical reaction at top'), 'V = T·senθ', U(R.reacoes.V), '');
    if (R.reacoes.vento) s += linha('M_w', L('Momento de vento', 'Wind moment'), 'F = Ca·q·A', U(R.reacoes.vento.M), esc(R.reacoes.vento.ref));
    s += linha('M_k', L('Momento na base', 'Base moment'), 'M_k = H·h' + (R.reacoes.vento ? ' + M_w' : ''), U(R.reacoes.M_k), '');
    s += linha('M_Sd', L('Momento solicitante de cálculo', 'Design moment'), 'γf·M_k (γf=' + f(R.poste.gf.valor) + ')', U(R.poste.M_Sd), '');
    s += linha('M_Rd', L('Momento resistente', 'Moment resistance'), 'Z·fy/γ', U(R.poste.M_Rd), 'γa1 = 1,10');
    s += linha('λ₀/χ', L('Esbeltez / flambagem', 'Slenderness / buckling'), 'χ = 0,658^(λ₀²)', f(R.poste.lambda0.valor) + ' / ' + f(R.poste.chi.valor), L('NBR 8800 5.3', 'AISC E3'));
    s += linha('util', L('UTILIZAÇÃO — flexo-compressão', 'UTILIZATION — beam-column'), '≤ 1,0', '<b>' + f(R.poste.util.valor) + '</b>', L('NBR 8800', 'AISC H1'), R.poste.check_util.ok);
    s += linha('V_Sd/V_Rd', L('Cisalhamento', 'Shear'), '0,6·fy·Aw/γ', U(R.cisalhamento.V_Sd) + ' / ' + U(R.cisalhamento.V_Rd), '', R.cisalhamento.check.ok);
    s += '</tbody></table>';
    if (Draw) s += '<div class="fig">' + Draw.esforcosPoste(R) + '</div>';

    // 6 (b) Ancoragem
    s += '<h2>6 · (b) ' + L('Placa de base e ancoragem', 'Base plate and anchorage') + '</h2><table class="tab"><tbody>';
    s += linha('T_ch', L('Tração por chumbador', 'Tension per anchor bolt'), 'M_Sd/((n/2)·d)', U(R.ancoragem.T_ch), L('verificar arrancamento', 'verify pull-out'));
    s += linha('R_anc', L('Resistência mínima do dispositivo', 'Minimum device resistance'), 'máx(' + f(R.ancoragem.check_15kN.exigido) + '; T)', U(R.ancoragem.R_anc), esc(pais.refAncoragem || ''), R.ancoragem.check_15kN.ok);
    s += linha('σ_c', L('Compressão no concreto', 'Concrete bearing'), 'σ ≤ 0,85·fcd', U(R.placaBase.sigma_c), L('NBR 6118 / ACI 318', 'ACI 318'), R.placaBase.check_contato.ok);
    s += '</tbody></table>';

    // 7 Cabo
    s += '<h2>7 · ' + L('Verificação do cabo', 'Cable verification') + '</h2><table class="tab"><tbody>';
    s += linha('FS_din', L('FS dinâmico', 'Dynamic SF'), 'F_rup/T ≥ ' + f(pais.fsCaboMin), f(R.cabo.FS_din.valor), '', R.cabo.check_din.ok);
    s += linha('FS_serv', L('FS em serviço', 'Service SF'), 'F_rup/T₀', f(R.cabo.FS_trab.valor), '', R.cabo.check_trab.ok);
    s += '</tbody></table>';

    // 8 (c) ZLQ
    s += '<h2>8 · (c) ' + L('Zona Livre de Queda — ZLQ', 'Required Fall Clearance — RFC') + ' <span class="micro">— ' + L('NBR 16325-2 Anexo C.2', 'NBR 16325-2 Annex C.2 / ANSI Z359') + '</span></h2><table class="tab"><tbody>';
    s += linha('H_ql', L('Queda livre', 'Free fall'), '', U(R.zlq.H_ql), '');
    s += linha('H_fr', L('Frenagem do absorvedor', 'Deceleration distance'), '', U(R.zlq.H_fr), '');
    s += linha('—', L('Engate aos pés (norma)', 'Harness-to-feet (code)'), '1,5 m', U(R.zlq.C_pes), '');
    s += linha('—', L('Distância de segurança (norma)', 'Safety distance (code)'), '1,0 m', U(R.zlq.C_seg), '');
    s += linha('f', L('Flecha da linha', 'Line deflection'), '', U(R.zlq.f_tot), '');
    s += linha('ZLQ', L('ZONA LIVRE DE QUEDA', 'REQUIRED FALL CLEARANCE'), 'H_ql+H_fr+1,5+1,0+f', '<b>' + U(R.zlq.ZLQ) + '</b>', '', R.zlq.check.ok);
    s += linha('—', L('Pé-direito disponível', 'Available clearance'), '', U(R.zlq.peDireito), '', R.zlq.check.ok);
    s += '</tbody></table>';
    if (Draw) s += '<div class="fig">' + Draw.elevacaoZLQ(R) + '</div>';

    // 9 Indicadores
    s += '<h2>9 · ' + L('Resultados consolidados e indicadores', 'Consolidated results and indicators') + '</h2><table class="tab indic"><tbody>';
    R.veredito.indicadores.forEach(function (ind) { s += '<tr><td>' + esc(L(ind.nome, ind.nomeEn || ind.nome)) + '</td><td class="val">' + chkBadge(ind.ok) + '</td></tr>'; });
    s += '</tbody></table>';

    // 10 Conclusão
    s += '<h2>10 · ' + L('Conclusão', 'Conclusion') + '</h2><p class="conclusao">' +
      L('Com os dados adotados, o sistema resulta ', 'With the adopted data, the system is ') + '<b>' +
      L(R.veredito.aprovado ? 'APROVADO' : 'REPROVADO', R.veredito.aprovado ? 'APPROVED' : 'FAILED') + '</b>. ' +
      L('Os resultados devem ser conferidos e validados pelo responsável técnico, com a respectiva ART.',
        'Results must be checked and validated by the engineer of record, with the corresponding sealed documentation.') + '</p>';
    s += assinatura(cfg, proj);
    s += '</div>';
    return s;
  }

  // =======================================================================
  //  MEMORIAL DESCRITIVO
  // =======================================================================
  function memorialDescritivo(R, proj, cfg) {
    setCtx(R);
    var e = R.entrada, pais = R.pais || {}, Draw = root.LV.Draw;
    var inox = /Inox/i.test(R.dados.cabo.material);
    var s = '<div class="report memorial-desc">';
    s += cabecalho(cfg, L('MEMORIAL DESCRITIVO', 'DESCRIPTIVE REPORT'),
      L('Linha de Vida Horizontal — Sistema de Proteção Individual contra Quedas',
        'Horizontal Lifeline — Personal Fall Arrest System'), proj);
    s += '<h2>1 · ' + L('Objeto', 'Object') + '</h2><p>' +
      L('O presente memorial descreve o projeto da Linha de Vida Horizontal a ser instalada na obra ',
        'This report describes the Horizontal Lifeline to be installed at ') + '<b>' + esc(e.obra || proj.nome) + '</b>, ' +
      L('situada em ', 'located at ') + esc(e.local || '—') + '.</p>';
    s += '<h2>2 · ' + L('Normas aplicáveis', 'Applicable standards') + '</h2><p>' + (pais.normas ? pais.normas.join(', ') : '') + '. ' +
      L('Sistema classificado como dispositivo de ancoragem ', 'System classified as anchor device ') + '<b>' + esc(pais.tipoDispositivo || 'tipo C') + '</b>.</p>';
    s += '<h2>3 · ' + L('Descrição do sistema', 'System description') + '</h2><p>' +
      L('Sistema composto por cabo de aço tensionado entre ', 'System comprising a tensioned steel cable between ') +
      '<b>' + (Math.round(R.dados.nVaos.valor) + 1) + ' ' + L('postes', 'posts') + '</b>, ' +
      L('em', 'in') + ' ' + Math.round(R.dados.nVaos.valor) + ' ' + L('vão(s) de', 'span(s) of') + ' ' + U(R.dados.L) + ' ' + L('cada', 'each') +
      ', ' + L('postes de', 'posts') + ' ' + U(R.dados.h) + '. ' + L('Cabo', 'Cable') + ' Ø' + R.dados.cabo.d + ' mm (' + esc(R.dados.cabo.material) + '), ' +
      L('pré-tensão', 'pretension') + ' ' + U(R.dados.T0) + '.</p>';
    if (Draw) s += '<div class="fig">' + Draw.iso3D(R) + '</div><div class="fig">' + Draw.planta(R) + '</div>';
    s += '<h2>4 · ' + L('Materiais', 'Materials') + '</h2><p>' + L('Componentes em ', 'Components in ') + '<b>' +
      (inox ? L('aço inoxidável AISI 316', 'AISI 316 stainless steel') : L('aço galvanizado a fogo', 'hot-dip galvanized steel')) + '</b>.</p>';
    s += '<h2>5 · ' + L('Segurança e utilização', 'Safety and use') + '</h2><p>' +
      L('O uso exige EPI completos (cinturão paraquedista, talabarte com absorvedor, trava-quedas, capacete) com certificação válida, e capacitação. Inspeção inicial e periódica (≤ 12 meses).',
        'Use requires complete PPE (full-body harness, energy-absorbing lanyard, fall arrester, helmet) with valid certification, and training. Initial and periodic inspection (≤ 12 months).') + '</p>';
    s += assinatura(cfg, proj);
    s += '</div>';
    return s;
  }

  var Report = {
    memorialCalculo: memorialCalculo, memorialDescritivo: memorialDescritivo,
    cabecalho: cabecalho, assinatura: assinatura, setCtx: setCtx, L: L, U: U,
    _f: f, _U: U, _esc: esc, _dataBR: dataBR, _chkBadge: chkBadge, _L: L
  };
  root.LV = root.LV || {};
  root.LV.Report = Report;
  if (typeof module !== 'undefined' && module.exports) module.exports = Report;
})(typeof self !== 'undefined' ? self : (typeof globalThis !== 'undefined' ? globalThis : this));
