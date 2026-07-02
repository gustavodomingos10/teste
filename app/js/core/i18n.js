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
      'app.conformidade': 'Conformidade', 'app.sobre': 'Sobre', 'app.sair': 'Sair', 'app.idioma': 'Idioma',
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
      'app.conformidade': 'Compliance', 'app.sobre': 'About', 'app.sair': 'Sign out', 'app.idioma': 'Language',
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
      'app.conformidade': 'Conformidad', 'app.sobre': 'Acerca de', 'app.sair': 'Salir', 'app.idioma': 'Idioma',
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

  // Dicionário de VALORES DE DADOS (opções de listas, substratos, ancoragens,
  // materiais, categorias, notas normativas). A CHAVE em português é canônica
  // (usada como valor nos selects e nas buscas); o EN é só para exibição.
  var DADOS = {
    // Cenários
    'Cobertura': 'Roof', 'Estrutura': 'Structure', 'Solo': 'Ground', 'Silo / Industrial': 'Silo / Industrial',
    // Substratos — cobertura (termos usuais nos EUA)
    'Telha trapezoidal metálica': 'Trapezoidal metal roof panel (R-panel)', 'Telha fibrocimento': 'Fiber-cement roof panel',
    'Telha cerâmica': 'Clay roof tile', 'Laje de concreto': 'Concrete slab', 'Telha termoacústica (sanduíche)': 'Insulated metal panel (IMP)',
    'Telha fibrocimento (frágil)': 'Fiber-cement roof panel (fragile)', 'Telha cerâmica (frágil)': 'Clay roof tile (fragile)',
    'Membrana TPO (termoplástica)': 'TPO single-ply membrane (thermoplastic)', 'Membrana EPDM (borracha)': 'EPDM rubber membrane',
    // Substratos — estrutura
    'Viga metálica (perfil I/H)': 'Steel beam (W-shape / I-beam)', 'Viga metálica (tubular)': 'Steel HSS (tubular) beam',
    'Pilar de concreto': 'Concrete column', 'Terça metálica': 'Steel purlin (C/Z)',
    // Substratos — solo
    'Solo coesivo (bloco concreto)': 'Cohesive soil (concrete footing)', 'Solo arenoso (bloco concreto)': 'Sandy soil (concrete footing)',
    'Rocha (chumbador)': 'Rock (anchor)', 'Talude protegido': 'Protected slope', 'Poste cravado': 'Driven post',
    'Solo coesivo': 'Cohesive soil', 'Solo arenoso': 'Sandy soil', 'Rocha': 'Rock',
    // Substratos — silo
    'Teto de silo metálico (cônico)': 'Metal silo roof (conical)', 'Costado de silo (chapa)': 'Silo shell (plate)',
    'Anel de reforço do silo': 'Silo stiffening ring', 'Passarela / galeria de correia': 'Catwalk / conveyor gallery',
    'Estrutura de torre de elevador': 'Bucket-elevator tower', 'Tremonta / cobertura de armazém': 'Warehouse hopper / roof',
    // Ancoragens (terminologia dos EUA)
    'Suporte parafusado à terça/estrutura': 'Bolted bracket to purlin/structure', 'Chapa/olhal SOLDADO (aço)': 'WELDED plate / D-ring (steel)',
    'Grampo / braçadeira (clamp)': 'Beam clamp', 'Chumbador QUÍMICO (concreto)': 'ADHESIVE (epoxy) anchor (concrete)',
    'Chumbador mecânico (concreto)': 'Mechanical (expansion) anchor (concrete)', 'Bloco de fundação (concreto)': 'Concrete footing / deadman',
    'Poste cravado / estaiado': 'Driven / guyed post',
    // Legenda da matriz
    'Recomendado — solução usual e segura': 'Recommended — standard, safe solution',
    'Recomendado SOMENTE com reforço sob a telha (a telha não recebe carga)': 'Recommended ONLY with reinforcement under the sheet (the sheet carries no load)',
    'Com restrição — exige verificação adicional / detalhe específico': 'Restricted — requires additional verification / specific detailing',
    'Não permitido para esse substrato': 'Not allowed for this substrate', 'Não aplicável': 'Not applicable',
    // Materiais de cabo (terminologia dos EUA)
    'Inox AISI 316': '316 stainless steel (7x19)', 'Inox AISI 316 (1x19 rígido)': '316 stainless (1x19 strand)',
    'Inox AISI 304': '304 stainless steel', 'Custo-benefício (galvanizado)': 'Galvanized (cost-effective, 6x19 IWRC)',
    'Galvanizado EIPS 6x36 (alta resistência)': 'Galvanized EIPS 6x36 (high-strength)',
    // Talabartes (terminologia dos EUA)
    'Talabarte Y c/ absorvedor': 'Twin-leg (Y) shock-absorbing lanyard', 'Talabarte simples c/ absorvedor': 'Single-leg shock-absorbing lanyard',
    'Trava-quedas retrátil': 'Self-retracting lifeline (SRL)',
    // Corrosividade (ISO 12944)
    'C1 — Muito baixa (interior seco/aquecido)': 'C1 — Very low (dry/heated interior)',
    'C2 — Baixa (interior, condensação ocasional)': 'C2 — Low (interior, occasional condensation)',
    'C3 — Média (urbano/industrial, umidade moderada)': 'C3 — Medium (urban/industrial, moderate humidity)',
    'C4 — Alta (industrial / litoral de baixa salinidade)': 'C4 — High (industrial / low-salinity coastal)',
    'C5 — Muito alta (industrial úmido / litorâneo)': 'C5 — Very high (humid industrial / coastal)',
    'CX — Extrema (offshore / químico agressivo)': 'CX — Extreme (offshore / aggressive chemical)',
    // Notas normativas da matriz de compatibilidade
    'Telhas frágeis (fibrocimento, cerâmica) NÃO podem receber carga concentrada — NR-18 18.7.8.2. A ancoragem deve transpassar a cobertura e fixar-se em estrutura resistente (terça/madeiramento/laje).':
      'Fragile roofing (fiber-cement, ceramic) must NOT receive concentrated loads — NR-18 18.7.8.2. The anchorage must pass through the roofing and be fixed to a load-bearing structure (purlin/framing/slab).',
    'Em telha trapezoidal metálica, o suporte é parafusado à TERÇA (estrutura), nunca apenas à telha; usar vedação tipo EPDM nas perfurações e fixar na onda alta.':
      'On trapezoidal metal roofing, the bracket is bolted to the PURLIN (structure), never to the sheet alone; use EPDM sealing at perforations and fasten at the high rib.',
    'Concentração de carga em telhado/cobertura só é admitida se autorizada por profissional legalmente habilitado.':
      'Load concentration on a roof is permitted only if authorized by a legally qualified professional.',
    'Dispositivos de ancoragem devem resistir a ≥ 15 kN (NR-18 18.12.12.2) e à força máxima aplicável (NR-35 Anexo II 3.1.1).':
      'Anchorage devices must withstand ≥ 15 kN (NR-18 18.12.12.2) and the maximum applicable force (NR-35 Annex II 3.1.1). In the US, ≥ 5,000 lbf (22.2 kN) per worker or SF ≥ 2 (OSHA 1926.502).',
    'Em aço, a chapa/olhal soldado deve ser executado por soldador qualificado, com solda dimensionada; o grampo (clamp) exige verificação de escorregamento.':
      'On steel, the welded plate/eye must be made by a qualified welder with a properly sized weld; the clamp requires a slippage check.',
    'Em concreto, o chumbador químico (epóxi) deve respeitar profundidade e distância de borda do fabricante; verificar arrancamento (cone de concreto).':
      'On concrete, the chemical (epoxy) anchor must respect the manufacturer’s embedment depth and edge distance; check pull-out (concrete cone).',
    'Em solo/talude, os postes devem ser ancorados em blocos de fundação dimensionados ao tombamento/arrancamento; em solo arenoso evitar postes simplesmente cravados.':
      'In soil/slope, posts must be anchored in foundation blocks sized against overturning/pull-out; in sandy soil avoid simply driven posts.',
    'Materiais resistentes às intempéries: aço inoxidável AISI 316 ou equivalente — NR-18 18.12.12.2 (d).':
      'Weather-resistant materials: AISI 316 stainless steel or equivalent — NR-18 18.12.12.2 (d).',
    'Coberturas de membrana (TPO/EPDM): o poste transpassa a membrana e fixa-se à estrutura/deck resistente abaixo; usar bota de vedação (flashing) soldada/colada à membrana para estanqueidade.':
      'Membrane roofs (TPO/EPDM): the post penetrates the membrane and is fastened to the load-bearing structure/deck below; use a welded/bonded pipe boot (flashing) at the membrane for watertightness.',

    // ---- Interface: formulário de projeto (rótulos e seções) ----
    'Dados do projeto': 'Project data',
    'Preencha os campos. O cálculo é automático na aba Resultados.': 'Fill in the fields. Calculation is automatic on the Results tab.',
    'Nome do projeto': 'Project name',
    '1 · Identificação': '1 · Identification', 'Obra / Cliente': 'Project / Client', 'Local': 'Location',
    'Responsável técnico (Eng.)': 'Engineer of record', 'Data': 'Date',
    '2 · Cenário e substrato': '2 · Scenario and substrate', 'Cenário': 'Scenario', 'Substrato / cobertura': 'Substrate / roof', 'Ambiente (corrosividade)': 'Environment (corrosivity)',
    '3 · Geometria do sistema': '3 · System geometry', 'Vão entre postes L': 'Span between posts L', 'Nº de vãos': 'Number of spans', 'Altura do poste h': 'Post height h', 'Pé-direito livre disponível': 'Available clear headroom',
    '4 · Cabo da linha de vida': '4 · Lifeline cable', 'Material do cabo': 'Cable material', 'Diâmetro Ø': 'Diameter Ø', 'Pré-tensão de instalação T₀': 'Installation pretension T₀',
    '5 · Usuários e EPI': '5 · Users and PPE', 'Nº de usuários simultâneos n': 'Number of simultaneous users n', 'Força de impacto no trabalhador Fₜ': 'Worker arrest force Fₜ', 'Tipo de talabarte': 'Lanyard type', 'Queda livre H_ql': 'Free fall H_ql', 'Frenagem do absorvedor H_fr': 'Absorber deceleration H_fr',
    '6 · Absorvedor de energia da linha (opcional)': '6 · Line energy absorber (optional)', 'Possui absorvedor de linha?': 'Has a line absorber?', 'Força de atuação F_abs': 'Activation force F_abs', 'Curso do absorvedor de linha': 'Line absorber travel',
    '7 · Poste de ancoragem': '7 · Anchor post', 'Perfil do poste': 'Post profile', 'Aço estrutural': 'Structural steel', 'Coef. ponderação ações γf': 'Load factor γf', 'Nº de chumbadores': 'Number of anchor bolts', 'Braço dos chumbadores d': 'Anchor bolt lever arm d',

    // ---- Interface: painel ----
    'Nenhum projeto ainda. Crie o primeiro.': 'No projects yet. Create the first one.',
    'APROVADO': 'APPROVED', 'REVISAR': 'REVIEW', 'Abrir': 'Open', 'Duplicar': 'Duplicate', 'Excluir': 'Delete',
    'Projeto duplicado.': 'Project duplicated.',

    // ---- Interface: registros ----
    'Registros do prontuário': 'Technical file records',
    'Inspeções': 'Inspections', 'Tipo (inicial/rotineira/periódica)': 'Type (initial/routine/periodic)', 'Inspetor': 'Inspector', 'Resultado': 'Result', 'Próxima inspeção': 'Next inspection', 'Observações': 'Notes',
    'Ensaios de carga': 'Load tests', 'Ponto': 'Point', 'Carga exigida (kN)': 'Required load (kN)', 'Carga aplicada (kN)': 'Applied load (kN)', 'Responsável': 'Responsible',
    'Capacitação': 'Training', 'Trabalhador': 'Worker', 'CPF': 'SSN / Employee ID', 'Curso': 'Course', 'Carga (h)': 'Hours (h)', 'Validade': 'Valid until',
    'EPI': 'PPE', 'Fabricante': 'Manufacturer', 'CA': 'Cert. No. (ANSI/CE)', 'Última inspeção': 'Last inspection',
    'APR': 'JHA', 'Perigo': 'Hazard', 'Medida de controle': 'Control measure',
    '+ Adicionar': '+ Add', 'Registro adicionado.': 'Record added.', 'Sem registros nesta aba.': 'No records on this tab.',

    // ---- Interface: administração ----
    'Administração': 'Administration', 'Usuários, licença, dados do escritório, auditoria e backup.': 'Users, license, office data, audit trail and backup.',
    'Usuários e perfis de acesso': 'Users and access roles', 'Usuário': 'Username', 'Nome': 'Name', 'Perfil': 'Role', 'Estado': 'Status',
    'Resetar senha': 'Reset password', 'Remover': 'Remove', 'nome completo': 'full name', 'senha inicial': 'initial password', 'perfil': 'role',
    '+ Criar usuário': '+ Create user', 'Usuário criado.': 'User created.',
    'Licença comercial': 'Commercial license', 'Sem licença.': 'No license.', 'CLIENTE': 'CLIENT', 'AAAAMMDD (validade)': 'YYYYMMDD (valid until)', 'chave gerada aparecerá aqui': 'generated key will appear here',
    'Cliente': 'Client', 'Validade (AAAAMMDD)': 'Valid until (YYYYMMDD)', 'Plano': 'Plan', 'Gerar chave de licença': 'Generate license key', 'Chave gerada.': 'Key generated.', 'Chave gerada (entregue ao cliente)': 'Generated key (deliver to client)',
    'Dados do escritório (marca dos relatórios)': 'Office data (report branding)', 'Empresa': 'Company', 'CNPJ': 'Company Tax ID', 'CREA': 'License / PE', 'Contato': 'Contact', 'Cidade': 'City', 'Salvar dados': 'Save data',
    'Trilha de auditoria': 'Audit trail', 'Verificar integridade': 'Verify integrity', 'Ação': 'Action', 'Detalhes': 'Details',
    'ativo': 'active', 'inativo': 'inactive',

    // ---- Interface: telas de acesso (após escolher o país) ----
    'Ativação do software': 'Software activation',
    'Informe a chave de licença fornecida pela GD Engenharia ou inicie uma avaliação de 30 dias.': 'Enter the license key provided by GD Engenharia or start a 30-day trial.',
    'Ativar licença': 'Activate license', 'Iniciar avaliação (30 dias)': 'Start trial (30 days)', 'Avaliação iniciada (30 dias).': 'Trial started (30 days).',
    'Acesso ao sistema': 'System login', 'Senha': 'Password', 'senha': 'password', 'Entrar': 'Sign in', 'usuário': 'username',
    'As senhas não conferem.': 'Passwords do not match.', 'Senha alterada com sucesso.': 'Password changed successfully.',
    'Defina sua nova senha': 'Set your new password', 'Por segurança, é necessário alterar a senha no primeiro acesso.': 'For security, you must change your password on first login.',
    'Senha atual': 'Current password', 'Nova senha': 'New password', 'Mínimo 8 caracteres, com maiúscula, minúscula e número.': 'Minimum 8 characters, with uppercase, lowercase and a number.',
    'Confirmar nova senha': 'Confirm new password', 'Salvar nova senha': 'Save new password', 'Sessão encerrada.': 'Session ended.'
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
  // Tradução de VALOR DE DADO (mantém a chave PT; retorna EN quando idioma=en)
  function d(pt, lang) { lang = lang || getLang(); if (lang !== 'en') return pt; return DADOS[pt] != null ? DADOS[pt] : pt; }
  // Conveniência: escolhe entre PT e EN conforme o idioma atual
  function L(pt, en, lang) { lang = lang || getLang(); return lang === 'en' ? en : pt; }

  LV.I18n = { t: t, secao: secao, d: d, L: L, getLang: getLang, setLang: setLang, idiomas: idiomas, DICT: DICT, DADOS: DADOS };
  if (typeof module !== 'undefined' && module.exports) module.exports = LV.I18n;
})(typeof self !== 'undefined' ? self : (typeof globalThis !== 'undefined' ? globalThis : this));
