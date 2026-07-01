/* ============================================================================
 *  LINHA DE VIDA · GD ENGENHARIA
 *  export.js — Exportação unificada: Word (.doc), PDF (impressão) e Excel (.xls)
 *
 *  Gera os documentos a partir do HTML do prontuário (com as seções escolhidas
 *  pelo usuário) e de uma planilha editável com os dados e resultados.
 *  Sem dependências externas. Somente navegador (usa canvas/Blob).
 * ========================================================================== */
(function (root) {
  'use strict';
  var LV = root.LV = root.LV || {};

  function baixar(conteudo, nome, mime) {
    var blob = (conteudo instanceof Blob) ? conteudo : new Blob([conteudo], { type: mime || 'application/octet-stream' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = nome;
    document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1500);
  }
  function slug(s) { return String(s || 'projeto').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-zA-Z0-9]+/g, '_').replace(/^_|_$/g, '').slice(0, 40) || 'projeto'; }

  // ---- SVG → PNG (para o Word, que não renderiza SVG inline) ----
  function svgToPng(svg) {
    return new Promise(function (resolve) {
      try {
        var m = svg.match(/viewBox="([\d.\- ]+)"/);
        var w = 760, hh = 400;
        if (m) { var p = m[1].trim().split(/\s+/); w = Math.round(+p[2]); hh = Math.round(+p[3]); }
        var scale = 2;
        var svg2 = svg.replace('<svg ', '<svg width="' + w + '" height="' + hh + '" ');
        var img = new Image();
        var blob = new Blob([svg2], { type: 'image/svg+xml;charset=utf-8' });
        var url = URL.createObjectURL(blob);
        img.onload = function () {
          var c = document.createElement('canvas'); c.width = w * scale; c.height = hh * scale;
          var ctx = c.getContext('2d'); ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, c.width, c.height);
          ctx.drawImage(img, 0, 0, c.width, c.height);
          URL.revokeObjectURL(url);
          try { resolve(c.toDataURL('image/png')); } catch (e) { resolve(null); }
        };
        img.onerror = function () { URL.revokeObjectURL(url); resolve(null); };
        img.src = url;
      } catch (e) { resolve(null); }
    });
  }
  // Substitui cada <svg>…</svg> por <img src=PNG> (assíncrono)
  function htmlComImagens(html) {
    var svgs = html.match(/<svg[\s\S]*?<\/svg>/g) || [];
    var i = 0;
    function passo() {
      if (i >= svgs.length) return Promise.resolve(html);
      return svgToPng(svgs[i]).then(function (png) {
        if (png) html = html.replace(svgs[i], '<img src="' + png + '" style="max-width:100%;height:auto"/>');
        else html = html.replace(svgs[i], '');
        i++; return passo();
      });
    }
    return passo();
  }

  // CSS compacto para os documentos exportados (Word/impressão)
  function reportCss() {
    return 'body{font-family:"Segoe UI",Arial,sans-serif;color:#1a1a1a;font-size:12px}' +
      '.report h1{font-size:18px;color:#1f3a5f}.report h2{font-size:14px;color:#1f3a5f;border-bottom:2px solid #eaf1f8;padding-bottom:3px;margin:14px 0 6px}' +
      '.report h3{font-size:13px;color:#5b6470}.rep-head{border-bottom:2px solid #1f3a5f;padding-bottom:8px;margin-bottom:10px}' +
      '.rh-emp{font-weight:800;color:#1f3a5f;font-size:14px}.rh-sub,.rh-norma{font-size:10px;color:#666}' +
      '.rh-proj{font-size:11px;background:#eaf1f8;padding:5px 8px;border-radius:5px;margin-top:5px}' +
      '.verdito{font-weight:800;text-align:center;padding:8px;border-radius:6px;margin:8px 0}.verdito.ok{background:#e8f6ee;color:#1e8449;border:1px solid #1e8449}.verdito.fail{background:#fdecea;color:#c0392b;border:1px solid #c0392b}' +
      'table.tab{width:100%;border-collapse:collapse;margin:6px 0;font-size:11px}table.tab th{background:#eaf1f8;color:#1f3a5f;text-align:left;padding:5px;border:1px solid #dfe4ea}table.tab td{padding:4px 6px;border:1px solid #dfe4ea;vertical-align:top}' +
      'table.tab td.val{text-align:right}.badge{font-size:10px;font-weight:700}.badge.ok{color:#1e8449}.badge.fail{color:#c0392b}' +
      '.calc-step{margin:6px 0;padding:6px 8px;background:#fbfcfe;border-left:3px solid #2a5a8f}.calc-step .cs-t{font-size:11.5px;font-weight:700;color:#1f3a5f}.calc-step .cs-eq{font-family:Consolas,monospace;font-size:11px;margin:2px 0}.calc-step .cs-eq b{color:#1f3a5f}.cs-ref,.cs-note{font-size:10px;color:#666}' +
      'table.nr-tab{border-collapse:collapse;font-size:10px;font-family:Consolas,monospace}table.nr-tab th,table.nr-tab td{border:1px solid #dfe4ea;padding:2px 6px;text-align:right}' +
      '.prem{font-size:11px}.nota{font-size:10.5px;color:#666;font-style:italic;background:#f9fafb;padding:5px 8px;border-left:3px solid #dfe4ea;margin:6px 0}' +
      '.pr-h{font-size:14px;color:#fff;background:#1f3a5f;padding:5px 10px;border-radius:5px}.pr-sec{margin-bottom:16px;page-break-inside:avoid}' +
      '.pr-capa{text-align:center;padding:20px;border:3px solid #1f3a5f;border-radius:10px;margin-bottom:16px;page-break-after:always}.cp-titulo{font-size:22px;font-weight:800;color:#1f3a5f;margin:12px 0}.cp-id{margin:0 auto;max-width:600px;text-align:left;font-size:12px}.cp-id td:first-child{font-weight:600;width:45%}' +
      '.fig{margin:10px 0;text-align:center}.fig img{max-width:100%}.assin{margin-top:22px;text-align:center}.linha-assin{letter-spacing:1px}.cargo{font-size:10px;color:#666}' +
      '.plaqueta{border:2px dashed #1f3a5f;border-radius:8px;padding:8px;display:inline-block}.qr img,.qr svg{width:120px;height:120px}' +
      '.tok{color:#1e8449}.tfail{color:#c0392b}.refs{font-size:11px}';
  }

  // Rodapé institucional (logo/empresa/contato/normas) para os documentos
  function rodape(R, cfg) { return (LV.Report && LV.Report.rodapeDoc) ? LV.Report.rodapeDoc(cfg, R && R.pais) : ''; }
  function cssMais() { return reportCss() + '.rep-logo{max-height:54px;max-width:150px}.rep-emblema{width:52px;height:52px;border-radius:10px;background:#1f3a5f;color:#fff;font-weight:800;font-size:20px;display:inline-flex;align-items:center;justify-content:center}.rep-top,.rh-top{display:flex;align-items:center;gap:12px;margin-bottom:6px}.rep-footer{margin-top:16px;padding-top:8px;border-top:1px solid #dfe4ea;font-size:9.5px;color:#666;text-align:center}.rf-normas{margin-top:3px;color:#999;font-size:8.5px}'; }

  // ---- PDF (via impressão do navegador — o usuário escolhe "Salvar como PDF") ----
  function gerarPDF(html, titulo, R, cfg) {
    var w = window.open('', '_blank');
    if (!w) { alert('Permita pop-ups para gerar o PDF / Allow pop-ups to generate the PDF.'); return; }
    w.document.write('<!DOCTYPE html><html><head><meta charset="utf-8"><title>' + (titulo || 'Prontuário') + '</title><style>' + cssMais() + '@page{margin:14mm}</style></head><body>' + html + rodape(R, cfg) + '</body></html>');
    w.document.close();
    setTimeout(function () { w.focus(); w.print(); }, 600);
  }

  // ---- Word (.doc) — HTML compatível com Word; figuras convertidas em PNG ----
  function gerarWord(html, nome, R, cfg) {
    return htmlComImagens(html + rodape(R, cfg)).then(function (h2) {
      var doc = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">' +
        '<head><meta charset="utf-8"><title>Prontuário</title>' +
        '<!--[if gte mso 9]><xml><w:WordDocument><w:View>Print</w:View></w:WordDocument></xml><![endif]-->' +
        '<style>@page{size:A4;margin:2cm}' + cssMais() + '</style></head><body>' + h2 + '</body></html>';
      baixar('﻿' + doc, nome + '.doc', 'application/msword;charset=utf-8');
    });
  }

  // ---- Excel (.xls — XML Spreadsheet 2003, multi-aba, editável) ----
  function xmlEsc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function cell(v, tipo) { tipo = tipo || 'String'; return '<Cell><Data ss:Type="' + tipo + '">' + xmlEsc(v) + '</Data></Cell>'; }
  function cellNum(v) { return (v == null || !isFinite(v)) ? cell('—') : '<Cell><Data ss:Type="Number">' + v + '</Data></Cell>'; }
  function rowXml(cells) { return '<Row>' + cells + '</Row>'; }
  function sheetXml(nome, rows) { return '<Worksheet ss:Name="' + xmlEsc(nome.slice(0, 31)) + '"><Table>' + rows + '</Table></Worksheet>'; }

  function excelWorkbook(R, proj, cfg) {
    var Units = LV.Units, Report = LV.Report;
    var imp = R.pais && R.pais.unidades === 'imperial';
    var en = R.pais && R.pais.idioma === 'en';
    function U(o) { if (!o) return { v: null, u: '' }; var v = o.valor, u = o.unidade; if (imp && Units && u) { var c = Units.conv(v, u, 'imperial'); v = c.valor; u = c.unidade; } return { v: (isFinite(v) ? Math.round(v * 1000) / 1000 : null), u: u || '' }; }
    function L(pt, ee) { return en ? ee : pt; }
    function linhaGr(nome, o) { var x = U(o); return rowXml(cell(nome) + cellNum(x.v) + cell(x.u)); }
    var e = R.entrada;

    // Aba 1 — Entrada / Input
    var s1 = rowXml(cell(L('DADOS DE ENTRADA', 'INPUT DATA')) + cell('') + cell(''));
    s1 += rowXml(cell(L('Grandeza', 'Item')) + cell(L('Valor', 'Value')) + cell(L('Unid.', 'Unit')));
    s1 += rowXml(cell(L('Obra/Cliente', 'Project/Client')) + cell(e.obra || proj.nome) + cell(''));
    s1 += rowXml(cell(L('Local', 'Site')) + cell(e.local || '') + cell(''));
    s1 += rowXml(cell(L('País/normas', 'Country/standards')) + cell(en ? (R.pais.nomeEn || R.pais.nome) : R.pais.nome) + cell(''));
    s1 += linhaGr(L('Vão entre postes L', 'Span L'), R.dados.L);
    s1 += rowXml(cell(L('Nº de vãos', 'No. of spans')) + cellNum(Math.round(R.dados.nVaos.valor)) + cell('un'));
    s1 += linhaGr(L('Altura do poste h', 'Post height h'), R.dados.h);
    s1 += rowXml(cell(L('Cabo', 'Cable')) + cell(R.dados.cabo.material + ' Ø' + R.dados.cabo.d + 'mm') + cell(''));
    s1 += linhaGr(L('Pré-tensão T₀', 'Pretension T₀'), R.dados.T0);
    s1 += rowXml(cell(L('Nº usuários', 'Users')) + cellNum(Math.round(R.dados.n.valor)) + cell('un'));
    s1 += linhaGr(L('Força no trabalhador Fₜ', 'Worker force Fₜ'), R.dados.Ft);
    s1 += rowXml(cell(L('Perfil do poste', 'Post profile')) + cell(R.poste.perfil + ' · ' + R.poste.aco) + cell(''));

    // Aba 2 — Resultados / Results
    var s2 = rowXml(cell(L('RESULTADOS', 'RESULTS')) + cell('') + cell(''));
    s2 += rowXml(cell(L('Grandeza', 'Item')) + cell(L('Valor', 'Value')) + cell(L('Unid.', 'Unit')));
    s2 += linhaGr(L('Carga na linha Q', 'Line load Q'), R.trabalhador.Q);
    s2 += linhaGr(L('Tração máxima T', 'Max tension T'), R.tracao.T);
    s2 += linhaGr(L('Ângulo θ', 'Angle θ'), R.tracao.theta);
    s2 += linhaGr(L('Flecha total', 'Total sag'), R.tracao.f_tot);
    s2 += linhaGr(L('ZLQ / RFC', 'RFC'), R.zlq.ZLQ);
    s2 += rowXml(cell('FS_din') + cellNum(Math.round(R.cabo.FS_din.valor * 100) / 100) + cell('—'));
    s2 += linhaGr(L('Reação H', 'Reaction H'), R.reacoes.H);
    s2 += linhaGr(L('Momento base M_k', 'Base moment M_k'), R.reacoes.M_k);
    s2 += linhaGr('M_Sd', R.poste.M_Sd); s2 += linhaGr('M_Rd', R.poste.M_Rd);
    s2 += rowXml(cell(L('Utilização', 'Utilization')) + cellNum(Math.round(R.poste.util.valor * 1000) / 1000) + cell('—'));
    s2 += linhaGr('R_anc', R.ancoragem.R_anc);
    s2 += rowXml(cell(L('Método (aço)', 'Method (steel)')) + cell(R.poste.metodo) + cell(''));
    s2 += rowXml(cell(L('VEREDITO', 'VERDICT')) + cell(en ? (R.veredito.aprovado ? 'APPROVED' : 'FAILED') : R.veredito.texto) + cell(''));

    // Aba 3 — Quantitativo / BOM (descrições traduzidas; comprimentos convertidos)
    var q = LV.Prontuario.quantitativo(e);
    var matNome = LV.Prontuario.nomesMateriais(L);
    var epiNome = LV.Prontuario.nomesEpi(L);
    function matLinha(r) {
      var qtd = r[1], un = r[2];
      if (imp && un === 'm' && Units) { var c = Units.conv(qtd, 'm', 'imperial'); qtd = Math.round(c.valor * 10) / 10; un = c.unidade; }
      return rowXml(cell(matNome[r[0]] || r[0]) + cellNum(qtd) + cell(un));
    }
    var s3 = rowXml(cell(L('QUANTITATIVO DE MATERIAIS', 'BILL OF MATERIALS')) + cell('') + cell(''));
    s3 += rowXml(cell(L('Descrição', 'Description')) + cell(L('Qtd', 'Qty')) + cell(L('Unid.', 'Unit')));
    q.materiais.forEach(function (r) { s3 += matLinha(r); });
    s3 += rowXml(cell(L('EPI por trabalhador', 'PPE per worker')) + cell('') + cell(''));
    q.epi.forEach(function (r) { s3 += rowXml(cell(epiNome[r[0]] || r[0]) + cellNum(r[1]) + cell('un')); });

    // Aba 4 — Verificações / Checks
    var s4 = rowXml(cell(L('VERIFICAÇÕES', 'CHECKS')) + cell(''));
    R.veredito.indicadores.forEach(function (ind) { s4 += rowXml(cell(en ? (ind.nomeEn || ind.nome) : ind.nome) + cell(ind.ok ? (en ? 'PASS' : 'ATENDE') : (en ? 'FAIL' : 'NÃO ATENDE'))); });

    var wb = '<?xml version="1.0"?>\n<?mso-application progid="Excel.Sheet"?>\n' +
      '<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">' +
      sheetXml(L('Entrada', 'Input'), s1) + sheetXml(L('Resultados', 'Results'), s2) + sheetXml(L('Materiais', 'BOM'), s3) + sheetXml(L('Verificações', 'Checks'), s4) +
      '</Workbook>';
    return wb;
  }
  function gerarExcel(R, proj, cfg, nome) {
    baixar('﻿' + excelWorkbook(R, proj, cfg), nome + '.xls', 'application/vnd.ms-excel;charset=utf-8');
  }

  LV.Export = { gerarPDF: gerarPDF, gerarWord: gerarWord, gerarExcel: gerarExcel, baixar: baixar, slug: slug, svgToPng: svgToPng, htmlComImagens: htmlComImagens };
})(typeof self !== 'undefined' ? self : this);
