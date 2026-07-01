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

  // Emblema/logo do escritório (imagem enviada em Admin, ou monograma gerado)
  function emblema(cfg) {
    if (cfg && cfg.logo) return '<img class="rep-logo" src="' + cfg.logo + '" alt="logo"/>';
    var ini = String((cfg && cfg.empresa) || 'GD').replace(/[^A-Za-zÀ-ÿ ]/g, '').split(/\s+/).map(function (w) { return w[0] || ''; }).join('').slice(0, 3).toUpperCase() || 'GD';
    return '<div class="rep-emblema">' + esc(ini) + '</div>';
  }
  // Rodapé institucional (empresa · contato · normas) — usado nos documentos exportados
  function rodapeDoc(cfg, pais) {
    return '<div class="rep-footer"><b>' + esc(cfg.empresa) + '</b> · CNPJ ' + esc(cfg.cnpj) + ' · ' + esc(cfg.responsavel) + ' · ' + esc(cfg.crea) +
      ' · ' + esc(cfg.contato) + (cfg.cidade ? ' · ' + esc(cfg.cidade) : '') +
      (pais && pais.normas ? '<div class="rf-normas">' + esc(pais.normas.join('  ·  ')) + '</div>' : '') + '</div>';
  }
  function cabecalho(cfg, titulo, subt, proj) {
    return '<div class="rep-head"><div class="rh-top">' + emblema(cfg) +
      '<div class="rh-ids"><div class="rh-emp">' + esc(cfg.empresa) + '</div>' +
      '<div class="rh-sub">' + esc(cfg.responsavel) + ' · ' + esc(cfg.crea) + ' · CNPJ ' + esc(cfg.cnpj) + ' · ' + esc(cfg.contato) + '</div></div></div>' +
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
        'Design determines: (a) arrest force; (b) forces in each part; (c) required fall clearance.') + ' ' + L('(NR-35 Anexo II 5.1.1 / ANSI Z359.6)', '(ANSI Z359.6 / NR-35 Annex II 5.1.1)') + '</li>' +
      (pais.quedaLivreMax ? '<li>' + L('Queda livre', 'Free fall') + ' ≤ ' + f(pais.quedaLivreMax) + ' m (6 ft) · ' + L('desaceleração', 'deceleration') + ' ≤ ' + f(pais.frenagemMax) + ' m (3.5 ft) — OSHA 1926.502(d)(16)</li>' +
        '<li>' + L('Sistema projetado por profissional qualificado; deflexão da linha e forças de ancoragem conforme ', 'Engineered by a qualified person; lifeline deflection and anchorage forces per ') + 'ANSI/ASSP Z359.6.</li>' : '') +
      '<li>' + L('Normas aplicáveis', 'Applicable standards') + ': ' + esc((pais.normas || []).join(' · ')) + '</li></ul>';

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

    // ===== 3 · ROTEIRO DE CÁLCULO DETALHADO (passo a passo, auditável) =====
    s += '<h2>3 · ' + L('Roteiro de cálculo detalhado (passo a passo)', 'Detailed calculation routine (step by step)') + '</h2>';
    s += '<p class="nota">' + L(
      'Cada grandeza é demonstrada com a fórmula, a substituição numérica e o resultado, permitindo contraprova e auditoria. Unidades em SI (kN, m, mm, MPa); os equivalentes em unidades locais constam do resumo e da plaqueta.',
      'Each quantity is shown with the formula, the numeric substitution and the result, allowing verification and audit. Units in SI (kN, m, mm, MPa); local-unit equivalents are given in the summary and on the plate.') + '</p>';

    // atalhos numéricos (valores em SI)
    var d0 = R.dados, tr = R.tracao, zl = R.zlq, rc = R.reacoes, po = R.poste, ci = R.cisalhamento, an = R.ancoragem, ent = R.entrada, sec = d0.secao;
    var Lv = d0.L.valor, a = d0.a.valor, nU = d0.n.valor, Ft = d0.Ft.valor, T0 = d0.T0.valor, hP = d0.h.valor;
    var Ec = d0.E.valor, Acab = d0.A_cabo.valor, MBL = d0.MBL.valor, EA = d0.EA.valor, Q = R.trabalhador.Q.valor;
    var f_el = tr.f_el.valor, T_el = tr.T_el.valor, T = tr.T.valor, sen = tr.senTheta.valor, th = tr.theta.valor, f_g = tr.f_g.valor, dAbs = tr.dAbs.valor, f_tot = tr.f_tot.valor;
    var Fabs = Number(ent.F_abs) || 0, cosT = Math.cos(th * Math.PI / 180), tanT = Math.tan(th * Math.PI / 180), r_el = Math.sqrt(a * a + f_el * f_el);
    var H = rc.H.valor, V = rc.V.valor, Pp = rc.Pp.valor, M_k = rc.M_k.valor, N_k = rc.N_k.valor;
    var fy = po.fy.valor, gf = po.gf.valor, LF = po.LF.valor, resF = po.resF.valor, M_Sd = po.M_Sd.valor, N_Sd = po.N_Sd.valor, M_Rd = po.M_Rd.valor, N_Rd = po.N_Rd.valor;
    var lcLF = po.fatorCargaLabel || 'γf', lcRes = po.fatorResistLabel || '1/γa1';
    var Ne = po.Ne.valor, lam = po.lambda0.valor, chi = po.chi.valor, util = po.util.valor, Kfl = po.K.valor;
    var W = po.W.valor, Z = po.Z.valor, Asec = po.A.valor, Isec = po.I.valor;
    var V_Sd = ci.V_Sd.valor, V_Rd = ci.V_Rd.valor, T_ch = an.T_ch.valor, n_ch = an.n_ch.valor, d_ch = an.d_ch.valor, R_anc = an.R_anc.valor, ancMin = an.check_15kN.exigido;

    function pc(num, titulo, ref, linhas) {
      return '<div class="calc-step"><div class="cs-t"><b>' + num + '.</b> ' + esc(titulo) + (ref ? ' <span class="cs-ref">[' + esc(ref) + ']</span>' : '') + '</div>' +
        linhas.map(function (x) { return '<div class="cs-eq">' + x + '</div>'; }).join('') + '</div>';
    }
    function chi_txt() { return lam <= 1.5 ? 'χ = ' + f(0.658, 3) + '^(λ₀²)' : 'χ = ' + f(0.877, 3) + '/λ₀²'; }
    function secDeriv() {
      var g = sec.geom, t = g.t;
      if (sec.type === 'SHS') { var b = g.b, bi = b - 2 * t;
        return ['A = b² − (b−2t)² = ' + f(b, 1) + '² − (' + f(b, 1) + '−2·' + f(t, 2) + ')² = ' + f(b * b, 0) + ' − ' + f(bi * bi, 0) + ' = ' + f(sec._mm.A, 0) + ' mm² = <b>' + f(sec.A, 2) + ' cm²</b>',
          'I = (b⁴ − (b−2t)⁴)/12 = <b>' + f(sec.I, 1) + ' cm⁴</b>',
          'W = 2·I/b = <b>' + f(sec.W, 1) + ' cm³</b>',
          'Z = (b³ − (b−2t)³)/4 = <b>' + f(sec.Z, 1) + ' cm³</b>',
          'i = √(I/A) = √(' + f(sec.I, 1) + '/' + f(sec.A, 2) + ') = <b>' + f(sec.i, 2) + ' cm</b>']; }
      if (sec.type === 'RHS') { var bw = g.b, dp = g.d;
        return ['A = b·d − (b−2t)(d−2t) = <b>' + f(sec.A, 2) + ' cm²</b> (b=' + f(bw, 1) + ', d=' + f(dp, 1) + ', t=' + f(t, 2) + ' mm)',
          'I_x = (b·d³ − (b−2t)(d−2t)³)/12 = <b>' + f(sec.I, 1) + ' cm⁴</b>',
          'W = 2·I/d = <b>' + f(sec.W, 1) + ' cm³</b> ; Z = (b·d² − (b−2t)(d−2t)²)/4 = <b>' + f(sec.Z, 1) + ' cm³</b> ; i = <b>' + f(sec.i, 2) + ' cm</b>']; }
      return ['A = π/4·(D² − (D−2t)²) = <b>' + f(sec.A, 2) + ' cm²</b> (D=' + f(g.b, 1) + ', t=' + f(t, 2) + ' mm)',
        'I = π/64·(D⁴ − (D−2t)⁴) = <b>' + f(sec.I, 1) + ' cm⁴</b>',
        'W = 2·I/D = <b>' + f(sec.W, 1) + ' cm³</b> ; Z = (D³ − (D−2t)³)/6 = <b>' + f(sec.Z, 1) + ' cm³</b> ; i = <b>' + f(sec.i, 2) + ' cm</b>'];
    }
    var okmark = function (ok) { return ok ? ' ✔' : ' ✘'; };

    s += pc('3.1', L('Meio-vão', 'Half-span'), '', ['a = L / 2 = ' + f(Lv, 2) + ' / 2 = <b>' + f(a, 2) + ' m</b>']);
    s += pc('3.2', L('Rigidez axial do cabo', 'Cable axial stiffness'), '', ['EA = E · A / 1000 = ' + f(Ec, 0) + ' · ' + f(Acab, 0) + ' / 1000 = <b>' + f(EA, 0) + ' kN</b> <span class="cs-note">(E ' + L('em MPa', 'in MPa') + ', A ' + L('em mm²', 'in mm²') + ')</span>']);
    s += pc('3.3', L('Carga aplicada à linha', 'Load applied to the line'), 'NR-35 Anexo II 5.1.1(a)', ['Q = n · Fₜ = ' + f(nU, 0) + ' · ' + f(Ft, 2) + ' = <b>' + f(Q, 2) + ' kN</b>']);
    var nrRows = tr.historico.map(function (it) { return '<tr><td>' + it.i + '</td><td>' + f(it.f, 4) + '</td><td>' + f(it.g, 4) + '</td><td>' + f(it.fNext, 4) + '</td></tr>'; }).join('');
    s += pc('3.4', L('Flecha da linha — Newton-Raphson', 'Line sag — Newton-Raphson'), '', [
      'g(f) = Q·√(a²+f²)/(2f) − T₀ − (2·EA/L)·(√(a²+f²) − a) = 0',
      '<table class="nr-tab"><thead><tr><th>i</th><th>f_i (m)</th><th>g(f_i)</th><th>f_(i+1) (m)</th></tr></thead><tbody>' + nrRows + '</tbody></table>',
      L('Flecha convergida', 'Converged sag') + ': f = <b>' + f(f_el, 4) + ' m</b> (' + tr.iteracoes + ' ' + L('iterações', 'iterations') + ')']);
    s += pc('3.5', L('Tração elástica', 'Elastic tension'), '', ['T_el = Q·√(a²+f²)/(2f) = ' + f(Q, 2) + '·√(' + f(a, 2) + '²+' + f(f_el, 3) + '²)/(2·' + f(f_el, 3) + ') = ' + f(Q, 2) + '·' + f(r_el, 3) + '/' + f(2 * f_el, 3) + ' = <b>' + f(T_el, 2) + ' kN</b>']);
    if (tr.absAtivo) s += pc('3.6', L('Tração máxima (absorvedor de linha ativo)', 'Max tension (in-line absorber active)'), 'NBR 16325 / EN 795', ['T = ' + L('mín', 'min') + '(T_el ; F_abs) = ' + L('mín', 'min') + '(' + f(T_el, 2) + ' ; ' + f(Fabs, 2) + ') = <b>' + f(T, 2) + ' kN</b>']);
    else s += pc('3.6', L('Tração máxima na linha', 'Maximum line tension'), '', ['T = T_el = <b>' + f(T, 2) + ' kN</b> ' + L('(sem absorvedor de linha)', '(no in-line absorber)')]);
    s += pc('3.7', L('Ângulo da linha', 'Line angle'), '', ['senθ = Q/(2T) = ' + f(Q, 2) + '/(2·' + f(T, 2) + ') = <b>' + f(sen, 4) + '</b>', 'θ = arcsen(' + f(sen, 4) + ') = <b>' + f(th, 2) + '°</b>']);
    s += pc('3.8', L('Flecha sob carga', 'Sag under load'), '', ['f_g = a·tanθ = ' + f(a, 2) + '·tan(' + f(th, 2) + '°) = ' + f(a, 2) + '·' + f(tanT, 4) + ' = <b>' + f(f_g, 3) + ' m</b>']);
    s += pc('3.9', L('Flecha total', 'Total sag'), '', ['f_tot = f_g + Δ_abs = ' + f(f_g, 3) + ' + ' + f(dAbs, 2) + ' = <b>' + f(f_tot, 3) + ' m</b>']);
    s += pc('3.10', L('Zona Livre de Queda (ZLQ)', 'Required Fall Clearance (RFC)'), 'NBR 16325-2 C.2', [
      'ZLQ = H_ql + H_fr + ' + f(1.5, 1) + ' + ' + f(1.0, 1) + ' + f_tot = ' + f(zl.H_ql.valor, 2) + ' + ' + f(zl.H_fr.valor, 2) + ' + ' + f(1.5, 1) + ' + ' + f(1.0, 1) + ' + ' + f(f_tot, 3) + ' = <b>' + f(zl.ZLQ.valor, 3) + ' m</b>',
      L('Pé-direito disponível', 'Available headroom') + ' = ' + f(zl.peDireito.valor, 2) + ' m → ZLQ ' + (zl.check.ok ? '≤' : '>') + ' ' + f(zl.peDireito.valor, 2) + ' m' + okmark(zl.check.ok)]);
    s += pc('3.11', L('Fator de segurança do cabo', 'Cable safety factor'), pais.refLinha || '', [
      'FS_din = F_rup / T = ' + f(MBL, 1) + ' / ' + f(T, 2) + ' = <b>' + f(R.cabo.FS_din.valor, 2) + '</b> (≥ ' + f(pais.fsCaboMin, 0) + okmark(R.cabo.check_din.ok) + ')',
      'FS_serv = F_rup / T₀ = ' + f(MBL, 1) + ' / ' + f(T0, 2) + ' = <b>' + f(R.cabo.FS_trab.valor, 1) + '</b>']);
    if (Draw) s += '<div class="fig">' + Draw.elevacaoZLQ(R) + '</div>';
    s += pc('3.12', L('Reações no topo do poste', 'Post-top reactions'), '', [
      'H = T·cosθ = ' + f(T, 2) + '·cos(' + f(th, 2) + '°) = ' + f(T, 2) + '·' + f(cosT, 4) + ' = <b>' + f(H, 2) + ' kN</b>',
      'V = T·senθ = ' + f(T, 2) + '·' + f(sen, 4) + ' = <b>' + f(V, 2) + ' kN</b>']);
    s += pc('3.13', L('Peso próprio do poste', 'Post self-weight'), '', ['P_p = A·10⁻⁴·h·γ = ' + f(Asec, 2) + '·10⁻⁴·' + f(hP, 2) + '·77 = <b>' + f(Pp, 3) + ' kN</b> <span class="cs-note">(A ' + L('em cm²', 'in cm²') + ', ' + L('γ_aço', 'γ_steel') + ' = 77 kN/m³)</span>']);
    if (R.reacoes.vento) { var w = R.reacoes.vento; s += pc('3.14', L('Ação do vento no poste', 'Wind action on post'), w.ref, [
      'V_k = V₀·S1·S2·S3 = <b>' + f(w.Vk.valor, 1) + ' m/s</b>',
      'q = ' + f(0.613, 3) + '·V_k²/1000 = ' + f(0.613, 3) + '·' + f(w.Vk.valor, 1) + '²/1000 = <b>' + f(w.q.valor, 3) + ' kN/m²</b>',
      'F = Ca·q·(b·h) = <b>' + f(w.F.valor, 3) + ' kN</b> ; M_w = F·h/2 = <b>' + f(w.M.valor, 3) + ' kN·m</b>']); }
    s += pc('3.15', L('Momento na base', 'Base moment'), '', ['M_k = H·h' + (R.reacoes.vento ? ' + M_w' : '') + ' = ' + f(H, 2) + '·' + f(hP, 2) + (R.reacoes.vento ? ' + ' + f(R.reacoes.vento.M.valor, 3) : '') + ' = <b>' + f(M_k, 2) + ' kN·m</b>']);
    s += pc('3.16', L('Força axial na base', 'Axial force at base'), '', ['N_k = V + P_p = ' + f(V, 2) + ' + ' + f(Pp, 3) + ' = <b>' + f(N_k, 2) + ' kN</b>']);
    s += pc('3.17', L('Esforços de cálculo', 'Design forces'), R.poste.metodo + ' (' + lcLF + ')', [
      'M_Sd = ' + lcLF + '·M_k = ' + f(LF, 2) + '·' + f(M_k, 2) + ' = <b>' + f(M_Sd, 2) + ' kN·m</b>',
      'N_Sd = ' + lcLF + '·N_k = ' + f(LF, 2) + '·' + f(N_k, 2) + ' = <b>' + f(N_Sd, 2) + ' kN</b>',
      '<span class="cs-note">' + L('Método: ', 'Method: ') + esc(R.poste.metodo) + '</span>']);
    s += pc('3.18', L('Propriedades da seção (pela geometria)', 'Section properties (from geometry)') + ' — ' + R.poste.perfil, '', secDeriv());
    s += pc('3.19', L('Momento resistente', 'Moment resistance'), lcRes, ['M_Rd = ' + lcRes.replace(/ .*/, '') + '·Z·fy = ' + f(resF, 3) + '·' + f(Z, 1) + '·' + f(fy, 0) + '/1000 = <b>' + f(M_Rd, 2) + ' kN·m</b> <span class="cs-note">(Z ' + L('em cm³', 'in cm³') + ')</span>']);
    s += pc('3.20', L('Flambagem por flexão (compressão)', 'Flexural buckling (compression)'), R.poste.metodo, [
      'N_e = π²·E·I/(K·L)² = π²·20000·' + f(Isec, 1) + '/(' + f(Kfl, 1) + '·' + f(hP, 2) + '·100)² = <b>' + f(Ne, 1) + ' kN</b> <span class="cs-note">(E = 20000 kN/cm²)</span>',
      'λ₀ = √(A·fy/(10·N_e)) = √(' + f(Asec, 2) + '·' + f(fy, 0) + '/(10·' + f(Ne, 1) + ')) = <b>' + f(lam, 3) + '</b>',
      chi_txt() + ' = <b>' + f(chi, 3) + '</b>',
      'N_Rd = ' + f(resF, 3) + '·χ·A·fy/10 = ' + f(resF, 3) + '·' + f(chi, 3) + '·' + f(Asec, 2) + '·' + f(fy, 0) + '/10 = <b>' + f(N_Rd, 1) + ' kN</b>']);
    var caso02 = (N_Sd / N_Rd) >= 0.2;
    s += pc('3.21', L('Interação flexo-compressão', 'Beam-column interaction'), 'NBR 8800 / AISC H1', [
      'N_Sd/N_Rd = ' + f(N_Sd, 2) + '/' + f(N_Rd, 1) + ' = ' + f(N_Sd / N_Rd, 3) + ' ' + (caso02 ? '≥ ' + f(0.2, 2) : '< ' + f(0.2, 2)),
      caso02
        ? 'util = N_Sd/N_Rd + (8/9)·(M_Sd/M_Rd) = ' + f(N_Sd / N_Rd, 3) + ' + (8/9)·' + f(M_Sd / M_Rd, 3) + ' = <b>' + f(util, 3) + '</b>'
        : 'util = N_Sd/(2·N_Rd) + M_Sd/M_Rd = ' + f(N_Sd / (2 * N_Rd), 3) + ' + ' + f(M_Sd, 2) + '/' + f(M_Rd, 2) + ' = <b>' + f(util, 3) + '</b>',
      '(util ' + (util <= 1 ? '≤' : '>') + ' ' + f(1.0, 1) + okmark(po.check_util.ok) + ')']);
    if (Draw) s += '<div class="fig">' + Draw.esforcosPoste(R) + '</div>';
    s += pc('3.22', L('Força cortante no poste', 'Post shear force'), R.poste.metodo, [
      'V_Sd = ' + lcLF + '·H = ' + f(LF, 2) + '·' + f(H, 2) + ' = <b>' + f(V_Sd, 2) + ' kN</b>',
      'V_Rd = ' + f(resF, 3) + '·' + f(0.6, 1) + '·fy·A_w = <b>' + f(V_Rd, 1) + ' kN</b> (V_Sd ' + (ci.check.ok ? '≤' : '>') + ' V_Rd' + okmark(ci.check.ok) + ')']);
    s += pc('3.23', L('Tração de cálculo por chumbador', 'Design tension per anchor bolt'), '', ['T_ch = M_Sd/((n/2)·d) = ' + f(M_Sd, 2) + '/((' + f(n_ch, 0) + '/2)·' + f(d_ch, 2) + ') = ' + f(M_Sd, 2) + '/' + f((n_ch / 2) * d_ch, 3) + ' = <b>' + f(T_ch, 1) + ' kN</b> <span class="cs-note">' + L('verificar arrancamento no catálogo do fabricante', 'verify pull-out per manufacturer catalog') + '</span>']);
    s += pc('3.24', L('Resistência mínima da ancoragem', 'Minimum anchorage resistance'), pais.refAncoragem || '', ['R_anc = ' + L('máx', 'max') + '(' + f(ancMin, 1) + ' ; T) = ' + L('máx', 'max') + '(' + f(ancMin, 1) + ' ; ' + f(T, 2) + ') = <b>' + f(R_anc, 1) + ' kN</b> (≥ ' + f(ancMin, 1) + ' kN' + okmark(an.check_15kN.ok) + ')']);
    // passos avançados opcionais
    if (R.dinamica) s += pc('3.25', L('Verificação por energia (fator de queda)', 'Energy check (fall factor)'), 'NBR 16325 / EN 355', [
      L('Fator de queda', 'Fall factor') + ' = H_ql/L_tal = ' + f(zl.H_ql.valor, 2) + '/' + f(R.dinamica.compTalabarte.valor, 2) + ' = <b>' + f(R.dinamica.fatorQueda.valor, 2) + '</b> (' + esc(R.dinamica.classeFQ) + ')',
      L('Energia da queda livre', 'Free-fall energy') + ' = m·g·H_ql ≤ W_abs = Fₜ·H_fr → ' + f(R.dinamica.W_abs.valor, 2) + ' kJ' + okmark(R.dinamica.check_energia.ok)]);
    if (R.canto) s += pc('3.26', L('Poste de canto (mudança de direção)', 'Corner post (direction change)'), '', ['R = 2·T·sen(β/2) = 2·' + f(T, 2) + '·sen(' + f(R.canto.angulo.valor, 0) + '°/2) = <b>' + f(R.canto.R.valor, 2) + ' kN</b> <span class="cs-note">' + L('dimensionar o poste de canto para R', 'design the corner post for R') + '</span>']);

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
    cabecalho: cabecalho, assinatura: assinatura, emblema: emblema, rodapeDoc: rodapeDoc, setCtx: setCtx, L: L, U: U,
    _f: f, _U: U, _esc: esc, _dataBR: dataBR, _chkBadge: chkBadge, _L: L
  };
  root.LV = root.LV || {};
  root.LV.Report = Report;
  if (typeof module !== 'undefined' && module.exports) module.exports = Report;
})(typeof self !== 'undefined' ? self : (typeof globalThis !== 'undefined' ? globalThis : this));
