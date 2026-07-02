/* ============================================================================
 *  LINHA DE VIDA · GD ENGENHARIA
 *  data.js — Catálogos de engenharia (cabos, perfis, aços, corrosão, etc.)
 *
 *  Os valores marcados com origem "planilha" reproduzem EXATAMENTE a planilha
 *  validada pelo Eng. responsável e são cobertos por testes automatizados.
 *  Os demais são acréscimos de engenharia, com valores de tabelas comerciais
 *  usuais — devem ser confirmados no catálogo do fornecedor na data da compra.
 * ========================================================================== */
(function (root) {
  'use strict';

  /* --------------------------------------------------------------------------
   *  CABOS DE AÇO
   *  E   = módulo de elasticidade efetivo do cabo [MPa]
   *  A   = área metálica [mm²]
   *  MBL = carga mínima de ruptura (Minimum Breaking Load) [kN]
   *  massa [kg/m]
   *  Chave = "<material>|<Ø>" — usada nas buscas (igual à planilha).
   * ------------------------------------------------------------------------ */
  var CABLES = [
    // --- INOX AISI 316 (valores da planilha validada) ---
    { key: 'Inox AISI 316|8',  material: 'Inox AISI 316', construcao: '7x19', d: 8,  E: 120000, A: 30, MBL: 40, massa: 0.25, fonte: 'planilha' },
    { key: 'Inox AISI 316|10', material: 'Inox AISI 316', construcao: '7x19', d: 10, E: 120000, A: 47, MBL: 63, massa: 0.39, fonte: 'planilha' },
    { key: 'Inox AISI 316|12', material: 'Inox AISI 316', construcao: '7x19', d: 12, E: 120000, A: 68, MBL: 90, massa: 0.56, fonte: 'planilha' },
    // --- INOX AISI 316 (acréscimos) ---
    { key: 'Inox AISI 316|6',  material: 'Inox AISI 316', construcao: '7x19', d: 6,  E: 120000, A: 17, MBL: 23, massa: 0.14, fonte: 'catálogo' },
    { key: 'Inox AISI 316|14', material: 'Inox AISI 316', construcao: '7x19', d: 14, E: 120000, A: 92, MBL: 120, massa: 0.76, fonte: 'catálogo' },
    { key: 'Inox AISI 316|16', material: 'Inox AISI 316', construcao: '7x19', d: 16, E: 120000, A: 120, MBL: 157, massa: 0.99, fonte: 'catálogo' },

    // --- GALVANIZADO 6x19 + alma de aço (valores da planilha validada) ---
    { key: 'Custo-benefício (galvanizado)|8',  material: 'Galvanizado 6x19', construcao: '6x19+AA', d: 8,  E: 100000, A: 31, MBL: 38, massa: 0.23, fonte: 'planilha' },
    { key: 'Custo-benefício (galvanizado)|10', material: 'Galvanizado 6x19', construcao: '6x19+AA', d: 10, E: 100000, A: 48, MBL: 59, massa: 0.36, fonte: 'planilha' },
    { key: 'Custo-benefício (galvanizado)|12', material: 'Galvanizado 6x19', construcao: '6x19+AA', d: 12, E: 100000, A: 69, MBL: 85, massa: 0.52, fonte: 'planilha' },
    // --- GALVANIZADO (acréscimos) ---
    { key: 'Custo-benefício (galvanizado)|6',  material: 'Galvanizado 6x19', construcao: '6x19+AA', d: 6,  E: 100000, A: 17, MBL: 22, massa: 0.13, fonte: 'catálogo' },
    { key: 'Custo-benefício (galvanizado)|14', material: 'Galvanizado 6x19', construcao: '6x19+AA', d: 14, E: 100000, A: 94, MBL: 116, massa: 0.71, fonte: 'catálogo' },
    { key: 'Custo-benefício (galvanizado)|16', material: 'Galvanizado 6x19', construcao: '6x19+AA', d: 16, E: 100000, A: 122, MBL: 151, massa: 0.93, fonte: 'catálogo' },

    // --- INOX AISI 316 (1x19 rígido — alta rigidez, usual em LV permanente) ---
    { key: 'Inox AISI 316 (1x19 rígido)|6',  material: 'Inox AISI 316 (1x19 rígido)', construcao: '1x19', d: 6,  E: 135000, A: 21, MBL: 30, massa: 0.17, fonte: 'catálogo' },
    { key: 'Inox AISI 316 (1x19 rígido)|8',  material: 'Inox AISI 316 (1x19 rígido)', construcao: '1x19', d: 8,  E: 135000, A: 37, MBL: 52, massa: 0.29, fonte: 'catálogo' },
    { key: 'Inox AISI 316 (1x19 rígido)|10', material: 'Inox AISI 316 (1x19 rígido)', construcao: '1x19', d: 10, E: 135000, A: 58, MBL: 80, massa: 0.46, fonte: 'catálogo' },
    { key: 'Inox AISI 316 (1x19 rígido)|12', material: 'Inox AISI 316 (1x19 rígido)', construcao: '1x19', d: 12, E: 135000, A: 84, MBL: 115, massa: 0.66, fonte: 'catálogo' },
    { key: 'Inox AISI 316 (1x19 rígido)|14', material: 'Inox AISI 316 (1x19 rígido)', construcao: '1x19', d: 14, E: 135000, A: 113, MBL: 152, massa: 0.90, fonte: 'catálogo' },
    { key: 'Inox AISI 316 (1x19 rígido)|16', material: 'Inox AISI 316 (1x19 rígido)', construcao: '1x19', d: 16, E: 135000, A: 148, MBL: 198, massa: 1.18, fonte: 'catálogo' },

    // --- INOX AISI 304 (7x19) — alternativa em ambientes C3-C4 ---
    { key: 'Inox AISI 304|6',  material: 'Inox AISI 304', construcao: '7x19', d: 6,  E: 120000, A: 17, MBL: 23, massa: 0.14, fonte: 'catálogo' },
    { key: 'Inox AISI 304|8',  material: 'Inox AISI 304', construcao: '7x19', d: 8,  E: 120000, A: 30, MBL: 41, massa: 0.25, fonte: 'catálogo' },
    { key: 'Inox AISI 304|10', material: 'Inox AISI 304', construcao: '7x19', d: 10, E: 120000, A: 47, MBL: 64, massa: 0.39, fonte: 'catálogo' },
    { key: 'Inox AISI 304|12', material: 'Inox AISI 304', construcao: '7x19', d: 12, E: 120000, A: 68, MBL: 92, massa: 0.56, fonte: 'catálogo' },
    { key: 'Inox AISI 304|14', material: 'Inox AISI 304', construcao: '7x19', d: 14, E: 120000, A: 92, MBL: 122, massa: 0.76, fonte: 'catálogo' },
    { key: 'Inox AISI 304|16', material: 'Inox AISI 304', construcao: '7x19', d: 16, E: 120000, A: 120, MBL: 160, massa: 0.99, fonte: 'catálogo' },

    // --- GALVANIZADO EIPS 6x36 (alta resistência — vãos longos industriais) ---
    { key: 'Galvanizado EIPS 6x36 (alta resistência)|6',  material: 'Galvanizado EIPS 6x36 (alta resistência)', construcao: '6x36+AA', d: 6,  E: 105000, A: 17, MBL: 27, massa: 0.14, fonte: 'catálogo' },
    { key: 'Galvanizado EIPS 6x36 (alta resistência)|8',  material: 'Galvanizado EIPS 6x36 (alta resistência)', construcao: '6x36+AA', d: 8,  E: 105000, A: 31, MBL: 47, massa: 0.24, fonte: 'catálogo' },
    { key: 'Galvanizado EIPS 6x36 (alta resistência)|10', material: 'Galvanizado EIPS 6x36 (alta resistência)', construcao: '6x36+AA', d: 10, E: 105000, A: 48, MBL: 74, massa: 0.37, fonte: 'catálogo' },
    { key: 'Galvanizado EIPS 6x36 (alta resistência)|12', material: 'Galvanizado EIPS 6x36 (alta resistência)', construcao: '6x36+AA', d: 12, E: 105000, A: 69, MBL: 106, massa: 0.54, fonte: 'catálogo' },
    { key: 'Galvanizado EIPS 6x36 (alta resistência)|14', material: 'Galvanizado EIPS 6x36 (alta resistência)', construcao: '6x36+AA', d: 14, E: 105000, A: 94, MBL: 144, massa: 0.73, fonte: 'catálogo' },
    { key: 'Galvanizado EIPS 6x36 (alta resistência)|16', material: 'Galvanizado EIPS 6x36 (alta resistência)', construcao: '6x36+AA', d: 16, E: 105000, A: 122, MBL: 188, massa: 0.95, fonte: 'catálogo' }
  ];

  /* --------------------------------------------------------------------------
   *  PERFIS TUBULARES (postes de ancoragem)
   *  As propriedades (W, Z, A, I, i) são CALCULADAS pela geometria em
   *  sections.js — aqui guardamos apenas o nome e a geometria. Isso garante
   *  coerência total e permite expandir o catálogo sem risco de erro de tabela.
   * ------------------------------------------------------------------------ */
  var PROFILES = [
    // SHS — da planilha validada (b,t em mm)
    { nome: 'SHS 80x80x6,3',   spec: { type: 'SHS', b: 80,  t: 6.3 }, fonte: 'planilha' },
    { nome: 'SHS 100x100x6,3', spec: { type: 'SHS', b: 100, t: 6.3 }, fonte: 'planilha' },
    { nome: 'SHS 100x100x8,0', spec: { type: 'SHS', b: 100, t: 8.0 }, fonte: 'planilha' },
    { nome: 'SHS 120x120x8,0', spec: { type: 'SHS', b: 120, t: 8.0 }, fonte: 'planilha' },
    { nome: 'SHS 150x150x8,0', spec: { type: 'SHS', b: 150, t: 8.0 }, fonte: 'planilha' },
    { nome: 'SHS 150x150x10,0',spec: { type: 'SHS', b: 150, t: 10.0 }, fonte: 'planilha' },
    // SHS — acréscimos
    { nome: 'SHS 60x60x4,0',   spec: { type: 'SHS', b: 60,  t: 4.0 }, fonte: 'catálogo' },
    { nome: 'SHS 80x80x4,0',   spec: { type: 'SHS', b: 80,  t: 4.0 }, fonte: 'catálogo' },
    { nome: 'SHS 90x90x5,0',   spec: { type: 'SHS', b: 90,  t: 5.0 }, fonte: 'catálogo' },
    { nome: 'SHS 120x120x6,3', spec: { type: 'SHS', b: 120, t: 6.3 }, fonte: 'catálogo' },
    { nome: 'SHS 200x200x10,0',spec: { type: 'SHS', b: 200, t: 10.0 }, fonte: 'catálogo' },
    // RHS — retangular (largura x altura x t)
    { nome: 'RHS 100x60x5,0',  spec: { type: 'RHS', b: 60,  d: 100, t: 5.0 }, fonte: 'catálogo' },
    { nome: 'RHS 120x80x6,3',  spec: { type: 'RHS', b: 80,  d: 120, t: 6.3 }, fonte: 'catálogo' },
    { nome: 'RHS 150x100x8,0', spec: { type: 'RHS', b: 100, d: 150, t: 8.0 }, fonte: 'catálogo' },
    { nome: 'SHS 140x140x8,0', spec: { type: 'SHS', b: 140, t: 8.0 }, fonte: 'catálogo' },
    { nome: 'SHS 180x180x10,0',spec: { type: 'SHS', b: 180, t: 10.0 }, fonte: 'catálogo' },
    { nome: 'SHS 250x250x12,5',spec: { type: 'SHS', b: 250, t: 12.5 }, fonte: 'catálogo' },
    // RHS — retangular (largura x altura x t)
    { nome: 'RHS 100x60x5,0',  spec: { type: 'RHS', b: 60,  d: 100, t: 5.0 }, fonte: 'catálogo' },
    { nome: 'RHS 120x80x6,3',  spec: { type: 'RHS', b: 80,  d: 120, t: 6.3 }, fonte: 'catálogo' },
    { nome: 'RHS 150x100x8,0', spec: { type: 'RHS', b: 100, d: 150, t: 8.0 }, fonte: 'catálogo' },
    { nome: 'RHS 200x120x8,0', spec: { type: 'RHS', b: 120, d: 200, t: 8.0 }, fonte: 'catálogo' },
    { nome: 'RHS 250x150x10,0',spec: { type: 'RHS', b: 150, d: 250, t: 10.0 }, fonte: 'catálogo' },
    // CHS — circular / tubo (Ø externo x t) — comum em silos e indústria
    { nome: 'CHS Ø60,3x4,0',   spec: { type: 'CHS', D: 60.3,  t: 4.0 }, fonte: 'catálogo' },
    { nome: 'CHS Ø73,0x5,0',   spec: { type: 'CHS', D: 73.0,  t: 5.0 }, fonte: 'catálogo' },
    { nome: 'CHS Ø88,9x5,0',   spec: { type: 'CHS', D: 88.9,  t: 5.0 }, fonte: 'catálogo' },
    { nome: 'CHS Ø114,3x6,3',  spec: { type: 'CHS', D: 114.3, t: 6.3 }, fonte: 'catálogo' },
    { nome: 'CHS Ø141,3x8,0',  spec: { type: 'CHS', D: 141.3, t: 8.0 }, fonte: 'catálogo' },
    { nome: 'CHS Ø168,3x8,0',  spec: { type: 'CHS', D: 168.3, t: 8.0 }, fonte: 'catálogo' },
    { nome: 'CHS Ø219,1x10,0', spec: { type: 'CHS', D: 219.1, t: 10.0 }, fonte: 'catálogo' },
    // --- HSS (designação americana AISC — polegadas) para clientes dos EUA ---
    { nome: 'HSS 3x3x1/4 (US)',   spec: { type: 'SHS', b: 76.2,  t: 6.35 }, fonte: 'AISC' },
    { nome: 'HSS 4x4x1/4 (US)',   spec: { type: 'SHS', b: 101.6, t: 6.35 }, fonte: 'AISC' },
    { nome: 'HSS 4x4x3/8 (US)',   spec: { type: 'SHS', b: 101.6, t: 9.53 }, fonte: 'AISC' },
    { nome: 'HSS 5x5x5/16 (US)',  spec: { type: 'SHS', b: 127.0, t: 7.94 }, fonte: 'AISC' },
    { nome: 'HSS 6x6x3/8 (US)',   spec: { type: 'SHS', b: 152.4, t: 9.53 }, fonte: 'AISC' },
    { nome: 'HSS 8x8x1/2 (US)',   spec: { type: 'SHS', b: 203.2, t: 12.70 }, fonte: 'AISC' },
    { nome: 'HSS 4.500x0.237 (US round)', spec: { type: 'CHS', D: 114.3, t: 6.02 }, fonte: 'AISC' },
    { nome: 'HSS 6.625x0.280 (US round)', spec: { type: 'CHS', D: 168.3, t: 7.11 }, fonte: 'AISC' }
  ];

  /* --------------------------------------------------------------------------
   *  AÇOS ESTRUTURAIS — tensão de escoamento fy e ruptura fu [MPa]
   *  Permite separar o material do perfil (mais robusto que fixar fy na tabela).
   *  O perfil da planilha (SHS 100x100x6,3) usava fy=345 MPa (ASTM A572 G50).
   * ------------------------------------------------------------------------ */
  var STEELS = [
    { nome: 'ASTM A36',        fy: 250, fu: 400, fonte: 'ASTM' },
    { nome: 'ASTM A572 Gr.50', fy: 345, fu: 450, fonte: 'planilha' },
    { nome: 'ASTM A500 Gr.B',  fy: 290, fu: 400, fonte: 'ASTM' },
    { nome: 'ASTM A500 Gr.C',  fy: 317, fu: 427, fonte: 'ASTM' },
    { nome: 'ASTM A53 Gr.B (tubo)', fy: 240, fu: 415, fonte: 'ASTM' },
    { nome: 'ABNT VMB 350',    fy: 350, fu: 485, fonte: 'ABNT' },
    { nome: 'EN S235',         fy: 235, fu: 360, fonte: 'EN 10025' },
    { nome: 'EN S275',         fy: 275, fu: 430, fonte: 'EN 10025' },
    { nome: 'EN S355',         fy: 355, fu: 510, fonte: 'EN 10025' },
    { nome: 'Inox AISI 316',   fy: 240, fu: 530, fonte: 'norma' },
    { nome: 'Inox AISI 304',   fy: 210, fu: 520, fonte: 'norma' }
  ];

  /* --------------------------------------------------------------------------
   *  CATEGORIAS DE CORROSIVIDADE (ISO 12944-2) — orienta material e revestimento
   * ------------------------------------------------------------------------ */
  var CORROSION = [
    { cat: 'C1', nome: 'C1 — Muito baixa (interior seco/aquecido)',        material: 'Galvanizado', zinco_um: 45,  fonte: 'ISO 12944' },
    { cat: 'C2', nome: 'C2 — Baixa (interior, condensação ocasional)',      material: 'Galvanizado', zinco_um: 55,  fonte: 'ISO 12944' },
    { cat: 'C3', nome: 'C3 — Média (urbano/industrial, umidade moderada)',  material: 'Galvanizado', zinco_um: 70,  fonte: 'ISO 12944' },
    { cat: 'C4', nome: 'C4 — Alta (industrial / litoral de baixa salinidade)', material: 'Inox AISI 316', zinco_um: 85, fonte: 'ISO 12944' },
    { cat: 'C5', nome: 'C5 — Muito alta (industrial úmido / litorâneo)',    material: 'Inox AISI 316', zinco_um: 115, fonte: 'ISO 12944' },
    { cat: 'CX', nome: 'CX — Extrema (offshore / químico agressivo)',       material: 'Inox AISI 316', zinco_um: 150, fonte: 'ISO 12944' }
  ];

  /* --------------------------------------------------------------------------
   *  CENÁRIOS E SUBSTRATOS (da planilha) — listas dependentes
   * ------------------------------------------------------------------------ */
  var SCENARIOS = {
    'Cobertura': [
      'Telha trapezoidal metálica', 'Telha fibrocimento', 'Telha cerâmica',
      'Laje de concreto', 'Telha termoacústica (sanduíche)',
      'Membrana TPO (termoplástica)', 'Membrana EPDM (borracha)'
    ],
    'Estrutura': [
      'Viga metálica (perfil I/H)', 'Viga metálica (tubular)', 'Laje de concreto',
      'Pilar de concreto', 'Terça metálica'
    ],
    'Solo': [
      'Solo coesivo (bloco concreto)', 'Solo arenoso (bloco concreto)',
      'Rocha (chumbador)', 'Talude protegido', 'Poste cravado'
    ],
    'Silo / Industrial': [
      'Teto de silo metálico (cônico)', 'Costado de silo (chapa)', 'Anel de reforço do silo',
      'Passarela / galeria de correia', 'Estrutura de torre de elevador', 'Tremonta / cobertura de armazém'
    ]
  };

  /* --------------------------------------------------------------------------
   *  TALABARTES — tipo e características padrão de queda livre / frenagem
   * ------------------------------------------------------------------------ */
  var LANYARDS = [
    { nome: 'Talabarte Y c/ absorvedor',       H_ql: 1.5, H_fr: 1.75, Ft_max: 6 },
    { nome: 'Talabarte simples c/ absorvedor', H_ql: 1.5, H_fr: 1.75, Ft_max: 6 },
    { nome: 'Trava-quedas retrátil',           H_ql: 0.6, H_fr: 1.0,  Ft_max: 6 }
  ];

  var DIAMETERS = [6, 8, 10, 12, 14, 16];
  var MATERIALS = [
    'Inox AISI 316', 'Inox AISI 316 (1x19 rígido)', 'Inox AISI 304',
    'Custo-benefício (galvanizado)', 'Galvanizado EIPS 6x36 (alta resistência)'
  ];

  // Índices de busca rápidos
  var cableByKey = {};
  CABLES.forEach(function (c) { cableByKey[c.key] = c; });
  var profileByName = {};
  PROFILES.forEach(function (p) { profileByName[p.nome] = p; });
  var steelByName = {};
  STEELS.forEach(function (s) { steelByName[s.nome] = s; });

  function findCable(material, d) {
    var c = cableByKey[material + '|' + d];
    if (!c) throw new Error('Cabo não encontrado no catálogo: ' + material + ' Ø' + d + ' mm');
    return c;
  }
  function findProfile(nome) {
    var p = profileByName[nome];
    if (!p) throw new Error('Perfil não encontrado no catálogo: ' + nome);
    return p;
  }
  function findSteel(nome) {
    var s = steelByName[nome];
    if (!s) throw new Error('Aço não encontrado no catálogo: ' + nome);
    return s;
  }

  var Data = {
    CABLES: CABLES, PROFILES: PROFILES, STEELS: STEELS, CORROSION: CORROSION,
    SCENARIOS: SCENARIOS, LANYARDS: LANYARDS, DIAMETERS: DIAMETERS, MATERIALS: MATERIALS,
    findCable: findCable, findProfile: findProfile, findSteel: findSteel,
    E_STEEL: 200000,        // módulo de elasticidade do aço estrutural [MPa]
    GAMMA_STEEL: 77         // peso específico do aço [kN/m³]
  };

  root.LV = root.LV || {};
  root.LV.Data = Data;
  if (typeof module !== 'undefined' && module.exports) module.exports = Data;
})(typeof self !== 'undefined' ? self : (typeof globalThis !== 'undefined' ? globalThis : this));
