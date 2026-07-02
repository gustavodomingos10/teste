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
    if (!lista.length) { alvo.appendChild(h('div', { class: 'vazio', text: D('Nenhum projeto ainda. Crie o primeiro.') })); return; }
    var grid = h('div', { class: 'cards' });
    lista.forEach(function (p) {
      var full = LV.Storage.obter(p.id);
      var c = calcular(full);
      var ver = (c.R) ? c.R.veredito : null;
      grid.appendChild(h('div', { class: 'card proj' }, [
        h('div', { class: 'card-top' }, [
          h('b', { text: p.nome }),
          ver ? h('span', { class: 'badge ' + (ver.aprovado ? 'ok' : 'fail'), text: ver.aprovado ? D('APROVADO') : D('REVISAR') }) : null
        ]),
        h('div', { class: 'card-sub', text: (p.obra || '—') + ' · ' + p.revisao }),
        h('div', { class: 'card-sub small', text: L('Atualizado ', 'Updated ') + new Date(p.atualizadoEm).toLocaleDateString(dateLoc()) }),
        h('div', { class: 'card-acoes' }, [
          h('button', { class: 'btn mini', text: D('Abrir'), onclick: function () { LV.state.projetoId = p.id; LV.UI.irPara('projeto'); } }),
          h('button', { class: 'btn mini ghost', text: D('Duplicar'), onclick: function () { LV.Storage.duplicar(p.id); toast(D('Projeto duplicado.'), 'ok'); LV.UI.renderRota(); } }),
          podeEditar() ? h('button', { class: 'btn mini danger', text: D('Excluir'), onclick: function () { if (confirmar(L('Excluir «' + p.nome + '»?', 'Delete “' + p.nome + '”?'))) { LV.Storage.remover(p.id); if (LV.state.projetoId === p.id) LV.state.projetoId = null; LV.UI.renderRota(); } } }) : null
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
      lista.forEach(function (o) { selSub.appendChild(h('option', { value: o, text: D(o), selected: o === e.substrato ? 'true' : null })); });
      e.substrato = selSub.value;
    }
    var selCen = h('select', { class: 'inp', onchange: function () { set('cenario', selCen.value); popularSub(selCen.value); } });
    ['Cobertura', 'Estrutura', 'Solo', 'Silo / Industrial'].forEach(function (c) { selCen.appendChild(h('option', { value: c, text: D(c), selected: c === (e.cenario || 'Cobertura') ? 'true' : null })); });
    e.cenario = e.cenario || 'Cobertura';
    selSub = h('select', { class: 'inp', onchange: function () { set('substrato', selSub.value); } });
    popularSub(e.cenario);
    var selAmb = h('select', { class: 'inp', onchange: function () { set('ambiente', selAmb.value); } });
    LV.Data.CORROSION.forEach(function (c) { selAmb.appendChild(h('option', { value: c.nome, text: D(c.nome), selected: c.nome === e.ambiente ? 'true' : null })); });
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
    LV.Data.MATERIALS.forEach(function (m) { selMat.appendChild(h('option', { value: m, text: D(m), selected: m === e.caboMaterial ? 'true' : null })); });
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
    LV.Data.LANYARDS.forEach(function (l) { selTal.appendChild(h('option', { value: l.nome, text: D(l.nome), selected: l.nome === e.talabarte ? 'true' : null })); });
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
    ['Sim', 'Não'].forEach(function (o) { selAbs.appendChild(h('option', { value: o, text: D(o), selected: o === (e.temAbsorvedor || 'Sim') ? 'true' : null })); });
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

    // Cartão de dimensionamento automático ("Calcule para mim") — respeita as
    // escolhas manuais acima e oferece a busca da melhor solução do catálogo.
    var sAuto = h('div', { class: 'auto-card' }, [
      h('div', { class: 'auto-card-txt' }, [
        h('div', { class: 'auto-card-t', text: '⚡ ' + L('Dimensionamento automático', 'Automatic dimensioning') }),
        h('div', { class: 'auto-card-s', text: L('Você pode escolher o perfil, o cabo e o vão manualmente acima — ou deixar o software encontrar a solução APROVADA mais leve (menor custo) para o país e as cargas informadas.',
          'You can pick the profile, cable and span manually above — or let the software find the lightest PASSING solution (lowest cost) for the selected country and loads.') })
      ]),
      h('button', { class: 'btn primary btn-calc', text: L('⚡ Calcule para mim', '⚡ Calculate for me'), onclick: function () { salvar(); autoDimensionar(proj); } })
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
      paisAtual ? h('div', { class: 'pais-tag', text: paisAtual.bandeira + ' ' + (L(paisAtual.nome, paisAtual.nomeEn || paisAtual.nome)) + ' · ' + (paisAtual.unidades === 'imperial' ? 'Imperial' : 'SI') }) : null,
      h('button', { class: 'btn primary', text: LV.DEMO ? L('Calcular (demonstração)', 'Calculate (demo)') : L('Salvar e calcular', 'Save & calculate'), onclick: function () { salvar(); if (!LV.DEMO) toast(L('Projeto salvo.', 'Project saved.'), 'ok'); LV.UI.irPara('resultados'); } })]));
    [s1, s2, s3, s4, s5, s6, s7, sAuto, s8].forEach(function (x) { alvo.appendChild(x); });
    // auto-salva ao sair de qualquer campo
    alvo.addEventListener('change', salvar);
  }

  // ======================= RESULTADOS =======================
  function resultados(alvo) {
    H();
    if (!LV.Auth.pode('calcular')) { alvo.appendChild(avisoPermissao()); return; }
    var proj = projAtual();
    var c = calcular(proj);
    alvo.appendChild(tituloPagina(L('Resultados', 'Results') + ' — ' + proj.nome, L('Memória de cálculo automática (NR-35 Anexo II 5.1.1 / ANSI Z359.6).', 'Automatic calculation report (NR-35 Annex II 5.1.1 / ANSI Z359.6).')));
    if (c.erro) { alvo.appendChild(h('div', { class: 'erro-fatal', text: L('Não foi possível calcular: ', 'Could not calculate: ') + c.erro })); return; }
    // Erros bloqueantes de validação: não exibe resultado/prontuário sobre dados inválidos.
    if (c.val && c.val.erros && c.val.erros.length) {
      var boxErr = h('div', { class: 'avisos-box' });
      boxErr.appendChild(h('div', { class: 'av erro forte', text: '⛔ ' + L('Corrija os dados abaixo para calcular. Não emitimos resultado nem prontuário sobre dados inválidos.', 'Fix the data below to calculate. No result or technical file is issued on invalid data.') }));
      c.val.erros.forEach(function (m) { boxErr.appendChild(h('div', { class: 'av erro', text: '• ' + m })); });
      alvo.appendChild(boxErr);
      alvo.appendChild(h('div', { class: 'toolbar' }, [h('button', { class: 'btn primary', text: L('Editar dados', 'Edit data'), onclick: function () { LV.UI.irPara('projeto'); } })]));
      return;
    }
    var R = c.R;
    LV.Audit.registrar('calculo', { projeto: proj.nome, veredito: R.veredito.texto }).catch(function(){});

    // veredito
    alvo.appendChild(h('div', { class: 'verdito-banner ' + (R.veredito.aprovado ? 'ok' : 'fail') }, [
      h('span', { class: 'vb-txt', text: L('VEREDITO', 'VERDICT') + ': ' + L(R.veredito.texto, R.veredito.aprovado ? 'APPROVED' : 'FAILED — review data') }),
      h('div', { class: 'vb-ind' }, R.veredito.indicadores.map(function (i) { return h('span', { class: 'ind ' + (i.ok ? 'ok' : 'fail'), text: (i.ok ? '✔ ' : '✘ ') + L(i.nome, i.nomeEn || i.nome) }); }))
    ]));
    // Comparativo internacional (Brasil × EUA) — mesmo projeto, dois critérios
    alvo.appendChild(comparativoInternacional(proj));
    // avisos de validação (ocultos na demonstração)
    if (!LV.DEMO && c.val && (c.val.avisos.length || c.val.erros.length)) {
      var box = h('div', { class: 'avisos-box' });
      c.val.erros.forEach(function (m) { box.appendChild(h('div', { class: 'av erro', text: '⛔ ' + m })); });
      c.val.avisos.forEach(function (m) { box.appendChild(h('div', { class: 'av aviso', text: '⚠ ' + m })); });
      alvo.appendChild(box);
    }
    // figuras — visíveis, mas BORRADAS na demonstração (mostram que há saída
    // profissional, sem entregar as cotas nem o perfil dimensionado)
    alvo.appendChild(h('div', { class: 'figuras-grid' + (LV.DEMO ? ' demo-blur' : ''), html:
      '<div class="fig">' + LV.Draw.iso3D(R) + '</div>' +
      '<div class="fig">' + LV.Draw.elevacaoZLQ(R) + '</div>' +
      '<div class="fig">' + LV.Draw.esforcosPoste(R) + '</div>' +
      '<div class="fig">' + LV.Draw.planta(R) + '</div>'
    }));
    // botões
    var cfgR = LV.Storage.getConfig();
    alvo.appendChild(h('div', { class: 'toolbar' }, [
      h('button', { class: 'btn primary btn-prontuario', text: L('📑 Gerar Prontuário Completo', '📑 Generate Complete Technical File'), onclick: function () { abrirExportModal(R, proj, cfgR); } }),
      h('button', { class: 'btn ghost', text: L('⚡ Calcule para mim', '⚡ Calculate for me'), title: L('Dimensionamento automático', 'Automatic dimensioning'), onclick: function () { autoDimensionar(proj); } }),
      h('button', { class: 'btn ghost', text: L('⎙ Imprimir memorial de cálculo', '⎙ Print calculation report'), onclick: function () { imprimir(LV.Report.memorialCalculo(R, proj, cfgR), 'Calc'); } }),
      h('button', { class: 'btn ghost', text: L('⎙ Memorial descritivo', '⎙ Descriptive report'), onclick: function () { imprimir(LV.Report.memorialDescritivo(R, proj, cfgR), 'Desc'); } }),
      h('button', { class: 'btn ghost', text: L('Editar dados', 'Edit data'), onclick: function () { LV.UI.irPara('projeto'); } })
    ]));
    // memorial de cálculo COMPLETO (na demonstração é exibido inteiro, porém com
    // TARJAS de censura cobrindo os dados essenciais — materiais, cabo, chumbadores…)
    alvo.appendChild(h('div', { class: 'doc-inline', html: LV.Report.memorialCalculo(R, proj, cfgR) }));
    if (LV.DEMO && LV.aplicarTarjas) LV.aplicarTarjas(alvo);
  }

  // ======================= PRONTUÁRIO =======================
  function prontuario(alvo) {
    H();
    if (!LV.Auth.pode('emitir_prontuario')) { alvo.appendChild(avisoPermissao()); return; }
    var proj = projAtual(); var c = calcular(proj);
    alvo.appendChild(tituloPagina(L('Prontuário do sistema', 'System technical file'), L('Dossiê técnico completo (19 seções) para auditoria.', 'Complete technical file (19 sections) for audit.')));
    if (c.erro) { alvo.appendChild(h('div', { class: 'erro-fatal', text: L('Não foi possível gerar: ', 'Could not generate: ') + c.erro })); return; }
    if (c.val && c.val.erros && c.val.erros.length) {
      var boxE = h('div', { class: 'avisos-box' });
      boxE.appendChild(h('div', { class: 'av erro forte', text: '⛔ ' + L('Corrija os dados do projeto antes de emitir o prontuário.', 'Fix the project data before issuing the technical file.') }));
      c.val.erros.forEach(function (m) { boxE.appendChild(h('div', { class: 'av erro', text: '• ' + m })); });
      alvo.appendChild(boxE);
      alvo.appendChild(h('div', { class: 'toolbar' }, [h('button', { class: 'btn primary', text: L('Editar dados', 'Edit data'), onclick: function () { LV.UI.irPara('projeto'); } })]));
      return;
    }
    var R = c.R; var cfg = LV.Storage.getConfig();
    var html = LV.Prontuario.gerar(R, proj, cfg);
    LV.Audit.registrar('prontuario', { projeto: proj.nome, veredito: R.veredito.texto }).catch(function(){});
    alvo.appendChild(h('div', { class: 'toolbar' }, [
      h('button', { class: 'btn primary btn-prontuario', text: L('📑 Gerar Prontuário Completo', '📑 Generate Complete Technical File'), onclick: function () { abrirExportModal(R, proj, cfg); } }),
      h('button', { class: 'btn ghost', text: L('⎙ Imprimir / Salvar PDF', '⎙ Print / Save PDF'), onclick: function () { imprimir(html, 'TechnicalFile'); } }),
      h('button', { class: 'btn ghost', text: L('Registros', 'Records'), onclick: function () { LV.UI.irPara('registros'); } })
    ]));
    alvo.appendChild(h('div', { class: 'doc-inline', html: html }));
    if (LV.DEMO && LV.aplicarTarjas) LV.aplicarTarjas(alvo);
  }

  // ======================= CONFORMIDADE (gestão de ativos) =======================
  function conformidade(alvo) {
    H();
    if (!LV.Auth.pode('registrar_inspecao')) { alvo.appendChild(avisoPermissao()); return; }
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
    if (!LV.Auth.pode('registrar_inspecao')) { alvo.appendChild(avisoPermissao()); return; }
    var proj = projAtual();
    alvo.appendChild(tituloPagina('Registros do prontuário', L('Inspeções, ensaios, APR, capacitação e EPI — projeto «' + proj.nome + '».', 'Inspections, load tests, JHA, training and PPE — project “' + proj.nome + '”.')));
    var abas = [
      { id: 'inspecoes', nome: 'Inspeções', campos: [['tipo', 'Tipo (inicial/rotineira/periódica)'], ['inspetor', 'Inspetor'], ['resultado', 'Resultado'], ['proxima', 'Próxima inspeção'], ['obs', 'Observações']] },
      { id: 'ensaios', nome: 'Ensaios de carga', campos: [['ponto', 'Ponto'], ['exigida', 'Carga exigida (kN)'], ['aplicada', 'Carga aplicada (kN)'], ['resultado', 'Resultado'], ['resp', 'Responsável']] },
      { id: 'capacitacao', nome: 'Capacitação', campos: [['nome', 'Trabalhador'], ['cpf', 'CPF'], ['curso', 'Curso'], ['horas', 'Carga (h)'], ['validade', 'Validade']] },
      { id: 'epi', nome: 'EPI', campos: [['epi', 'EPI'], ['fabricante', 'Fabricante'], ['ca', 'CA'], ['validade', 'Validade'], ['inspecao', 'Última inspeção']] },
      { id: 'apr', nome: 'APR', campos: [['perigo', 'Perigo'], ['medida', 'Medida de controle']] }
    ];
    var ativo = LV.state.regAba || 'inspecoes';
    alvo.appendChild(h('div', { class: 'tabs' }, abas.map(function (a) {
      return h('button', { class: 'tab' + (a.id === ativo ? ' ativo' : ''), text: D(a.nome), onclick: function () { LV.state.regAba = a.id; LV.UI.renderRota(); } });
    })));
    var aba = abas.filter(function (a) { return a.id === ativo; })[0];
    var inputs = {};
    var form = h('div', { class: 'reg-form' }, aba.campos.map(function (c) {
      var inp = h('input', { class: 'inp', placeholder: D(c[1]) }); inputs[c[0]] = inp;
      return h('div', { class: 'reg-campo' }, [h('label', { class: 'rot', text: D(c[1]) }), inp]);
    }).concat([h('button', { class: 'btn primary', text: D('+ Adicionar'), onclick: function () {
      var rec = {}; aba.campos.forEach(function (c) { rec[c[0]] = inputs[c[0]].value; });
      LV.Storage.addRegistro(proj.id, aba.id, rec); LV.Audit.registrar('registro', { tipo: aba.id, projeto: proj.nome }).catch(function(){});
      toast(D('Registro adicionado.'), 'ok'); LV.UI.renderRota();
    } })]));
    alvo.appendChild(form);
    var registrosAtuais = (proj.registros && proj.registros[aba.id]) || [];
    var tab = h('table', { class: 'tab' });
    tab.appendChild(h('thead', {}, [h('tr', {}, aba.campos.map(function (c) { return h('th', { text: D(c[1]) }); }).concat([h('th', { text: D('Data') }), h('th', { text: '' })]))]));
    var tb = h('tbody');
    registrosAtuais.forEach(function (r) {
      tb.appendChild(h('tr', {}, aba.campos.map(function (c) { return h('td', { text: r[c[0]] || '' }); }).concat([
        h('td', { text: new Date(r.criadoEm).toLocaleDateString(dateLoc()) }),
        h('td', {}, [h('button', { class: 'btn mini danger', text: 'x', onclick: function () { LV.Storage.removerRegistro(proj.id, aba.id, r.id); LV.UI.renderRota(); } })])
      ])));
    });
    tab.appendChild(tb);
    alvo.appendChild(registrosAtuais.length ? tab : h('div', { class: 'vazio', text: D('Sem registros nesta aba.') }));
  }

  // ======================= ADMINISTRAÇÃO =======================
  function admin(alvo) {
    H();
    if (!LV.Auth.pode('gerenciar_usuarios')) { alvo.appendChild(avisoPermissao()); return; }
    alvo.appendChild(tituloPagina('Administração', 'Usuários, licença, dados do escritório, auditoria e backup.'));
    function rolLabel(r) { return LV.I18n ? LV.I18n.t('role.' + r) : r; }

    // --- Usuários ---
    var box = h('div', { class: 'admin-sec' });
    box.appendChild(h('h3', { text: D('Usuários e perfis de acesso') }));
    var tab = h('table', { class: 'tab' });
    tab.appendChild(h('thead', {}, [h('tr', {}, ['Usuário', 'Nome', 'Perfil', 'Estado', ''].map(function (t) { return h('th', { text: D(t) }); }))]));
    var tb = h('tbody');
    LV.Auth.listarUsuarios().forEach(function (u) {
      tb.appendChild(h('tr', {}, [
        h('td', { text: u.username }), h('td', { text: u.nome }), h('td', { text: rolLabel(u.role) }),
        h('td', { text: (u.ativo ? D('ativo') : D('inativo')) + (u.bloqueado ? L(' (bloqueado)', ' (locked)') : '') + (u.mustChange ? L(' · troca pendente', ' · change pending') : '') }),
        h('td', {}, [
          h('button', { class: 'btn mini ghost', text: L('Resetar senha', 'Reset password'), onclick: function () {
            // Senha temporária de alta entropia (~48 bits) e que satisfaz a política
            // (maiúscula G, minúscula d, símbolo @, dígitos do hex); troca obrigatória no 1º acesso.
            var nova = 'Gd@' + LV.Crypto.randomHex(6);
            LV.Auth.resetarSenha(u.username, nova).then(function () { toast(L('Nova senha temporária: ', 'New temporary password: ') + nova, 'ok'); });
          } }),
          u.username !== 'admin' ? h('button', { class: 'btn mini danger', text: L('Remover', 'Remove'), onclick: function () { if (confirmar(L('Remover ' + u.username + '?', 'Remove ' + u.username + '?'))) { LV.Auth.removerUsuario(u.username); LV.UI.renderRota(); } } }) : null
        ])
      ]));
    });
    tab.appendChild(tb); box.appendChild(tab);
    // novo usuário
    var nu = {}, campos = [['username', L('usuário', 'username')], ['nome', L('nome completo', 'full name')], ['senha', L('senha inicial', 'initial password')]];
    var roleSel = h('select', { class: 'inp' });
    Object.keys(LV.Auth.PERFIS).forEach(function (r) { roleSel.appendChild(h('option', { value: r, text: rolLabel(r) })); });
    box.appendChild(h('div', { class: 'reg-form' }, campos.map(function (c) { var i = h('input', { class: 'inp', placeholder: c[1], type: 'text' }); nu[c[0]] = i; return h('div', { class: 'reg-campo' }, [h('label', { class: 'rot', text: c[1] }), i]); }).concat([
      h('div', { class: 'reg-campo' }, [h('label', { class: 'rot', text: L('perfil', 'role') }), roleSel]),
      h('button', { class: 'btn primary', text: L('+ Criar usuário', '+ Create user'), onclick: function () {
        LV.Auth.criarUsuario({ username: nu.username.value, nome: nu.nome.value, senha: nu.senha.value, role: roleSel.value, mustChange: true })
          .then(function () { toast(L('Usuário criado.', 'User created.'), 'ok'); LV.UI.renderRota(); }).catch(function (e) { toast(e.message, 'erro'); });
      } })
    ])));
    alvo.appendChild(box);

    // --- Licença ---
    var lic = LV.Auth.licencaAtual();
    var boxL = h('div', { class: 'admin-sec' });
    boxL.appendChild(h('h3', { text: L('Licença comercial', 'Commercial license') }));
    boxL.appendChild(h('p', { class: 'muted', text: lic ? (L('Cliente: ', 'Client: ') + lic.cliente + L(' · plano ', ' · plan ') + lic.plano + L(' · validade ', ' · valid until ') + lic.validade) : L('Sem licença.', 'No license.') }));
    var gc = {}, gcCli = h('input', { class: 'inp', placeholder: L('CLIENTE', 'CLIENT') }), gcVal = h('input', { class: 'inp', placeholder: L('AAAAMMDD (validade)', 'YYYYMMDD (valid until)') }), gcPl = h('input', { class: 'inp', placeholder: 'PRO', value: 'PRO' });
    var saidaChave = h('input', { class: 'inp', readonly: 'true', placeholder: L('chave gerada aparecerá aqui', 'generated key will appear here') });
    boxL.appendChild(h('div', { class: 'reg-form' }, [
      h('div', { class: 'reg-campo' }, [h('label', { class: 'rot', text: L('Cliente', 'Client') }), gcCli]),
      h('div', { class: 'reg-campo' }, [h('label', { class: 'rot', text: L('Validade (AAAAMMDD)', 'Valid until (YYYYMMDD)') }), gcVal]),
      h('div', { class: 'reg-campo' }, [h('label', { class: 'rot', text: L('Plano', 'Plan') }), gcPl]),
      h('button', { class: 'btn primary', text: L('Gerar chave de licença', 'Generate license key'), onclick: function () {
        LV.Auth.gerarChave(gcCli.value, gcVal.value, gcPl.value).then(function (k) { saidaChave.value = k; toast(L('Chave gerada.', 'Key generated.'), 'ok'); });
      } })
    ]));
    boxL.appendChild(h('div', { class: 'reg-campo' }, [h('label', { class: 'rot', text: L('Chave gerada (entregue ao cliente)', 'Generated key (deliver to client)') }), saidaChave]));
    alvo.appendChild(boxL);

    // --- Config do escritório ---
    var cfg = LV.Storage.getConfig();
    var boxC = h('div', { class: 'admin-sec' });
    boxC.appendChild(h('h3', { text: L('Dados do escritório (marca dos relatórios)', 'Office data (report branding)') }));
    var ci = {};
    [['empresa', L('Empresa', 'Company')], ['cnpj', L('CNPJ', 'Company Tax ID')], ['responsavel', L('Responsável técnico', 'Engineer of record')], ['crea', L('CREA', 'License / PE')], ['contato', L('Contato', 'Contact')], ['cidade', L('Cidade', 'City')]].forEach(function (c) {
      var i = h('input', { class: 'inp', value: cfg[c[0]] || '' }); ci[c[0]] = i;
      boxC.appendChild(h('div', { class: 'reg-campo' }, [h('label', { class: 'rot', text: c[1] }), i]));
    });
    // --- Logotipo (aparece no cabeçalho e na capa de todos os documentos) ---
    var logoState = { data: cfg.logo || '' };
    var logoPrev = h('div', { class: 'logo-prev' + (logoState.data ? '' : ' vazio') },
      logoState.data ? [h('img', { src: logoState.data, alt: 'logo' })] : [h('span', { class: 'muted', text: L('Sem logotipo — será usado o monograma do escritório.', 'No logo — the office monogram will be used.') })]);
    function pintarLogo() {
      clear(logoPrev);
      logoPrev.className = 'logo-prev' + (logoState.data ? '' : ' vazio');
      if (logoState.data) logoPrev.appendChild(h('img', { src: logoState.data, alt: 'logo' }));
      else logoPrev.appendChild(h('span', { class: 'muted', text: L('Sem logotipo — será usado o monograma do escritório.', 'No logo — the office monogram will be used.') }));
    }
    var inputLogo = h('input', { type: 'file', accept: 'image/png,image/jpeg,image/svg+xml', style: 'display:none', onchange: function (ev) {
      var file = ev.target.files && ev.target.files[0]; if (!file) return;
      if (file.size > 512 * 1024) { toast(L('Imagem muito grande (máx. 512 KB).', 'Image too large (max 512 KB).'), 'erro'); return; }
      var rd = new FileReader();
      rd.onload = function () { logoState.data = rd.result; pintarLogo(); toast(L('Logotipo carregado — clique em Salvar dados.', 'Logo loaded — click Save data.'), 'ok'); };
      rd.readAsDataURL(file);
    } });
    boxC.appendChild(h('div', { class: 'reg-campo logo-campo' }, [
      h('label', { class: 'rot', text: L('Logotipo do escritório (PNG/JPG/SVG · máx. 512 KB)', 'Office logo (PNG/JPG/SVG · max 512 KB)') }),
      logoPrev,
      h('div', { class: 'logo-btns' }, [
        h('label', { class: 'btn ghost arquivo' }, [L('⭱ Enviar imagem', '⭱ Upload image'), inputLogo]),
        h('button', { class: 'btn ghost danger', text: L('Remover', 'Remove'), onclick: function () { logoState.data = ''; pintarLogo(); toast(L('Logotipo removido — clique em Salvar dados.', 'Logo removed — click Save data.'), 'ok'); } })
      ])
    ]));
    boxC.appendChild(h('button', { class: 'btn primary', text: L('Salvar dados', 'Save data'), onclick: function () { var n = Object.assign({}, cfg); Object.keys(ci).forEach(function (k) { n[k] = ci[k].value; }); n.logo = logoState.data; LV.Storage.setConfig(n); toast(L('Dados salvos.', 'Data saved.'), 'ok'); } }));
    alvo.appendChild(boxC);

    // --- Auditoria ---
    var boxA = h('div', { class: 'admin-sec' });
    boxA.appendChild(h('h3', { text: L('Trilha de auditoria', 'Audit trail') }));
    boxA.appendChild(h('button', { class: 'btn ghost', text: L('Verificar integridade', 'Verify integrity'), onclick: function () {
      LV.Audit.verificarIntegridade().then(function (r) { toast(r.ok ? (L('Cadeia íntegra (', 'Chain intact (') + r.total + L(' eventos).', ' events).')) : (L('Integridade ROMPIDA no evento ', 'Integrity BROKEN at event ') + r.rompidaEm), r.ok ? 'ok' : 'erro'); });
    } }));
    var logTab = h('table', { class: 'tab' });
    logTab.appendChild(h('thead', {}, [h('tr', {}, ['#', 'Data', 'Ação', 'Detalhes'].map(function (t) { return h('th', { text: D(t) }); }))]));
    var ltb = h('tbody');
    LV.Audit.listar(15).forEach(function (ev) {
      ltb.appendChild(h('tr', {}, [h('td', { text: ev.seq }), h('td', { text: new Date(ev.ts).toLocaleString(dateLoc()) }), h('td', { text: ev.acao }), h('td', { text: JSON.stringify(ev.dados) })]));
    });
    logTab.appendChild(ltb); boxA.appendChild(logTab);
    alvo.appendChild(boxA);
  }

  // ======================= helpers de view =======================
  // D(s): traduz uma string estática de UI (dicionário PT→EN) conforme o idioma.
  function D(s) { return (LV.I18n && typeof s === 'string') ? LV.I18n.d(s) : s; }
  // Cartão de bloqueio da versão demonstração (substitui o documento completo)
  function teaserDemo(titulo) {
    return h('div', { class: 'demo-lock' }, [
      h('div', { class: 'demo-lock-ico', text: '🔒' }),
      h('div', {}, [
        h('b', { text: L(titulo + ' — disponível na versão completa', titulo + ' — available in the full version') }),
        h('div', { class: 'muted', text: L(
          'Nesta demonstração você calcula e visualiza os resultados. O memorial detalhado, o prontuário e a exportação (Word/PDF/Excel) ficam na versão licenciada. Contato: ' + (LV.demoContato || ''),
          'In this demo you can calculate and preview the results. The detailed report, technical file and export (Word/PDF/Excel) are in the licensed version. Contact: ' + (LV.demoContato || '')) })
      ])
    ]);
  }
  function dateLoc() { return (LV.I18n && LV.I18n.getLang() === 'en') ? 'en-US' : 'pt-BR'; }
  function tituloPagina(t, sub) { return h('div', { class: 'pg-titulo' }, [h('h1', { text: D(t) }), sub ? h('p', { class: 'muted', text: D(sub) }) : null]); }
  function secaoForm(titulo, campos) { return h('div', { class: 'form-sec' }, [h('h3', { text: D(titulo) }), h('div', { class: 'grid-campos' }, campos)]); }
  function campoWrap(rotulo, el) { return h('div', { class: 'campo' }, [h('label', { class: 'rot', text: D(rotulo) }), el]); }
  function campoTexto(rotulo, val, onchange) { var i = h('input', { class: 'inp', value: val || '', onchange: function () { onchange(i.value); } }); return campoWrap(rotulo, i); }
  function campoNum(rotulo, val, un, onchange, ph) {
    var i = h('input', { class: 'inp', type: 'number', step: 'any', value: (val != null && val !== '') ? val : '', placeholder: ph != null ? String(ph) : '', onchange: function () { onchange(i.value); } });
    return h('div', { class: 'campo' }, [h('label', { class: 'rot', text: D(rotulo) + (un && un !== '—' ? ' (' + un + ')' : '') }), i]);
  }
  function podeEditar() { return LV.Auth.pode('editar_projeto'); }
  function avisoPermissao() { return h('div', { class: 'vazio', text: L('Seu perfil não tem permissão para acessar esta área.', 'Your role does not have permission to access this area.') }); }

  // imprimir/PDF: abre janela com o documento + folha de estilo
  function imprimir(html, titulo) {
    if (LV.DEMO) return LV.demoAviso();
    var cssHref = '';
    var link = qs('link[rel=stylesheet]'); if (link) cssHref = link.href;
    var w = window.open('', '_blank');
    if (!w) { toast(L('Permita pop-ups para imprimir.', 'Allow pop-ups to print.'), 'erro'); return; }
    w.document.write('<!DOCTYPE html><html lang="' + (LV.I18n && LV.I18n.getLang() === 'en' ? 'en' : 'pt-BR') + '"><head><meta charset="utf-8"><title>' + titulo + '</title>' +
      (cssHref ? '<link rel="stylesheet" href="' + cssHref + '">' : '') +
      '</head><body class="print-body">' + html + '</body></html>');
    w.document.close();
    setTimeout(function () { w.focus(); w.print(); }, 500);
  }
  function baixar(nome, conteudo) {
    if (LV.DEMO) return LV.demoAviso();
    var blob = new Blob([conteudo], { type: 'application/json' });
    var a = h('a', { href: URL.createObjectURL(blob), download: nome }); document.body.appendChild(a); a.click(); a.remove();
  }
  function importar(file) {
    if (!file) return; var r = new FileReader();
    r.onload = function () { try { LV.Storage.importarTudo(r.result, true); toast(L('Backup restaurado.', 'Backup restored.'), 'ok'); LV.UI.renderRota(); } catch (e) { toast(L('Falha: ', 'Failed: ') + e.message, 'erro'); } };
    r.readAsText(file);
  }

  // ---- Modal genérico (overlay central) ----
  function modal(titulo, corpoEl, rodapeEls, classeExtra) {
    var overlay = h('div', { class: 'modal-overlay' });
    function fechar() { overlay.remove(); document.removeEventListener('keydown', onKey); }
    function onKey(ev) { if (ev.key === 'Escape') fechar(); }
    document.addEventListener('keydown', onKey);
    var caixa = h('div', { class: 'modal-caixa ' + (classeExtra || '') }, [
      h('div', { class: 'modal-head' }, [
        h('h3', { text: D(titulo) }),
        h('button', { class: 'modal-x', text: '✕', title: L('Fechar', 'Close'), onclick: fechar })
      ]),
      h('div', { class: 'modal-corpo' }, [corpoEl]),
      rodapeEls ? h('div', { class: 'modal-rodape' }, rodapeEls) : null
    ]);
    overlay.appendChild(caixa);
    overlay.addEventListener('click', function (ev) { if (ev.target === overlay) fechar(); });
    document.body.appendChild(overlay);
    return { overlay: overlay, fechar: fechar };
  }

  // ---- "Gerar Prontuário Completo": seleção de seções + formatos de saída ----
  function abrirExportModal(R, proj, cfg) {
    if (LV.DEMO) return LV.demoAviso();
    var secoes = LV.Prontuario.secoesDisponiveis(R, proj, cfg);
    var checks = {};
    var lista = h('div', { class: 'exp-secoes' }, secoes.map(function (s, i) {
      var cb = h('input', { type: 'checkbox', checked: 'true', value: s.id });
      checks[s.id] = cb;
      return h('label', { class: 'exp-item' }, [cb, h('span', { class: 'exp-n', text: String(i + 1) }), h('span', { text: s.titulo })]);
    }));
    var fmtWord = h('input', { type: 'checkbox', checked: 'true' });
    var fmtPdf = h('input', { type: 'checkbox', checked: 'true' });
    var fmtXls = h('input', { type: 'checkbox', checked: 'true' });
    var incluiCapa = h('input', { type: 'checkbox', checked: 'true' });
    function setAll(v) { Object.keys(checks).forEach(function (id) { checks[id].checked = v; }); }

    var corpo = h('div', { class: 'exp-modal' }, [
      h('p', { class: 'muted', text: L('Escolha as seções que deseja incluir no prontuário e os formatos de saída. Todos os documentos saem com a marca, o emblema do país e os dados de contato do escritório.',
        'Choose the sections to include in the technical file and the output formats. Every document carries the branding, the country emblem and the office contact details.') }),
      h('div', { class: 'exp-acoes-sel' }, [
        h('button', { class: 'btn mini ghost', text: L('☑ Selecionar todos', '☑ Select all'), onclick: function () { setAll(true); } }),
        h('button', { class: 'btn mini ghost', text: L('☐ Desmarcar todos', '☐ Clear all'), onclick: function () { setAll(false); } })
      ]),
      h('div', { class: 'exp-titulo-grupo', text: L('Seções do prontuário', 'Technical-file sections') }),
      lista,
      h('div', { class: 'exp-formatos' }, [
        h('div', { class: 'exp-titulo-grupo', text: L('Formatos de saída', 'Output formats') }),
        h('label', { class: 'exp-fmt' }, [fmtWord, h('span', { text: L('Word (.doc) — editável, com figuras e rodapé', 'Word (.doc) — editable, with figures and footer') })]),
        h('label', { class: 'exp-fmt' }, [fmtPdf, h('span', { text: L('PDF (impressão / assinatura)', 'PDF (print / signature)') })]),
        h('label', { class: 'exp-fmt' }, [fmtXls, h('span', { text: L('Planilha (.xls) — editável (entrada, resultados, materiais, verificações)', 'Spreadsheet (.xls) — editable (input, results, materials, checks)') })]),
        h('label', { class: 'exp-fmt exp-capa' }, [incluiCapa, h('span', { text: L('Incluir capa institucional', 'Include institutional cover page') })])
      ])
    ]);

    var m = modal(L('Gerar Prontuário Completo', 'Generate Complete Technical File'), corpo, [
      h('button', { class: 'btn ghost', text: L('Cancelar', 'Cancel'), onclick: function () { m.fechar(); } }),
      h('button', { class: 'btn primary', text: L('⭳ Gerar documentos', '⭳ Generate documents'), onclick: function () {
        var ids = Object.keys(checks).filter(function (id) { return checks[id].checked; });
        if (!ids.length) { toast(L('Selecione ao menos uma seção.', 'Select at least one section.'), 'erro'); return; }
        if (!fmtWord.checked && !fmtPdf.checked && !fmtXls.checked) { toast(L('Selecione ao menos um formato.', 'Select at least one format.'), 'erro'); return; }
        var html = LV.Prontuario.gerar(R, proj, cfg, { ids: ids, capa: incluiCapa.checked });
        var nome = LV.Export.slug((proj.entrada && proj.entrada.obra) || proj.nome) + '-prontuario';
        LV.Audit.registrar('exportacao', { projeto: proj.nome, secoes: ids.length }).catch(function () {});
        try {
          if (fmtWord.checked) LV.Export.gerarWord(html, nome, R, cfg);
          if (fmtPdf.checked) LV.Export.gerarPDF(html, nome, R, cfg);
          if (fmtXls.checked) LV.Export.gerarExcel(R, proj, cfg, nome);
          toast(L('Documentos gerados.', 'Documents generated.'), 'ok');
          m.fechar();
        } catch (e) { toast(L('Falha ao gerar: ', 'Generation failed: ') + e.message, 'erro'); }
      } })
    ], 'modal-exportar');
  }

  // ---- "Calcule para mim": dimensionamento automático (perfil + cabo ótimos) ----
  function autoDimensionar(proj, aposAplicar) {
    if (LV.DEMO) return LV.demoAviso();
    var e = proj.entrada, inp, r;
    try { inp = montarEntrada(e); } catch (err) { toast(err.message, 'erro'); return; }
    try { r = LV.Engine.otimizar(inp); } catch (err) { toast(err.message, 'erro'); return; }
    if (!r) {
      var ms = modal(L('Sem solução no catálogo', 'No catalog solution'),
        h('div', { class: 'auto-sem' }, [
          h('p', { text: L('Nenhuma combinação de perfil de poste e bitola de cabo do catálogo foi APROVADA em todas as verificações do país selecionado.',
            'No combination of post profile and cable diameter in the catalog PASSED all checks for the selected country.') }),
          h('p', { class: 'muted', text: L('Isso quase sempre indica uma limitação geométrica (zona livre de queda maior que o pé-direito disponível) ou de carga — não algo que um poste maior resolva. Sugestões: aumentar o pé-direito livre, reduzir o vão entre postes, adicionar/limitar o absorvedor de energia da linha, ou reduzir o nº de usuários simultâneos.',
            'This almost always means a geometric limit (required fall clearance exceeds the available headroom) or a load limit — not something a bigger post fixes. Try: increase available headroom, reduce the span between posts, add/limit the line energy absorber, or reduce the number of simultaneous users.') })
        ]),
        [h('button', { class: 'btn primary', text: L('Entendi', 'Got it'), onclick: function () { ms.fechar(); } })]);
      return;
    }
    var pais = LV.Paises ? LV.Paises.get(LV.Paises.getSelecionado()) : null;
    var alt = (r.alternativas || []).map(function (a) {
      return h('li', { text: a.perfil + ' · Ø' + a.caboDiametro + ' mm · ' + a.massaLinear.toFixed(1) + ' kg/m' + (a.utilizacao != null ? ' · ' + L('utilização', 'utilization') + ' ' + (a.utilizacao * 100).toFixed(0) + '%' : '') });
    });
    var util = (r.utilizacao != null) ? (r.utilizacao * 100).toFixed(0) + '%' : '—';
    var corpo = h('div', { class: 'auto-res' }, [
      h('div', { class: 'auto-badge', text: '⚡ ' + L('Solução ótima encontrada', 'Optimal solution found') }),
      h('table', { class: 'auto-tab' }, [
        linhaAuto(L('Perfil do poste', 'Post profile'), r.perfil),
        linhaAuto(L('Diâmetro do cabo', 'Cable diameter'), 'Ø ' + r.caboDiametro + ' mm'),
        linhaAuto(L('Massa linear do poste', 'Post linear mass'), r.massaLinear.toFixed(1) + ' kg/m'),
        linhaAuto(L('Massa por poste (h=' + (Number(e.h) || 1.2).toFixed(2) + ' m)', 'Mass per post (h=' + (Number(e.h) || 1.2).toFixed(2) + ' m)'), r.massaPoste.toFixed(1) + ' kg'),
        linhaAuto(L('Utilização governante', 'Governing utilization'), util),
        linhaAuto(L('Critério normativo', 'Design basis'), pais ? (pais.bandeira + ' ' + L(pais.nome, pais.nomeEn || pais.nome)) : '—'),
        linhaAuto(L('Combinações avaliadas', 'Combinations evaluated'), String(r.testados))
      ]),
      alt.length ? h('div', { class: 'auto-alt' }, [h('div', { class: 'auto-alt-t', text: L('Alternativas válidas (mais pesadas)', 'Valid alternatives (heavier)') }), h('ul', {}, alt)]) : null,
      h('p', { class: 'muted small', text: L('Selecionamos a opção APROVADA mais leve do catálogo (menor custo de material). Você pode aplicá-la ou continuar ajustando manualmente.',
        'We picked the lightest PASSING option in the catalog (lowest material cost). You can apply it or keep adjusting manually.') })
    ]);
    var mr = modal(L('Dimensionamento automático', 'Automatic dimensioning'), corpo, [
      h('button', { class: 'btn ghost', text: L('Fechar', 'Close'), onclick: function () { mr.fechar(); } }),
      h('button', { class: 'btn primary', text: L('✔ Aplicar e ver resultados', '✔ Apply & view results'), onclick: function () {
        e.posteperfil = r.perfil; e.caboDiametro = r.caboDiametro;
        LV.Storage.salvar(proj);
        LV.Audit.registrar('otimizacao', { projeto: proj.nome, perfil: r.perfil, cabo: r.caboDiametro }).catch(function () {});
        mr.fechar();
        if (aposAplicar) aposAplicar();
        LV.UI.irPara('resultados');
      } })
    ], 'modal-auto');
  }
  function linhaAuto(rot, val) { return h('tr', {}, [h('td', { class: 'ar-rot', text: rot }), h('td', { class: 'ar-val', text: val })]); }

  // ---- Comparativo internacional (Brasil × EUA) — a "cereja do bolo" ----
  //  O MESMO projeto avaliado sob cada jurisdição, lado a lado. Como os métodos
  //  de dimensionamento e os limites diferem, um sistema pode ser APROVADO no
  //  Brasil e REPROVADO nos EUA (ou vice-versa) — e isso fica explícito aqui.
  function comparativoInternacional(proj) {
    var cmp;
    try { cmp = LV.Engine.comparar(montarEntrada(proj.entrada)); } catch (e) { return h('div', {}); }
    var atual = LV.Paises ? LV.Paises.getSelecionado() : 'BR';
    var demo = !!LV.DEMO;
    function mask(v) { return demo ? '🔒' : v; }   // oculta os números "de ouro" na demonstração
    function utilPct(R) { return (R && R.poste && R.poste.util) ? (R.poste.util.valor * 100).toFixed(0) + '%' : '—'; }
    function veredito(R) { return R ? R.veredito.aprovado : null; }
    var cols = cmp.codigos.map(function (cod) {
      var R = cmp.resultados[cod], p = LV.Paises ? LV.Paises.get(cod) : { nome: cod, bandeira: '' };
      var ap = veredito(R);
      var met = (R && R.poste && R.poste.metodo) ? R.poste.metodo : ((p.metodoAco) || '');
      return h('div', { class: 'ci-col' + (cod === atual ? ' ativo' : '') }, [
        h('div', { class: 'ci-flag' }, [h('span', { class: 'ci-band', text: p.bandeira || '' }), h('b', { text: L(p.nome, p.nomeEn || p.nome) }), cod === atual ? h('span', { class: 'ci-tag-atual', text: L('atual', 'active') }) : null]),
        h('div', { class: 'ci-verd ' + (ap == null ? 'na' : (ap ? 'ok' : 'fail')), text: ap == null ? '—' : (ap ? L('APROVADO', 'APPROVED') : L('REPROVADO', 'FAILED')) }),
        h('table', { class: 'ci-tab' }, [
          h('tr', {}, [h('td', { text: L('Utilização do poste', 'Post utilization') }), h('td', { class: 'v', text: mask(utilPct(R)) })]),
          h('tr', {}, [h('td', { text: L('Força máx. no trabalhador', 'Max. worker force') }), h('td', { class: 'v', text: p.forcaTrabalhadorMax + ' kN' })]),
          h('tr', {}, [h('td', { text: L('Ancoragem mínima', 'Min. anchorage') }), h('td', { class: 'v', text: (p.ancoragemMin != null ? p.ancoragemMin.toFixed(1) : '—') + ' kN' })]),
          h('tr', {}, [h('td', { text: L('Método de dimensionamento', 'Design method') }), h('td', { class: 'v', text: met })])
        ])
      ]);
    });
    var aviso = cmp.divergem
      ? h('div', { class: 'ci-aviso divergem', text: '⚠ ' + L('Atenção: o veredito DIVERGE entre as jurisdições — o sistema atende uma norma e não atende a outra. Verifique o país de destino antes de emitir o prontuário.',
          'Warning: the verdict DIFFERS across jurisdictions — the system meets one code but not the other. Confirm the destination country before issuing the technical file.') })
      : h('div', { class: 'ci-aviso igual', text: '✔ ' + L('Veredito consistente nas duas jurisdições avaliadas.', 'Consistent verdict across both jurisdictions evaluated.') });
    return h('div', { class: 'ci-card' }, [
      h('div', { class: 'ci-head', text: '🌐 ' + L('Comparativo internacional — mesmo projeto, dois critérios (Brasil × EUA)', 'International comparison — same project, two criteria (Brazil × USA)') }),
      h('div', { class: 'ci-cols' }, cols),
      aviso
    ]);
  }

  // ======================= SOBRE / ABOUT =======================
  function sobre(alvo) {
    H();
    var cfg = LV.Storage.getConfig();
    var pais = LV.Paises ? LV.Paises.get(LV.Paises.getSelecionado()) : null;
    var VERSAO = '2.1';
    var ano = new Date().getFullYear();
    alvo.appendChild(tituloPagina(L('Sobre o software', 'About the software'),
      L('Fabricante, tecnologia e conformidade normativa.', 'Manufacturer, technology and standards compliance.')));

    // Hero — emblema + "Desenvolvido por"
    alvo.appendChild(h('div', { class: 'sobre-hero' }, [
      h('div', { class: 'sh-emblema', html: LV.Report ? LV.Report.emblema(cfg) : '' }),
      h('div', { class: 'sh-info' }, [
        h('div', { class: 'sh-produto', text: 'Linha de Vida' }),
        h('div', { class: 'sh-tagline', text: L('Dimensionamento de linha de vida horizontal (SPIQ) e geração de prontuário técnico auditável.',
          'Horizontal lifeline (PFAS) design and auditable technical-file generation.') }),
        h('div', { class: 'sh-dev' }, [h('span', { text: L('Desenvolvido por ', 'Developed by ') }), h('b', { text: cfg.empresa || 'GD Engenharia e Perícia' })]),
        h('div', { class: 'sh-versao', text: L('Versão ', 'Version ') + VERSAO + (pais ? ' · ' + pais.bandeira + ' ' + L(pais.nome, pais.nomeEn || pais.nome) : '') })
      ])
    ]));

    // Fabricante — dados oficiais
    var dados = [
      [L('Empresa / Fabricante do software', 'Company / Software manufacturer'), cfg.empresa],
      ['CNPJ', cfg.cnpj],
      [L('Responsável técnico', 'Engineer of record'), cfg.responsavel],
      [L('Registro profissional', 'Professional license'), cfg.crea],
      [L('Contato', 'Contact'), cfg.contato],
      [L('Cidade', 'City'), cfg.cidade]
    ].filter(function (l) { return l[1]; });
    var tabF = h('table', { class: 'sobre-tab' });
    dados.forEach(function (l) { tabF.appendChild(h('tr', {}, [h('td', { class: 'sf-rot', text: l[0] }), h('td', { class: 'sf-val', text: l[1] })])); });
    alvo.appendChild(h('div', { class: 'sobre-card' }, [h('h3', { text: L('Fabricante', 'Manufacturer') }), tabF]));

    // O que o software faz
    var recursos = [
      ['⚙', L('Motor de cálculo verificado', 'Verified calculation engine'), L('Reproduz a planilha validada e acrescenta flambagem, cisalhamento, classe de seção, placa de base, vento e energia — com memorial passo a passo auditável.', 'Reproduces the validated spreadsheet and adds buckling, shear, section class, base plate, wind and energy — with an auditable step-by-step report.')],
      ['🌐', L('Bilíngue e internacional', 'Bilingual and international'), L('Brasil (SI · NR-35/ABNT) e EUA (Imperial · OSHA/ANSI Z359), com comparativo lado a lado das duas jurisdições.', 'Brazil (SI · NR-35/ABNT) and USA (Imperial · OSHA/ANSI Z359), with a side-by-side comparison of both jurisdictions.')],
      ['⚡', L('Dimensionamento automático', 'Automatic dimensioning'), L('Encontra a solução aprovada mais leve (menor custo) e permite ajuste manual completo.', 'Finds the lightest passing (lowest-cost) solution and allows full manual override.')],
      ['📑', L('Prontuário completo', 'Complete technical file'), L('Exportação unificada em Word, PDF e planilha editável, com marca, logotipo e rodapé normativo.', 'Unified export to Word, PDF and editable spreadsheet, with branding, logo and standards footer.')],
      ['🔒', L('Acesso seguro e auditoria', 'Secure access and audit trail'), L('Perfis de usuário, senha protegida (PBKDF2) e trilha de auditoria encadeada.', 'User roles, PBKDF2-protected passwords and a tamper-evident audit trail.')],
      ['◎', L('Gestão de ativos', 'Asset management'), L('Controle de inspeções, ensaios, EPI e vencimentos com QR de rastreabilidade.', 'Inspections, load tests, PPE and due-date tracking with a traceability QR code.')]
    ];
    alvo.appendChild(h('div', { class: 'sobre-card' }, [
      h('h3', { text: L('O que o software faz', 'What the software does') }),
      h('div', { class: 'sobre-recursos' }, recursos.map(function (r) {
        return h('div', { class: 'sr-item' }, [h('div', { class: 'sr-ico', text: r[0] }), h('div', {}, [h('b', { text: r[1] }), h('div', { class: 'sr-desc', text: r[2] })])]);
      }))
    ]));

    // Normas atendidas (do país ativo)
    if (pais && pais.normas) {
      alvo.appendChild(h('div', { class: 'sobre-card' }, [
        h('h3', { text: L('Normas atendidas', 'Standards addressed') + ' · ' + (pais.bandeira || '') + ' ' + L(pais.nome, pais.nomeEn || pais.nome) }),
        h('div', { class: 'sobre-normas' }, pais.normas.map(function (n) { return h('span', { class: 'sn-chip', text: n }); }))
      ]));
    }

    // Aviso técnico / responsabilidade
    alvo.appendChild(h('div', { class: 'sobre-nota', text: L(
      'Este software é uma ferramenta de apoio à engenharia. Os resultados devem ser conferidos e assinados por profissional legalmente habilitado (Responsável Técnico), que responde pelo projeto.',
      'This software is an engineering support tool. Results must be reviewed and signed by a legally qualified professional (Engineer of Record), who is responsible for the design.') }));

    // Rodapé de copyright / fabricante
    alvo.appendChild(h('div', { class: 'sobre-copy' }, [
      h('span', { text: '© ' + ano + ' ' + (cfg.empresa || 'GD Engenharia e Perícia Ltda') + '. ' + L('Todos os direitos reservados.', 'All rights reserved.') }),
      h('span', { class: 'sc-dev', text: L('Desenvolvido por ', 'Developed by ') + (cfg.empresa || 'GD Engenharia e Perícia') + ' · Linha de Vida v' + VERSAO })
    ]));
  }

  // ---- Planos / Aquisição de licença (aberto pela faixa e pelas ações bloqueadas na demo) ----
  function demoPlanos() {
    H();
    var WA = 'https://wa.me/5543999259577?text=' + encodeURIComponent('Olá! Tenho interesse na licença do software Linha de Vida (dimensionamento e prontuário da GD Engenharia).');
    var planos = [
      { nome: L('Plano Mensal', 'Monthly'), preco: L('Sob consulta', 'On request'), nota: L('Para começar', 'To start'), dest: false },
      { nome: L('Plano Anual', 'Annual'), preco: L('Sob consulta', 'On request'), nota: L('Melhor custo-benefício', 'Best value'), dest: true }
    ];
    var corpo = h('div', { class: 'demo-planos' }, [
      h('p', { class: 'dp-intro', text: L('Você está na DEMONSTRAÇÃO. Para emitir documentos com validade legal, sem tarjas e com TODOS os dados (materiais, cabo, chumbadores, espaçadores) e exportação em Word/PDF/Excel, adquira uma licença:',
        'You are in the DEMO. To issue legally valid documents, without redaction bars and with ALL data and Word/PDF/Excel export, get a license:') }),
      h('div', { class: 'dp-grid' }, planos.map(function (p) {
        return h('div', { class: 'dp-card' + (p.dest ? ' dp-dest' : '') }, [
          p.dest ? h('div', { class: 'dp-tag', text: L('Recomendado', 'Recommended') }) : null,
          h('div', { class: 'dp-nome', text: p.nome }),
          h('div', { class: 'dp-preco', text: p.preco }),
          h('div', { class: 'dp-nota', text: p.nota })
        ]);
      })),
      h('div', { class: 'dp-pub' }, [
        h('div', { class: 'dp-pub-item', text: '⚖️ ' + L('Para peritos e engenheiros — laudos e prontuários com validade legal.', 'For experts and engineers — legally valid reports.') }),
        h('div', { class: 'dp-pub-item', text: '🏢 ' + L('Para seguradoras — verificação de conformidade e análise de sinistros.', 'For insurers — compliance verification and claim analysis.') })
      ])
    ]);
    var m = modal(L('Adquirir licença', 'Get a license'), corpo, [
      h('a', { class: 'btn primary', href: WA, target: '_blank', rel: 'noopener', text: L('✆ Falar com a GD Engenharia', '✆ Talk to GD Engenharia') }),
      h('button', { class: 'btn ghost', text: L('Continuar na demonstração', 'Continue demo'), onclick: function () { m.fechar(); } })
    ], 'modal-planos');
  }
  LV.demoPlanos = demoPlanos;

  LV.Views = { painel: painel, projeto: projeto, resultados: resultados, prontuario: prontuario, conformidade: conformidade, registros: registros, admin: admin, sobre: sobre };
})(typeof self !== 'undefined' ? self : this);
