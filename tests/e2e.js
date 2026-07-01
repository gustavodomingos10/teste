/* End-to-end (Playwright + Chromium) — valida o fluxo completo e as novidades:
 *  seleção de país, licença, login, troca de senha, formulário, botão
 *  "Calcule para mim", modal de exportação e comparativo internacional.
 *  Executa em PT (Brasil) e EN (EUA). Falha (exit 1) em qualquer erro de JS. */
'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..');
const CHROME = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.json': 'application/json' };

function serve() {
  return new Promise(function (resolve) {
    const srv = http.createServer(function (req, res) {
      let p = decodeURIComponent(req.url.split('?')[0]);
      if (p === '/') p = '/index.html';
      const fp = path.join(ROOT, p);
      if (!fp.startsWith(ROOT) || !fs.existsSync(fp)) { res.statusCode = 404; return res.end('nf'); }
      res.setHeader('Content-Type', MIME[path.extname(fp)] || 'application/octet-stream');
      res.end(fs.readFileSync(fp));
    });
    srv.listen(0, function () { resolve(srv); });
  });
}

let passes = 0, fails = 0;
function ok(name, cond) { if (cond) { passes++; console.log('  ✓ ' + name); } else { fails++; console.log('  ✗ ' + name); } }

async function fluxo(page, base, locale) {
  const isEN = locale === 'US';
  const erros = [];
  page.on('console', function (m) { if (m.type() === 'error') erros.push(m.text()); });
  page.on('pageerror', function (e) { erros.push(String(e)); });

  await page.addInitScript(function () { try { localStorage.clear(); } catch (e) {} });
  await page.goto(base, { waitUntil: 'networkidle' });
  await page.waitForSelector('.pais-btn');

  // 1 · País (BR = 1º, US = 2º)
  const btns = page.locator('.pais-btn');
  await btns.nth(isEN ? 1 : 0).click();

  // 2 · Licença — iniciar avaliação (botão ghost)
  await page.waitForSelector('.auth-card .btn.ghost');
  await page.locator('.auth-card .btn.ghost').click();

  // 3 · Login admin (tela de login = 1 campo de senha)
  await page.waitForFunction(function () { return document.querySelectorAll('.auth-card input[type=password]').length === 1; });
  await page.locator('.auth-card input').nth(0).fill('admin');
  await page.locator('.auth-card input[type=password]').fill('GD-altura@2026');
  await page.locator('.auth-card .btn.primary').click();

  // 4 · Troca de senha obrigatória (tela de troca = 3 campos de senha)
  await page.waitForFunction(function () { return document.querySelectorAll('.auth-card input[type=password]').length === 3; });
  const senhas = page.locator('.auth-card input[type=password]');
  await senhas.nth(0).fill('GD-altura@2026');
  await senhas.nth(1).fill('GDsenha@2026');
  await senhas.nth(2).fill('GDsenha@2026');
  await page.locator('.auth-card .btn.primary').click();

  // 5 · Shell principal
  await page.waitForSelector('.shell .sidebar', { timeout: 9000 });
  ok(locale + ' · shell carregado', await page.locator('.sb-pais-flag').count() > 0);
  ok(locale + ' · marca da empresa (sutil)', await page.locator('.sb-empresa').count() > 0);

  // 6 · Projeto — o formulário e o cartão de dimensionamento automático
  await page.locator('.sb-link', { hasText: isEN ? 'Design' : 'Projeto' }).first().click().catch(function () {});
  // fallback: navega por rota via clique no 2º link
  await page.waitForTimeout(200);
  if (await page.locator('.auto-card').count() === 0) {
    await page.locator('.sb-nav .sb-link').nth(1).click();
  }
  await page.waitForSelector('.auto-card');
  ok(locale + ' · cartão "Calcule para mim" presente', await page.locator('.btn-calc').count() > 0);
  const calcTxt = await page.locator('.btn-calc').innerText();
  ok(locale + ' · botão traduzido', isEN ? /Calculate for me/i.test(calcTxt) : /Calcule para mim/i.test(calcTxt));

  // material/poste/vão continuam selecionáveis manualmente
  ok(locale + ' · seleção manual de perfil disponível', await page.locator('select').count() >= 5);

  // clica em "Calcule para mim" → modal de resultado (ótimo) ou "sem solução"
  await page.locator('.btn-calc').click();
  await page.waitForSelector('.modal-overlay', { timeout: 6000 });
  const temAuto = await page.locator('.modal-auto').count() > 0;
  const temSem = await page.locator('.auto-sem').count() > 0;
  ok(locale + ' · modal de dimensionamento abriu', temAuto || temSem);
  // fecha o modal
  await page.locator('.modal-overlay .modal-x, .modal-overlay .btn').first().click();
  await page.waitForTimeout(150);

  // 7 · Resultados — comparativo internacional + botão prontuário
  await page.locator('.sb-nav .sb-link').nth(2).click();
  await page.waitForSelector('.verdito-banner');
  ok(locale + ' · comparativo internacional presente', await page.locator('.ci-card').count() > 0);
  ok(locale + ' · duas colunas de jurisdição', await page.locator('.ci-col').count() === 2);
  ok(locale + ' · botão Gerar Prontuário Completo', await page.locator('.btn-prontuario').count() > 0);

  // 8 · Modal de exportação: seções + selecionar/desmarcar + formatos
  await page.locator('.btn-prontuario').first().click();
  await page.waitForSelector('.modal-exportar');
  const nSec = await page.locator('.exp-item input[type=checkbox]').count();
  ok(locale + ' · seções listadas (>10)', nSec > 10);
  // desmarcar todos → nenhum marcado
  await page.locator('.exp-acoes-sel .btn', { hasText: isEN ? 'Clear all' : 'Desmarcar' }).click();
  const marcadosApos = await page.locator('.exp-item input:checked').count();
  ok(locale + ' · "Desmarcar todos" funciona', marcadosApos === 0);
  // selecionar todos → todos marcados
  await page.locator('.exp-acoes-sel .btn', { hasText: isEN ? 'Select all' : 'Selecionar' }).click();
  const marcadosTodos = await page.locator('.exp-item input:checked').count();
  ok(locale + ' · "Selecionar todos" funciona', marcadosTodos === nSec);
  ok(locale + ' · 3 formatos de saída', await page.locator('.exp-fmt').count() >= 3);

  // 8b · Geração real de Excel (.xls) — desmarca Word/PDF, mantém só Excel
  const fmts = page.locator('.exp-fmt input[type=checkbox]');
  await fmts.nth(0).uncheck(); // Word
  await fmts.nth(1).uncheck(); // PDF
  // (nth(2) = Excel permanece marcado; nth(3) = incluir capa)
  const dlPromise = page.waitForEvent('download', { timeout: 8000 }).catch(function () { return null; });
  await page.locator('.modal-rodape .btn.primary').click();
  const dl = await dlPromise;
  ok(locale + ' · download de Excel disparado', !!dl);
  if (dl) {
    const fn = dl.suggestedFilename();
    ok(locale + ' · arquivo .xls nomeado', /\.xls$/.test(fn));
    const p2 = await dl.path();
    const conteudo = p2 ? fs.readFileSync(p2, 'utf8') : '';
    ok(locale + ' · workbook XML válido', /<Workbook[\s\S]*<\/Workbook>/.test(conteudo) && /Worksheet/.test(conteudo));
    ok(locale + ' · sem NaN no Excel', !/NaN/.test(conteudo));
  }
  // garante o modal fechado antes de prosseguir
  if (await page.locator('.modal-overlay').count() > 0) { await page.locator('.modal-overlay .modal-x').first().click().catch(function () {}); }
  await page.waitForTimeout(150);

  // 8c · Crédito discreto no canto + aba "Sobre / About"
  ok(locale + ' · crédito no canto presente', await page.locator('.credito-canto').count() > 0);
  const credTxt = await page.locator('.credito-canto').innerText();
  ok(locale + ' · crédito traduzido', (isEN ? /Developed by/i.test(credTxt) : /Desenvolvido por/i.test(credTxt)) && /GD Engenharia/.test(credTxt));
  await page.locator('.credito-canto').click();
  await page.waitForSelector('.sobre-hero');
  ok(locale + ' · página Sobre carregou', await page.locator('.sobre-hero').count() > 0);
  const sobreTxt = await page.locator('.conteudo').innerText();
  ok(locale + ' · Sobre cita o fabricante', /GD Engenharia/i.test(sobreTxt));
  ok(locale + ' · Sobre traduzido', isEN ? /Developed by|Manufacturer/i.test(sobreTxt) : /Desenvolvido por|Fabricante/i.test(sobreTxt));

  // 9 · Sem vazamento de PT quando em inglês (resultados + Sobre)
  if (isEN) {
    const corpoSobre = await page.locator('.conteudo').innerText();
    ok('US · sem PT vazado na página Sobre', !/(Desenvolvido|Fabricante|Versão|Normas atendidas)/.test(corpoSobre));
    await page.locator('.sb-nav .sb-link').nth(2).click(); // volta a Resultados
    await page.waitForSelector('.verdito-banner');
    const corpo = await page.locator('.conteudo').innerText();
    ok('US · sem PT vazado na tela de resultados', !/(Vão|Veredito|Prontuário|Selecionar|Comparativo)/.test(corpo));
  }

  ok(locale + ' · nenhum erro de JS no console', erros.length === 0);
  if (erros.length) console.log('    erros:', erros.slice(0, 5).join(' | '));
}

async function fluxoDemo(page, demoUrl) {
  const erros = [];
  page.on('console', function (m) { if (m.type() === 'error') erros.push(m.text()); });
  page.on('pageerror', function (e) { erros.push(String(e)); });
  await page.addInitScript(function () { try { localStorage.clear(); } catch (e) {} });
  await page.goto(demoUrl, { waitUntil: 'networkidle' });

  // 1 · Entra direto na aplicação (sem login/licença)
  await page.waitForSelector('.shell .sidebar', { timeout: 9000 });
  ok('demo · entra sem login', await page.locator('.auth-card').count() === 0);
  ok('demo · body.demo-mode ativo', await page.evaluate(function () { return document.body.classList.contains('demo-mode'); }));
  ok('demo · marca d’água presente', await page.locator('.demo-watermark').count() > 0);
  ok('demo · faixa de demonstração presente', await page.locator('.demo-faixa').count() > 0);

  // 2 · Resultados: mostra o veredito, mas SEM entregar o "ouro" (números/cálculos)
  await page.locator('.sb-nav .sb-link').nth(2).click();
  await page.waitForSelector('.verdito-banner');
  ok('demo · veredito calculado (prova que funciona)', await page.locator('.verdito-banner').count() > 0);
  ok('demo · comparativo internacional visível', await page.locator('.ci-card').count() > 0);
  ok('demo · números do comparativo OCULTOS (🔒)', (await page.locator('.ci-tab').first().innerText()).indexOf('🔒') !== -1);
  ok('demo · figuras em PRÉVIA borrada', await page.locator('.figuras-grid.demo-blur').count() > 0);
  ok('demo · memorial de 1 página (demonstrativo)', await page.locator('.memorial-demo').count() > 0);
  ok('demo · SEM passos de cálculo (o ouro)', await page.locator('.calc-step').count() === 0);
  ok('demo · cálculo detalhado bloqueado', await page.locator('.demo-doc-lock').count() > 0);

  // 3 · Exportar/Prontuário bloqueado: clique mostra aviso e NÃO abre o modal
  await page.locator('.btn-prontuario').first().click();
  await page.waitForTimeout(300);
  ok('demo · exportação bloqueada (sem modal)', await page.locator('.modal-exportar').count() === 0);
  ok('demo · aviso de bloqueio exibido (toast)', await page.locator('.toast').count() > 0);

  // 4 · Nada é persistido: recarregar zera (sem projetos salvos além do exemplo)
  ok('demo · sem erros de JS', erros.length === 0);
  if (erros.length) console.log('    erros:', erros.slice(0, 5).join(' | '));
}

(async function () {
  const srv = await serve();
  const base = 'http://127.0.0.1:' + srv.address().port + '/index.html';
  const browser = await chromium.launch({ executablePath: CHROME, args: ['--no-sandbox'] });
  try {
    for (const loc of ['BR', 'US']) {
      console.log('\n=== E2E · ' + loc + ' ===');
      const ctx = await browser.newContext();
      const page = await ctx.newPage();
      page.setDefaultTimeout(9000);
      await fluxo(page, base, loc);
      await ctx.close();
    }
    console.log('\n=== E2E · DEMONSTRAÇÃO ===');
    const ctxD = await browser.newContext();
    const pageD = await ctxD.newPage();
    pageD.setDefaultTimeout(9000);
    await fluxoDemo(pageD, 'http://127.0.0.1:' + srv.address().port + '/demo.html');
    await ctxD.close();
  } catch (e) {
    fails++; console.log('  ✗ EXCEÇÃO: ' + e.message);
  } finally {
    await browser.close();
    srv.close();
  }
  console.log('\n' + '='.repeat(50));
  console.log('E2E: ' + passes + ' aprovados, ' + fails + ' falhos.');
  console.log('='.repeat(50));
  process.exit(fails === 0 ? 0 : 1);
})();
