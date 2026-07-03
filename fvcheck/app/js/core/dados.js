/* ============================================================================
 *  FV-CHECK · GD ENGENHARIA — Verificação Estrutural Expressa p/ FV em Telhado
 *  dados.js — Catálogos técnicos e comerciais
 *
 *  · Aços estruturais usuais em terças (fy em MPa)
 *  · Séries de perfis de terça (NBR 6355 + laminados) — dimensões nominais;
 *    as propriedades geométricas são CALCULADAS por sections.js (auditável)
 *  · Telhas: peso próprio, vão máximo usual e carga admissível TÍPICOS —
 *    valores de triagem; a tabela do fabricante prevalece (avisado na UI)
 *  · Módulos fotovoltaicos: presets de mercado
 *  · Vento: V0 típico conservador por UF (isopletas NBR 6123 Fig. 1)
 *  · Preços/planos do SaaS (configuráveis)
 * ========================================================================== */
(function (root) {
  'use strict';

  /* ----------------------------- Aços ----------------------------------- */
  var ACOS = [
    { id: 'ZAR230',  nome: 'ZAR-230 (bobina zincada)',        fy: 230, fu: 310 },
    { id: 'ZAR280',  nome: 'ZAR-280 (bobina zincada)',        fy: 280, fu: 370 },
    { id: 'ZAR345',  nome: 'ZAR-345 (bobina zincada)',        fy: 345, fu: 430 },
    { id: 'A36',     nome: 'ASTM A36 / MR-250',               fy: 250, fu: 400 },
    { id: 'A572_50', nome: 'ASTM A572 Gr.50 / AR-350',        fy: 345, fu: 450 },
    { id: 'SAE1010', nome: 'SAE 1008/1010 (chapa comum)',     fy: 180, fu: 300 },
    { id: 'DESCONHECIDO', nome: 'Não sei (adota conservador)', fy: 200, fu: 330, atencao: 'Aço desconhecido — adotado fy = 200 MPa (conservador). A identificação do material integra o laudo completo.' }
  ];

  /* ------------------------ Perfis de terça ------------------------------ */
  /* Dimensões nominais em mm: bw = alma; bf = mesa; D = enrijecedor; t = espessura.
   * type: U (U simples) | UE (U enrijecido) | Z (Z enrijecido, dims como UE)
   *       TR (tubo retangular/metalon: bw = altura, bf = largura) | W (laminado, com props de tabela) */
  var PERFIS = [
    // --- U simples (NBR 6355 série U) ---
    { id: 'U100x40x2.65', type: 'U', nome: 'U 100×40×2,65', bw: 100, bf: 40, t: 2.65 },
    { id: 'U100x50x3.00', type: 'U', nome: 'U 100×50×3,00', bw: 100, bf: 50, t: 3.00 },
    { id: 'U127x50x2.65', type: 'U', nome: 'U 127×50×2,65', bw: 127, bf: 50, t: 2.65 },
    { id: 'U127x50x3.00', type: 'U', nome: 'U 127×50×3,00', bw: 127, bf: 50, t: 3.00 },
    { id: 'U150x50x2.65', type: 'U', nome: 'U 150×50×2,65', bw: 150, bf: 50, t: 2.65 },
    { id: 'U150x50x3.00', type: 'U', nome: 'U 150×50×3,00', bw: 150, bf: 50, t: 3.00 },
    { id: 'U150x60x3.75', type: 'U', nome: 'U 150×60×3,75', bw: 150, bf: 60, t: 3.75 },
    { id: 'U200x75x3.00', type: 'U', nome: 'U 200×75×3,00', bw: 200, bf: 75, t: 3.00 },
    // --- U enrijecido (NBR 6355 série Ue) ---
    { id: 'UE100x50x17x2.00', type: 'UE', nome: 'Ue 100×50×17×2,00', bw: 100, bf: 50, D: 17, t: 2.00 },
    { id: 'UE127x50x17x2.00', type: 'UE', nome: 'Ue 127×50×17×2,00', bw: 127, bf: 50, D: 17, t: 2.00 },
    { id: 'UE150x60x20x2.00', type: 'UE', nome: 'Ue 150×60×20×2,00', bw: 150, bf: 60, D: 20, t: 2.00 },
    { id: 'UE150x60x20x2.65', type: 'UE', nome: 'Ue 150×60×20×2,65', bw: 150, bf: 60, D: 20, t: 2.65 },
    { id: 'UE200x75x20x2.00', type: 'UE', nome: 'Ue 200×75×20×2,00', bw: 200, bf: 75, D: 20, t: 2.00 },
    { id: 'UE200x75x20x2.65', type: 'UE', nome: 'Ue 200×75×20×2,65', bw: 200, bf: 75, D: 20, t: 2.65 },
    { id: 'UE200x75x25x3.00', type: 'UE', nome: 'Ue 200×75×25×3,00', bw: 200, bf: 75, D: 25, t: 3.00 },
    { id: 'UE250x85x25x2.65', type: 'UE', nome: 'Ue 250×85×25×2,65', bw: 250, bf: 85, D: 25, t: 2.65 },
    { id: 'UE250x85x25x3.00', type: 'UE', nome: 'Ue 250×85×25×3,00', bw: 250, bf: 85, D: 25, t: 3.00 },
    { id: 'UE300x85x25x3.00', type: 'UE', nome: 'Ue 300×85×25×3,00', bw: 300, bf: 85, D: 25, t: 3.00 },
    // --- Z enrijecido (NBR 6355 série Ze — enrijecedor a 90°) ---
    { id: 'Z150x60x20x2.00', type: 'Z', nome: 'Ze 150×60×20×2,00', bw: 150, bf: 60, D: 20, t: 2.00 },
    { id: 'Z150x60x20x2.65', type: 'Z', nome: 'Ze 150×60×20×2,65', bw: 150, bf: 60, D: 20, t: 2.65 },
    { id: 'Z200x75x20x2.00', type: 'Z', nome: 'Ze 200×75×20×2,00', bw: 200, bf: 75, D: 20, t: 2.00 },
    { id: 'Z200x75x20x2.65', type: 'Z', nome: 'Ze 200×75×20×2,65', bw: 200, bf: 75, D: 20, t: 2.65 },
    { id: 'Z250x85x25x2.65', type: 'Z', nome: 'Ze 250×85×25×2,65', bw: 250, bf: 85, D: 25, t: 2.65 },
    // --- Tubo retangular (metalon estrutural) ---
    { id: 'TR100x40x2.00', type: 'TR', nome: 'Tubo 100×40×2,00', bw: 100, bf: 40, t: 2.00 },
    { id: 'TR100x50x3.00', type: 'TR', nome: 'Tubo 100×50×3,00', bw: 100, bf: 50, t: 3.00 },
    { id: 'TR120x60x3.00', type: 'TR', nome: 'Tubo 120×60×3,00', bw: 120, bf: 60, t: 3.00 },
    { id: 'TR150x50x3.00', type: 'TR', nome: 'Tubo 150×50×3,00', bw: 150, bf: 50, t: 3.00 },
    // --- Perfis I laminados (Gerdau — propriedades nominais de tabela) ---
    { id: 'W150x13', type: 'W', nome: 'W 150×13,0 (laminado)', props: { A: 16.6, Ix: 635,  Wx: 88.8,  Iy: 82.9, Wy: 16.6, ry: 2.24, hw: 138, tw: 4.3 }, peso: 13.0 },
    { id: 'W150x18', type: 'W', nome: 'W 150×18,0 (laminado)', props: { A: 23.4, Ix: 939,  Wx: 122.8, Iy: 126,  Wy: 24.7, ry: 2.32, hw: 139, tw: 5.8 }, peso: 18.0 },
    { id: 'W200x15', type: 'W', nome: 'W 200×15,0 (laminado)', props: { A: 19.4, Ix: 1305, Wx: 130.4, Iy: 87.6, Wy: 17.5, ry: 2.12, hw: 190, tw: 4.3 }, peso: 15.0 },
    { id: 'W200x19.3', type: 'W', nome: 'W 200×19,3 (laminado)', props: { A: 25.1, Ix: 1686, Wx: 165.7, Iy: 116, Wy: 23.2, ry: 2.14, hw: 190, tw: 5.8 }, peso: 19.3 },
    // --- Personalizado ---
    { id: 'CUSTOM', type: 'CUSTOM', nome: 'Personalizado (informar dimensões)' }
  ];

  /* ------------------------------ Telhas -------------------------------- */
  /* peso: kN/m² (inclui sobreposição/acessórios) · vaoMax: m (apoios múltiplos)
   * qAdm: kN/m² carga admissível TÍPICA no vão máximo (triagem)
   * fixDireta: aceita fixação do FV diretamente na telha? (senão: nas terças) */
  var TELHAS = [
    { id: 'FIBRO6',   nome: 'Fibrocimento ondulada 6 mm',        peso: 0.18, vaoMax: 1.69, qAdm: 0.55, fixDireta: false,
      obs: 'Fixação do FV deve ser feita na terça (parafuso prisioneiro/gancho) — nunca apenas na telha. Telhas com mais de 10 anos: verificar fissuras e friabilidade.' },
    { id: 'FIBRO8',   nome: 'Fibrocimento ondulada 8 mm',        peso: 0.22, vaoMax: 1.99, qAdm: 0.65, fixDireta: false,
      obs: 'Fixação do FV na terça. Verificar estado (fissuras, absorção).' },
    { id: 'FIBROESTR',nome: 'Fibrocimento estrutural (kalhetão)', peso: 0.34, vaoMax: 4.60, qAdm: 0.60, fixDireta: false,
      obs: 'Telha autoportante — a verificação da telha ao novo carregamento exige consulta ao fabricante (item tratado como ATENÇÃO).' , forcaAtencao: true },
    { id: 'TP40_043', nome: 'Metálica trapezoidal TP40 e=0,43 mm', peso: 0.05, vaoMax: 1.75, qAdm: 0.70, fixDireta: true,
      obs: 'Fixação direta admitida apenas com suporte tipo mini-trilho parafusado na crista com vedação EPDM e arrancamento comprovado por ensaio.' },
    { id: 'TP40_050', nome: 'Metálica trapezoidal TP40 e=0,50 mm', peso: 0.055, vaoMax: 2.10, qAdm: 0.85, fixDireta: true,
      obs: 'Fixação direta admitida com suporte adequado e ensaio de arrancamento.' },
    { id: 'TP25_043', nome: 'Metálica trapezoidal TP25 e=0,43 mm', peso: 0.048, vaoMax: 1.40, qAdm: 0.60, fixDireta: true,
      obs: 'Perfil baixo — preferir fixação alinhada às terças.' },
    { id: 'OND043',   nome: 'Metálica ondulada e=0,43 mm',        peso: 0.048, vaoMax: 1.10, qAdm: 0.50, fixDireta: false,
      obs: 'Perfil ondulado de baixa inércia — fixação do FV na terça.' },
    { id: 'SAND30',   nome: 'Termoacústica (sanduíche) EPS/PIR 30 mm', peso: 0.12, vaoMax: 2.00, qAdm: 0.80, fixDireta: true,
      obs: 'Verificar esmagamento do núcleo no ponto de fixação (calço/coxim).' },
    { id: 'ZIP065',   nome: 'Zipada/Seam e=0,65 mm (clips)',      peso: 0.07, vaoMax: 2.50, qAdm: 0.75, fixDireta: true, zipada: true,
      obs: 'Sistema zipado: a telha NÃO trava a mesa da terça (clips deslizantes) e a fixação por grampos exige ensaio do sistema — item tratado com critério conservador.' },
    { id: 'CERAMICA', nome: 'Cerâmica/concreto (madeira)',        peso: 0.75, vaoMax: 0.60, qAdm: 0.90, fixDireta: false, naoSuportada: true,
      obs: 'Estruturas de madeira/telha cerâmica estão FORA do escopo do método expresso (NBR 7190) — solicite o laudo completo.' }
  ];

  /* --------------------------- Módulos FV -------------------------------- */
  var MODULOS = [
    { id: 'M450', nome: '450 Wp — 2,09×1,04 m · 24 kg', wp: 450, comp: 2.094, larg: 1.038, kg: 24.0 },
    { id: 'M550', nome: '550 Wp — 2,28×1,13 m · 28 kg', wp: 550, comp: 2.278, larg: 1.134, kg: 28.0 },
    { id: 'M585', nome: '585 Wp — 2,28×1,13 m · 31 kg', wp: 585, comp: 2.278, larg: 1.134, kg: 31.0 },
    { id: 'M615', nome: '615 Wp — 2,38×1,13 m · 31,5 kg', wp: 615, comp: 2.384, larg: 1.134, kg: 31.5 },
    { id: 'MCUSTOM', nome: 'Personalizado', wp: 0, comp: 0, larg: 0, kg: 0 }
  ];
  var TRILHOS_PADRAO = 0.03; // kN/m² — trilhos + grampos + parafusos (típico 2–4 kgf/m²)

  /* ------------------------- Vento por UF -------------------------------- */
  /* V0 típico CONSERVADOR por UF (m/s), envoltória das isopletas NBR 6123 Fig.1
   * dentro do estado. Sempre confirmar na isopleta para o município (avisado). */
  var V0_UF = {
    AC: 30, AL: 32, AP: 30, AM: 30, BA: 32, CE: 32, DF: 35, ES: 34, GO: 35,
    MA: 32, MT: 35, MS: 42, MG: 35, PA: 30, PB: 32, PR: 45, PE: 32, PI: 32,
    RJ: 35, RN: 32, RS: 47, RO: 30, RR: 32, SC: 45, SP: 42, SE: 32, TO: 32
  };
  var CATEGORIAS_TERRENO = [
    { id: 'I',   nome: 'I — Mar/lagos, superfícies lisas (> 5 km)' },
    { id: 'II',  nome: 'II — Campo aberto, poucos obstáculos (fazendas, aeroportos)' },
    { id: 'III', nome: 'III — Terreno com obstáculos baixos (subúrbios, granjas, muros)' },
    { id: 'IV',  nome: 'IV — Zona urbanizada/industrial (obstáculos ~10 m)' },
    { id: 'V',   nome: 'V — Centro de grande cidade (obstáculos ≥ 25 m)' }
  ];
  /* Ambiente ao redor em linguagem simples → categoria de rugosidade NBR 6123 */
  var AMBIENTES = [
    { id: 'mar',     categoria: 'I',   nome: '🌊 Beira de mar, lago ou campo totalmente liso', sub: 'Nada segura o vento — pega vento máximo' },
    { id: 'campo',   categoria: 'II',  nome: '🌾 Campo aberto (fazenda, beira de rodovia)', sub: 'Poucos obstáculos baixos — pega muito vento' },
    { id: 'sitios',  categoria: 'III', nome: '🏡 Região com casas baixas, árvores e cercas espalhadas', sub: 'Obstáculos até ~3 m ao redor' },
    { id: 'cidade',  categoria: 'IV',  nome: '🏘️ Bairro urbano ou distrito industrial cheio de construções', sub: 'Muitos prédios/galpões (~10 m) ao redor' },
    { id: 'centro',  categoria: 'V',   nome: '🏙️ Centro de cidade grande, com prédios altos por perto', sub: 'Obstáculos com 25 m ou mais' }
  ];
  var S1_OPCOES = [
    { id: 'plano',  nome: 'Terreno plano ou quase plano', valor: 1.0 },
    { id: 'talude', nome: 'No alto de um morro ou barranco (pega mais vento)', valor: 1.10, atencao: 'Edificação em topo de talude/morro: S1 varia ao longo da encosta (NBR 6123 5.2 b) — o valor exato é calculado no laudo. Adotado 1,10 (conservador).' },
    { id: 'vale',   nome: 'Numa baixada bem protegida do vento (vale fundo)', valor: 0.9 }
  ];
  /* Estrutura principal (pórticos/tesouras) em linguagem simples */
  var ESTRUTURAS_PRINCIPAIS = [
    { id: 'metalica', nome: '🏗️ Metálica — treliças (tesouras) ou vigas de aço', sub: 'O mais comum em galpões' },
    { id: 'concreto', nome: '🧱 Concreto armado ou pré-moldado', sub: 'Pilares e vigas de concreto (terças podem ser de aço)' },
    { id: 'madeira',  nome: '🪵 Madeira', sub: 'Tesouras/terças de madeira', foraEscopo: 'Estruturas de madeira (NBR 7190) estão fora do método expresso — solicite o laudo completo.' }
  ];
  var TERCA_MATERIAIS = [
    { id: 'aco',      nome: 'Aço (perfil dobrado, metalon ou viga I)', sub: 'Meça o perfil com trena — te ajudamos abaixo' },
    { id: 'concreto', nome: 'Concreto (terça pré-moldada)', foraEscopo: 'Terças de concreto exigem verificação pela NBR 6118 — fora do método expresso; solicite o laudo.' },
    { id: 'madeira',  nome: 'Madeira (caibro/viga)', foraEscopo: 'Terças de madeira (NBR 7190) estão fora do método expresso — solicite o laudo.' }
  ];
  var S3_OPCOES = [
    { id: 'g2', nome: 'Grupo 2 — Edificações em geral (fábricas, comércio, residências)', valor: 1.00 },
    { id: 'g1', nome: 'Grupo 1 — Pós-desastre (hospitais, bombeiros, energia)', valor: 1.10 },
    { id: 'g3', nome: 'Grupo 3 — Baixo fator de ocupação (depósitos, silos)', valor: 0.95 }
  ];

  /* ------------------- Estado de conservação ----------------------------- */
  var CONSERVACAO = [
    { id: 'bom',     nome: 'Bom — sem corrosão aparente, geometria íntegra', fator: 1.00 },
    { id: 'regular', nome: 'Regular — corrosão superficial/pintura degradada', fator: 0.90,
      atencao: 'Corrosão superficial: resistência reduzida em 10% na triagem; vistoria presencial recomendada.' },
    { id: 'ruim',    nome: 'Ruim — corrosão com perda de seção, avarias ou flechas visíveis', fator: 0.70, reprova: true,
      atencao: 'Estrutura com corrosão severa/avarias: o método expresso NÃO se aplica — vistoria e laudo obrigatórios.' }
  ];

  /* ----------------------- Planos e preços (SaaS) ------------------------ */
  var PRECOS = {
    moeda: 'R$',
    trialDias: 14,
    planos: [
      { id: 'INTEGRADOR', nome: 'Integrador', mensal: 189, anual: 1890,
        recursos: ['Verificações ilimitadas', 'Memorial expresso em PDF', 'Até 2 usuários', 'Suporte por e-mail'] },
      { id: 'INTEGRADOR_PRO', nome: 'Integrador Pro', mensal: 349, anual: 3490, destaque: true,
        recursos: ['Tudo do Integrador', 'Usuários ilimitados', 'Logo da sua empresa no memorial', '1 laudo assinado incluso/ano', 'Prioridade na fila de laudos'] },
      { id: 'ENGENHARIA', nome: 'Engenharia/Rede', mensal: 749, anual: 7490,
        recursos: ['Multi-filial', 'API de integração (roadmap)', 'Dossiê completo p/ calculista', 'Comissão em laudos indicados'] }
    ],
    laudo: {
      base: 1490,          // R$ até 500 m² de cobertura
      adicionalM2: 1.20,   // R$/m² acima de 500 m²
      incluiART: true,
      prazoDias: 5,
      descricao: 'Laudo de verificação estrutural assinado por engenheiro da rede, com ART, memorial completo (NBR 8800/14762/6123/8681), vistoria documental e parecer de reforço quando necessário.'
    }
  };

  /* --------------------------- Exemplo/demo ------------------------------ */
  /* Caso VERDE calibrado (demonstração) */
  var EXEMPLO = {
    nome: 'Galpão Exemplo — Usina 56 kWp',
    cliente: 'Metalúrgica Horizonte Ltda',
    uf: 'SP', cidade: 'Campinas', v0: 40,
    ambiente: 'campo', categoria: 'II', s1: 'plano', s3: 'g2',
    fechamento: 'fechado', permeabilidade: 'normal',
    tipoTelhado: '2aguas', largura: 20, comprimento: 40, peDireito: 6, inclinacao: 10,
    estruturaPrincipal: 'metalica', tercaMaterial: 'aco',
    perfilId: 'UE200x75x20x2.65', acoId: 'ZAR280', vaoTerca: 5, espacamento: 1.35,
    correntes: 1, continuidade: 'continua3', conservacao: 'bom',
    telhaId: 'TP40_050',
    moduloId: 'M585', numModulos: 96, trilhos: TRILHOS_PADRAO, fixacao: 'terca'
  };
  /* Caso crítico (demonstração do semáforo vermelho) */
  var EXEMPLO_CRITICO = {
    nome: 'Galpão Antigo — Usina 92 kWp (crítico)',
    cliente: 'Distribuidora Sul Ltda',
    uf: 'RS', cidade: 'Caxias do Sul', v0: 47,
    ambiente: 'campo', categoria: 'II', s1: 'plano', s3: 'g2',
    fechamento: 'fechado', permeabilidade: 'normal',
    tipoTelhado: '2aguas', largura: 18, comprimento: 45, peDireito: 7, inclinacao: 8,
    estruturaPrincipal: 'metalica', tercaMaterial: 'aco',
    perfilId: 'U127x50x2.65', acoId: 'DESCONHECIDO', vaoTerca: 6, espacamento: 1.7,
    correntes: 0, continuidade: 'biapoiada', conservacao: 'regular',
    telhaId: 'FIBRO6',
    moduloId: 'M585', numModulos: 158, trilhos: TRILHOS_PADRAO, fixacao: 'terca'
  };

  function porId(lista, id) {
    for (var i = 0; i < lista.length; i++) if (lista[i].id === id) return lista[i];
    return null;
  }

  var Dados = {
    ACOS: ACOS, PERFIS: PERFIS, TELHAS: TELHAS, MODULOS: MODULOS,
    TRILHOS_PADRAO: TRILHOS_PADRAO, V0_UF: V0_UF,
    CATEGORIAS_TERRENO: CATEGORIAS_TERRENO, AMBIENTES: AMBIENTES,
    ESTRUTURAS_PRINCIPAIS: ESTRUTURAS_PRINCIPAIS, TERCA_MATERIAIS: TERCA_MATERIAIS,
    S1_OPCOES: S1_OPCOES, S3_OPCOES: S3_OPCOES,
    CONSERVACAO: CONSERVACAO, PRECOS: PRECOS, EXEMPLO: EXEMPLO, EXEMPLO_CRITICO: EXEMPLO_CRITICO,
    aco: function (id) { return porId(ACOS, id); },
    perfil: function (id) { return porId(PERFIS, id); },
    telha: function (id) { return porId(TELHAS, id); },
    modulo: function (id) { return porId(MODULOS, id); },
    porId: porId
  };

  root.FV = root.FV || {};
  root.FV.Dados = Dados;
  if (typeof module !== 'undefined' && module.exports) module.exports = Dados;
})(typeof self !== 'undefined' ? self : (typeof globalThis !== 'undefined' ? globalThis : this));
