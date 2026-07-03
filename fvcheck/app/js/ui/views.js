/* ============================================================================
 *  FV-CHECK · GD ENGENHARIA — Verificação Estrutural Expressa p/ FV em Telhado
 *  views.js — Telas: landing, autenticação, painel, wizard, resultado,
 *             laudos, planos, conta e normas
 * ========================================================================== */
(function (root) {
  'use strict';

  function UI() { return root.FV.UI; }
  function Auth() { return root.FV.Auth; }
  function Dados() { return root.FV.Dados; }

  var esc = function (s) { return root.FV.UI.esc(s); };

  /* ======================= helpers de formulário ======================== */
  function campo(id, rotulo, tipo, valor, extra) {
    return '<div class="campo"><label class="rot" for="' + id + '">' + rotulo + '</label>' +
      '<input class="inp" id="' + id + '" type="' + (tipo || 'text') + '" value="' + esc(valor == null ? '' : valor) + '" ' + (extra || '') + '></div>';
  }
  function selectC(id, rotulo, opcoes, valorSel, hint) {
    var h = '<div class="campo"><label class="rot" for="' + id + '">' + rotulo + '</label><select class="inp" id="' + id + '">';
    opcoes.forEach(function (o) {
      h += '<option value="' + esc(o.id) + '"' + (String(o.id) === String(valorSel) ? ' selected' : '') + '>' + esc(o.nome) + '</option>';
    });
    h += '</select>' + (hint ? '<div class="micro">' + hint + '</div>' : '') + '</div>';
    return h;
  }
  function radioCards(nome, opcoes, valorSel) {
    var h = '<div class="radio-cards">';
    opcoes.forEach(function (o) {
      h += '<label class="radio-card' + (o.id === valorSel ? ' sel' : '') + '">' +
        '<input type="radio" name="' + nome + '" value="' + esc(o.id) + '"' + (o.id === valorSel ? ' checked' : '') + '>' +
        '<b>' + esc(o.nome) + '</b>' + (o.sub ? '<span>' + esc(o.sub) + '</span>' : '') + '</label>';
    });
    return h + '</div>';
  }
  function badgeSem(s, mini) {
    var m = { verde: ['VERDE', 'ok'], atencao: ['ATENÇÃO', 'at'], reprovado: ['REPROVADO', 're'] }[s] || ['—', 'at'];
    return '<span class="badge sem-' + m[1] + (mini ? ' mini' : '') + '">' + m[0] + '</span>';
  }
  function luzes(s) {
    return '<span class="luzes"><i class="lz r' + (s === 'reprovado' ? ' on' : '') + '"></i><i class="lz a' + (s === 'atencao' ? ' on' : '') + '"></i><i class="lz v' + (s === 'verde' ? ' on' : '') + '"></i></span>';
  }

  /* ============================ LANDING ================================= */
  function landing() {
    var P = Dados().PRECOS;
    var planosHtml = P.planos.map(function (p) {
      return '<div class="plano-card' + (p.destaque ? ' destaque' : '') + '">' +
        (p.destaque ? '<div class="plano-tag">MAIS ESCOLHIDO</div>' : '') +
        '<h3>' + esc(p.nome) + '</h3>' +
        '<div class="plano-preco">R$ ' + p.mensal + '<span>/mês</span></div>' +
        '<div class="micro">ou R$ ' + p.anual.toLocaleString('pt-BR') + '/ano (2 meses grátis)</div>' +
        '<ul>' + p.recursos.map(function (r) { return '<li>' + esc(r) + '</li>'; }).join('') + '</ul>' +
        '<a class="btn primary block" href="#/registro">Testar grátis ' + P.trialDias + ' dias</a></div>';
    }).join('');

    UI().render(
      '<div class="landing">' +
      '<header class="ld-topo"><div class="ld-marca"><b>FV-CHECK</b><span>GD Engenharia</span></div>' +
      '<nav><a href="#como">Como funciona</a><a href="#planos">Planos</a><a href="#faq">Dúvidas</a>' +
      '<a class="btn ghost mini" href="#/entrar">Entrar</a><a class="btn primary mini" href="#/registro">Criar conta</a></nav></header>' +

      '<section class="ld-hero"><div class="ld-hero-txt">' +
      '<div class="ld-chip">NBR 8800 · NBR 6123 · NBR 8681 · NBR 14762</div>' +
      '<h1>O telhado aguenta a usina solar?<br><em>Descubra em 3 minutos.</em></h1>' +
      '<p>Feito para o <b>instalador</b>, não para o engenheiro: responda perguntas simples (distância entre treliças e terças, tipo de telha, se o barracão é aberto ou fechado, o que tem ao redor) e receba o <b>semáforo técnico</b> calculado pelas normas brasileiras — com memorial e, quando precisar, o <b>laudo assinado com ART</b> pela rede de calculistas.</p>' +
      '<div class="ld-cta"><a class="btn primary grande" href="#/registro">Começar grátis</a>' +
      '<a class="btn ghost grande" href="index.html?demo=1#/app">Ver demonstração</a></div>' +
      '<div class="micro">Sem cartão de crédito · ' + P.trialDias + ' dias grátis · seus dados ficam no seu navegador</div></div>' +
      '<div class="ld-hero-sem"><div class="sem-demo">' +
      '<div class="sd-luzes"><i class="lz r"></i><i class="lz a"></i><i class="lz v on"></i></div>' +
      '<b>VERDE — APTO PELO MÉTODO EXPRESSO</b>' +
      '<div class="sd-itens"><span>Flexão da terça <b class="tv">0,18</b></span><span>Levantamento (vento) <b class="tv">0,46</b></span><span>Flecha L/180 <b class="tv">0,13</b></span><span>Telha <b class="tv">0,64</b></span><span>Acréscimo global <b class="tv">4,7%</b></span></div>' +
      '<div class="micro">Exemplo real: galpão 20×40 m · Ue 200×75 · 96 módulos · 56 kWp</div></div></div></section>' +

      '<section class="ld-dor"><h2>A responsabilidade é enorme. A ferramenta, até hoje, não existia.</h2>' +
      '<div class="ld-3col">' +
      '<div><b>O problema</b><p>Milhares de usinas são instaladas sobre galpões sem qualquer verificação. Telhado que colapsa = prejuízo milionário, seguro negado e responsabilidade civil do integrador.</p></div>' +
      '<div><b>A triagem</b><p>O FV-CHECK roda as verificações simplificadas das normas brasileiras e devolve um semáforo claro: <b class="c-ok">verde</b>, <b class="c-at">atenção</b> ou <b class="c-re">reprovado</b> — com memorial imprimível.</p></div>' +
      '<div><b>O laudo</b><p>Precisou de assinatura? Um clique envia o dossiê completo ao calculista da rede, que emite o laudo com ART — sem retrabalho de levantamento.</p></div></div></section>' +

      '<section class="ld-como" id="como"><h2>Como funciona</h2><div class="ld-passos">' +
      '<div class="passo"><i>1</i><b>Meça e responda</b><p>Com a trena na mão: distância entre treliças, entre terças, tipo de telha e do perfil. A gente ensina a identificar cada um.</p></div>' +
      '<div class="passo"><i>2</i><b>Conte sobre o local</b><p>Barracão aberto ou fechado? Campo aberto ou cercado de casas e árvores? O vento da NBR 6123 é calculado sozinho.</p></div>' +
      '<div class="passo"><i>3</i><b>Receba o semáforo</b><p>7 verificações explicadas em português claro, figuras técnicas, memorial imprimível e reserva de capacidade.</p></div></div></section>' +

      '<section class="ld-planos" id="planos"><h2>Planos</h2><div class="planos-grid">' + planosHtml + '</div>' +
      '<p class="ld-laudo-info">Laudo assinado com ART: a partir de <b>R$ ' + P.laudo.base.toLocaleString('pt-BR') + '</b> (até 500 m²) · prazo ' + P.laudo.prazoDias + ' dias úteis · emitido por engenheiro da rede.</p></section>' +

      '<section class="ld-faq" id="faq"><h2>Perguntas frequentes</h2>' +
      '<details><summary>O semáforo verde substitui o laudo de engenheiro?</summary><p>Não. O método expresso é uma <b>triagem</b> técnica que reduz risco e retrabalho. Instalação segue exigindo a responsabilidade técnica aplicável — e o FV-CHECK facilita justamente a contratação do laudo quando indicado.</p></details>' +
      '<details><summary>Quais estruturas são suportadas?</summary><p>Coberturas metálicas (terças U, U enrijecido, Z, tubo e perfis W) com telha de fibrocimento, metálica, sanduíche ou zipada, e módulos em montagem coplanar. Madeira/cerâmica e montagens inclinadas são direcionadas ao laudo completo.</p></details>' +
      '<details><summary>De onde vêm os cálculos?</summary><p>NBR 6123 (vento), NBR 8681/6120 (ações e combinações), NBR 8800 e NBR 14762 (resistências), com envoltórias conservadoras documentadas no memorial e na página “Normas &amp; Método”.</p></details>' +
      '<details><summary>Meus projetos ficam onde?</summary><p>Nesta versão, no armazenamento local do seu navegador (com backup exportável). Nenhum dado sai da sua máquina sem sua ação.</p></details></section>' +

      '<footer class="ld-rodape"><b>FV-CHECK</b> · GD Engenharia e Perícia Ltda · CNPJ 54.705.748/0001-19 · Eng. Civil Gustavo F. F. Domingos · CREA 140.964-D/PR<br><span class="micro">Ferramenta de triagem — não substitui projeto/laudo assinado com ART.</span></footer>' +
      '</div>');
  }

  /* ============================ AUTH ==================================== */
  function registro() {
    UI().render(
      '<div class="auth-wrap"><div class="auth-card">' +
      '<div class="auth-marca"><div class="am-titulo">FV-CHECK</div><div class="am-sub">Verificação estrutural expressa · fotovoltaico em telhado</div></div>' +
      '<h2>' + (Auth().temContas() ? 'Criar nova conta' : 'Criar conta administradora') + '</h2>' +
      '<div id="a-erro"></div>' +
      campo('r-nome', 'Seu nome', 'text', '') +
      campo('r-empresa', 'Empresa (integradora)', 'text', '') +
      campo('r-email', 'E-mail', 'email', '') +
      campo('r-login', 'Login', 'text', '', 'autocomplete="username"') +
      campo('r-senha', 'Senha', 'password', '', 'autocomplete="new-password"') +
      '<div class="forca-wrap"><div class="forca-bar s0" id="r-forca"></div></div>' +
      '<button class="btn primary block" id="r-criar">Criar conta e ativar ' + Dados().PRECOS.trialDias + ' dias grátis</button>' +
      '<div class="auth-rodape">Já tem conta? <a href="#/entrar">Entrar</a> · <a href="#/landing">Voltar ao site</a></div>' +
      '</div></div>');
    UI().on('r-senha', 'input', function () {
      var f = root.FV.Crypto.forcaSenha(UI().val('r-senha'));
      UI().el('r-forca').className = 'forca-bar s' + f;
      UI().el('r-forca').style.width = (f * 25) + '%';
    });
    UI().on('r-criar', 'click', function () {
      Auth().criarConta({
        nome: UI().val('r-nome'), empresa: UI().val('r-empresa'), email: UI().val('r-email'),
        login: UI().val('r-login'), senha: UI().val('r-senha')
      }).then(function (conta) {
        return Auth().entrar(conta.login, UI().val('r-senha'));
      }).then(function () {
        UI().toast('Conta criada! Bem-vindo ao FV-CHECK.', 'ok');
        UI().ir('/app');
      }).catch(function (e) {
        UI().el('a-erro').innerHTML = '<div class="auth-erro">' + esc(e.message) + '</div>';
      });
    });
  }

  function entrar() {
    UI().render(
      '<div class="auth-wrap"><div class="auth-card">' +
      '<div class="auth-marca"><div class="am-titulo">FV-CHECK</div><div class="am-sub">Verificação estrutural expressa · fotovoltaico em telhado</div></div>' +
      '<h2>Entrar</h2><div id="a-erro"></div>' +
      campo('l-login', 'Login', 'text', '', 'autocomplete="username"') +
      campo('l-senha', 'Senha', 'password', '', 'autocomplete="current-password"') +
      '<button class="btn primary block" id="l-entrar">Entrar</button>' +
      '<div class="auth-rodape">' + (Auth().temContas() ? 'Nova equipe? ' : 'Primeiro acesso? ') + '<a href="#/registro">Criar conta</a> · <a href="#/landing">Voltar ao site</a></div>' +
      '</div></div>');
    function tentar() {
      Auth().entrar(UI().val('l-login'), UI().val('l-senha')).then(function () {
        UI().ir('/app');
      }).catch(function (e) {
        UI().el('a-erro').innerHTML = '<div class="auth-erro">' + esc(e.message) + '</div>';
      });
    }
    UI().on('l-entrar', 'click', tentar);
    UI().on('l-senha', 'keydown', function (ev) { if (ev.key === 'Enter') tentar(); });
  }

  /* ============================ DEMO ==================================== */
  function iniciarDemo() {
    var SENHA = 'Demo@Fv2026';
    var pronto = function () {
      Auth().entrar('demo', SENHA).then(function () {
        var St = root.FV.Storage, Eng = root.FV.Engine, Val = root.FV.Validate;
        if (!St.projetos().length) {
          [Dados().EXEMPLO, Dados().EXEMPLO_CRITICO].forEach(function (ex) {
            var v = Val.validar(ex);
            if (!v.ok) return;
            var R = Eng.verificar(v.inp);
            St.salvarProjeto({ entrada: v.inp, resumo: resumo(R) });
          });
        }
        UI().toast('Modo demonstração: conta demo com projetos de exemplo.', 'info');
        UI().ir('/app');
      });
    };
    if (Auth().contas().some(function (c) { return c.login === 'demo'; })) return pronto();
    Auth().criarConta({ nome: 'Demonstração', empresa: 'Integradora Demo', login: 'demo', senha: SENHA })
      .then(pronto)
      .catch(function () { UI().ir('/entrar'); });
  }

  function resumo(R) {
    return {
      semaforo: R.semaforo, kwp: R.modelo.kwp, area: R.modelo.areaSuperficie,
      modulos: R.modelo.inp.numModulos, laudoObrigatorio: R.laudoObrigatorio
    };
  }

  /* ============================ SHELL =================================== */
  function shell(ativo, conteudo) {
    var s = Auth().sessaoAtual, lic = Auth().estadoLicenca();
    var licTxt = lic.ok
      ? (lic.trial ? 'Avaliação: ' + lic.diasRestantes + ' dia(s) restante(s)' : 'Plano ' + esc(lic.lic.plano) + ' · ' + lic.diasRestantes + ' dia(s)')
      : 'Licença expirada';
    function link(rota, ico, nome) {
      return '<a class="sb-link' + (ativo === rota ? ' ativo' : '') + '" href="#/' + rota + '"><span class="ico">' + ico + '</span>' + nome + '</a>';
    }
    UI().render(
      '<div class="shell"><aside class="sidebar">' +
      '<div class="sb-marca"><b>FV-CHECK</b><span>fotovoltaico em telhado · GD Engenharia</span></div>' +
      '<nav class="sb-nav">' +
      link('app', '▦', 'Painel') +
      link('nova', '＋', 'Nova verificação') +
      link('laudos', '✓', 'Laudos assinados') +
      link('planos', '◈', 'Planos & Licença') +
      link('conta', '⚙', 'Conta & Segurança') +
      link('normas', '§', 'Normas & Método') +
      '</nav>' +
      '<div class="sb-rodape"><div class="sb-user"><b>' + esc(s.nome) + '</b><span>' + esc(s.login) + ' · ' + (s.papel === 'admin' ? 'administrador' : 'usuário') + '</span></div>' +
      '<div class="sb-lic micro' + (lic.ok ? '' : ' expirada') + '">' + licTxt + '</div>' +
      '<button class="btn mini block" id="btn-sair">Sair</button></div></aside>' +
      '<main class="conteudo">' + conteudo + '</main></div>');
    UI().on('btn-sair', 'click', function () { Auth().sair(); UI().ir('/landing'); });
  }

  /* ============================ PAINEL ================================== */
  function painel() {
    var St = root.FV.Storage;
    var projetos = St.projetos(), laudos = St.laudos();
    var kwp = 0, cont = { verde: 0, atencao: 0, reprovado: 0 };
    projetos.forEach(function (p) {
      if (p.resumo) { kwp += p.resumo.kwp || 0; if (cont[p.resumo.semaforo] != null) cont[p.resumo.semaforo]++; }
    });
    var cards = projetos.map(function (p) {
      var r = p.resumo || {};
      return '<div class="card"><div class="card-top"><b>' + esc(p.entrada.nome) + '</b>' + luzes(r.semaforo) + '</div>' +
        '<div class="card-sub">' + esc(p.entrada.cliente || '—') + ' · ' + esc((p.entrada.cidade || '') + '/' + (p.entrada.uf || '')) + '</div>' +
        '<div class="card-sub">' + (r.kwp ? r.kwp.toFixed(1).replace('.', ',') + ' kWp · ' + r.modulos + ' módulos · ' : '') + badgeSem(r.semaforo, true) + '</div>' +
        '<div class="card-sub micro">Atualizado em ' + UI().dataBr(p.atualizadoEm) + '</div>' +
        '<div class="card-acoes">' +
        '<a class="btn mini primary" href="#/projeto/' + p.id + '">Abrir resultado</a>' +
        '<a class="btn mini" href="#/nova/' + p.id + '">Editar</a>' +
        '<button class="btn mini danger" data-del="' + p.id + '">Excluir</button></div></div>';
    }).join('');

    shell('app',
      '<div class="pg-titulo"><h1>Painel do integrador</h1><div class="muted">Triagem estrutural das suas usinas em telhado</div></div>' +
      '<div class="stats"><div class="stat"><b>' + projetos.length + '</b><span>verificações</span></div>' +
      '<div class="stat"><b>' + kwp.toFixed(0) + '</b><span>kWp analisados</span></div>' +
      '<div class="stat ok"><b>' + cont.verde + '</b><span>verdes</span></div>' +
      '<div class="stat at"><b>' + cont.atencao + '</b><span>atenção</span></div>' +
      '<div class="stat re"><b>' + cont.reprovado + '</b><span>reprovados</span></div>' +
      '<div class="stat"><b>' + laudos.length + '</b><span>laudos solicitados</span></div></div>' +
      '<div class="toolbar"><a class="btn primary" href="#/nova">＋ Nova verificação</a>' +
      '<button class="btn" id="btn-exemplo">Carregar exemplo</button>' +
      '<button class="btn" id="btn-backup">Exportar backup</button>' +
      '<label class="btn arquivo">Importar backup<input type="file" id="inp-importar" accept=".json" hidden></label></div>' +
      (projetos.length ? '<div class="cards">' + cards + '</div>'
        : '<div class="vazio">Nenhuma verificação ainda. Clique em <b>Nova verificação</b> ou em <b>Carregar exemplo</b> para ver o sistema em ação.</div>'));

    document.querySelectorAll('[data-del]').forEach(function (b) {
      b.addEventListener('click', function () {
        if (confirm('Excluir esta verificação?')) { St.excluirProjeto(b.getAttribute('data-del')); painel(); }
      });
    });
    UI().on('btn-exemplo', 'click', function () {
      var Val = root.FV.Validate, Eng = root.FV.Engine;
      var v = Val.validar(Dados().EXEMPLO);
      var R = Eng.verificar(v.inp);
      var p = St.salvarProjeto({ entrada: v.inp, resumo: resumo(R) });
      UI().ir('/projeto/' + p.id);
    });
    UI().on('btn-backup', 'click', function () {
      UI().baixar('fvcheck-backup-' + new Date().toISOString().slice(0, 10) + '.json', St.exportarBackup());
      UI().toast('Backup exportado.', 'ok');
    });
    UI().on('inp-importar', 'change', function (ev) {
      var f = ev.target.files[0];
      if (!f) return;
      var r = new FileReader();
      r.onload = function () {
        try { var res = St.importarBackup(r.result); UI().toast(res.novosProjetos + ' projeto(s) importado(s).', 'ok'); painel(); }
        catch (e) { UI().toast(e.message, 'erro'); }
      };
      r.readAsText(f);
    });
  }

  /* ============================ WIZARD ================================== */
  var _wiz = { etapa: 1, dados: null };

  function wizard(projetoId) {
    if (!_wiz.dados || _wiz.projetoId !== projetoId || _wiz.finalizado) {
      var base = null;
      if (projetoId) {
        var p = root.FV.Storage.projeto(projetoId);
        if (p) base = JSON.parse(JSON.stringify(p.entrada));
      }
      _wiz = { etapa: 1, projetoId: projetoId || null, finalizado: false, dados: base || { ambiente: 'campo', s1: 'plano', s3: 'g2', fechamento: 'fechado', tipoTelhado: '2aguas', estruturaPrincipal: 'metalica', tercaMaterial: 'aco', continuidade: 'continua3', correntes: 1, conservacao: 'bom', fixacao: 'terca', montagem: 'coplanar', trilhos: Dados().TRILHOS_PADRAO, acoId: 'DESCONHECIDO' } };
    }
    renderEtapa();
  }

  var ETAPAS = ['O projeto', 'Local e vento', 'O galpão', 'Estrutura do telhado', 'A telha', 'Os painéis'];

  function barraEtapas() {
    return '<div class="wiz-barra">' + ETAPAS.map(function (nome, i) {
      var n = i + 1, cls = n < _wiz.etapa ? 'feita' : (n === _wiz.etapa ? 'ativa' : '');
      return '<div class="wiz-et ' + cls + '"><i>' + (n < _wiz.etapa ? '✓' : n) + '</i><span>' + nome + '</span></div>';
    }).join('<div class="wiz-tra"></div>') + '</div>';
  }

  function dica(txt) { return '<div class="dica">💡 ' + txt + '</div>'; }

  function coletarEtapa() {
    var d = _wiz.dados, v = function (id) { return UI().val(id); };
    function radio(nome, atual) {
      var r = document.querySelector('input[name="' + nome + '"]:checked');
      return r ? r.value : atual;
    }
    switch (_wiz.etapa) {
      case 1:
        d.nome = v('w-nome'); d.cliente = v('w-cliente'); d.cidade = v('w-cidade'); d.uf = v('w-uf');
        break;
      case 2:
        d.v0 = v('w-v0'); d.ambiente = radio('w-amb', d.ambiente);
        d.s1 = v('w-s1'); d.fechamento = radio('w-fech', d.fechamento);
        break;
      case 3:
        d.tipoTelhado = radio('w-tipo', d.tipoTelhado); d.largura = v('w-larg'); d.comprimento = v('w-comp');
        d.peDireito = v('w-pd'); d.inclinacao = v('w-incl');
        break;
      case 4:
        d.estruturaPrincipal = radio('w-estr', d.estruturaPrincipal);
        d.tercaMaterial = radio('w-tmat', d.tercaMaterial);
        d.perfilId = v('w-perfil') || d.perfilId;
        if (d.perfilId === 'CUSTOM') d.perfilCustom = { type: v('w-pc-type'), bw: v('w-pc-bw'), bf: v('w-pc-bf'), D: v('w-pc-D'), t: v('w-pc-t') };
        d.acoId = v('w-aco') || d.acoId; d.vaoTerca = v('w-vao'); d.espacamento = v('w-esp');
        d.correntes = v('w-corr'); d.continuidade = v('w-cont'); d.conservacao = v('w-cons');
        break;
      case 5:
        d.telhaId = radio('w-telha', d.telhaId);
        break;
      case 6:
        d.moduloId = v('w-mod');
        if (d.moduloId === 'MCUSTOM') d.moduloCustom = { comp: v('w-mc-comp'), larg: v('w-mc-larg'), kg: v('w-mc-kg'), wp: v('w-mc-wp') };
        d.numModulos = v('w-num'); d.trilhos = v('w-trilhos');
        d.fixacao = radio('w-fix', d.fixacao); d.montagem = radio('w-mont', d.montagem);
        break;
    }
  }

  function etapaHtml() {
    var d = _wiz.dados, D = Dados();
    switch (_wiz.etapa) {
      case 1:
        var ufs = Object.keys(D.V0_UF).map(function (u) { return { id: u, nome: u }; });
        ufs.unshift({ id: '', nome: '— selecione —' });
        return '<div class="form-sec"><h3>Sobre o projeto</h3><div class="grid-campos">' +
          campo('w-nome', 'Nome do projeto *', 'text', d.nome, 'placeholder="Ex.: Galpão do Sr. João — 56 kWp"') +
          campo('w-cliente', 'Cliente', 'text', d.cliente) +
          campo('w-cidade', 'Cidade', 'text', d.cidade) +
          selectC('w-uf', 'Estado (UF) *', ufs, d.uf) + '</div>' +
          dica('O Estado define automaticamente a força do vento da sua região (mapa da NBR 6123). Você poderá ajustar no próximo passo.') + '</div>';
      case 2:
        return '<div class="form-sec"><h3>O que existe ao redor do galpão?</h3>' +
          '<p class="explica">O vento é o maior inimigo do telhado com painéis. Quanto mais aberto o local, mais forte ele bate.</p>' +
          radioCards('w-amb', D.AMBIENTES, d.ambiente) + '</div>' +
          '<div class="form-sec"><h3>O terreno e o barracão</h3><div class="grid-campos">' +
          selectC('w-s1', 'Como é o terreno?', D.S1_OPCOES, d.s1) +
          campo('w-v0', 'Força do vento na região (m/s) *', 'number', d.v0 || (d.uf ? D.V0_UF[d.uf] : ''), 'step="1" min="25" max="60"') +
          '</div>' +
          dica('Deixamos o valor típico do seu Estado (com folga de segurança). Se um engenheiro já te passou o V0 da cidade, use o valor dele.') +
          '<h3 class="sub">O barracão fica normalmente…</h3>' +
          radioCards('w-fech', [
            { id: 'fechado', nome: '🚪 Fechado', sub: 'Portões e janelas normalmente fechados' },
            { id: 'aberto', nome: '🌬️ Aberto de um lado', sub: 'Sem portão / sempre aberto — o vento entra e empurra o telhado por dentro' }
          ], d.fechamento) + '</div>';
      case 3:
        return '<div class="form-sec"><h3>O telhado é…</h3>' +
          radioCards('w-tipo', [
            { id: '2aguas', nome: '🏠 Duas águas', sub: 'Cai para os dois lados' },
            { id: '1agua', nome: '📐 Uma água só', sub: 'Meia-água / shed, cai para um lado' }
          ], d.tipoTelhado) + '</div>' +
          '<div class="form-sec"><h3>Medidas do galpão (em metros)</h3><div class="grid-campos">' +
          campo('w-larg', 'Largura (lado menor) *', 'number', d.largura, 'step="0.1" placeholder="ex.: 20"') +
          campo('w-comp', 'Comprimento (lado maior) *', 'number', d.comprimento, 'step="0.1" placeholder="ex.: 40"') +
          campo('w-pd', 'Altura da parede até o início do telhado *', 'number', d.peDireito, 'step="0.1" placeholder="ex.: 6"') +
          campo('w-incl', 'Inclinação do telhado (%) *', 'number', d.inclinacao, 'step="0.5" placeholder="ex.: 10"') +
          '</div>' +
          dica('Não sabe a inclinação? Meça quanto o telhado <b>sobe</b> em 1 metro na horizontal: subiu 10 cm = 10%. Telha metálica costuma ter 5 a 15%; fibrocimento, 15 a 27%.') + '</div>';
      case 4:
        var grupos = { U: 'Perfil U (tipo “C” aberto)', UE: 'Perfil U enrijecido (“C” com dobrinha na ponta)', Z: 'Perfil Z (“Z” com dobrinha)', TR: 'Metalon (tubo retangular fechado)', W: 'Viga “I” de aço', CUSTOM: 'Outro' };
        var perfis = D.PERFIS.map(function (p) { return { id: p.id, nome: (grupos[p.type] ? grupos[p.type] + ' — ' : '') + p.nome }; });
        var custom = d.perfilCustom || {};
        var tercaAco = d.tercaMaterial !== 'concreto' && d.tercaMaterial !== 'madeira';
        return '<div class="form-sec"><h3>A estrutura principal (pilares e treliças/tesouras) é de…</h3>' +
          radioCards('w-estr', D.ESTRUTURAS_PRINCIPAIS, d.estruturaPrincipal) + '</div>' +
          '<div class="form-sec"><h3>As terças (os “ferros” onde a telha é parafusada) são de…</h3>' +
          radioCards('w-tmat', D.TERCA_MATERIAIS, d.tercaMaterial) +
          '<div id="w-terca-aviso" class="av aviso" style="display:' + (tercaAco ? 'none' : 'block') + '">Terças de concreto ou madeira ficam fora da verificação expressa — ao final você poderá solicitar o laudo completo com um engenheiro da rede.</div></div>' +
          '<div class="form-sec" id="w-terca-aco" style="display:' + (tercaAco ? 'block' : 'none') + '"><h3>Sobre as terças de aço</h3>' +
          dica('<b>Como identificar o perfil:</b> olhe a terça de lado (corte). “C” aberto = perfil U · “C” com uma dobrinha virada para dentro na ponta = U enrijecido · formato de “Z” = perfil Z · tubo retangular fechado = metalon. Meça com trena: altura, largura e a espessura da chapa (use um paquímetro ou compare: cartão de crédito ≈ 0,8 mm).') +
          '<div class="grid-campos">' +
          selectC('w-perfil', 'Perfil da terça *', perfis, d.perfilId) +
          selectC('w-aco', 'Tipo de aço (se não souber, deixe “Não sei”)', D.ACOS, d.acoId || 'DESCONHECIDO') +
          campo('w-vao', 'Distância entre as treliças/tesouras (m) *', 'number', d.vaoTerca, 'step="0.1" placeholder="ex.: 5"') +
          campo('w-esp', 'Distância entre uma terça e outra (m) *', 'number', d.espacamento, 'step="0.05" placeholder="ex.: 1,35"') +
          selectC('w-corr', 'Tem “ferrinhos” (correntes) ligando as terças no meio do vão?', [{ id: 0, nome: 'Não tem' }, { id: 1, nome: 'Sim — 1 linha no meio do vão' }, { id: 2, nome: 'Sim — 2 linhas' }], String(d.correntes)) +
          selectC('w-cont', 'As terças passam direto por cima das treliças?', [{ id: 'biapoiada', nome: 'Não — cada peça vence um vão só (emenda em cima da treliça)' }, { id: 'continua2', nome: 'Sim — cada peça atravessa 2 vãos' }, { id: 'continua3', nome: 'Sim — peças longas, 3 vãos ou mais' }], d.continuidade) +
          selectC('w-cons', 'Estado geral da estrutura', D.CONSERVACAO, d.conservacao) +
          '</div>' +
          dica('<b>Distância entre treliças:</b> meça de um pilar ao próximo, no sentido do comprimento do galpão. <b>Distância entre terças:</b> meça sobre o telhado, de um “ferro” ao outro.') +
          '<div id="w-custom" style="display:' + (d.perfilId === 'CUSTOM' ? 'block' : 'none') + '"><h3 class="sub">Medidas do perfil (mm)</h3><div class="grid-campos">' +
          selectC('w-pc-type', 'Formato', [{ id: 'U', nome: 'U (“C” aberto)' }, { id: 'UE', nome: 'U enrijecido (com dobrinha)' }, { id: 'Z', nome: 'Z enrijecido' }, { id: 'TR', nome: 'Metalon (tubo retangular)' }], custom.type || 'UE') +
          campo('w-pc-bw', 'Altura (mm)', 'number', custom.bw, 'step="1" placeholder="ex.: 150"') +
          campo('w-pc-bf', 'Largura da aba (mm)', 'number', custom.bf, 'step="1" placeholder="ex.: 60"') +
          campo('w-pc-D', 'Dobrinha da ponta (mm)', 'number', custom.D, 'step="1" placeholder="ex.: 20"') +
          campo('w-pc-t', 'Espessura da chapa (mm)', 'number', custom.t, 'step="0.05" placeholder="ex.: 2,65"') +
          '</div></div></div>';
      case 5:
        var telhas = D.TELHAS.map(function (t) {
          return { id: t.id, nome: t.nome, sub: (t.peso * 100).toFixed(0) + ' kgf/m² · vão máx. entre terças ' + t.vaoMax.toFixed(2).replace('.', ',') + ' m' + (t.naoSuportada ? ' · FORA DO ESCOPO' : '') };
        });
        return '<div class="form-sec"><h3>Qual é a telha do galpão?</h3>' + radioCards('w-telha', telhas, d.telhaId) +
          dica('Os valores de peso e vão são típicos de mercado, usados para a triagem — a tabela do fabricante sempre prevalece (isso fica registrado no memorial).') + '</div>';
      case 6:
        var mc = d.moduloCustom || {};
        return '<div class="form-sec"><h3>Os painéis fotovoltaicos</h3><div class="grid-campos">' +
          selectC('w-mod', 'Modelo do painel *', D.MODULOS, d.moduloId) +
          campo('w-num', 'Quantidade de painéis *', 'number', d.numModulos, 'step="1" min="1" placeholder="ex.: 96"') +
          campo('w-trilhos', 'Peso de trilhos + fixações (kN/m²)', 'number', d.trilhos, 'step="0.005"') +
          '</div><div class="micro" id="w-kwp"></div>' +
          '<div id="w-modcustom" style="display:' + (d.moduloId === 'MCUSTOM' ? 'block' : 'none') + '"><h3 class="sub">Painel personalizado</h3><div class="grid-campos">' +
          campo('w-mc-comp', 'Comprimento (m)', 'number', mc.comp, 'step="0.001"') +
          campo('w-mc-larg', 'Largura (m)', 'number', mc.larg, 'step="0.001"') +
          campo('w-mc-kg', 'Peso (kg)', 'number', mc.kg, 'step="0.1"') +
          campo('w-mc-wp', 'Potência (Wp)', 'number', mc.wp, 'step="5"') +
          '</div></div>' +
          '<h3 class="sub">Como os painéis serão presos?</h3>' +
          radioCards('w-fix', [
            { id: 'terca', nome: '🔩 Parafusados nas terças', sub: 'O parafuso atravessa a telha e pega no ferro — recomendado' },
            { id: 'telha', nome: '📎 Presos só na telha', sub: 'Mini-trilho ou grampo — exige ensaio de arrancamento' }
          ], d.fixacao) +
          '<h3 class="sub">Como os painéis serão montados?</h3>' +
          radioCards('w-mont', [
            { id: 'coplanar', nome: '⬇️ Deitados, acompanhando o telhado', sub: 'Coplanar — é o que o método expresso verifica' },
            { id: 'inclinada', nome: '🔺 Levantados em triângulo', sub: 'Muda muito o vento — vai direto para o laudo' }
          ], d.montagem) +
          dica('O peso de trilhos já vem com um valor típico (3 kgf/m²). Se o seu kit informar outro, ajuste.') + '</div>';
    }
    return '';
  }

  function renderEtapa() {
    var ultima = _wiz.etapa === ETAPAS.length;
    shell('nova',
      '<div class="pg-titulo"><h1>' + (_wiz.projetoId ? 'Editar verificação' : 'Nova verificação') + '</h1>' +
      '<div class="muted">Método expresso — NBR 6123 · 8681 · 6120 · 8800 · 14762</div></div>' +
      barraEtapas() +
      '<div id="w-erros"></div>' +
      etapaHtml() +
      '<div class="toolbar">' +
      (_wiz.etapa > 1 ? '<button class="btn" id="w-voltar">← Voltar</button>' : '<a class="btn" href="#/app">Cancelar</a>') +
      '<button class="btn primary" id="w-avancar">' + (ultima ? '⚡ Executar verificação' : 'Avançar →') + '</button></div>');

    // interações específicas
    UI().on('w-perfil', 'change', function () {
      var c = UI().el('w-custom');
      if (c) c.style.display = UI().val('w-perfil') === 'CUSTOM' ? 'block' : 'none';
    });
    document.querySelectorAll('input[name="w-tmat"]').forEach(function (r) {
      r.addEventListener('change', function () {
        var aco = r.value === 'aco';
        if (UI().el('w-terca-aco')) UI().el('w-terca-aco').style.display = aco ? 'block' : 'none';
        if (UI().el('w-terca-aviso')) UI().el('w-terca-aviso').style.display = aco ? 'none' : 'block';
      });
    });
    UI().on('w-mod', 'change', function () {
      var c = UI().el('w-modcustom');
      if (c) c.style.display = UI().val('w-mod') === 'MCUSTOM' ? 'block' : 'none';
      atualizaKwp();
    });
    UI().on('w-num', 'input', atualizaKwp);
    function atualizaKwp() {
      var el = UI().el('w-kwp');
      if (!el) return;
      var mod = Dados().modulo(UI().val('w-mod'));
      var n = parseInt(UI().val('w-num'), 10) || 0;
      if (mod && mod.wp && n) el.textContent = 'Potência estimada: ' + (mod.wp * n / 1000).toFixed(1).replace('.', ',') + ' kWp · área de módulos ' + (mod.comp * mod.larg * n).toFixed(0) + ' m²';
      else el.textContent = '';
    }
    atualizaKwp();
    document.querySelectorAll('.radio-card input').forEach(function (r) {
      r.addEventListener('change', function () {
        document.querySelectorAll('.radio-card').forEach(function (c) { c.classList.remove('sel'); });
        r.closest('.radio-card').classList.add('sel');
      });
    });

    UI().on('w-voltar', 'click', function () { coletarEtapa(); _wiz.etapa--; renderEtapa(); });
    UI().on('w-avancar', 'click', function () {
      coletarEtapa();
      if (!ultima) { _wiz.etapa++; renderEtapa(); return; }
      executar();
    });
  }

  function executar() {
    var Val = root.FV.Validate, Eng = root.FV.Engine, St = root.FV.Storage;
    var v = Val.validar(_wiz.dados);
    if (!v.ok) {
      UI().el('w-erros').innerHTML = '<div class="avisos-box">' +
        v.erros.map(function (e) { return '<div class="av erro">' + esc(e) + '</div>'; }).join('') + '</div>';
      window.scrollTo(0, 0);
      return;
    }
    try {
      var R = Eng.verificar(v.inp);
      var proj = { id: _wiz.projetoId || undefined, entrada: v.inp, resumo: resumo(R), avisosEntrada: v.avisos };
      proj = St.salvarProjeto(proj);
      _wiz.finalizado = true;
      UI().toast('Verificação concluída: ' + R.semaforo.toUpperCase(), R.semaforo === 'verde' ? 'ok' : (R.semaforo === 'reprovado' ? 'erro' : 'info'));
      UI().ir('/projeto/' + proj.id);
    } catch (e) {
      UI().el('w-erros').innerHTML = '<div class="av erro forte">Erro no cálculo: ' + esc(e.message) + '</div>';
    }
  }

  /* ============================ RESULTADO =============================== */
  function resultado(pid) {
    var St = root.FV.Storage, Eng = root.FV.Engine, Mem = root.FV.Memorial, Lau = root.FV.Laudo;
    var proj = St.projeto(pid);
    if (!proj) { UI().toast('Projeto não encontrado.', 'erro'); return UI().ir('/app'); }
    var R;
    try { R = Eng.verificar(proj.entrada); }
    catch (e) { UI().toast('Erro ao recalcular: ' + e.message, 'erro'); return UI().ir('/app'); }
    var m = R.modelo, stx = Mem.SEMAFORO_TXT[R.semaforo];
    var figs = Mem.figuras(R);
    var laudoExistente = St.laudoDoProjeto(pid);
    var orc = Lau.orcamento(m.areaSuperficie);

    // tradução para quem não é engenheiro
    var SIMPLES = {
      V1: 'O ferro do telhado (terça) aguenta o peso da telha + painéis + alguém andando na manutenção?',
      V2: 'O vento consegue “sugar” o telhado e entortar a terça para cima?',
      V2b: 'E quando o vento empurra o telhado para baixo?',
      V3: 'A terça aguenta o esforço de corte perto dos apoios?',
      V4: 'O telhado fica “barrigudo” além do permitido pela norma?',
      V5: 'A telha aguenta o vão entre as terças e as cargas?',
      V6: 'Os parafusos/grampos seguram os painéis quando venta forte?',
      V7: 'A estrutura do galpão inteiro (treliças e pilares) sente o peso extra?'
    };
    var itensHtml = R.itens.map(function (it) {
      var pct = it.ratio == null ? null : Math.min(1.35, it.ratio);
      return '<div class="verif-card st-' + it.status + '">' +
        '<div class="vc-top"><b>' + it.id + ' · ' + esc(it.titulo) + '</b>' + badgeSem(it.status, true) + '</div>' +
        (SIMPLES[it.id] ? '<div class="vc-simples">' + esc(SIMPLES[it.id]) + '</div>' : '') +
        (pct != null ? '<div class="ratio-wrap"><div class="ratio-bar" style="width:' + (pct / 1.35 * 100).toFixed(0) + '%"></div><i class="ratio-lim" style="left:' + (1 / 1.35 * 100).toFixed(0) + '%"></i></div>' +
          '<div class="micro">uso da capacidade: <b>' + Math.round(it.ratio * 100) + '%</b> (limite 100%)</div>' : '') +
        '<details class="vc-tec"><summary>Detalhe técnico</summary><div class="vc-det">' + esc(it.detalhe) + '</div>' +
        '<div class="micro ref">' + esc(it.ref) + '</div></details></div>';
    }).join('');

    var avisosHtml = R.avisos.length ? '<div class="avisos-box">' + R.avisos.map(function (a) {
      var cls = a.tipo === 'erro' ? 'erro forte' : (a.tipo === 'atencao' ? 'aviso' : 'info');
      return '<div class="av ' + cls + '">' + esc(a.msg) + '</div>';
    }).join('') + '</div>' : '';

    shell('app',
      '<div class="pg-titulo"><h1>' + esc(m.inp.nome) + '</h1><div class="muted">' + esc(m.inp.cliente || '') + ' · ' + esc((m.inp.cidade || '') + '/' + (m.inp.uf || '')) + ' · ' + m.kwp.toFixed(1).replace('.', ',') + ' kWp (' + m.inp.numModulos + ' módulos) · cobertura ' + m.areaSuperficie.toFixed(0) + ' m²</div></div>' +

      '<div class="sem-hero tela sem-' + R.semaforo + '">' + luzes(R.semaforo) +
      '<div><b>' + stx.titulo + '</b><p>' + stx.sub + '</p>' +
      (R.reserva && R.reserva.margemKgM2 > 0 && R.semaforo !== 'reprovado' ? '<p class="micro">Reserva de capacidade nas terças: ≈ ' + R.reserva.margemKgM2.toFixed(0) + ' kgf/m² adicionais.</p>' : '') +
      '</div></div>' +

      '<div class="toolbar">' +
      '<button class="btn primary" id="btn-memorial">🖨 Memorial expresso (PDF)</button>' +
      '<button class="btn' + (R.laudoObrigatorio ? ' pulse' : '') + '" id="btn-laudo">✍ Contratar laudo assinado (ART)</button>' +
      '<a class="btn" href="#/nova/' + pid + '">Editar entrada</a>' +
      '<button class="btn" id="btn-dossie">Baixar dossiê (JSON)</button></div>' +

      (laudoExistente ? '<div class="av info">Laudo ' + esc(laudoExistente.protocolo) + ' — status: <b>' + esc((Lau.STATUS[laudoExistente.status] || {}).nome || laudoExistente.status) + '</b> · solicitado em ' + UI().dataBr(laudoExistente.criadoEm) + '</div>' : '') +

      '<div id="painel-laudo" class="laudo-painel" style="display:none">' +
      '<h3>Laudo estrutural assinado — orçamento</h3>' +
      '<p>' + esc(orc.descricao) + '</p>' +
      '<table class="tab"><tr><td>Cobertura</td><td class="val">' + orc.area.toFixed(0) + ' m²</td></tr>' +
      '<tr><td>Base (até 500 m²)</td><td class="val">' + UI().dinheiro(orc.base) + '</td></tr>' +
      (orc.adicional > 0 ? '<tr><td>Adicional (' + (orc.area - 500).toFixed(0) + ' m² × R$ 1,20)</td><td class="val">' + UI().dinheiro(Math.round(orc.adicional)) + '</td></tr>' : '') +
      '<tr><th>Total (ART inclusa)</th><th class="val">' + UI().dinheiro(orc.total) + '</th></tr></table>' +
      '<p class="micro">Emitido por ' + esc(Lau.CALCULISTA.nome) + ' — ' + esc(Lau.CALCULISTA.responsavel) + ' (' + esc(Lau.CALCULISTA.registro) + ') · prazo ' + orc.prazoDias + ' dias úteis.</p>' +
      '<div class="toolbar"><button class="btn primary" id="btn-laudo-confirmar">Enviar solicitação por e-mail</button>' +
      '<button class="btn" id="btn-laudo-fechar">Fechar</button></div></div>' +

      avisosHtml +
      '<h2 class="h-sec">Verificações (7 itens)</h2>' +
      '<div class="verifs">' + itensHtml + '</div>' +
      '<h2 class="h-sec">Figuras técnicas</h2>' +
      '<div class="figuras-grid">' +
      '<div class="fig">' + figs.isometrica + '</div>' +
      '<div class="fig">' + figs.corte + '</div>' +
      '<div class="fig">' + figs.vento + '</div>' +
      '<div class="fig">' + figs.perfil + '</div></div>');

    UI().on('btn-memorial', 'click', function () {
      var lic = Auth().estadoLicenca();
      var html = Mem.gerar(R, { numero: pid.slice(-6).toUpperCase(), trial: lic.trial });
      // injeta figuras no documento impresso
      html = html.replace('</header>', '</header><div class="doc-figs"><div class="fig">' + figs.corte + '</div><div class="fig">' + figs.vento + '</div></div>');
      UI().imprimir(html);
      root.FV.Audit.registrar('memorial_impresso', { projetoId: pid });
    });
    UI().on('btn-laudo', 'click', function () {
      var p = UI().el('painel-laudo');
      p.style.display = p.style.display === 'none' ? 'block' : 'none';
      p.scrollIntoView({ behavior: 'smooth' });
    });
    UI().on('btn-laudo-fechar', 'click', function () { UI().el('painel-laudo').style.display = 'none'; });
    UI().on('btn-laudo-confirmar', 'click', function () {
      var protocolo = laudoExistente ? laudoExistente.protocolo : St.proximoProtocolo();
      var registro = laudoExistente || {};
      registro.projetoId = pid;
      registro.protocolo = protocolo;
      registro.projeto = m.inp.nome;
      registro.valor = orc.total;
      registro.status = registro.status || 'solicitado';
      St.salvarLaudo(registro);
      UI().baixar('fvcheck-dossie-' + protocolo + '.json', JSON.stringify(Lau.dossie(proj, R), null, 2));
      location.href = Lau.linkMailto(proj, R, orc, protocolo);
      UI().toast('Solicitação ' + protocolo + ' registrada. O dossiê JSON foi baixado — anexe-o ao e-mail.', 'ok');
      setTimeout(function () { resultado(pid); }, 1200);
    });
    UI().on('btn-dossie', 'click', function () {
      UI().baixar('fvcheck-dossie-' + pid + '.json', JSON.stringify(Lau.dossie(proj, R), null, 2));
    });
  }

  /* ============================ LAUDOS ================================== */
  function laudos() {
    var St = root.FV.Storage, Lau = root.FV.Laudo;
    var lista = St.laudos();
    var admin = Auth().sessaoAtual.papel === 'admin';
    var linhas = lista.map(function (l) {
      var st = Lau.STATUS[l.status] || { nome: l.status, cor: 'atencao' };
      return '<tr><td class="mono">' + esc(l.protocolo) + '</td><td>' + esc(l.projeto || '—') + '</td>' +
        '<td class="val">' + UI().dinheiro(l.valor || 0) + '</td>' +
        '<td>' + badgeSem(st.cor === 'verde' ? 'verde' : (st.cor === 'fail' ? 'reprovado' : 'atencao'), true) + ' ' + esc(st.nome) + '</td>' +
        '<td>' + UI().dataBr(l.criadoEm) + '</td>' +
        '<td>' + (admin ? '<select class="inp mini" data-laudo="' + l.id + '">' +
          Object.keys(Lau.STATUS).map(function (k) { return '<option value="' + k + '"' + (k === l.status ? ' selected' : '') + '>' + Lau.STATUS[k].nome + '</option>'; }).join('') +
          '</select>' : '—') + '</td></tr>';
    }).join('');
    shell('laudos',
      '<div class="pg-titulo"><h1>Laudos assinados</h1><div class="muted">Solicitações enviadas à rede de calculistas (' + esc(Lau.CALCULISTA.nome) + ')</div></div>' +
      (lista.length ? '<table class="tab"><tr><th>Protocolo</th><th>Projeto</th><th>Valor</th><th>Status</th><th>Data</th><th>Atualizar</th></tr>' + linhas + '</table>'
        : '<div class="vazio">Nenhuma solicitação de laudo ainda. Abra o resultado de uma verificação e clique em <b>Contratar laudo assinado</b>.</div>') +
      '<div class="form-sec"><h3>Como funciona</h3><ol class="lista-limites">' +
      '<li>Você solicita o laudo a partir do resultado — o FV-CHECK gera o <b>dossiê técnico completo</b> (JSON) e o e-mail de solicitação.</li>' +
      '<li>O calculista da rede confere os dados, pode pedir fotos/medições e emite o <b>laudo assinado com ART</b> em até ' + Dados().PRECOS.laudo.prazoDias + ' dias úteis.</li>' +
      '<li>O status pode ser acompanhado nesta tela pelo protocolo.</li></ol></div>');
    document.querySelectorAll('[data-laudo]').forEach(function (sel) {
      sel.addEventListener('change', function () {
        var lst = St.laudos();
        var l = lst.filter(function (x) { return x.id === sel.getAttribute('data-laudo'); })[0];
        if (l) { l.status = sel.value; St.salvarLaudo(l); UI().toast('Status atualizado.', 'ok'); laudos(); }
      });
    });
  }

  /* ============================ PLANOS ================================== */
  function planos() {
    var P = Dados().PRECOS, lic = Auth().estadoLicenca();
    var admin = Auth().sessaoAtual.papel === 'admin';
    var estado = lic.ok
      ? (lic.trial ? '<div class="av aviso">Período de avaliação: <b>' + lic.diasRestantes + ' dia(s) restante(s)</b>. Assine um plano para não interromper o uso.</div>'
        : '<div class="av info">Plano <b>' + esc(lic.lic.plano) + '</b> ativo até ' + UI().dataBr(lic.lic.fim) + ' (' + lic.diasRestantes + ' dias).</div>')
      : '<div class="av erro forte">Licença expirada — ative um plano para continuar usando o FV-CHECK.</div>';
    var cards = P.planos.map(function (p) {
      return '<div class="plano-card' + (p.destaque ? ' destaque' : '') + '">' +
        (p.destaque ? '<div class="plano-tag">MAIS ESCOLHIDO</div>' : '') +
        '<h3>' + esc(p.nome) + '</h3><div class="plano-preco">R$ ' + p.mensal + '<span>/mês</span></div>' +
        '<div class="micro">ou R$ ' + p.anual.toLocaleString('pt-BR') + '/ano</div>' +
        '<ul>' + p.recursos.map(function (r) { return '<li>' + esc(r) + '</li>'; }).join('') + '</ul>' +
        '<button class="btn primary block" data-assinar="' + p.id + '">Assinar (gerar pedido)</button></div>';
    }).join('');
    shell('planos',
      '<div class="pg-titulo"><h1>Planos & Licença</h1><div class="muted">Licença mensal para o integrador + laudos avulsos por ART</div></div>' +
      estado +
      '<div class="planos-grid">' + cards + '</div>' +
      '<div class="form-sec"><h3>Ativar por chave</h3><div class="form-topo">' +
      campo('lic-chave', 'Chave de ativação (GD-FV-…)', 'text', '') +
      '<button class="btn primary" id="btn-ativar">Ativar</button></div>' +
      '<div class="micro">A chave é fornecida após a confirmação do pagamento (nesta versão de demonstração, o pedido gera a chave na hora' + (admin ? '' : ' para o administrador') + ').</div></div>' +
      '<div class="form-sec"><h3>Laudo assinado (avulso)</h3><p>' + esc(P.laudo.descricao) + '</p>' +
      '<p><b>R$ ' + P.laudo.base.toLocaleString('pt-BR') + '</b> até 500 m² + R$ ' + P.laudo.adicionalM2.toFixed(2).replace('.', ',') + '/m² adicional · prazo ' + P.laudo.prazoDias + ' dias úteis · ART inclusa.</p></div>');
    document.querySelectorAll('[data-assinar]').forEach(function (b) {
      b.addEventListener('click', function () {
        var plano = b.getAttribute('data-assinar');
        var chave = Auth().gerarChave(plano, 12);
        // Em produção: checkout → backend → e-mail com a chave. Demo: entrega direta.
        UI().el('lic-chave').value = chave;
        UI().toast('Pedido gerado! Chave anual preenchida — clique em Ativar.', 'ok');
        UI().el('lic-chave').scrollIntoView({ behavior: 'smooth' });
      });
    });
    UI().on('btn-ativar', 'click', function () {
      try {
        var lic2 = Auth().ativarLicenca(UI().val('lic-chave'));
        UI().toast('Plano ' + lic2.plano + ' ativado até ' + UI().dataBr(lic2.fim) + '.', 'ok');
        planos();
      } catch (e) { UI().toast(e.message, 'erro'); }
    });
  }

  /* ============================ CONTA =================================== */
  function conta() {
    var s = Auth().sessaoAtual, admin = s.papel === 'admin';
    var contas = Auth().contas().map(function (c) {
      return '<tr><td>' + esc(c.nome) + '</td><td class="mono">' + esc(c.login) + '</td><td>' + esc(c.email || '—') + '</td><td>' + (c.papel === 'admin' ? '<b>admin</b>' : 'usuário') + '</td><td>' + UI().dataBr(c.criadoEm) + '</td></tr>';
    }).join('');
    shell('conta',
      '<div class="pg-titulo"><h1>Conta & Segurança</h1></div>' +
      '<div class="form-sec"><h3>Trocar minha senha</h3><div class="grid-campos">' +
      campo('c-atual', 'Senha atual', 'password', '') +
      campo('c-nova', 'Nova senha', 'password', '') + '</div>' +
      '<div class="toolbar"><button class="btn primary" id="btn-trocar">Trocar senha</button></div></div>' +
      '<div class="form-sec"><h3>Equipe</h3><table class="tab"><tr><th>Nome</th><th>Login</th><th>E-mail</th><th>Papel</th><th>Desde</th></tr>' + contas + '</table>' +
      (admin ? '<div class="grid-campos" style="margin-top:10px">' +
        campo('u-nome', 'Nome', 'text', '') + campo('u-login', 'Login', 'text', '') + campo('u-senha', 'Senha inicial', 'password', '') +
        '</div><div class="toolbar"><button class="btn" id="btn-add-user">Adicionar usuário</button></div>' : '') + '</div>' +
      '<div class="form-sec"><h3>Trilha de auditoria</h3>' +
      '<div class="toolbar"><button class="btn" id="btn-verificar-cadeia">Verificar integridade da cadeia</button></div>' +
      '<div id="aud-out" class="micro"></div><div id="aud-lista"></div></div>');
    UI().on('btn-trocar', 'click', function () {
      Auth().trocarSenha(s.login, UI().val('c-atual'), UI().val('c-nova'))
        .then(function () { UI().toast('Senha alterada.', 'ok'); })
        .catch(function (e) { UI().toast(e.message, 'erro'); });
    });
    UI().on('btn-add-user', 'click', function () {
      Auth().criarConta({ nome: UI().val('u-nome'), login: UI().val('u-login'), senha: UI().val('u-senha'), papel: 'user' })
        .then(function () { UI().toast('Usuário criado.', 'ok'); conta(); })
        .catch(function (e) { UI().toast(e.message, 'erro'); });
    });
    UI().on('btn-verificar-cadeia', 'click', function () {
      root.FV.Audit.verificarCadeia().then(function (r) {
        UI().el('aud-out').innerHTML = r.integra
          ? '<b class="c-ok">Cadeia íntegra</b> — ' + r.total + ' evento(s) verificados por SHA-256 encadeado.'
          : '<b class="c-re">CADEIA VIOLADA no evento #' + r.quebraEm + '</b> — os registros foram adulterados.';
        var evs = root.FV.Audit.eventos().slice(-12).reverse().map(function (ev) {
          return '<tr><td>' + esc(ev.ts.replace('T', ' ').slice(0, 19)) + '</td><td>' + esc(ev.usuario) + '</td><td>' + esc(ev.evento) + '</td><td class="mono micro">' + esc(ev.hash.slice(0, 14)) + '…</td></tr>';
        }).join('');
        UI().el('aud-lista').innerHTML = '<table class="tab"><tr><th>Quando</th><th>Usuário</th><th>Evento</th><th>Hash</th></tr>' + evs + '</table>';
      });
    });
  }

  /* ============================ NORMAS ================================== */
  function normas() {
    var N = root.FV.Norms.NORMS;
    var secoes = Object.keys(N).map(function (k) {
      var nm = N[k];
      var itens = Object.keys(nm.itens).map(function (i) { return '<li>' + esc(nm.itens[i]) + '</li>'; }).join('');
      return '<details class="norma-det"><summary><b>' + esc(nm.codigo) + '</b> — ' + esc(nm.titulo) + '</summary><ul>' + itens + '</ul></details>';
    }).join('');
    shell('normas',
      '<div class="pg-titulo"><h1>Normas & Método</h1><div class="muted">Transparência total: todas as referências usadas pelo motor de cálculo</div></div>' +
      '<div class="form-sec"><h3>O que o método expresso verifica</h3><ol class="lista-limites">' +
      '<li><b>V1–V4</b> Terça crítica: flexão gravitacional e sob levantamento (fator R), cisalhamento e flecha L/180.</li>' +
      '<li><b>V5</b> Telha: vão entre terças e carga, com dados típicos de fabricante (triagem).</li>' +
      '<li><b>V6</b> Fixação dos módulos: demanda de arrancamento por ponto, incluindo zonas de borda (Ce local −2,0).</li>' +
      '<li><b>V7</b> Estrutura principal: indicador de acréscimo de carga (≤5% desprezível · ≤10% atenção · &gt;10% reprovado — não instale sem laudo/reforço).</li></ol>' +
      '<p class="destaque-aviso">O método expresso é uma triagem e <b>não substitui laudo assinado com ART</b>. As paráfrases abaixo são auxiliares; o texto oficial ABNT prevalece.</p></div>' +
      secoes);
  }

  var Views = {
    landing: landing, registro: registro, entrar: entrar, iniciarDemo: iniciarDemo,
    painel: painel, wizard: wizard, resultado: resultado, laudos: laudos,
    planos: planos, conta: conta, normas: normas
  };

  root.FV = root.FV || {};
  root.FV.Views = Views;
})(typeof self !== 'undefined' ? self : this);
