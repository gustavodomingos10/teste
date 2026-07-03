/* ============================================================================
 *  FV-CHECK · GD ENGENHARIA — Verificação Estrutural Expressa p/ FV em Telhado
 *  storage.js — Projetos, solicitações de laudo e backup (localStorage)
 * ========================================================================== */
(function (root) {
  'use strict';

  var K = { projetos: 'fvcheck.projetos', laudos: 'fvcheck.laudos', seq: 'fvcheck.seq' };

  function ler(k, padrao) {
    try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : padrao; }
    catch (e) { return padrao; }
  }
  function gravar(k, v) { localStorage.setItem(k, JSON.stringify(v)); }
  function id() { return 'p' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }

  var Storage = {
    /* ------------- projetos ------------- */
    projetos: function () {
      return ler(K.projetos, []).sort(function (a, b) { return (b.atualizadoEm || '').localeCompare(a.atualizadoEm || ''); });
    },
    projeto: function (pid) {
      return ler(K.projetos, []).filter(function (p) { return p.id === pid; })[0] || null;
    },
    salvarProjeto: function (proj) {
      var lista = ler(K.projetos, []);
      if (!proj.id) { proj.id = id(); proj.criadoEm = new Date().toISOString(); lista.push(proj); }
      else {
        var i = lista.findIndex(function (p) { return p.id === proj.id; });
        if (i >= 0) lista[i] = proj; else lista.push(proj);
      }
      proj.atualizadoEm = new Date().toISOString();
      gravar(K.projetos, lista);
      if (root.FV.Audit) root.FV.Audit.registrar('projeto_salvo', { id: proj.id, nome: proj.entrada && proj.entrada.nome });
      return proj;
    },
    excluirProjeto: function (pid) {
      gravar(K.projetos, ler(K.projetos, []).filter(function (p) { return p.id !== pid; }));
      if (root.FV.Audit) root.FV.Audit.registrar('projeto_excluido', { id: pid });
    },

    /* --------- solicitações de laudo --------- */
    laudos: function () {
      return ler(K.laudos, []).sort(function (a, b) { return (b.criadoEm || '').localeCompare(a.criadoEm || ''); });
    },
    laudoDoProjeto: function (pid) {
      return ler(K.laudos, []).filter(function (l) { return l.projetoId === pid; })[0] || null;
    },
    proximoProtocolo: function () {
      var seq = ler(K.seq, { laudo: 0 });
      seq.laudo++;
      gravar(K.seq, seq);
      var ano = new Date().getFullYear();
      return 'FV-' + ano + '-' + ('000' + seq.laudo).slice(-4);
    },
    salvarLaudo: function (l) {
      var lista = ler(K.laudos, []);
      if (!l.id) { l.id = id(); l.criadoEm = new Date().toISOString(); lista.push(l); }
      else {
        var i = lista.findIndex(function (x) { return x.id === l.id; });
        if (i >= 0) lista[i] = l; else lista.push(l);
      }
      l.atualizadoEm = new Date().toISOString();
      gravar(K.laudos, lista);
      if (root.FV.Audit) root.FV.Audit.registrar('laudo_' + (l.status || 'solicitado'), { protocolo: l.protocolo, projetoId: l.projetoId });
      return l;
    },

    /* --------------- backup --------------- */
    exportarBackup: function () {
      return JSON.stringify({
        app: 'FV-CHECK', versao: 1, geradoEm: new Date().toISOString(),
        projetos: ler(K.projetos, []), laudos: ler(K.laudos, [])
      }, null, 2);
    },
    importarBackup: function (json) {
      var b = JSON.parse(json);
      if (!b || b.app !== 'FV-CHECK' || !Array.isArray(b.projetos)) throw new Error('Arquivo de backup inválido.');
      var atuais = ler(K.projetos, []), ids = {};
      atuais.forEach(function (p) { ids[p.id] = true; });
      var novos = 0;
      b.projetos.forEach(function (p) { if (!ids[p.id]) { atuais.push(p); novos++; } });
      gravar(K.projetos, atuais);
      if (Array.isArray(b.laudos)) {
        var la = ler(K.laudos, []), lid = {};
        la.forEach(function (l) { lid[l.id] = true; });
        b.laudos.forEach(function (l) { if (!lid[l.id]) la.push(l); });
        gravar(K.laudos, la);
      }
      if (root.FV.Audit) root.FV.Audit.registrar('backup_importado', { novosProjetos: novos });
      return { novosProjetos: novos };
    }
  };

  root.FV = root.FV || {};
  root.FV.Storage = Storage;
  if (typeof module !== 'undefined' && module.exports) module.exports = Storage;
})(typeof self !== 'undefined' ? self : (typeof globalThis !== 'undefined' ? globalThis : this));
