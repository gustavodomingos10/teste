/* ============================================================================
 *  LINHA DE VIDA · GD ENGENHARIA
 *  report.js — Geração de memoriais e do PRONTUÁRIO (dossiê técnico auditável)
 *
 *  Produz HTML pronto para impressão/PDF. A estrutura do memorial de cálculo
 *  segue a NR-35 Anexo II, item 5.1.1: (a) força de impacto; (b) esforços em
 *  cada parte do sistema; (c) zona livre de queda. Cada resultado traz a
 *  fórmula, os valores substituídos e a referência normativa — para resistir
 *  à auditoria de peritos e seguradoras.
 * ========================================================================== */
(function (root) {
  'use strict';

  function dep(n) { var x = root.LV && root.LV[n]; if (!x) throw new Error('report.js: módulo ' + n + ' não carregado'); return x; }

  // ---- Formatação ----
  function f(x, dec) {
    if (x == null || !isFinite(x)) return '—';
    dec = dec == null ? 2 : dec;
    return Number(x).toFixed(dec).replace('.', ',');
  }
  function v(o, dec) { return o ? f(o.valor, dec) + (o.unidade && o.unidade !== '—' ? ' ' + o.unidade : '') : '—'; }
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function dataBR(ts) { if (!ts) return '—'; var d = new Date(ts); return ('0' + d.getDate()).slice(-2) + '/' + ('0' + (d.getMonth() + 1)).slice(-2) + '/' + d.getFullYear(); }

  function chkBadge(ok) {
    return '<span class="badge ' + (ok ? 'ok' : 'fail') + '">' + (ok ? '✔ ATENDE' : '✘ NÃO ATENDE') + '</span>';
  }
  function linha(simb, desc, formula, valor, ref, ok) {
    return '<tr>' +
      '<td class="sym">' + esc(simb) + '</td>' +
      '<td>' + esc(desc) + (formula ? '<div class="fml">' + formula + '</div>' : '') + '</td>' +
      '<td class="val">' + valor + '</td>' +
      '<td class="ref">' + esc(ref || '') + (ok != null ? '<br>' + chkBadge(ok) : '') + '</td>' +
      '</tr>';
  }

  function cabecalho(cfg, titulo, subt, proj) {
    return '<div class="rep-head">' +
      '<div class="rh-emp">' + esc(cfg.empresa) + '</div>' +
      '<div class="rh-sub">' + esc(cfg.responsavel) + ' · ' + esc(cfg.crea) + ' · CNPJ ' + esc(cfg.cnpj) + ' · ' + esc(cfg.contato) + '</div>' +
      '<h1>' + esc(titulo) + '</h1>' + (subt ? '<div class="rh-norma">' + esc(subt) + '</div>' : '') +
      (proj ? '<div class="rh-proj">Obra: <b>' + esc((proj.entrada || {}).obra || proj.nome) + '</b> · Local: ' + esc((proj.entrada || {}).local || '—') + ' · Rev. ' + esc(proj.revisao || 'R00') + ' · Emissão: ' + dataBR(Date.now()) + '</div>' : '') +
      '</div>';
  }

  function assinatura(cfg, proj) {
    var resp = (proj && proj.entrada && proj.entrada.responsavel) || cfg.responsavel;
    return '<div class="assin">' +
      '<div class="loc">' + esc(cfg.cidade) + ', ' + dataBR(Date.now()) + '.</div>' +
      '<div class="linha-assin">__________________________________________</div>' +
      '<div>' + esc(resp) + '</div>' +
      '<div class="cargo">Engenheiro Civil — Responsável Técnico</div>' +
      '<div class="cargo">ART nº ____________________ · ' + esc(cfg.crea) + '</div>' +
      '</div>';
  }

  // =======================================================================
  //  MEMORIAL DE CÁLCULO  (NR-35 Anexo II 5.1.1)
  // =======================================================================
  function memorialCalculo(R, proj, cfg) {
    var Norms = dep('Norms').NORMS, Draw = root.LV.Draw;
    var e = R.entrada;
    var s = '<div class="report memorial-calc">';
    s += cabecalho(cfg, 'MEMORIAL DE CÁLCULO', 'Linha de Vida Horizontal (SPIQ) · NR-35 Anexo II item 5.1.1 · NBR 16325 · NBR 8800', proj);

    // Veredito
    s += '<div class="verdito ' + (R.veredito.aprovado ? 'ok' : 'fail') + '">VEREDITO DO SISTEMA: ' + R.veredito.texto + '</div>';

    // 1 Premissas
    s += '<h2>1 · Premissas e critérios normativos</h2><ul class="prem">' +
      '<li>' + Norms.NR35.itens.forca6kN + '</li>' +
      '<li>' + Norms.NR35.itens.a2_estrutura + '</li>' +
      '<li>' + Norms.NR18.itens.ancoragem15kN + '</li>' +
      '<li>' + Norms.NR18.itens.cabosAco + ' — adotado FS dinâmico ≥ 2 (carga de ruptura/tração máxima).</li>' +
      '<li>' + Norms.NBR8800.itens.ponderacao + '</li>' +
      '<li>' + Norms.NR35.itens.a2_dimensionamento + '</li></ul>';

    // 2 Dados de entrada
    s += '<h2>2 · Dados de entrada</h2><table class="tab"><tbody>';
    s += linha('L', 'Vão entre postes', '', v(R.dados.L), 'projeto');
    s += linha('—', 'Nº de vãos', '', v(R.dados.nVaos), 'projeto');
    s += linha('cabo', 'Cabo da linha de vida', '', esc(R.dados.cabo.material) + ' Ø' + R.dados.cabo.d + ' mm (' + esc(R.dados.cabo.construcao) + ')', 'catálogo');
    s += linha('E', 'Módulo de elasticidade do cabo', '', v(R.dados.E), 'catálogo');
    s += linha('A', 'Área metálica do cabo', '', v(R.dados.A_cabo), 'catálogo');
    s += linha('F_rup', 'Carga de ruptura do cabo (MBL)', '', v(R.dados.MBL), 'catálogo');
    s += linha('EA', 'Rigidez axial do cabo', 'EA = E·A/1000', v(R.dados.EA), '');
    s += linha('T₀', 'Pré-tensão de instalação', '', v(R.dados.T0), 'projeto');
    s += linha('n', 'Nº de usuários simultâneos', '', v(R.dados.n), 'projeto');
    s += linha('Fₜ', 'Força de impacto no trabalhador', '', v(R.dados.Ft), 'NR-35.6.7');
    s += linha('h', 'Altura do poste', '', v(R.dados.h), 'projeto');
    s += linha('perfil', 'Perfil do poste', '', esc(R.poste.perfil) + ' · aço ' + esc(R.poste.aco) + ' (fy=' + v(R.poste.fy) + ')', 'projeto');
    s += '</tbody></table>';

    // 3 (a) Força de impacto — NR-35 Anexo II 5.1.1 (a)
    s += '<h2>3 · (a) Força de impacto de retenção <span class="micro">— NR-35 Anexo II 5.1.1 (a)</span></h2><table class="tab"><tbody>';
    s += linha('Fₜ', 'Força transmitida ao trabalhador', 'limite normativo ≤ 6 kN', v(R.trabalhador.Ft), Norms.NR35.itens.forca6kN, R.trabalhador.check_Ft.ok);
    s += linha('Q', 'Carga aplicada à linha', 'Q = n · Fₜ', v(R.trabalhador.Q), 'considera impactos simultâneos');
    s += '</tbody></table>';

    // 4 (b) Esforços — tração/flecha
    s += '<h2>4 · (b) Tração e flecha da linha <span class="micro">— equilíbrio + compatibilidade elástica (Newton-Raphson)</span></h2>';
    s += '<p class="nota">Resolve-se <span class="mono">Q = 2·T·senθ</span> com <span class="mono">T = T₀ + (2·EA/L)·(√(a²+f²) − a)</span>, ' +
      'iterando a flecha f até convergir (a = L/2 = ' + v(R.dados.a) + '). Convergiu em ' + R.tracao.iteracoes + ' iterações.</p>';
    s += '<table class="tab"><tbody>';
    s += linha('f_el', 'Flecha elástica convergida', '', v(R.tracao.f_el), '');
    s += linha('T_el', 'Tração elástica', 'T_el = Q·√(a²+f²)/(2f)', v(R.tracao.T_el), '');
    s += linha('abs', 'Absorvedor de energia da linha', '', R.tracao.absAtivo ? 'ATIVO — limita T a ' + f(e.F_abs) + ' kN' : 'não atuante', 'NBR 16325');
    s += linha('T', 'TRAÇÃO MÁXIMA NA LINHA', '', '<b>' + v(R.tracao.T) + '</b>', 'esforço de projeto');
    s += linha('θ', 'Ângulo da linha com a horizontal', 'senθ = Q/(2T)', v(R.tracao.theta), '');
    s += linha('f_tot', 'FLECHA TOTAL (f + curso absorvedor)', '', '<b>' + v(R.tracao.f_tot) + '</b>', '');
    s += '</tbody></table>';

    // 5 (b) Reações e dimensionamento do poste
    s += '<h2>5 · (b) Esforços nos postes e dimensionamento <span class="micro">— NBR 8800</span></h2><table class="tab"><tbody>';
    s += linha('H', 'Reação horizontal no topo', 'H = T·cosθ', v(R.reacoes.H), '');
    s += linha('V', 'Reação vertical no topo', 'V = T·senθ', v(R.reacoes.V), '');
    s += linha('M_k', 'Momento na base (poste extremo)', 'M_k = H·h', v(R.reacoes.M_k), '');
    s += linha('M_Sd', 'Momento solicitante de cálculo', 'M_Sd = γf·M_k (γf=' + f(R.poste.gf.valor, 2) + ')', v(R.poste.M_Sd), Norms.NBR8800.itens.ponderacao);
    s += linha('M_Rd', 'Momento resistente', 'M_Rd = Z·fy/γa1', v(R.poste.M_Rd), 'γa1 = 1,10');
    s += linha('λ₀', 'Esbeltez reduzida (flambagem)', 'Ne = π²EI/(K·L)²; λ₀=√(A·fy/Ne); K=' + f(R.poste.K.valor, 1), v(R.poste.lambda0), Norms.NBR8800.itens.compressao);
    s += linha('χ', 'Coef. de redução à flambagem', '', v(R.poste.chi), '');
    s += linha('N_Rd', 'Força axial resistente (c/ flambagem)', 'N_Rd = χ·A·fy/γa1', v(R.poste.N_Rd), '');
    s += linha('util', 'UTILIZAÇÃO — flexo-compressão', 'interação ≤ 1,0', '<b>' + v(R.poste.util) + '</b>', Norms.NBR8800.itens.flexoComp, R.poste.check_util.ok);
    s += linha('V_Sd/V_Rd', 'Força cortante', 'V_Rd = 0,6·fy·Aw/γa1', v(R.cisalhamento.V_Sd) + ' / ' + v(R.cisalhamento.V_Rd), Norms.NBR8800.itens.cortante, R.cisalhamento.check.ok);
    s += linha('b/t', 'Esbeltez de parede (classe da seção)', '', v(R.secaoClasse.bt) + ' (lim ' + v(R.secaoClasse.limite) + ')', Norms.NBR8800.itens.local, R.secaoClasse.compacta);
    s += '</tbody></table>';
    if (Draw) s += '<div class="fig">' + Draw.esforcosPoste(R) + '</div>';

    // 6 (b) Ancoragem
    s += '<h2>6 · (b) Placa de base e ancoragem</h2><table class="tab"><tbody>';
    s += linha('T_ch', 'Tração de cálculo por chumbador', 'T_ch = M_Sd/((n/2)·d)', v(R.ancoragem.T_ch), 'verificar arrancamento (fabricante)');
    s += linha('R_anc', 'Resistência mínima do dispositivo', 'R_anc = máx(15; T)', v(R.ancoragem.R_anc), Norms.NR18.itens.ancoragem15kN, R.ancoragem.check_15kN.ok);
    s += linha('σ_c', 'Compressão no concreto sob a placa', 'σ ≤ 0,85·fcd', v(R.placaBase.sigma_c) + ' (adm ' + v(R.placaBase.sigma_adm) + ')', Norms.NBR6118.itens.contato, R.placaBase.check_contato.ok);
    s += linha('t_placa', 'Espessura mínima estimada da placa', '', v(R.placaBase.t_min), 'detalhar em projeto');
    s += '</tbody></table>';
    s += '<p class="nota">' + esc(R.ancoragem.nota) + '</p>';

    // 7 Verificação do cabo
    s += '<h2>7 · Verificação do cabo</h2><table class="tab"><tbody>';
    s += linha('FS_din', 'Fator de segurança dinâmico', 'FS = F_rup/T ≥ 2', v(R.cabo.FS_din), Norms.NBR16325_2.itens.forca, R.cabo.check_din.ok);
    s += linha('FS_trab', 'FS em serviço', 'FS = F_rup/T₀ ≥ 5', v(R.cabo.FS_trab), Norms.NR18.itens.cabosAco, R.cabo.check_trab.ok);
    s += '</tbody></table>';

    // 8 (c) ZLQ
    s += '<h2>8 · (c) Zona Livre de Queda — ZLQ <span class="micro">— NBR 16325-2 Anexo C.2 (dispositivo tipo C)</span></h2>';
    s += '<table class="tab"><tbody>';
    s += linha('H_ql', 'Queda livre', '', v(R.zlq.H_ql), 'projeto/AR');
    s += linha('H_fr', 'Frenagem do absorvedor pessoal', '', v(R.zlq.H_fr), '');
    s += linha('—', 'Engate do cinturão aos pés (norma)', 'fixo = 1,5 m', v(R.zlq.C_pes), 'NBR 16325-2 C.2');
    s += linha('—', 'Distância de segurança (norma)', 'fixo = 1,0 m', v(R.zlq.C_seg), 'NBR 16325-2 C.2');
    s += linha('f', 'Flecha (deflexão) da linha', '', v(R.zlq.f_tot), '');
    s += linha('ZLQ', 'ZONA LIVRE DE QUEDA', 'ZLQ = H_ql + H_fr + 1,5 + 1,0 + f', '<b>' + v(R.zlq.ZLQ) + '</b>', Norms.NBR16325_2.itens.zlq, R.zlq.check.ok);
    s += linha('—', 'Pé-direito livre disponível', '', v(R.zlq.peDireito), 'projeto', R.zlq.check.ok);
    s += '</tbody></table>';
    if (Draw) s += '<div class="fig">' + Draw.elevacaoZLQ(R) + '</div>';

    // 9 Resultados consolidados
    s += '<h2>9 · Resultados consolidados e indicadores</h2><table class="tab indic"><tbody>';
    R.veredito.indicadores.forEach(function (ind) {
      s += '<tr><td>' + esc(ind.nome) + '</td><td class="val">' + chkBadge(ind.ok) + '</td></tr>';
    });
    s += '</tbody></table>';
    if (R.avisos && R.avisos.length) {
      s += '<div class="avisos"><b>Observações automáticas:</b><ul>' + R.avisos.map(function (a) { return '<li>' + esc(a) + '</li>'; }).join('') + '</ul></div>';
    }

    // 10 Conclusão
    s += '<h2>10 · Conclusão</h2><p class="conclusao">' +
      'Com os dados adotados, o sistema de linha de vida horizontal resulta <b>' + R.veredito.texto + '</b>. ' +
      (R.veredito.aprovado
        ? 'Foram atendidos os critérios da NR-35 (força ≤ 6 kN e ZLQ compatível), da NR-18 (ancoragem ≥ 15 kN e cabo) e da NBR 8800 (postes). '
        : 'Um ou mais critérios não foram atendidos — rever vão, bitola do cabo, absorvedor ou perfil do poste. ') +
      'Os resultados devem ser conferidos e validados pelo responsável técnico antes da emissão, com a respectiva ART.</p>';
    s += assinatura(cfg, proj);
    s += '</div>';
    return s;
  }

  // =======================================================================
  //  MEMORIAL DESCRITIVO
  // =======================================================================
  function memorialDescritivo(R, proj, cfg) {
    var Norms = dep('Norms').NORMS, Draw = root.LV.Draw;
    var e = R.entrada;
    var inox = /Inox/i.test(R.dados.cabo.material);
    var s = '<div class="report memorial-desc">';
    s += cabecalho(cfg, 'MEMORIAL DESCRITIVO', 'Linha de Vida Horizontal — Sistema de Proteção Individual contra Quedas (SPIQ)', proj);
    s += '<h2>1 · Objeto</h2><p>O presente memorial descreve o projeto da Linha de Vida Horizontal a ser instalada na obra <b>' +
      esc(e.obra || proj.nome) + '</b>, situada em ' + esc(e.local || '—') + '. O sistema integra as medidas de proteção contra quedas de altura (SPIQ), permitindo o deslocamento seguro de trabalhadores.</p>';
    s += '<h2>2 · Normas aplicáveis</h2><p>NR-35 (Trabalho em Altura) e seu Anexo II (Sistemas de Ancoragem); NR-18 (item 18.12.12); ABNT NBR 16325-1 e 16325-2 (dispositivos de ancoragem — sistema do <b>tipo C</b>, linha horizontal flexível); ABNT NBR 8800 (postes); NBR 6120 (ações) e NBR 6118 (concreto), no que couber.</p>';
    s += '<h2>3 · Descrição do local e cenário</h2><p>Cenário: <b>' + esc(e.cenario || '—') + '</b>. Substrato a proteger: <b>' + esc(e.substrato || '—') + '</b>. ' +
      'Ambiente classificado como <b>' + esc(e.ambiente || '—') + '</b>, parâmetro que orienta a seleção do material quanto à corrosão (ISO 12944-2).</p>';
    s += '<h2>4 · Descrição do sistema proposto</h2><p>Sistema composto por cabo de aço tensionado entre <b>' + (Math.round(R.dados.nVaos.valor) + 1) +
      ' postes</b> de ancoragem, em <b>' + Math.round(R.dados.nVaos.valor) + ' vão(s)</b> de ' + f(R.dados.L.valor) + ' m cada, com postes de ' + f(R.dados.h.valor) +
      ' m de altura. Cabo Ø' + R.dados.cabo.d + ' mm (' + esc(R.dados.cabo.material) + '), pré-tensão de ' + f(R.dados.T0.valor) +
      ' kN. O trabalhador conecta-se por trava-quedas deslizante ligado ao cinturão tipo paraquedista por talabarte com absorvedor de energia (NR-35.6.9.1.1).</p>';
    if (Draw) s += '<div class="fig">' + Draw.iso3D(R) + '</div>' + '<div class="fig">' + Draw.planta(R) + '</div>';
    s += '<h2>5 · Materiais</h2><p>Componentes em <b>' + (inox ? 'aço inoxidável AISI 316' : 'aço galvanizado a fogo') + '</b>' +
      (inox ? ', recomendado para ambientes mais agressivos (C4–C5).' : ', adequado a ambientes abrigados (C2–C3), com inspeção periódica do revestimento.') +
      ' A especificação completa consta da seção de materiais do prontuário.</p>';
    s += '<h2>6 · Segurança e utilização</h2><p>O uso exige EPI completos (cinturão paraquedista, talabarte com absorvedor, trava-quedas, capacete com jugular e conectores), todos com CA válido, e capacitação conforme a NR-35.4 (mínimo 8 h). O sistema deve passar por inspeção inicial e periódica (≤ 12 meses) — NR-35.6.6.</p>';
    s += '<p class="nota">A liberação para uso fica condicionada à correta instalação por equipe capacitada e à realização dos ensaios de carga das ancoragens (NR-35 Anexo II / NR-18 18.12.12.2.1).</p>';
    s += assinatura(cfg, proj);
    s += '</div>';
    return s;
  }

  var Report = {
    memorialCalculo: memorialCalculo, memorialDescritivo: memorialDescritivo,
    cabecalho: cabecalho, assinatura: assinatura, _f: f, _v: v, _esc: esc, _dataBR: dataBR, _chkBadge: chkBadge
  };
  root.LV = root.LV || {};
  root.LV.Report = Report;
  if (typeof module !== 'undefined' && module.exports) module.exports = Report;
})(typeof self !== 'undefined' ? self : (typeof globalThis !== 'undefined' ? globalThis : this));
