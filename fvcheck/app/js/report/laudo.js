/* ============================================================================
 *  FV-CHECK · GD ENGENHARIA — Verificação Estrutural Expressa p/ FV em Telhado
 *  laudo.js — Contratação de laudo assinado (rede de calculistas)
 *
 *  Fluxo: resultado expresso → orçamento automático → solicitação com dossiê
 *  técnico completo (JSON) → envio ao calculista responsável (e-mail) →
 *  acompanhamento por protocolo. O laudo é assinado com ART pelo engenheiro.
 * ========================================================================== */
(function (root) {
  'use strict';

  var isNode = (typeof module !== 'undefined' && module.exports);
  var Dados = isNode ? require('../core/dados.js') : root.FV.Dados;

  var CALCULISTA = {
    nome: 'GD Engenharia e Perícia Ltda',
    responsavel: 'Eng. Civil Gustavo F. F. Domingos',
    registro: 'CREA 140.964-D/PR',
    cnpj: '54.705.748/0001-19',
    email: 'Gdestrutural@hotmail.com'
  };

  /* Orçamento em função da área de cobertura (m²) */
  function orcamento(areaM2) {
    var L = Dados.PRECOS.laudo;
    var extra = Math.max(0, areaM2 - 500) * L.adicionalM2;
    var total = L.base + extra;
    return {
      base: L.base, adicional: extra, total: Math.round(total),
      area: areaM2, prazoDias: L.prazoDias, incluiART: L.incluiART,
      moeda: Dados.PRECOS.moeda, descricao: L.descricao
    };
  }

  /* Dossiê técnico completo (JSON) — tudo que o calculista precisa p/ o laudo */
  function dossie(projeto, resultado) {
    var m = resultado.modelo;
    return {
      app: 'FV-CHECK', tipo: 'solicitacao-laudo', versaoMetodo: resultado.versaoMetodo,
      geradoEm: new Date().toISOString(),
      projeto: {
        nome: m.inp.nome, cliente: m.inp.cliente,
        cidade: m.inp.cidade, uf: m.inp.uf
      },
      entrada: m.inp,
      resumoExpresso: {
        semaforo: resultado.semaforo,
        itens: resultado.itens.map(function (it) {
          return { id: it.id, titulo: it.titulo, ratio: it.ratio, status: it.status };
        }),
        avisos: resultado.avisos.map(function (a) { return a.msg; }),
        kwp: m.kwp, cobertura: m.cobertura, areaSuperficie: m.areaSuperficie,
        vento: { Vk: m.vento.VkLocal, q: m.vento.qLocal, ceSuc: m.vento.ceSuc, dpSuc: m.vento.dpSuc }
      },
      calculista: CALCULISTA
    };
  }

  /* Corpo de e-mail pré-preenchido para a solicitação */
  function corpoEmail(projeto, resultado, orc, protocolo) {
    var m = resultado.modelo;
    var linhas = [
      'SOLICITAÇÃO DE LAUDO ESTRUTURAL — FV-CHECK',
      'Protocolo: ' + protocolo,
      '',
      'Projeto: ' + m.inp.nome,
      'Cliente: ' + (m.inp.cliente || '—'),
      'Local: ' + (m.inp.cidade || '—') + '/' + (m.inp.uf || '—'),
      'Usina: ' + m.kwp.toFixed(1) + ' kWp (' + m.inp.numModulos + ' módulos)',
      'Área de cobertura: ' + m.areaSuperficie.toFixed(0) + ' m²',
      'Resultado expresso: ' + resultado.semaforo.toUpperCase(),
      '',
      'Orçamento estimado: ' + orc.moeda + ' ' + orc.total + ' (prazo ' + orc.prazoDias + ' dias úteis, ART inclusa)',
      '',
      'O dossiê técnico completo (JSON) gerado pelo FV-CHECK segue anexo/na sequência.',
      '',
      '— Enviado pelo FV-CHECK · GD Engenharia'
    ];
    return linhas.join('\n');
  }

  function linkMailto(projeto, resultado, orc, protocolo) {
    var assunto = '[FV-CHECK] Solicitação de laudo — ' + resultado.modelo.inp.nome + ' — ' + protocolo;
    return 'mailto:' + CALCULISTA.email +
      '?subject=' + encodeURIComponent(assunto) +
      '&body=' + encodeURIComponent(corpoEmail(projeto, resultado, orc, protocolo));
  }

  var STATUS = {
    solicitado: { nome: 'Solicitado', cor: 'atencao' },
    em_analise: { nome: 'Em análise pelo calculista', cor: 'atencao' },
    entregue: { nome: 'Laudo entregue', cor: 'verde' },
    cancelado: { nome: 'Cancelado', cor: 'fail' }
  };

  var Laudo = {
    CALCULISTA: CALCULISTA, STATUS: STATUS,
    orcamento: orcamento, dossie: dossie, corpoEmail: corpoEmail, linkMailto: linkMailto
  };

  root.FV = root.FV || {};
  root.FV.Laudo = Laudo;
  if (typeof module !== 'undefined' && module.exports) module.exports = Laudo;
})(typeof self !== 'undefined' ? self : (typeof globalThis !== 'undefined' ? globalThis : this));
