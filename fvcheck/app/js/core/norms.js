/* ============================================================================
 *  FV-CHECK · GD ENGENHARIA — Verificação Estrutural Expressa p/ FV em Telhado
 *  norms.js — Catálogo central de REFERÊNCIAS NORMATIVAS (auditável)
 *
 *  Base normativa do método expresso:
 *    · ABNT NBR 6123      — Forças devidas ao vento em edificações
 *    · ABNT NBR 8681      — Ações e segurança nas estruturas
 *    · ABNT NBR 6120      — Ações para o cálculo de estruturas de edificações
 *    · ABNT NBR 8800      — Projeto de estruturas de aço (laminados/soldados)
 *    · ABNT NBR 14762     — Estruturas de aço com perfis formados a frio
 *    · ABNT NBR 6355      — Perfis estruturais de aço formados a frio (séries)
 *    · ABNT NBR 16690     — Instalações elétricas de arranjos fotovoltaicos
 *
 *  Concentrar as referências em um único módulo facilita a auditoria por
 *  peritos, seguradoras e calculistas da rede, e a manutenção quando as
 *  normas forem revisadas. Os enunciados abaixo são paráfrases técnicas;
 *  o texto oficial da ABNT prevalece sempre.
 * ========================================================================== */
(function (root) {
  'use strict';

  var NORMS = {
    NBR6123: {
      codigo: 'ABNT NBR 6123',
      titulo: 'Forças devidas ao vento em edificações',
      itens: {
        vk:        'NBR 6123 4.2 — velocidade característica Vk = V0 · S1 · S2 · S3.',
        v0:        'NBR 6123 5.1 — V0: velocidade básica do vento (isopletas), rajada de 3 s, 50 anos de recorrência, a 10 m em campo aberto.',
        s1:        'NBR 6123 5.2 — S1: fator topográfico (terreno plano = 1,0; taludes e morros conforme 5.2 (b); vales protegidos = 0,9).',
        s2:        'NBR 6123 5.3 — S2 = b · Fr · (z/10)^p, com b, p pela categoria de rugosidade (Tabela 1) e Fr pela classe de dimensões (A/B/C).',
        s2classe:  'NBR 6123 5.3.2 — Classe A: toda unidade de vedação e suas fixações e peças individuais (maior dimensão ≤ 20 m); B: ≤ 50 m; C: > 50 m.',
        s3:        'NBR 6123 5.4 — S3: fator estatístico (Grupo 2 — edificações em geral: 1,00; Grupo 1: 1,10; Grupo 3 — baixa ocupação: 0,95).',
        q:         'NBR 6123 4.2 (c) — pressão dinâmica q = 0,613 · Vk² (q em N/m², Vk em m/s).',
        ce:        'NBR 6123 6.1/6.2 e Tabela 5 — coeficientes de pressão e de forma externos para telhados de duas águas em edificações de planta retangular.',
        ci:        'NBR 6123 6.2.5 — coeficiente de pressão interna Ci: edificações com paredes de permeabilidade semelhante: +0,2 e −0,3 (adotar o mais nocivo).',
        ciDominante:'NBR 6123 6.2.5 — aberturas dominantes alteram Ci (até ±0,8 conforme o caso); exige análise específica.',
        local:     'NBR 6123 6.1.3 / Tabela 5 (nota) — nas arestas (beiral, cumeeira, oitões) ocorrem coeficientes de pressão médios locais majorados (até −2,0), aplicáveis ao dimensionamento de fixações e vedações.',
        dp:        'NBR 6123 6.1.2 — pressão efetiva ΔP = (Ce − Ci) · q; valores negativos indicam sucção (de dentro para fora).'
      }
    },
    NBR8681: {
      codigo: 'ABNT NBR 8681',
      titulo: 'Ações e segurança nas estruturas — Procedimento',
      itens: {
        combUlt:   'NBR 8681 5.1.3 — combinações últimas normais: Fd = Σ γgi·Gi + γq·[Q1 + Σ ψ0j·Qj].',
        gFavoravel:'NBR 8681 5.1.4.1 — ações permanentes favoráveis à segurança: γg = 1,0 (verificação de arrancamento/inversão de esforços).',
        combServ:  'NBR 8681 5.1.5 — combinações de serviço (raras, frequentes e quase permanentes) para estados-limites de serviço.',
        psi:       'NBR 8681 Tabela 6 — fatores de combinação ψ0 e de redução ψ1/ψ2.'
      }
    },
    NBR6120: {
      codigo: 'ABNT NBR 6120:2019',
      titulo: 'Ações para o cálculo de estruturas de edificações',
      itens: {
        sc025:     'NBR 6120:2019 Tabela 10 (coberturas) — sobrecarga característica mínima de 0,25 kN/m² (em projeção horizontal) em coberturas acessíveis somente para manutenção e sem acúmulo de materiais.',
        pesoAco:   'NBR 6120:2019 Tabela 1 — peso específico do aço: 78,5 kN/m³.',
        equip:     'NBR 6120:2019 — equipamentos permanentes (ex.: módulos FV e estruturas de fixação) são ações permanentes diretas e devem constar do projeto.'
      }
    },
    NBR8800: {
      codigo: 'ABNT NBR 8800:2008',
      titulo: 'Projeto de estruturas de aço e mistas de aço e concreto de edifícios',
      itens: {
        gamaG:     'NBR 8800 Tabela 1 — γg: peso próprio de estruturas metálicas 1,25; elementos construtivos industrializados 1,35; ações variáveis (uso) 1,50; vento 1,40.',
        gamaA1:    'NBR 8800 4.8.2/Tabela 3 — coeficiente de ponderação da resistência γa1 = 1,10 (escoamento e instabilidade).',
        flt:       'NBR 8800 5.4.2 / Anexo G — flambagem lateral com torção (FLT) de vigas; mesa comprimida contida lateralmente de forma contínua dispensa a verificação.',
        flecha:    'NBR 8800 Anexo C, Tabela C.1 — deslocamento máximo de terças de cobertura: L/180 (combinações raras de serviço).',
        sc025:     'NBR 8800 Anexo B, B.5.1 — sobrecarga nominal mínima de 0,25 kN/m² em coberturas comuns (projeção horizontal).'
      }
    },
    NBR14762: {
      codigo: 'ABNT NBR 14762:2010',
      titulo: 'Dimensionamento de estruturas de aço constituídas por perfis formados a frio',
      itens: {
        gama:      'NBR 14762 Tabela 5 — γ = 1,10 para escoamento/flambagem na flexão e no cisalhamento.',
        larguras:  'NBR 14762 9.2 — método das larguras efetivas: elemento AA (apoiado-apoiado, k=4,0), elemento AL (apoiado-livre, k=0,43); largura efetiva pela curva de Winter: ρ = (1 − 0,22/λp)/λp para λp > 0,673.',
        fatorR:    'NBR 14762 9.8.2.2 (base AISI D6.1.2) — barras com um flange conectado a painel por parafusos passantes, sujeitas a LEVANTAMENTO: MRd = R·W·fy/γ, com R = 0,40 (U/Ue biapoiada), 0,50 (Z biapoiada), 0,60 (U/Ue contínua), 0,70 (Z contínua), respeitadas as condições de aplicabilidade.',
        cortante:  'NBR 14762 9.8.3 — força cortante resistente: VRd = 0,6·fy·h·t/γ para h/t ≤ 1,08·√(E·kv/fy); transição 0,65·t²·√(kv·fy·E)/γ; elástica 0,905·E·kv·t³/(h·γ); kv = 5,0 (alma sem enrijecedores).',
        flexao:    'NBR 14762 9.8.2 — momento fletor resistente de cálculo: MRd = Wef·fy/γ (início de escoamento da seção efetiva).',
        interacao: 'NBR 14762 9.9 (simplificação conservadora) — flexão oblíqua: Mx,Sd/Mx,Rd + My,Sd/My,Rd ≤ 1,0.'
      }
    },
    NBR6355: {
      codigo: 'ABNT NBR 6355:2012',
      titulo: 'Perfis estruturais de aço formados a frio — Padronização',
      itens: {
        series:    'NBR 6355 — séries comerciais U simples (U), U enrijecido (Ue) e Z enrijecido (Ze) com dimensões nominais padronizadas.'
      }
    },
    NBR16690: {
      codigo: 'ABNT NBR 16690:2019',
      titulo: 'Instalações elétricas de arranjos fotovoltaicos — Requisitos de projeto',
      itens: {
        estrutura: 'NBR 16690 — o projeto do arranjo FV deve considerar os esforços transmitidos à edificação (peso próprio, vento) e a compatibilidade com a estrutura de suporte, sob responsabilidade de profissional habilitado.'
      }
    },
    RESPONSABILIDADE: {
      codigo: 'Lei 5.194/66 · Res. CONFEA 1.025/2009',
      titulo: 'Responsabilidade técnica e ART',
      itens: {
        art:       'Res. CONFEA 1.025/2009 — todo serviço de engenharia (projeto, laudo, verificação estrutural) exige ART emitida por profissional legalmente habilitado.',
        laudo:     'A verificação expressa é uma TRIAGEM assistida por software e não substitui laudo/projeto assinado com ART por engenheiro habilitado.'
      }
    }
  };

  /* Parâmetros meteorológicos/normativos centralizados (auditáveis) */
  var PARAM = {
    // NBR 6123 Tabela 1 — S2 = b·Fr·(z/10)^p  (Fr pela classe, b/p pela categoria)
    S2: {
      Fr: { A: 1.00, B: 0.98, C: 0.95 },
      cat: {
        I:   { A: { b: 1.10, p: 0.06  }, B: { b: 1.11, p: 0.065 }, C: { b: 1.12, p: 0.07  } },
        II:  { A: { b: 1.00, p: 0.085 }, B: { b: 1.00, p: 0.09  }, C: { b: 1.00, p: 0.10  } },
        III: { A: { b: 0.94, p: 0.10  }, B: { b: 0.94, p: 0.105 }, C: { b: 0.93, p: 0.115 } },
        IV:  { A: { b: 0.86, p: 0.12  }, B: { b: 0.85, p: 0.125 }, C: { b: 0.84, p: 0.135 } },
        V:   { A: { b: 0.74, p: 0.15  }, B: { b: 0.73, p: 0.16  }, C: { b: 0.71, p: 0.175 } }
      }
    },
    // NBR 6123 Tabela 5 — Ce em telhados de duas águas, planta retangular, h/b ≤ 1/2.
    // Vento a 90° (perpendicular à cumeeira): [face de barlavento EF, face de sotavento GH]
    // Para 1/2 < h/b ≤ 3/2 as sucções são mais severas; ver fator abaixo.
    CE_TAB5_HB05: [
      { th: 0,  EF: -0.8, GH: -0.4 },
      { th: 5,  EF: -0.9, GH: -0.4 },
      { th: 10, EF: -1.2, GH: -0.4 },
      { th: 15, EF: -1.0, GH: -0.4 },
      { th: 20, EF: -0.4, GH: -0.4 },
      { th: 30, EF:  0.0, GH: -0.4 },
      { th: 45, EF:  0.3, GH: -0.5 },
      { th: 60, EF:  0.7, GH: -0.6 }
    ],
    // Vento a 0° (paralelo à cumeeira): sucção típica nas duas águas (valor envoltório
    // conservador adotado pelo método expresso; Tabela 5 apresenta EG/FH ≈ −0,6 a −0,8)
    CE_PARALELO: -0.8,
    // Majoração das sucções para edificações altas (1/2 < h/b ≤ 3/2) — envoltória expressa
    CE_FATOR_HB_ALTO: 1.15,
    // Coeficiente médio LOCAL de bordas/cumeeira (fixações e vedações) — envoltória Tabela 5 (nota)
    CE_LOCAL_BORDA: -2.0,
    CI: { pos: 0.2, neg: -0.3 }, // NBR 6123 6.2.5 (duas faces permeáveis)
    // Ponderações (NBR 8800 Tabela 1 / NBR 8681)
    GAMA: { gEstrutura: 1.25, gIndustrializado: 1.35, gFavoravel: 1.00, q: 1.50, vento: 1.40, a1: 1.10 },
    // Sobrecarga de cobertura (NBR 6120:2019 Tab.10 / NBR 8800 B.5.1) — kN/m² em projeção horizontal
    SC_COBERTURA: 0.25,
    // Aço
    E: 200000, // MPa (NBR 8800 4.5.2.9)
    G: 77000,  // MPa
    PESO_ACO: 77.0, // kN/m³ → NBR 6120 usa 78,5; adotado 77,0 (usual p/ perfis) — ver docs
    // Limites de serviço
    FLECHA_TERCA: 180, // L/180 — NBR 8800 Anexo C Tabela C.1
    // Semáforo (critério do método expresso)
    SEMAFORO: { verde: 0.85, atencao: 1.00 },
    // Acréscimo global de carga permanente sobre a estrutura principal
    ACRESCIMO: { verde: 5, atencao: 10 } // %
  };
  // NBR 6120:2019 Tabela 1: aço 78,5 kN/m³ — adotar o valor normativo:
  PARAM.PESO_ACO = 78.5;

  function ref(norma, item) {
    var n = NORMS[norma];
    if (!n) return '';
    return n.itens[item] || '';
  }

  var Norms = { NORMS: NORMS, PARAM: PARAM, ref: ref };

  root.FV = root.FV || {};
  root.FV.Norms = Norms;
  if (typeof module !== 'undefined' && module.exports) module.exports = Norms;
})(typeof self !== 'undefined' ? self : (typeof globalThis !== 'undefined' ? globalThis : this));
