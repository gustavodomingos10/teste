/* ============================================================================
 *  FV-CHECK · GD ENGENHARIA — Verificação Estrutural Expressa p/ FV em Telhado
 *  validate.js — Validação e saneamento das entradas do usuário
 *
 *  Cada regra devolve mensagens claras em PT-BR. "erro" impede o cálculo;
 *  "aviso" segue com ressalva (aparece no memorial).
 * ========================================================================== */
(function (root) {
  'use strict';

  var isNode = (typeof module !== 'undefined' && module.exports);
  var Dados = isNode ? require('./dados.js') : root.FV.Dados;

  function num(v) { var n = parseFloat(v); return isNaN(n) ? null : n; }

  function faixa(erros, avisos, valor, nome, min, max, minRec, maxRec, unidade) {
    if (valor == null) { erros.push('Informe ' + nome + '.'); return; }
    if (valor < min || valor > max) { erros.push(nome + ' fora da faixa admitida (' + min + ' a ' + max + ' ' + unidade + ').'); return; }
    if (minRec != null && valor < minRec) avisos.push(nome + ' abaixo do usual (' + minRec + ' ' + unidade + ') — confira o levantamento.');
    if (maxRec != null && valor > maxRec) avisos.push(nome + ' acima do usual (' + maxRec + ' ' + unidade + ') — confira o levantamento.');
  }

  /**
   * Valida a entrada do wizard. Retorna { ok, erros[], avisos[], inp } com
   * os números já convertidos.
   */
  function validar(raw) {
    var erros = [], avisos = [];
    var inp = {};

    // identificação
    inp.nome = String(raw.nome || '').trim();
    inp.cliente = String(raw.cliente || '').trim();
    inp.cidade = String(raw.cidade || '').trim();
    inp.uf = String(raw.uf || '').trim().toUpperCase();
    if (!inp.nome) erros.push('Dê um nome ao projeto.');

    // vento / local
    inp.v0 = num(raw.v0);
    if (inp.v0 == null && inp.uf && Dados.V0_UF[inp.uf]) inp.v0 = Dados.V0_UF[inp.uf];
    faixa(erros, avisos, inp.v0, 'a velocidade básica do vento V0', 25, 60, 30, 50, 'm/s');
    // ambiente em linguagem simples → categoria de rugosidade NBR 6123
    inp.ambiente = String(raw.ambiente || '');
    var amb = Dados.porId(Dados.AMBIENTES, inp.ambiente);
    inp.categoria = amb ? amb.categoria : String(raw.categoria || 'II');
    if (!Dados.porId(Dados.CATEGORIAS_TERRENO, inp.categoria)) erros.push('Descreva o ambiente ao redor do galpão (influência do vento).');
    inp.s1 = String(raw.s1 || 'plano');
    inp.s3 = String(raw.s3 || 'g2');
    // barracão fechado/aberto → permeabilidade NBR 6123 6.2.5
    inp.fechamento = raw.fechamento === 'aberto' ? 'aberto' : 'fechado';
    inp.permeabilidade = (raw.permeabilidade === 'dominante' || inp.fechamento === 'aberto') ? 'dominante' : 'normal';

    // materiais da estrutura (linguagem simples)
    inp.estruturaPrincipal = String(raw.estruturaPrincipal || 'metalica');
    var ep = Dados.porId(Dados.ESTRUTURAS_PRINCIPAIS, inp.estruturaPrincipal);
    if (!ep) erros.push('Informe o material da estrutura principal (metálica ou concreto).');
    else if (ep.foraEscopo) erros.push(ep.foraEscopo);
    inp.tercaMaterial = String(raw.tercaMaterial || 'aco');
    var tm = Dados.porId(Dados.TERCA_MATERIAIS, inp.tercaMaterial);
    if (!tm) erros.push('Informe o material das terças.');
    else if (tm.foraEscopo) erros.push(tm.foraEscopo);

    // geometria
    inp.tipoTelhado = raw.tipoTelhado === '1agua' ? '1agua' : '2aguas';
    inp.largura = num(raw.largura);
    inp.comprimento = num(raw.comprimento);
    inp.peDireito = num(raw.peDireito);
    inp.inclinacao = num(raw.inclinacao);
    faixa(erros, avisos, inp.largura, 'a largura do galpão', 3, 80, 6, 40, 'm');
    faixa(erros, avisos, inp.comprimento, 'o comprimento do galpão', 3, 300, 10, 150, 'm');
    faixa(erros, avisos, inp.peDireito, 'o pé-direito (beiral)', 2, 30, 3, 12, 'm');
    faixa(erros, avisos, inp.inclinacao, 'a inclinação do telhado', 1, 100, 3, 58, '%');
    if (inp.inclinacao != null && inp.inclinacao < 3) avisos.push('Inclinação < 3%: risco de empoçamento e infiltração nas furações do FV — verificar estanqueidade.');

    // estrutura
    inp.perfilId = String(raw.perfilId || '');
    if (inp.perfilId === 'CUSTOM') {
      var pc = raw.perfilCustom || {};
      inp.perfilCustom = { type: String(pc.type || 'UE'), bw: num(pc.bw), bf: num(pc.bf), D: num(pc.D) || 0, t: num(pc.t) };
      faixa(erros, avisos, inp.perfilCustom.bw, 'a altura da alma do perfil', 40, 400, 75, 350, 'mm');
      faixa(erros, avisos, inp.perfilCustom.bf, 'a largura da mesa do perfil', 20, 200, 40, 100, 'mm');
      faixa(erros, avisos, inp.perfilCustom.t, 'a espessura do perfil', 0.8, 12.5, 1.5, 6.3, 'mm');
      if (inp.perfilCustom.type === 'UE' || inp.perfilCustom.type === 'Z') {
        faixa(erros, avisos, inp.perfilCustom.D, 'o enrijecedor de borda', 5, 60, 12, 30, 'mm');
      }
    } else if (!Dados.perfil(inp.perfilId)) erros.push('Selecione o perfil da terça.');
    inp.acoId = String(raw.acoId || '');
    if (raw.acoCustomFy) {
      inp.acoCustomFy = num(raw.acoCustomFy);
      faixa(erros, avisos, inp.acoCustomFy, 'o fy do aço', 150, 460, 180, 350, 'MPa');
    } else if (!Dados.aco(inp.acoId)) erros.push('Selecione o aço da terça.');
    inp.vaoTerca = num(raw.vaoTerca);
    inp.espacamento = num(raw.espacamento);
    faixa(erros, avisos, inp.vaoTerca, 'o vão da terça (distância entre pórticos)', 1, 15, 3, 9, 'm');
    faixa(erros, avisos, inp.espacamento, 'o espaçamento entre terças', 0.3, 5, 0.8, 2.5, 'm');
    inp.correntes = Math.max(0, Math.min(3, Math.round(num(raw.correntes) || 0)));
    inp.continuidade = ['biapoiada', 'continua2', 'continua3'].indexOf(raw.continuidade) >= 0 ? raw.continuidade : 'biapoiada';
    inp.conservacao = ['bom', 'regular', 'ruim'].indexOf(raw.conservacao) >= 0 ? raw.conservacao : 'bom';

    // telha
    inp.telhaId = String(raw.telhaId || '');
    if (!Dados.telha(inp.telhaId)) erros.push('Selecione o tipo de telha.');

    // FV
    inp.moduloId = String(raw.moduloId || '');
    if (inp.moduloId === 'MCUSTOM') {
      var mc = raw.moduloCustom || {};
      inp.moduloCustom = { comp: num(mc.comp), larg: num(mc.larg), kg: num(mc.kg), wp: num(mc.wp) || 0 };
      faixa(erros, avisos, inp.moduloCustom.comp, 'o comprimento do módulo', 0.5, 3.5, 1.0, 2.5, 'm');
      faixa(erros, avisos, inp.moduloCustom.larg, 'a largura do módulo', 0.3, 2.0, 0.9, 1.4, 'm');
      faixa(erros, avisos, inp.moduloCustom.kg, 'a massa do módulo', 5, 60, 18, 40, 'kg');
    } else if (!Dados.modulo(inp.moduloId)) erros.push('Selecione o módulo fotovoltaico.');
    inp.numModulos = Math.round(num(raw.numModulos) || 0);
    if (!(inp.numModulos > 0)) erros.push('Informe a quantidade de módulos.');
    if (inp.numModulos > 20000) erros.push('Quantidade de módulos fora da faixa (máx. 20.000).');
    inp.trilhos = num(raw.trilhos);
    if (inp.trilhos == null) inp.trilhos = Dados.TRILHOS_PADRAO;
    faixa(erros, avisos, inp.trilhos, 'o peso de trilhos/fixações', 0, 0.2, 0.02, 0.08, 'kN/m²');
    inp.fixacao = ['terca', 'telha'].indexOf(raw.fixacao) >= 0 ? raw.fixacao : 'terca';
    inp.montagem = raw.montagem === 'inclinada' ? 'inclinada' : 'coplanar';
    if (inp.montagem === 'inclinada') erros.push('Montagem inclinada (triângulos) altera drasticamente as cargas de vento e está FORA do método expresso — a análise coplanar não se aplica. Solicite o laudo completo.');

    // consistência geométrica: módulos cabem no telhado?
    if (erros.length === 0) {
      var theta = Math.atan(inp.inclinacao / 100);
      var areaSup = inp.comprimento * inp.largura / Math.cos(theta);
      var mod = inp.moduloCustom || Dados.modulo(inp.moduloId);
      var areaMod = mod.comp * mod.larg * inp.numModulos;
      if (areaMod > areaSup) erros.push('A área dos módulos (' + areaMod.toFixed(0) + ' m²) excede a área do telhado (' + areaSup.toFixed(0) + ' m²). Revise a quantidade.');
      else if (areaMod > 0.9 * areaSup) avisos.push('Módulos ocupam mais de 90% do telhado — confira afastamentos de borda/cumeeira (zonas de alta sucção) e caminhos de manutenção.');
    }

    return { ok: erros.length === 0, erros: erros, avisos: avisos, inp: inp };
  }

  var Validate = { validar: validar };

  root.FV = root.FV || {};
  root.FV.Validate = Validate;
  if (typeof module !== 'undefined' && module.exports) module.exports = Validate;
})(typeof self !== 'undefined' ? self : (typeof globalThis !== 'undefined' ? globalThis : this));
