/* ============================================================================
 *  LINHA DE VIDA · GD ENGENHARIA
 *  i18n.js — Internacionalização (PT / EN / ES)
 *
 *  Dicionário das cadeias visíveis da interface e dos títulos de relatório,
 *  para atender clientes multinacionais. Use LV.I18n.t('chave').
 * ========================================================================== */
(function (root) {
  'use strict';
  var LV = root.LV = root.LV || {};

  var DICT = {
    pt: {
      'app.painel': 'Painel', 'app.projeto': 'Projeto', 'app.resultados': 'Resultados',
      'app.prontuario': 'Prontuário', 'app.registros': 'Registros', 'app.admin': 'Administração',
      'app.conformidade': 'Conformidade', 'app.sair': 'Sair', 'app.idioma': 'Idioma',
      'btn.novo': '+ Novo projeto', 'btn.calcular': 'Salvar e calcular', 'btn.editar': 'Editar dados',
      'btn.imprimir': 'Imprimir', 'btn.pdf': 'Imprimir / Salvar PDF',
      'res.veredito': 'VEREDITO', 'res.aprovado': 'APROVADO', 'res.reprovado': 'REPROVADO',
      'title.resultados': 'Resultados', 'title.conformidade': 'Conformidade dos ativos',
      'unit.sistema': 'Unidades',
      'role.admin': 'Administrador', 'role.engenheiro': 'Engenheiro (RT)', 'role.inspetor': 'Inspetor', 'role.leitor': 'Leitor'
    },
    en: {
      'app.painel': 'Dashboard', 'app.projeto': 'Project', 'app.resultados': 'Results',
      'app.prontuario': 'Technical file', 'app.registros': 'Records', 'app.admin': 'Administration',
      'app.conformidade': 'Compliance', 'app.sair': 'Sign out', 'app.idioma': 'Language',
      'btn.novo': '+ New project', 'btn.calcular': 'Save & calculate', 'btn.editar': 'Edit data',
      'btn.imprimir': 'Print', 'btn.pdf': 'Print / Save PDF',
      'res.veredito': 'VERDICT', 'res.aprovado': 'APPROVED', 'res.reprovado': 'FAILED',
      'title.resultados': 'Results', 'title.conformidade': 'Asset compliance',
      'unit.sistema': 'Units',
      'role.admin': 'Administrator', 'role.engenheiro': 'Engineer (RE)', 'role.inspetor': 'Inspector', 'role.leitor': 'Reader'
    },
    es: {
      'app.painel': 'Panel', 'app.projeto': 'Proyecto', 'app.resultados': 'Resultados',
      'app.prontuario': 'Expediente técnico', 'app.registros': 'Registros', 'app.admin': 'Administración',
      'app.conformidade': 'Conformidad', 'app.sair': 'Salir', 'app.idioma': 'Idioma',
      'btn.novo': '+ Nuevo proyecto', 'btn.calcular': 'Guardar y calcular', 'btn.editar': 'Editar datos',
      'btn.imprimir': 'Imprimir', 'btn.pdf': 'Imprimir / Guardar PDF',
      'res.veredito': 'VEREDICTO', 'res.aprovado': 'APROBADO', 'res.reprovado': 'RECHAZADO',
      'title.resultados': 'Resultados', 'title.conformidade': 'Conformidad de activos',
      'unit.sistema': 'Unidades'
    }
  };

  // Títulos do prontuário por idioma (estrutura do dossiê)
  var SECOES = {
    pt: ['Capa e identificação', 'Objeto e dados gerais', 'Normas e premissas', 'Memorial descritivo',
      'Memorial de cálculo', 'Especificação de materiais', 'Compatibilidade', 'Quantitativo de materiais e EPI',
      'Análise Preliminar de Risco (APR)', 'Procedimento e Permissão de Trabalho', 'Plano e registros de inspeção',
      'Ensaio de carga das ancoragens', 'Plano de emergência e resgate', 'Registro de capacitação',
      'Relação de EPI', 'Plaqueta de identificação', 'Termo de entrega e liberação', 'Responsabilidade técnica (ART)',
      'Equivalência normativa internacional', 'Referências normativas'],
    en: ['Cover and identification', 'Object and general data', 'Standards and assumptions', 'Descriptive report',
      'Calculation report', 'Material specification', 'Compatibility', 'Bill of materials and PPE',
      'Preliminary Risk Analysis', 'Procedure and Work Permit', 'Inspection plan and records',
      'Anchorage load test', 'Emergency and rescue plan', 'Training records',
      'PPE list', 'Identification plate', 'Handover and release', 'Engineering responsibility',
      'International standards mapping', 'Normative references'],
    es: ['Portada e identificación', 'Objeto y datos generales', 'Normas y premisas', 'Memoria descriptiva',
      'Memoria de cálculo', 'Especificación de materiales', 'Compatibilidad', 'Cómputo de materiales y EPP',
      'Análisis Preliminar de Riesgo', 'Procedimiento y Permiso de Trabajo', 'Plan y registros de inspección',
      'Ensayo de carga de anclajes', 'Plan de emergencia y rescate', 'Registros de capacitación',
      'Lista de EPP', 'Placa de identificación', 'Entrega y liberación', 'Responsabilidad técnica',
      'Equivalencia normativa internacional', 'Referencias normativas']
  };

  var idiomas = [{ id: 'pt', nome: 'Português' }, { id: 'en', nome: 'English' }, { id: 'es', nome: 'Español' }];
  var atual = 'pt';

  function getLang() {
    try { if (typeof localStorage !== 'undefined') { var v = localStorage.getItem('lv_lang'); if (v) atual = v; } } catch (e) {}
    return atual;
  }
  function setLang(l) { atual = (DICT[l] ? l : 'pt'); try { if (typeof localStorage !== 'undefined') localStorage.setItem('lv_lang', atual); } catch (e) {} return atual; }
  function t(key, lang) { lang = lang || getLang(); var d = DICT[lang] || DICT.pt; return d[key] != null ? d[key] : (DICT.pt[key] != null ? DICT.pt[key] : key); }
  function secao(idx, lang) { lang = lang || getLang(); var s = SECOES[lang] || SECOES.pt; return s[idx] != null ? s[idx] : SECOES.pt[idx]; }

  LV.I18n = { t: t, secao: secao, getLang: getLang, setLang: setLang, idiomas: idiomas, DICT: DICT };
  if (typeof module !== 'undefined' && module.exports) module.exports = LV.I18n;
})(typeof self !== 'undefined' ? self : (typeof globalThis !== 'undefined' ? globalThis : this));
