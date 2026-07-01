/* ============================================================================
 *  LINHA DE VIDA · GD ENGENHARIA
 *  storage.js — Persistência de projetos, registros e configurações
 *
 *  Guarda projetos (entrada + registros de prontuário) com versionamento e
 *  permite exportar/importar em JSON (backup e transferência entre máquinas).
 *  Backend injetável (localStorage no navegador; memória nos testes).
 * ========================================================================== */
(function (root) {
  'use strict';

  var K_PROJ = 'lv_projetos', K_CFG = 'lv_config';
  var store = null, clock = function () { return Date.now(); };
  function setStore(s) { store = s; }
  function setClock(fn) { clock = fn; }
  function ensureStore() {
    if (store) return store;
    if (typeof localStorage !== 'undefined') store = localStorage;
    else { var m = {}; store = { getItem: function (k) { return k in m ? m[k] : null; }, setItem: function (k, v) { m[k] = String(v); }, removeItem: function (k) { delete m[k]; } }; }
    return store;
  }
  function load(k, d) { try { var v = ensureStore().getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } }
  function save(k, o) { ensureStore().setItem(k, JSON.stringify(o)); }

  function uid() {
    var c = root.LV && root.LV.Crypto;
    if (c) return 'p_' + c.randomHex(8);
    return 'p_' + clock().toString(36) + Math.floor((clock() % 100000)).toString(36);
  }

  // Estrutura de um projeto:
  // { id, nome, criadoEm, atualizadoEm, entrada:{}, registros:{ inspecoes:[], ensaios:[], apr:[], capacitacao:[], epi:[] }, revisao }
  // Entrada padrão (mesmo caso-exemplo validado da planilha) — projeto já calcula de imediato
  function entradaPadrao() {
    return {
      obra: '', local: '', responsavel: '', data: dataBR(clock()),
      cenario: 'Cobertura', substrato: 'Telha trapezoidal metálica', ambiente: 'C4 — Alta (industrial / litoral de baixa salinidade)',
      L: 10, nVaos: 3, h: 1.2, peDireito: 8.5,
      caboMaterial: 'Inox AISI 316', caboDiametro: 10, T0: 1,
      nUsuarios: 1, Ft: 6, talabarte: 'Talabarte Y c/ absorvedor', H_ql: 1.5, H_fr: 1.75,
      temAbsorvedor: 'Sim', F_abs: 12, cursoAbsorvedor: 0.5,
      posteperfil: 'SHS 100x100x6,3', acoNome: 'ASTM A572 Gr.50', gamaF: 1.4, nChumbadores: 4, bracoChumbadores: 0.18,
      fck: 25, ladoPlaca: 220
    };
  }
  function dataBR(ts) { var d = new Date(ts); return ('0' + d.getDate()).slice(-2) + '/' + ('0' + (d.getMonth() + 1)).slice(-2) + '/' + d.getFullYear(); }

  function novoProjeto(nome) {
    return {
      id: uid(), nome: nome || 'Novo projeto', criadoEm: clock(), atualizadoEm: clock(), revisao: 'R00',
      entrada: entradaPadrao(), registros: { inspecoes: [], ensaios: [], apr: [], capacitacao: [], epi: [], pt: [] }
    };
  }

  function listar() {
    var p = load(K_PROJ, {});
    return Object.keys(p).map(function (k) {
      return { id: p[k].id, nome: p[k].nome, atualizadoEm: p[k].atualizadoEm, revisao: p[k].revisao, obra: (p[k].entrada || {}).obra || '' };
    }).sort(function (a, b) { return b.atualizadoEm - a.atualizadoEm; });
  }
  function obter(id) { return load(K_PROJ, {})[id] || null; }
  function salvar(proj) {
    var p = load(K_PROJ, {});
    if (!proj.id) proj.id = uid();
    proj.atualizadoEm = clock();
    p[proj.id] = proj;
    save(K_PROJ, p);
    return proj;
  }
  function remover(id) { var p = load(K_PROJ, {}); delete p[id]; save(K_PROJ, p); return { ok: true }; }

  function duplicar(id, novoNome) {
    var orig = obter(id); if (!orig) throw new Error('Projeto inexistente.');
    var copia = JSON.parse(JSON.stringify(orig));
    copia.id = uid(); copia.nome = novoNome || (orig.nome + ' (cópia)');
    copia.criadoEm = clock(); copia.atualizadoEm = clock();
    return salvar(copia);
  }

  // Registros do prontuário (inspeções, ensaios, etc.)
  function addRegistro(id, tipo, registro) {
    var proj = obter(id); if (!proj) throw new Error('Projeto inexistente.');
    proj.registros = proj.registros || {};
    proj.registros[tipo] = proj.registros[tipo] || [];
    registro.id = 'r_' + (root.LV && root.LV.Crypto ? root.LV.Crypto.randomHex(6) : clock().toString(36));
    registro.criadoEm = clock();
    proj.registros[tipo].push(registro);
    return salvar(proj);
  }
  function removerRegistro(id, tipo, regId) {
    var proj = obter(id); if (!proj) throw new Error('Projeto inexistente.');
    if (proj.registros && proj.registros[tipo]) proj.registros[tipo] = proj.registros[tipo].filter(function (r) { return r.id !== regId; });
    return salvar(proj);
  }

  // Configuração global (dados do escritório/RT) para a marca dos relatórios
  function getConfig() {
    return load(K_CFG, {
      empresa: 'GD ENGENHARIA E PERÍCIA LTDA', cnpj: '54.705.748/0001-19',
      responsavel: 'Eng. Civil Gustavo Francisco Floriano Domingos', crea: 'CREA 140.964-D/PR',
      contato: '(43) 9 9925-9577', cidade: 'Cornélio Procópio/PR', logo: ''
    });
  }
  function setConfig(cfg) { save(K_CFG, cfg); return cfg; }

  // Backup / restauração
  function exportarTudo() {
    return JSON.stringify({ versao: 1, exportadoEm: clock(), projetos: load(K_PROJ, {}), config: getConfig() }, null, 2);
  }
  function importarTudo(json, mesclar) {
    var dados = (typeof json === 'string') ? JSON.parse(json) : json;
    if (!dados || !dados.projetos) throw new Error('Arquivo de backup inválido.');
    if (mesclar) {
      var atual = load(K_PROJ, {});
      Object.keys(dados.projetos).forEach(function (k) { atual[k] = dados.projetos[k]; });
      save(K_PROJ, atual);
    } else { save(K_PROJ, dados.projetos); }
    if (dados.config) setConfig(dados.config);
    return { ok: true, total: Object.keys(dados.projetos).length };
  }
  function exportarProjeto(id) {
    var p = obter(id); if (!p) throw new Error('Projeto inexistente.');
    return JSON.stringify({ versao: 1, projeto: p }, null, 2);
  }

  var Storage = {
    setStore: setStore, setClock: setClock,
    novoProjeto: novoProjeto, listar: listar, obter: obter, salvar: salvar, remover: remover, duplicar: duplicar,
    addRegistro: addRegistro, removerRegistro: removerRegistro,
    getConfig: getConfig, setConfig: setConfig,
    exportarTudo: exportarTudo, importarTudo: importarTudo, exportarProjeto: exportarProjeto
  };
  root.LV = root.LV || {};
  root.LV.Storage = Storage;
  if (typeof module !== 'undefined' && module.exports) module.exports = Storage;
})(typeof self !== 'undefined' ? self : (typeof globalThis !== 'undefined' ? globalThis : this));
