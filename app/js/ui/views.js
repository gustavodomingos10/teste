/* ============================================================================
 *  LINHA DE VIDA · GD ENGENHARIA
 *  views.js — Telas de conteúdo (painel, projeto, resultados, prontuário, …)
 * ========================================================================== */
(function (root) {
  'use strict';
  var LV = root.LV = root.LV || {};
  var h, qs, clear, toast, confirmar;
  function H() { var U = LV.UI; h = U.h; qs = U.qs; clear = U.clear; toast = U.toast; confirmar = U.confirmar; }

  function projAtual() {
    var id = LV.state.projetoId;
    if (id) { var p = LV.Storage.obter(id); if (p) return p; }
    var lista = LV.Storage.listar();
    if (lista.length) { LV.state.projetoId = lista[0].id; return LV.Storage.obter(lista[0].id); }
    var novo = LV.Storage.salvar(LV.Storage.novoProjeto('Projeto 1'));
    LV.state.projetoId = novo.id; return novo;
  }
  function calcular(proj) {
    try {
      var val = LV.Validate.validar(proj.entrada);
      var R = LV.Engine.calcular(montarEntrada(proj.entrada));
      return { R: R, val: val };
    } catch (e) { return { erro: e.message }; }
  }
  // Converte a entrada do formulário (strings) em números para o motor
  function montarEntrada(e) {
    var o = {};
    Object.keys(e).forEach(function (k) { o[k] = e[k]; });
    ['L', 'nVaos', 'h', 'peDireito', 'caboDiametro', 'T0', 'nUsuarios', 'Ft', 'H_ql', 'H_fr', 'F_abs', 'cursoAbsorvedor', 'gamaF', 'nChumbadores', 'bracoChumbadores', 'fck', 'ladoPlaca']
      .forEach(function (k) { if (e[k] !== undefined && e[k] !== '') o[k] = Number(e[k]); });
    o.posteperfil = e.posteperfil; o.caboMaterial = e.caboMaterial; o.temAbsorvedor = e.temAbsorvedor; o.acoNome = e.acoNome;
    // País selecionado globalmente (define normas, unidades e idioma dos resultados)
    o.pais = (LV.Paises ? (LV.Paises.getSelecionado() || 'BR') : 'BR');
    return o;
  }
  function L(pt, en) { return (LV.I18n && LV.I18n.getLang() === 'en') ? en : pt; }

  // ======================= PAINEL =======================
  function painel(alvo) {
    H();
    var lista = LV.Storage.listar();
    alvo.appendChild(tituloPagina(L('Painel de projetos', 'Project dashboard'), L('Gerencie os projetos de linha de vida.', 'Manage your lifeline projects.')));
    alvo.appendChild(h('div', { class: 'toolbar' }, [
      h('button', { class: 'btn primary', text: L('+ Novo projeto', '+ New project'), onclick: function () {
        var p = LV.Storage.salvar(LV.Storage.novoProjeto('Projeto ' + (lista.length + 1)));
        LV.state.projetoId = p.id; LV.UI.irPara('projeto');
      } }),
      h('button', { class: 'btn ghost', text: L('⭳ Backup (exportar)', '⭳ Backup (export)'), onclick: function () { baixar('linha-de-vida-backup.json', LV.Storage.exportarTudo()); } }),
      h('label', { class: 'btn ghost arquivo' }, [L('Restaurar backup', 'Restore backup'), h('input', { type: 'file', accept: '.json', style: 'display:none', onchange: function (ev) { importar(ev.target.files[0]); } })])
    ]));
    if (!lista.length) { alvo.appendChild(h('div', { class: 'vazio', text: 'Nenhum projeto ainda. Crie o primeiro.' })); return; }
    var grid = h('div', { class: 'cards' });
    lista.forEach(function (p) {
      var full = LV.Storage.obter(p.id);
      var c = calcular(full);
      var ver = (c.R) ? c.R.veredito : null;
      grid.appendChild(h('div', { class: 'card proj' }, [
        h('div', { class: 'card-top' }, [
          h('b', { text: p.nome }),
          ver ? h('span', { class: 'badge ' + (ver.aprovado ? 'ok' : 'fail'), text: ver.aprovado ? 'APROVADO' : 'REVISAR' }) : null
        ]),
        h('div', { class: 'card-sub', text: (p.obra || '—') + ' · ' + p.revisao }),
        h('div', { class: 'card-sub small', text: 'Atualizado ' + new Date(p.atualizadoEm).toLocaleDateString('pt-BR') }),
        h('div', { class: 'card-acoes' }, [
          h('button', { class: 'btn mini', text: 'Abrir', onclick: function () { LV.state.projetoId = p.id; LV.UI.irPara('projeto'); } }),
          h('button', { class: 'btn mini ghost', text: 'Duplicar', onclick: function () { LV.Storage.duplicar(p.id); toast('Projeto duplicado.', 'ok'); LV.UI.renderRota(); } }),
          podeEditar() ? h('button', { class: 'btn mini danger', text: 'Excluir', onclick: function () { if (confirmar('Excluir «' + p.nome + '»?')) { LV.Storage.remover(p.id); if (LV.state.projetoId === p.id) LV.state.projetoId = null; LV.UI.renderRota(); } } }) : null
        ])
      ]));
    });
    alvo.appendChild(grid);
  }

  // ======================= PROJETO (FORMULÁRIO) =======================
  function projeto(alvo) {
    H();
    if (!podeEditar()) { alvo.appendChild(avisoPermissao()); return; }
    var proj = projAtual(); var e = proj.entrada;
    alvo.appendChild(tituloPagina('Dados do projeto', 'Preencha os campos. O cálculo é automático na aba Resultados.'));

    function set(k, val) { e[k] = val; }
    function salvar() { LV.Storage.salvar(proj); }

    // seção 1
    var s1 = secaoForm('1 · Identificação', [
      campoTexto('Obra / Cliente', e.obra, function (v) { set('obra', v); }),
      campoTexto('Local', e.local, function (v) { set('local', v); }),
      campoTexto('Responsável técnico (Eng.)', e.responsavel, function (v) { set('responsavel', v); }),
      campoTexto('Data', e.data, function (v) { set('data', v); })
    ]);
    // seção 2 — cenário e substrato (dependente)
    var selSub;
    function popularSub(cenario) {
      var lista = LV.Data.SCENARIOS[cenario] || [];
      clear(selSub);
      lista.forEach(function (o) { selSub.appendChild(h('option', { value: o, text: o, selected: o === e.substrato ? 'true' : null })); });
      e.substrato = selSub.value;
    }
    var selCen = h('select', { class: 'inp', onchange: function () { set('cenario', selCen.value); popularSub(selCen.value); } });
    ['Cobertura', 'Estrutura', 'Solo'].forEach(function (c) { selCen.appendChild(h('option', { value: c, text: c, selected: c === (e.cenario || 'Cobertura') ? 'true' : null })); });
    e.cenario = e.cenario || 'Cobertura';
    selSub = h('select', { class: 'inp', onchange: function () { set('substrato', selSub.value); } });
    popularSub(e.cenario);
    var selAmb = h('select', { class: 'inp', onchange: function () { set('ambiente', selAmb.value); } });
    LV.Data.CORROSION.forEach(function (c) { selAmb.appendChild(h('option', { value: c.nome, text: c.nome, selected: c.nome === e.ambiente ? 'true' : null })); });
    e.ambiente = e.ambiente || LV.Data.CORROSION[3].nome;
    var s2 = secaoForm('2 · Cenário e substrato', [
      campoWrap('Cenário', selCen), campoWrap('Substrato / cobertura', selSub), campoWrap('Ambiente (corrosividade)', selAmb)
    ]);

    // seção 3 — geometria
    var s3 = secaoForm('3 · Geometria do sistema', [
      campoNum('Vão entre postes L', e.L, 'm', function (v) { set('L', v); }, 10),
      campoNum('Nº de vãos', e.nVaos, 'un', function (v) { set('nVaos', v); }, 3),
      campoNum('Altura do poste h', e.h, 'm', function (v) { set('h', v); }, 1.2),
      campoNum('Pé-direito livre disponível', e.peDireito, 'm', function (v) { set('peDireito', v); }, 8.5)
    ]);
    // seção 4 — cabo
    var selMat = h('select', { class: 'inp', onchange: function () { set('caboMaterial', selMat.value); } });
    LV.Data.MATERIALS.forEach(function (m) { selMat.appendChild(h('option', { value: m, text: m, selected: m === e.caboMaterial ? 'true' : null })); });
    e.caboMaterial = e.caboMaterial || LV.Data.MATERIALS[0];
    var selDia = h('select', { class: 'inp', onchange: function () { set('caboDiametro', Number(selDia.value)); } });
    LV.Data.DIAMETERS.forEach(function (d) { selDia.appendChild(h('option', { value: d, text: d + ' mm', selected: Number(d) === Number(e.caboDiametro) ? 'true' : null })); });
    e.caboDiametro = e.caboDiametro || 10;
    var s4 = secaoForm('4 · Cabo da linha de vida', [
      campoWrap('Material do cabo', selMat), campoWrap('Diâmetro Ø', selDia),
      campoNum('Pré-tensão de instalação T₀', e.T0, 'kN', function (v) { set('T0', v); }, 1)
    ]);
    // seção 5 — usuários e EPI
    var selTal = h('select', { class: 'inp', onchange: function () { set('talabarte', selTal.value); var l = LV.Data.LANYARDS.filter(function (x) { return x.nome === selTal.value; })[0]; if (l) { e.H_ql = l.H_ql; e.H_fr = l.H_fr; salvar(); LV.UI.renderRota(); } } });
    LV.Data.LANYARDS.forEach(function (l) { selTal.appendChild(h('option', { value: l.nome, text: l.nome, selected: l.nome === e.talabarte ? 'true' : null })); });
    e.talabarte = e.talabarte || LV.Data.LANYARDS[0].nome;
    var s5 = secaoForm('5 · Usuários e EPI', [
      campoNum('Nº de usuários simultâneos n', e.nUsuarios, 'un', function (v) { set('nUsuarios', v); }, 1),
      campoNum('Força de impacto no trabalhador Fₜ', e.Ft, 'kN', function (v) { set('Ft', v); }, 6),
      campoWrap('Tipo de talabarte', selTal),
      campoNum('Queda livre H_ql', e.H_ql, 'm', function (v) { set('H_ql', v); }, 1.5),
      campoNum('Frenagem do absorvedor H_fr', e.H_fr, 'm', function (v) { set('H_fr', v); }, 1.75)
    ]);
    // seção 6 — absorvedor de linha
    var selAbs = h('select', { class: 'inp', onchange: function () { set('temAbsorvedor', selAbs.value); } });
    ['Sim', 'Não'].forEach(function (o) { selAbs.appendChild(h('option', { value: o, text: o, selected: o === (e.temAbsorvedor || 'Sim') ? 'true' : null })); });
    e.temAbsorvedor = e.temAbsorvedor || 'Sim';
    var s6 = secaoForm('6 · Absorvedor de energia da linha (opcional)', [
      campoWrap('Possui absorvedor de linha?', selAbs),
      campoNum('Força de atuação F_abs', e.F_abs, 'kN', function (v) { set('F_abs', v); }, 12),
      campoNum('Curso do absorvedor de linha', e.cursoAbsorvedor, 'm', function (v) { set('cursoAbsorvedor', v); }, 0.5)
    ]);
    // seção 7 — poste
    var selPerf = h('select', { class: 'inp', onchange: function () { set('posteperfil', selPerf.value); } });
    LV.Data.PROFILES.forEach(function (p) { selPerf.appendChild(h('option', { value: p.nome, text: p.nome, selected: p.nome === e.posteperfil ? 'true' : null })); });
    e.posteperfil = e.posteperfil || 'SHS 100x100x6,3';
    var selAco = h('select', { class: 'inp', onchange: function () { set('acoNome', selAco.value); } });
    LV.Data.STEELS.forEach(function (a) { selAco.appendChild(h('option', { value: a.nome, text: a.nome + ' (fy=' + a.fy + ')', selected: a.nome === e.acoNome ? 'true' : null })); });
    e.acoNome = e.acoNome || 'ASTM A572 Gr.50';
    var s7 = secaoForm('7 · Poste de ancoragem', [
      campoWrap('Perfil do poste', selPerf), campoWrap('Aço estrutural', selAco),
      campoNum('Coef. ponderação ações γf', e.gamaF, '—', function (v) { set('gamaF', v); }, 1.4),
      campoNum('Nº de chumbadores', e.nChumbadores, 'un', function (v) { set('nChumbadores', v); }, 4),
      campoNum('Braço dos chumbadores d', e.bracoChumbadores, 'm', function (v) { set('bracoChumbadores', v); }, 0.18)
    ]);

    // seção 8 — avançado / internacional (opcional)
    var s8 = secaoForm(L('8 · Avançado / Internacional (opcional)', '8 · Advanced / International (optional)'), [
      campoNum(L('Velocidade básica do vento V0', 'Basic wind speed V0'), e.ventoV0, 'm/s', function (v) { set('ventoV0', v); }, 0),
      campoNum(L('Fator topográfico S2', 'Terrain factor S2'), e.ventoS2, '—', function (v) { set('ventoS2', v); }, 1),
      campoNum(L('Coef. de arrasto Ca', 'Drag coefficient Ca'), e.ventoCa, '—', function (v) { set('ventoCa', v); }, 2),
      campoNum(L('Variação de temperatura ΔT', 'Temperature variation ΔT'), e.deltaTemp, '°C', function (v) { set('deltaTemp', v); }, 0),
      campoNum(L('Ângulo de mudança de direção β (poste de canto)', 'Direction change angle β (corner post)'), e.anguloMudanca, '°', function (v) { set('anguloMudanca', v); }, 0),
      campoNum(L('Comprimento do talabarte', 'Lanyard length'), e.compTalabarte, 'm', function (v) { set('compTalabarte', v); }, 1.5),
      campoNum('fck ' + L('do concreto', 'concrete'), e.fck, 'MPa', function (v) { set('fck', v); }, 25)
    ]);

    var nomeProj = h('input', { class: 'inp inp-nome', value: proj.nome, onchange: function () { proj.nome = nomeProj.value; salvar(); } });
    var paisAtual = LV.Paises ? LV.Paises.get(LV.Paises.getSelecionado()) : null;
    alvo.appendChild(h('div', { class: 'form-topo' }, [campoWrap(L('Nome do projeto', 'Project name'), nomeProj),
      paisAtual ? h('div', { class: 'pais-tag', text: paisAtual.bandeira + ' ' + paisAtual.nome + ' · ' + (paisAtual.unidades === 'imperial' ? 'Imperial' : 'SI') }) : null,
      h('button', { class: 'btn primary', text: L('Salvar e calcular', 'Save & calculate'), onclick: function () { salvar(); toast(L('Projeto salvo.', 'Project saved.'), 'ok'); LV.UI.irPara('resultados'); } })]));
    [s1, s2, s3, s4, s5, s6, s7, s8].forEach(function (x) { alvo.appendChild(x); });
    // auto-salva ao sair de qualquer campo
    alvo.addEventListener('change', salvar);
  }

  // ======================= RESULTADOS =======================
  function resultados(alvo) {
    H();
    var proj = projAtual();
    var c = calcular(proj);
    alvo.appendChild(tituloPagina(L('Resultados', 'Results') + ' — ' + proj.nome, L('Memória de cálculo automática (NR-35 Anexo II 5.1.1 / ANSI Z359.6).', 'Automatic calculation report (NR-35 Annex II 5.1.1 / ANSI Z359.6).')));
    if (c.erro) { alvo.appendChild(h('div', { class: 'erro-fatal', text: L('Não foi possível calcular: ', 'Could not calculate: ') + c.erro })); return; }
    var R = c.R;
    LV.Audit.registrar('calculo', { projeto: proj.nome, veredito: R.veredito.texto }).catch(function(){});

    // veredito
    alvo.appendChild(h('div', { class: 'verdito-banner ' + (R.veredito.aprovado ? 'ok' : 'fail') }, [
      h('span', { class: 'vb-txt', text: L('VEREDITO', 'VERDICT') + ': ' + L(R.veredito.texto, R.veredito.aprovado ? 'APPROVED' : 'FAILED — review data') }),
      h('div', { class: 'vb-ind' }, R.veredito.indicadores.map(function (i) { return h('span', { class: 'ind ' + (i.ok ? 'ok' : 'fail'), text: (i.ok ? '✔ ' : '✘ ') + L(i.nome, i.nomeEn || i.nome) }); }))
    ]));
    // avisos de validação
    if (c.val && (c.val.avisos.length || c.val.erros.length)) {
      var box = h('div', { class: 'avisos-box' });
      c.val.erros.forEach(function (m) { box.appendChild(h('div', { class: 'av erro', text: '⛔ ' + m })); });
      c.val.avisos.forEach(function (m) { box.appendChild(h('div', { class: 'av aviso', text: '⚠ ' + m })); });
      alvo.appendChild(box);
    }
    // figuras
    alvo.appendChild(h('div', { class: 'figuras-grid', html:
      '<div class="fig">' + LV.Draw.iso3D(R) + '</div>' +
      '<div class="fig">' + LV.Draw.elevacaoZLQ(R) + '</div>' +
      '<div class="fig">' + LV.Draw.esforcosPoste(R) + '</div>' +
      '<div class="fig">' + LV.Draw.planta(R) + '</div>'
    }));
    // botões
    alvo.appendChild(h('div', { class: 'toolbar' }, [
      h('button', { class: 'btn primary', text: L('⎙ Imprimir memorial de cálculo', '⎙ Print calculation report'), onclick: function () { imprimir(LV.Report.memorialCalculo(R, proj, LV.Storage.getConfig()), 'Calc'); } }),
      h('button', { class: 'btn ghost', text: L('⎙ Memorial descritivo', '⎙ Descriptive report'), onclick: function () { imprimir(LV.Report.memorialDescritivo(R, proj, LV.Storage.getConfig()), 'Desc'); } }),
      h('button', { class: 'btn ghost', text: L('Editar dados', 'Edit data'), onclick: function () { LV.UI.irPara('projeto'); } })
    ]));
    // memorial inline
    alvo.appendChild(h('div', { class: 'doc-inline', html: LV.Report.memorialCalculo(R, proj, LV.Storage.getConfig()) }));
  }

  // ======================= PRONTUÁRIO =======================
  function prontuario(alvo) {
    H();
    var proj = projAtual(); var c = calcular(proj);
    alvo.appendChild(tituloPagina(L('Prontuário do sistema', 'System technical file'), L('Dossiê técnico completo (19 seções) para auditoria.', 'Complete technical file (19 sections) for audit.')));
    if (c.erro) { alvo.appendChild(h('div', { class: 'erro-fatal', text: L('Não foi possível gerar: ', 'Could not generate: ') + c.erro })); return; }
    var R = c.R; var cfg = LV.Storage.getConfig();
    var html = LV.Prontuario.gerar(R, proj, cfg);
    LV.Audit.registrar('prontuario', { projeto: proj.nome, veredito: R.veredito.texto }).catch(function(){});
    alvo.appendChild(h('div', { class: 'toolbar' }, [
      h('button', { class: 'btn primary', text: L('⎙ Imprimir / Salvar PDF', '⎙ Print / Save PDF'), onclick: function () { imprimir(html, 'TechnicalFile'); } }),
      h('button', { class: 'btn ghost', text: L('Registros', 'Records'), onclick: function () { LV.UI.irPara('registros'); } })
    ]));
    alvo.appendChild(h('div', { class: 'doc-inline', html: html }));
  }

  // ======================= CONFORMIDADE (gestão de ativos) =======================
  function conformidade(alvo) {
    H();
    var DIA = 864e5, hoje = Date.now();
    alvo.appendChild(tituloPagina(L('Conformidade dos ativos', 'Asset compliance'),
      L('Status de inspeção e vencimentos de todos os sistemas (NR-35.6.6 / OSHA).', 'Inspection status and due dates of all systems (NR-35.6.6 / OSHA).')));
    var lista = LV.Storage.listar();
    var cont = { ok: 0, avencer: 0, vencida: 0, pendente: 0 };
    var linhas = lista.map(function (p) {
      var full = LV.Storage.obter(p.id);
      var insp = (full.registros && full.registros.inspecoes) || [];
      var ultima = insp.length ? insp[insp.length - 1] : null;
      var status, proxima = null, classe;
      if (!ultima) { status = L('sem inspeção', 'no inspection'); classe = 'pendente'; cont.pendente++; }
      else {
        proxima = ultima.criadoEm + 365 * DIA;
        var dias = Math.round((proxima - hoje) / DIA);
        if (dias < 0) { status = L('VENCIDA', 'OVERDUE') + ' (' + (-dias) + 'd)'; classe = 'vencida'; cont.vencida++; }
        else if (dias <= 60) { status = L('a vencer', 'due soon') + ' (' + dias + 'd)'; classe = 'avencer'; cont.avencer++; }
        else { status = L('em dia', 'compliant') + ' (' + dias + 'd)'; classe = 'ok'; cont.ok++; }
      }
      return { p: p, ultima: ultima, proxima: proxima, status: status, classe: classe };
    });
    // cartões de resumo
    alvo.appendChild(h('div', { class: 'conf-resumo' }, [
      cardConf(L('Em dia', 'Compliant'), cont.ok, 'ok'),
      cardConf(L('A vencer', 'Due soon'), cont.avencer, 'avencer'),
      cardConf(L('Vencidas', 'Overdue'), cont.vencida, 'vencida'),
      cardConf(L('Sem inspeção', 'No inspection'), cont.pendente, 'pendente')
    ]));
    if (!lista.length) { alvo.appendChild(h('div', { class: 'vazio', text: L('Nenhum sistema cadastrado.', 'No systems registered.') })); return; }
    var tab = h('table', { class: 'tab' });
    tab.appendChild(h('thead', {}, [h('tr', {}, [L('Sistema / Obra', 'System / Project'), L('Última inspeção', 'Last inspection'), L('Próxima', 'Next due'), 'Status'].map(function (t) { return h('th', { text: t }); }))]));
    var tb = h('tbody');
    linhas.forEach(function (x) {
      tb.appendChild(h('tr', {}, [
        h('td', {}, [h('b', { text: x.p.nome }), h('div', { class: 'small muted', text: x.p.obra || '' })]),
        h('td', { text: x.ultima ? new Date(x.ultima.criadoEm).toLocaleDateString() : '—' }),
        h('td', { text: x.proxima ? new Date(x.proxima).toLocaleDateString() : '—' }),
        h('td', {}, [h('span', { class: 'conf-badge ' + x.classe, text: x.status })])
      ]));
    });
    tab.appendChild(tb);
    alvo.appendChild(tab);
  }
  function cardConf(rotulo, n, classe) {
    return h('div', { class: 'conf-card ' + classe }, [h('div', { class: 'cc-num', text: String(n) }), h('div', { class: 'cc-rot', text: rotulo })]);
  }

  // ======================= REGISTROS =======================
  function registros(alvo) {
    H();
    var proj = projAtual();
    alvo.appendChild(tituloPagina('Registros do prontuário', 'Inspeções, ensaios, APR, capacitação e EPI — projeto «' + proj.nome + '».'));
    var abas = [
      { id: 'inspecoes', nome: 'Inspeções', campos: [['tipo', 'Tipo (inicial/rotineira/periódica)'], ['inspetor', 'Inspetor'], ['resultado', 'Resultado'], ['proxima', 'Próxima inspeção'], ['obs', 'Observações']] },
      { id: 'ensaios', nome: 'Ensaios de carga', campos: [['ponto', 'Ponto'], ['exigida', 'Carga exigida (kN)'], ['aplicada', 'Carga aplicada (kN)'], ['resultado', 'Resultado'], ['resp', 'Responsável']] },
      { id: 'capacitacao', nome: 'Capacitação', campos: [['nome', 'Trabalhador'], ['cpf', 'CPF'], ['curso', 'Curso'], ['horas', 'Carga (h)'], ['validade', 'Validade']] },
      { id: 'epi', nome: 'EPI', campos: [['epi', 'EPI'], ['fabricante', 'Fabricante'], ['ca', 'CA'], ['validade', 'Validade'], ['inspecao', 'Última inspeção']] },
      { id: 'apr', nome: 'APR', campos: [['perigo', 'Perigo'], ['medida', 'Medida de controle']] }
    ];
    var ativo = LV.state.regAba || 'inspecoes';
    alvo.appendChild(h('div', { class: 'tabs' }, abas.map(function (a) {
      return h('button', { class: 'tab' + (a.id === ativo ? ' ativo' : ''), text: a.nome, onclick: function () { LV.state.regAba = a.id; LV.UI.renderRota(); } });
    })));
    var aba = abas.filter(function (a) { return a.id === ativo; })[0];
    var inputs = {};
    var form = h('div', { class: 'reg-form' }, aba.campos.map(function (c) {
      var inp = h('input', { class: 'inp', placeholder: c[1] }); inputs[c[0]] = inp;
      return h('div', { class: 'reg-campo' }, [h('label', { class: 'rot', text: c[1] }), inp]);
    }).concat([h('button', { class: 'btn primary', text: '+ Adicionar', onclick: function () {
      var rec = {}; aba.campos.forEach(function (c) { rec[c[0]] = inputs[c[0]].value; });
      LV.Storage.addRegistro(proj.id, aba.id, rec); LV.Audit.registrar('registro', { tipo: aba.id, projeto: proj.nome }).catch(function(){});
      toast('Registro adicionado.', 'ok'); LV.UI.renderRota();
    } })]));
    alvo.appendChild(form);
    var registrosAtuais = (proj.registros && proj.registros[aba.id]) || [];
    var tab = h('table', { class: 'tab' });
    tab.appendChild(h('thead', {}, [h('tr', {}, aba.campos.map(function (c) { return h('th', { text: c[1] }); }).concat([h('th', { text: 'Data' }), h('th', { text: '' })]))]));
    var tb = h('tbody');
    registrosAtuais.forEach(function (r) {
      tb.appendChild(h('tr', {}, aba.campos.map(function (c) { return h('td', { text: r[c[0]] || '' }); }).concat([
        h('td', { text: new Date(r.criadoEm).toLocaleDateString('pt-BR') }),
        h('td', {}, [h('button', { class: 'btn mini danger', text: 'x', onclick: function () { LV.Storage.removerRegistro(proj.id, aba.id, r.id); LV.UI.renderRota(); } })])
      ])));
    });
    tab.appendChild(tb);
    alvo.appendChild(registrosAtuais.length ? tab : h('div', { class: 'vazio', text: 'Sem registros nesta aba.' }));
  }

  // ======================= ADMINISTRAÇÃO =======================
  function admin(alvo) {
    H();
    if (!LV.Auth.pode('gerenciar_usuarios')) { alvo.appendChild(avisoPermissao()); return; }
    alvo.appendChild(tituloPagina('Administração', 'Usuários, licença, dados do escritório, auditoria e backup.'));

    // --- Usuários ---
    var box = h('div', { class: 'admin-sec' });
    box.appendChild(h('h3', { text: 'Usuários e perfis de acesso' }));
    var tab = h('table', { class: 'tab' });
    tab.appendChild(h('thead', {}, [h('tr', {}, ['Usuário', 'Nome', 'Perfil', 'Estado', ''].map(function (t) { return h('th', { text: t }); }))]));
    var tb = h('tbody');
    LV.Auth.listarUsuarios().forEach(function (u) {
      tb.appendChild(h('tr', {}, [
        h('td', { text: u.username }), h('td', { text: u.nome }), h('td', { text: LV.Auth.PERFIS[u.role] }),
        h('td', { text: (u.ativo ? 'ativo' : 'inativo') + (u.bloqueado ? ' (bloqueado)' : '') + (u.mustChange ? ' · troca pendente' : '') }),
        h('td', {}, [
          h('button', { class: 'btn mini ghost', text: 'Resetar senha', onclick: function () {
            var nova = 'GD-' + LV.Crypto.randomHex(3);
            LV.Auth.resetarSenha(u.username, nova).then(function () { toast('Nova senha temporária: ' + nova, 'ok'); });
          } }),
          u.username !== 'admin' ? h('button', { class: 'btn mini danger', text: 'Remover', onclick: function () { if (confirmar('Remover ' + u.username + '?')) { LV.Auth.removerUsuario(u.username); LV.UI.renderRota(); } } }) : null
        ])
      ]));
    });
    tab.appendChild(tb); box.appendChild(tab);
    // novo usuário
    var nu = {}, campos = [['username', 'usuário'], ['nome', 'nome completo'], ['senha', 'senha inicial']];
    var roleSel = h('select', { class: 'inp' });
    Object.keys(LV.Auth.PERFIS).forEach(function (r) { roleSel.appendChild(h('option', { value: r, text: LV.Auth.PERFIS[r] })); });
    box.appendChild(h('div', { class: 'reg-form' }, campos.map(function (c) { var i = h('input', { class: 'inp', placeholder: c[1], type: c[0] === 'senha' ? 'text' : 'text' }); nu[c[0]] = i; return h('div', { class: 'reg-campo' }, [h('label', { class: 'rot', text: c[1] }), i]); }).concat([
      h('div', { class: 'reg-campo' }, [h('label', { class: 'rot', text: 'perfil' }), roleSel]),
      h('button', { class: 'btn primary', text: '+ Criar usuário', onclick: function () {
        LV.Auth.criarUsuario({ username: nu.username.value, nome: nu.nome.value, senha: nu.senha.value, role: roleSel.value, mustChange: true })
          .then(function () { toast('Usuário criado.', 'ok'); LV.UI.renderRota(); }).catch(function (e) { toast(e.message, 'erro'); });
      } })
    ])));
    alvo.appendChild(box);

    // --- Licença ---
    var lic = LV.Auth.licencaAtual();
    var boxL = h('div', { class: 'admin-sec' });
    boxL.appendChild(h('h3', { text: 'Licença comercial' }));
    boxL.appendChild(h('p', { class: 'muted', text: lic ? ('Cliente: ' + lic.cliente + ' · plano ' + lic.plano + ' · validade ' + lic.validade) : 'Sem licença.' }));
    var gc = {}, gcCli = h('input', { class: 'inp', placeholder: 'CLIENTE' }), gcVal = h('input', { class: 'inp', placeholder: 'AAAAMMDD (validade)' }), gcPl = h('input', { class: 'inp', placeholder: 'PRO', value: 'PRO' });
    var saidaChave = h('input', { class: 'inp', readonly: 'true', placeholder: 'chave gerada aparecerá aqui' });
    boxL.appendChild(h('div', { class: 'reg-form' }, [
      h('div', { class: 'reg-campo' }, [h('label', { class: 'rot', text: 'Cliente' }), gcCli]),
      h('div', { class: 'reg-campo' }, [h('label', { class: 'rot', text: 'Validade (AAAAMMDD)' }), gcVal]),
      h('div', { class: 'reg-campo' }, [h('label', { class: 'rot', text: 'Plano' }), gcPl]),
      h('button', { class: 'btn primary', text: 'Gerar chave de licença', onclick: function () {
        LV.Auth.gerarChave(gcCli.value, gcVal.value, gcPl.value).then(function (k) { saidaChave.value = k; toast('Chave gerada.', 'ok'); });
      } })
    ]));
    boxL.appendChild(h('div', { class: 'reg-campo' }, [h('label', { class: 'rot', text: 'Chave gerada (entregue ao cliente)' }), saidaChave]));
    alvo.appendChild(boxL);

    // --- Config do escritório ---
    var cfg = LV.Storage.getConfig();
    var boxC = h('div', { class: 'admin-sec' });
    boxC.appendChild(h('h3', { text: 'Dados do escritório (marca dos relatórios)' }));
    var ci = {};
    [['empresa', 'Empresa'], ['cnpj', 'CNPJ'], ['responsavel', 'Responsável técnico'], ['crea', 'CREA'], ['contato', 'Contato'], ['cidade', 'Cidade']].forEach(function (c) {
      var i = h('input', { class: 'inp', value: cfg[c[0]] || '' }); ci[c[0]] = i;
      boxC.appendChild(h('div', { class: 'reg-campo' }, [h('label', { class: 'rot', text: c[1] }), i]));
    });
    boxC.appendChild(h('button', { class: 'btn primary', text: 'Salvar dados', onclick: function () { var n = {}; Object.keys(ci).forEach(function (k) { n[k] = ci[k].value; }); LV.Storage.setConfig(n); toast('Dados salvos.', 'ok'); } }));
    alvo.appendChild(boxC);

    // --- Auditoria ---
    var boxA = h('div', { class: 'admin-sec' });
    boxA.appendChild(h('h3', { text: 'Trilha de auditoria' }));
    boxA.appendChild(h('button', { class: 'btn ghost', text: 'Verificar integridade', onclick: function () {
      LV.Audit.verificarIntegridade().then(function (r) { toast(r.ok ? ('Cadeia íntegra (' + r.total + ' eventos).') : ('Integridade ROMPIDA no evento ' + r.rompidaEm), r.ok ? 'ok' : 'erro'); });
    } }));
    var logTab = h('table', { class: 'tab' });
    logTab.appendChild(h('thead', {}, [h('tr', {}, ['#', 'Data', 'Ação', 'Detalhes'].map(function (t) { return h('th', { text: t }); }))]));
    var ltb = h('tbody');
    LV.Audit.listar(15).forEach(function (ev) {
      ltb.appendChild(h('tr', {}, [h('td', { text: ev.seq }), h('td', { text: new Date(ev.ts).toLocaleString('pt-BR') }), h('td', { text: ev.acao }), h('td', { text: JSON.stringify(ev.dados) })]));
    });
    logTab.appendChild(ltb); boxA.appendChild(logTab);
    alvo.appendChild(boxA);
  }

  // ======================= helpers de view =======================
  function tituloPagina(t, sub) { return h('div', { class: 'pg-titulo' }, [h('h1', { text: t }), sub ? h('p', { class: 'muted', text: sub }) : null]); }
  function secaoForm(titulo, campos) { return h('div', { class: 'form-sec' }, [h('h3', { text: titulo }), h('div', { class: 'grid-campos' }, campos)]); }
  function campoWrap(rotulo, el) { return h('div', { class: 'campo' }, [h('label', { class: 'rot', text: rotulo }), el]); }
  function campoTexto(rotulo, val, onchange) { var i = h('input', { class: 'inp', value: val || '', onchange: function () { onchange(i.value); } }); return campoWrap(rotulo, i); }
  function campoNum(rotulo, val, un, onchange, ph) {
    var i = h('input', { class: 'inp', type: 'number', step: 'any', value: (val != null && val !== '') ? val : '', placeholder: ph != null ? String(ph) : '', onchange: function () { onchange(i.value); } });
    return h('div', { class: 'campo' }, [h('label', { class: 'rot', text: rotulo + (un && un !== '—' ? ' (' + un + ')' : '') }), i]);
  }
  function podeEditar() { return LV.Auth.pode('editar_projeto'); }
  function avisoPermissao() { return h('div', { class: 'vazio', text: 'Seu perfil não tem permissão para acessar esta área.' }); }

  // imprimir/PDF: abre janela com o documento + folha de estilo
  function imprimir(html, titulo) {
    var cssHref = '';
    var link = qs('link[rel=stylesheet]'); if (link) cssHref = link.href;
    var w = window.open('', '_blank');
    if (!w) { toast('Permita pop-ups para imprimir.', 'erro'); return; }
    w.document.write('<!DOCTYPE html><html lang="pt-BR"><head><meta charset="utf-8"><title>' + titulo + '</title>' +
      (cssHref ? '<link rel="stylesheet" href="' + cssHref + '">' : '') +
      '</head><body class="print-body">' + html + '</body></html>');
    w.document.close();
    setTimeout(function () { w.focus(); w.print(); }, 500);
  }
  function baixar(nome, conteudo) {
    var blob = new Blob([conteudo], { type: 'application/json' });
    var a = h('a', { href: URL.createObjectURL(blob), download: nome }); document.body.appendChild(a); a.click(); a.remove();
  }
  function importar(file) {
    if (!file) return; var r = new FileReader();
    r.onload = function () { try { LV.Storage.importarTudo(r.result, true); toast('Backup restaurado.', 'ok'); LV.UI.renderRota(); } catch (e) { toast('Falha: ' + e.message, 'erro'); } };
    r.readAsText(file);
  }

  LV.Views = { painel: painel, projeto: projeto, resultados: resultados, prontuario: prontuario, conformidade: conformidade, registros: registros, admin: admin };
})(typeof self !== 'undefined' ? self : this);
