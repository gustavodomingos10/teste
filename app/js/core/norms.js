/* ============================================================================
 *  LINHA DE VIDA · GD ENGENHARIA
 *  norms.js — Catálogo central de REFERÊNCIAS NORMATIVAS (auditável)
 *
 *  Todas as citações foram conferidas contra os textos oficiais fornecidos:
 *    · NR-35 (atualizada — Portaria MTP nº 4.218/2022) + Anexo II (Ancoragem)
 *    · NR-18 (item 18.12.12)
 *    · ABNT NBR 16325-1 e 16325-2 (Anexo C — ZLQ, dispositivos tipo C)
 *    · ABNT NBR 8800 ; NBR 6118 ; NBR 6120 ; NBR 16489 ; ISO 12944-2
 *
 *  Concentrar as referências em um único módulo facilita a auditoria por
 *  peritos e seguradoras e a manutenção quando as normas forem revisadas.
 * ========================================================================== */
(function (root) {
  'use strict';

  var NORMS = {
    NR35: {
      codigo: 'NR-35',
      titulo: 'Trabalho em Altura',
      orgao: 'Ministério do Trabalho e Emprego',
      atualizacao: 'Portaria MTP nº 4.218, de 20/12/2022',
      itens: {
        aplicacao:        'NR-35.2.1 — aplica-se a toda atividade com diferença de nível acima de 2,0 m, com risco de queda.',
        arquivamento:     'NR-35.3.1 “j” — a organização deve arquivar a documentação por período mínimo de 5 anos.',
        capacitacao:      'NR-35.4.2.1 — treinamento inicial com carga horária mínima de 8 h (reciclagem periódica conforme NR-35.4).',
        analiseRisco:     'NR-35.5 — Análise de Risco (AR) e Permissão de Trabalho (PT) documentadas.',
        inspecaoSPIQ:     'NR-35.6.6 — inspeções inicial (35.6.6.1), rotineira (35.6.6.2) e periódica (35.6.6.3, ≤ 12 meses) do SPIQ.',
        registroInspecao: 'NR-35.6.6.4 — registrar as inspeções iniciais, periódicas e as rotineiras que recusarem elementos do SPIQ.',
        descarte:         'NR-35.6.6.5 — elementos com defeito/deformação ou que sofreram impacto de queda devem ser inutilizados e descartados.',
        forca6kN:         'NR-35.6.7 — o SPIQ deve ser selecionado de forma que a força de impacto transmitida ao trabalhador seja, no máximo, 6 kN.',
        restricao:        'NR-35.6.8 — sistemas de ancoragem para restrição devem ser dimensionados para resistir às forças aplicáveis.',
        paraquedista:     'NR-35.6.9.1.1 — em retenção de queda, o cinturão paraquedista deve ter talabarte integrado com absorvedor de energia.',
        arSPIQ:           'NR-35.6.11 — a AR do SPIQ deve considerar: queda livre, fator de queda, impacto ≤ 6 kN, zona livre de queda e compatibilidade.',
        emergencia:       'NR-35.7 — Emergência e Salvamento: procedimento de resgate, dimensionamento da equipe, tempo de resgate e redução da suspensão inerte.',
        // ---- ANEXO II — SISTEMAS DE ANCORAGEM ----
        a2_estrutura:     'NR-35 Anexo II 3.1.1 — a estrutura integrante do sistema de ancoragem deve resistir à FORÇA MÁXIMA APLICÁVEL.',
        a2_habilitado:    'NR-35 Anexo II 3.2 — ancoragem estrutural projetada e construída sob responsabilidade de profissional legalmente habilitado.',
        a2_marcacao:      'NR-35 Anexo II 3.2.1 — marcação dos pontos: (a) fabricante; (b) lote/série/rastreabilidade; (c) nº máx. de trabalhadores simultâneos ou força máxima aplicável.',
        a2_inspInicial:   'NR-35 Anexo II 4.1.1 — inspeção inicial após instalação, alteração ou mudança de local.',
        a2_inspPeriodica: 'NR-35 Anexo II 4.1.2 — inspeção periódica com periodicidade não superior a 12 meses.',
        a2_permanente:    'NR-35 Anexo II 4.3 — o sistema de ancoragem permanente deve possuir projeto e instalação sob responsabilidade de profissional legalmente habilitado.',
        a2_projeto:       'NR-35 Anexo II 5.1 — projeto e especificações sob RT, com indicação das estruturas e detalhamento dos dispositivos e fixações.',
        a2_dimensionamento:'NR-35 Anexo II 5.1.1 — o dimensionamento deve determinar: (a) força de impacto de retenção (impactos simultâneos/sequenciais); (b) os esforços em cada parte do sistema; (c) a zona livre de queda necessária.',
        a2_procedimento:  'NR-35 Anexo II 6.1 — procedimento operacional de montagem e utilização (montagem, manutenção, alteração, mudança de local e desmontagem).'
      },
      criterios: { forcaTrabalhador: 6, inspecaoMesesMax: 12, alturaMin: 2.0, capacitacaoHoras: 8, arquivamentoAnos: 5 }
    },
    NR18: {
      codigo: 'NR-18',
      titulo: 'Segurança e Saúde no Trabalho na Indústria da Construção',
      itens: {
        ancoragem15kN:    'NR-18 18.12.12.2 “b” — os dispositivos de ancoragem devem suportar carga de trabalho de, no mínimo, 1.500 kgf (15 kN).',
        intemperie:       'NR-18 18.12.12.2 “d” — material resistente às intempéries (aço inoxidável ou equivalente).',
        ensaioCarga:      'NR-18 18.12.12.2.1 — ensaios para comprovação da carga mínima conforme normas técnicas vigentes ou determinação do fabricante.',
        identificacao:    'NR-18 18.12.12.3 — marcação indelével: razão social + CNPJ do fabricante; modelo/código; nº de fabricação/série; material; carga; nº máx. de trabalhadores ou força máxima; pictograma.',
        cabosAco:         'NR-18 (boa prática c/ Anexo II e NBR 16325) — cabos de aço com carga de ruptura (CR) ≥ 5× a carga de trabalho.'
      }
    },
    NBR16325_2: {
      codigo: 'ABNT NBR 16325-2',
      titulo: 'Dispositivos de ancoragem — Parte 2: Dispositivos com ancoragens flexíveis horizontais',
      itens: {
        zlq:    'NBR 16325-2 Anexo C (C.2) — ZLQ de dispositivos tipo C (linhas horizontais) = queda livre + distância de frenagem + 1,5 m (engate do cinturão aos pés) + 1,0 m (distância de segurança) + deflexão (flecha) da linha horizontal flexível.',
        forca:  'NBR 16325-2 — deve haver meio de limitar a força dinâmica exercida sobre o usuário a, no máximo, 6 kN.',
        figura: 'NBR 16325-2 Figura C.1 — esquema da ZLQ abaixo da posição da ancoragem.'
      }
    },
    NBR16325_1: {
      codigo: 'ABNT NBR 16325-1',
      titulo: 'Dispositivos de ancoragem para proteção contra quedas de altura — Parte 1',
      itens: {
        classes: 'NBR 16325-1 — classes de dispositivos: A (pontual), B (provisório portátil), C (linha de vida horizontal flexível), D (trilho rígido horizontal), E (peso morto). Este sistema é do TIPO C.',
        projeto: 'NBR 16325-1 — dispositivos projetados/ensaiados sob responsabilidade de profissional legalmente habilitado.'
      }
    },
    NBR8800: {
      codigo: 'ABNT NBR 8800',
      titulo: 'Projeto de estruturas de aço e mistas de edifícios',
      itens: {
        ponderacao: 'NBR 8800 — coeficientes: γf = 1,40 (ações) e γa1 = 1,10 (resistência do aço).',
        compressao: 'NBR 8800 5.3 — barras comprimidas: Ne = π²EI/(KL)²; λ₀ = √(A·fy/Ne); χ = 0,658^(λ₀²) se λ₀ ≤ 1,5, senão 0,877/λ₀².',
        cortante:   'NBR 8800 5.4 — força cortante resistente V_Rd = 0,6·fy·Aw/γa1.',
        flexoComp:  'NBR 8800 — interação flexo-compressão (índice combinado ≤ 1,0).',
        local:      'NBR 8800 Tabela F.1 — classificação da seção pela esbeltez de parede (b/t).'
      }
    },
    NBR6120: {
      codigo: 'ABNT NBR 6120',
      titulo: 'Ações para o cálculo de estruturas de edificações',
      itens: { acoes: 'NBR 6120 — definição das ações permanentes e variáveis e suas combinações para o dimensionamento.' }
    },
    NBR6118: {
      codigo: 'ABNT NBR 6118',
      titulo: 'Projeto de estruturas de concreto',
      itens: { contato: 'NBR 6118 — verificação do esmagamento do concreto sob a placa de base (σ ≤ 0,85·fcd) e ancoragem de chumbadores.' }
    },
    NBR16489: {
      codigo: 'ABNT NBR 16489',
      titulo: 'Sistemas e equipamentos de PI contra quedas — recomendações de seleção, uso e manutenção',
      itens: { absorvedor: 'NBR 16489 — o absorvedor de energia do talabarte limita a força de frenagem transmitida ao trabalhador a 6 kN.' }
    },
    ISO12944: {
      codigo: 'ISO 12944-2',
      titulo: 'Corrosividade atmosférica — categorias C1 a CX',
      itens: { categorias: 'ISO 12944-2 — seleção de material/revestimento conforme a categoria de corrosividade (C1–CX).' }
    },
    NBR6123: {
      codigo: 'ABNT NBR 6123',
      titulo: 'Forças devidas ao vento em edificações',
      itens: { vento: 'NBR 6123 — pressão dinâmica q = 0,613·V_k² (V_k = V₀·S1·S2·S3); força F = Ca·q·A. Relevante em silos/estruturas expostas.' }
    },
    // ----------------- NORMAS INTERNACIONAIS -----------------
    EN795: {
      codigo: 'EN 795 / CEN/TS 16415',
      titulo: 'Anchor devices — Personal fall protection equipment',
      internacional: true,
      itens: {
        tipoC: 'EN 795 Type C — flexible horizontal lifeline (cabo de aço). Equivale ao "tipo C" da NBR 16325.',
        classes: 'EN 795 — Type A (structural), B (transportable), C (horizontal flexible line), D (rigid rail), E (deadweight).',
        multi: 'CEN/TS 16415 — anchor devices for use by MORE THAN ONE person simultaneously (carga majorada por usuário adicional).'
      }
    },
    EN355: {
      codigo: 'EN 355 / EN 354 / EN 360 / EN 361',
      titulo: 'PPE against falls — energy absorbers, lanyards, retractables, harnesses',
      internacional: true,
      itens: {
        absorvedor: 'EN 355 — energy absorber limits the arrest force on the worker to ≤ 6 kN.',
        arnes: 'EN 361 — full body harness; EN 354 lanyards; EN 360 self-retracting lifelines (SRL).'
      }
    },
    OSHA: {
      codigo: 'OSHA 29 CFR 1926.502 / 1910.140',
      titulo: 'US — Fall protection systems criteria and practices',
      internacional: true,
      itens: {
        gi1910: 'OSHA 1910.140 (General Industry) — personal fall protection systems: definitions and performance criteria (MAF ≤ 1,800 lbf; anchorages ≥ 5,000 lbf or engineered).',
        arrest: 'OSHA 1926.502(d)(16) (Construction, Subpart M) — personal fall arrest: maximum arresting force (MAF) ≤ 1,800 lbf (≈ 8 kN) with body harness.',
        freefall: 'OSHA 1926.502(d)(16) — limit free fall to 6 ft (1.83 m) and maximum deceleration distance to 3.5 ft (1.07 m).',
        anchorage: 'OSHA 1926.502(d)(15) — anchorages: 5,000 lbf (≈ 22.2 kN) per worker, OR designed as part of a complete system (safety factor ≥ 2) supervised by a qualified person.',
        clearance: 'OSHA — verify total fall distance (TFD): free fall + deceleration + harness stretch + safety margin — no contact with lower level.'
      }
    },
    ANSI: {
      codigo: 'ANSI/ASSP Z359 (Fall Protection Code)',
      titulo: 'US — Fall Protection Code',
      internacional: true,
      itens: {
        z359_6: 'ANSI/ASSP Z359.6 — design of active fall protection systems by a qualified person: computes lifeline DEFLECTION, anchorage/support forces and total fall clearance for engineered HLL. (Base do dimensionamento deste software.)',
        z359_11: 'ANSI/ASSP Z359.11 — full-body harnesses.',
        z359_13: 'ANSI/ASSP Z359.13 — personal energy absorbers and lanyards (limit MAF to 1,800 lbf).',
        z359_14: 'ANSI/ASSP Z359.14 — self-retracting devices (SRLs).',
        z359_15: 'ANSI/ASSP Z359.15 — single-anchor lifelines and fall arresters for vertical systems.'
      }
    },
    ISO22846: {
      codigo: 'ISO 22846 / IRATA',
      titulo: 'Rope access — safety and practice',
      internacional: true,
      itens: { acesso: 'ISO 22846 / IRATA — acesso por cordas (quando aplicável a inspeção/manutenção em altura).' }
    }
  };

  /** Tabela de equivalência entre normas (BR × Internacionais) — exibida no prontuário internacional. */
  var EQUIVALENCIAS = [
    { tema: 'Linha de vida horizontal flexível', temaEn: 'Flexible horizontal lifeline', br: 'NBR 16325-2 (tipo C)', en: 'EN 795 Type C', us: 'ANSI Z359.6 / OSHA 1926.502' },
    { tema: 'Força máxima no trabalhador', temaEn: 'Maximum arrest force on worker', br: 'NR-35.6.7 — 6 kN', en: 'EN 355 — 6 kN', us: 'OSHA — 8 kN (1,800 lbf) / ANSI 6 kN' },
    { tema: 'Resistência da ancoragem', temaEn: 'Anchorage strength', br: 'NR-18 — 15 kN', en: 'EN 795 — ensaio 12–18 kN', us: 'OSHA — 22.2 kN (5,000 lbf) or SF ≥ 2' },
    { tema: 'Absorvedor de energia', temaEn: 'Energy absorber', br: 'NBR 16489', en: 'EN 355', us: 'ANSI Z359.13' },
    { tema: 'Cinturão paraquedista', temaEn: 'Full-body harness', br: 'NR-35 / NBR 15836', en: 'EN 361', us: 'ANSI Z359.11' },
    { tema: 'Múltiplos usuários', temaEn: 'Multiple users', br: '— (majorar carga)', en: 'CEN/TS 16415', us: 'ANSI Z359.6' },
    { tema: 'Vento em estruturas', temaEn: 'Wind on structures', br: 'NBR 6123', en: 'EN 1991-1-4', us: 'ASCE 7' },
    { tema: 'Estruturas de aço', temaEn: 'Steel structures', br: 'NBR 8800', en: 'EN 1993 (Eurocode 3)', us: 'AISC 360' },
    { tema: 'Estruturas de concreto', temaEn: 'Concrete structures', br: 'NBR 6118', en: 'EN 1992', us: 'ACI 318' },
    { tema: 'Distância/zona livre de queda', temaEn: 'Required fall clearance', br: 'NBR 16325-2 (ZLQ)', en: 'EN 363', us: 'OSHA TFD / Z359.6' },
    { tema: 'Dispositivo retrátil (SRL)', temaEn: 'Self-retracting lifeline (SRL)', br: 'NBR 16325', en: 'EN 360', us: 'ANSI Z359.14' },
    { tema: 'Sistema vertical / ponto único', temaEn: 'Vertical system / single point', br: 'NBR 16325-1', en: 'EN 353/795', us: 'ANSI Z359.15' },
    { tema: 'Indústria geral (uso/critérios)', temaEn: 'General industry (use/criteria)', br: 'NR-35 / NR-18', en: 'EN 365', us: 'OSHA 1910.140' }
  ];

  /** Lista plana (para a aba de referências do prontuário). */
  function listarReferencias() {
    var out = [];
    Object.keys(NORMS).forEach(function (k) {
      var n = NORMS[k];
      out.push({ codigo: n.codigo, titulo: n.titulo, itens: Object.keys(n.itens).map(function (i) { return n.itens[i]; }) });
    });
    return out;
  }

  /** Estrutura formal do PRONTUÁRIO do sistema (dossiê técnico auditável). */
  var PRONTUARIO_SECOES = [
    { id: 'capa',        titulo: 'Capa e identificação do sistema' },
    { id: 'objeto',      titulo: '1 · Objeto e dados gerais' },
    { id: 'normas',      titulo: '2 · Normas e premissas adotadas' },
    { id: 'descritivo',  titulo: '3 · Memorial descritivo' },
    { id: 'calculo',     titulo: '4 · Memorial de cálculo (NR-35 Anexo II 5.1.1)' },
    { id: 'materiais',   titulo: '5 · Especificação técnica de materiais' },
    { id: 'compat',      titulo: '6 · Compatibilidade substrato × ancoragem' },
    { id: 'quantit',     titulo: '7 · Quantitativo de materiais e EPI' },
    { id: 'apr',         titulo: '8 · Análise Preliminar de Risco (APR)' },
    { id: 'pt',          titulo: '9 · Procedimento e Permissão de Trabalho (PT)' },
    { id: 'inspecao',    titulo: '10 · Plano e registros de inspeção (NR-35.6.6)' },
    { id: 'ensaio',      titulo: '11 · Registro de ensaio de carga das ancoragens' },
    { id: 'resgate',     titulo: '12 · Plano de emergência e resgate (NR-35.7)' },
    { id: 'capacit',     titulo: '13 · Registro de capacitação (NR-35.4)' },
    { id: 'epi',         titulo: '14 · Relação de EPI (CA e validade)' },
    { id: 'placa',       titulo: '15 · Plaqueta de identificação (NR-18 18.12.12.3)' },
    { id: 'liberacao',   titulo: '16 · Termo de entrega técnica e liberação de uso' },
    { id: 'art',         titulo: '17 · Responsabilidade técnica (ART)' },
    { id: 'refs',        titulo: '18 · Referências normativas' }
  ];

  var Norms = { NORMS: NORMS, PRONTUARIO_SECOES: PRONTUARIO_SECOES, EQUIVALENCIAS: EQUIVALENCIAS, listarReferencias: listarReferencias };

  root.LV = root.LV || {};
  root.LV.Norms = Norms;
  if (typeof module !== 'undefined' && module.exports) module.exports = Norms;
})(typeof self !== 'undefined' ? self : (typeof globalThis !== 'undefined' ? globalThis : this));
