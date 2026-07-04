/* ============================================================================
 *  FV-CHECK — build-preview.js
 *  Gera um único arquivo HTML autocontido (CSS + JS embutidos) que abre a
 *  aplicação direto no MODO DEMONSTRAÇÃO — basta dar dois cliques no arquivo.
 *  Uso:  node build-preview.js  →  fvcheck-preview.html
 * ========================================================================== */
'use strict';
var fs = require('fs');
var path = require('path');
var raiz = __dirname;

function ler(p) { return fs.readFileSync(path.join(raiz, p), 'utf8'); }

// ordem de carga (a mesma do index.html)
var scripts = [
  'app/js/core/norms.js', 'app/js/core/dados.js', 'app/js/core/sections.js',
  'app/js/core/vento.js', 'app/js/core/acoes.js', 'app/js/core/engine.js',
  'app/js/core/validate.js', 'app/js/security/crypto.js', 'app/js/security/auth.js',
  'app/js/security/audit.js', 'app/js/data/storage.js', 'app/js/report/draw.js',
  'app/js/report/laudo.js', 'app/js/report/memorial.js', 'app/js/ui/ui.js',
  'app/js/ui/views.js', 'app/js/app.js'
];

var css = ler('app/css/styles.css');
var js = scripts.map(function (s) {
  return '/* ===== ' + s + ' ===== */\n' + ler(s);
}).join('\n;\n');

var html = '<!DOCTYPE html>\n<html lang="pt-BR">\n<head>\n' +
  '<meta charset="utf-8">\n' +
  '<meta name="viewport" content="width=device-width, initial-scale=1">\n' +
  '<title>FV-CHECK — Prévia (demonstração) · GD Engenharia</title>\n' +
  '<meta name="description" content="Prévia autocontida do FV-CHECK: verificação estrutural expressa para fotovoltaico em telhado.">\n' +
  "<link rel=\"icon\" href=\"data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='6' fill='%230e2a47'/><rect x='6' y='13' width='8' height='6' rx='1' fill='%23f5a623'/><rect x='16' y='13' width='8' height='6' rx='1' fill='%23f5a623'/><path d='M4 12 L16 5 L28 12' stroke='white' stroke-width='2.4' fill='none'/></svg>\">\n" +
  '<style>\n' + css + '\n</style>\n' +
  '</head>\n<body>\n' +
  '<div id="app"><div class="carregando">Carregando a prévia do FV-CHECK…</div></div>\n' +
  '<script>window.FV_FORCE_DEMO = true;</script>\n' +
  '<script>\n' + js + '\n</script>\n' +
  '</body>\n</html>\n';

var saida = path.join(raiz, 'fvcheck-preview.html');
fs.writeFileSync(saida, html);
console.log('Prévia gerada: ' + saida + '  (' + (html.length / 1024).toFixed(0) + ' KB)');
