#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Gera a ÁREA RESTRITA de cursos para o site GD (estático/Amplify).
Uso: python3 gerar_area_restrita.py <dir_do_site> <senha_temporaria>

- Login com PBKDF2-SHA256 (600k iterações, WebCrypto) — sem senha em texto no código.
- Páginas dos cursos geradas dos .md (apostila-style GD) + kits copiados para download.
- Sem link no menu público; robots/noindex ficam por conta do chamador.
AVISO: proteção client-side (site estático). Para barreira de servidor, ativar o
Access Control (Basic Auth) do Amplify Hosting no console."""
import os, sys, shutil, hashlib, glob, html
import markdown

BASE = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
SITE = os.path.abspath(sys.argv[1])
SENHA = sys.argv[2]
AREA = os.path.join(SITE, "area-restrita")

ITER = 600_000
SALT = os.urandom(16).hex()
HASH = hashlib.pbkdf2_hmac("sha256", SENHA.encode(), bytes.fromhex(SALT), ITER).hex()

CURSOS = [
  dict(slug="curso-fundacoes", num="Curso 2", nome="Tipos de Fundações e Quando Usar Cada Uma",
       sub="Da sondagem à escolha certa — rasa ou profunda, sem chute", src="04-curso-fundacoes",
       ferramenta=("seletor-fundacao-PRO.html","⭐ Seletor Interativo de Fundação (PRO)"),
       ferramenta_lite="seletor-fundacao-LITE.html",
       planilha="planilha-fundacoes.xlsx", modulo_ouro="M4 — A decisão: qual fundação para qual caso (6 aulas)"),
  dict(slug="curso-concreto", num="Curso 3", nome="Receber e Liberar Concreto com Critério",
       sub="O procedimento de 8 minutos que protege a sua estrutura", src="05-curso-concreto",
       ferramenta=("simulador-recebimento-PRO.html","⭐ Simulador de Recebimento (PRO)"),
       ferramenta_lite="simulador-recebimento-LITE.html",
       planilha="planilha-concreto.xlsx", modulo_ouro="M2 — A hora do caminhão: os 8 minutos (6 aulas)"),
  dict(slug="curso-inspecao", num="Curso 4", nome="Inspeção de Serviços Críticos",
       sub="Forma, armação, escoramento e alvenaria — pegue o erro antes do concreto", src="06-curso-inspecao",
       ferramenta=("liberador-concretagem-PRO.html","⭐ Liberador de Concretagem (PRO)"),
       ferramenta_lite="liberador-concretagem-LITE.html",
       planilha="planilha-inspecao.xlsx", modulo_ouro="M2 — A liberação de concretagem (7 aulas)"),
  dict(slug="curso-fissuras", num="Curso 5 · PILOTO", nome="Diagnóstico de Fissuras e Trincas",
       sub="Enxergue como um perito — leia o que a fissura está dizendo", src="02-curso-piloto",
       ferramenta=("ferramenta-fissuras-PRO.html","⭐ Diagnóstico Interativo de Fissuras (PRO)"),
       ferramenta_lite="ferramenta-fissuras-LITE.html",
       planilha="planilha-fissuras.xlsx", modulo_ouro="M2 — A fissura fala: leitura do desenho (7 aulas)"),
]

CSS = """
:root{--verde:#0E3A34;--vesc:#0A2A25;--vmed:#1C5A4E;--creme:#F5EFE0;--creme2:#FBF8F0;--dour:#C9A24B;--dour2:#E3C97E;--carvao:#20211E;--cinza:#6B6B63;--verd:#2E7D32;--amar:#F9A825;--verm:#C62828;}
*{box-sizing:border-box;}body{margin:0;font-family:-apple-system,'Segoe UI',Roboto,Arial,sans-serif;background:var(--creme);color:var(--carvao);line-height:1.6;}
.serif{font-family:Georgia,'Times New Roman',serif;}
header.top{background:linear-gradient(160deg,var(--verde),var(--vesc));color:var(--creme);padding:14px 0;border-bottom:3px solid var(--dour);}
.wrap{max-width:960px;margin:0 auto;padding:0 20px;}
.brand{display:flex;align-items:center;gap:12px;}
.lz{width:38px;height:38px;min-width:38px;background:var(--dour);color:var(--verde);transform:rotate(45deg);display:flex;align-items:center;justify-content:center;font-weight:800;}
.lz span{transform:rotate(-45deg);font-size:.85rem;}
.brand b{color:var(--creme);}.brand .t{font-size:.6rem;letter-spacing:.15em;text-transform:uppercase;color:var(--dour2);}
.brand .right{margin-left:auto;display:flex;gap:10px;align-items:center;}
a.btn,button.btn{display:inline-block;background:var(--dour);color:var(--verde);font-weight:700;padding:9px 16px;border-radius:8px;text-decoration:none;border:none;cursor:pointer;font-size:.9rem;}
a.btn-ghost,button.btn-ghost{background:transparent;color:var(--dour2);border:1.5px solid var(--dour2);}
main{padding:28px 0 50px;}
h1.pg{font-family:Georgia,serif;color:var(--verde);font-size:1.7rem;margin:0 0 4px;}
.sub{color:var(--cinza);margin:0 0 20px;}
.card{background:#fff;border-radius:14px;padding:20px 22px;box-shadow:0 3px 12px rgba(14,58,52,.07);margin-bottom:16px;}
.card h2{font-family:Georgia,serif;color:var(--verde);font-size:1.2rem;margin:0 0 8px;}
.card h3{color:var(--vmed);font-size:1rem;margin:14px 0 4px;}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:14px;}
.tag{display:inline-block;background:rgba(201,162,75,.15);border:1px solid var(--dour);color:var(--verde);border-radius:20px;padding:2px 10px;font-size:.72rem;font-weight:700;margin-right:6px;}
.ok{color:var(--verd);font-weight:700;}.warn{color:#9C6500;font-weight:700;}
ul.links{list-style:none;padding:0;margin:8px 0;}
ul.links li{padding:8px 0;border-bottom:1px solid #e3dcc7;}
ul.links a{color:var(--verde);font-weight:600;text-decoration:none;}
ul.links a:hover{color:var(--vmed);text-decoration:underline;}
ul.links .d{color:var(--cinza);font-size:.82rem;font-weight:400;}
.crumb{font-size:.8rem;color:var(--cinza);margin-bottom:14px;}
.crumb a{color:var(--vmed);text-decoration:none;}
.avis{background:rgba(249,168,37,.13);border-left:4px solid var(--amar);padding:10px 14px;border-radius:0 8px 8px 0;font-size:.88rem;margin:12px 0;}
footer{background:var(--vesc);color:var(--dour2);text-align:center;padding:18px;font-size:.75rem;}
/* conteúdo md */
.md{background:#fff;border-radius:14px;padding:26px 30px;box-shadow:0 3px 12px rgba(14,58,52,.07);}
.md h1{font-family:Georgia,serif;color:var(--verde);font-size:1.5rem;border-bottom:2px solid var(--dour);padding-bottom:6px;}
.md h2{font-family:Georgia,serif;color:var(--verde);font-size:1.25rem;margin-top:26px;border-bottom:1px solid #e3dcc7;padding-bottom:4px;}
.md h3{color:var(--vmed);font-size:1.05rem;margin-top:18px;}
.md table{width:100%;border-collapse:collapse;font-size:.85rem;margin:10px 0;display:block;overflow-x:auto;}
.md thead th{background:var(--verde);color:var(--creme);text-align:left;padding:6px 9px;}
.md tbody td{padding:6px 9px;border-bottom:1px solid #e3dcc7;vertical-align:top;}
.md tbody tr:nth-child(even){background:var(--creme2);}
.md blockquote{background:var(--creme2);border-left:4px solid var(--dour);margin:12px 0;padding:10px 16px;color:#333;}
.md code{background:#eee7d3;color:var(--vmed);padding:1px 5px;border-radius:3px;font-size:.85em;}
.md hr{border:none;border-top:1px solid var(--dour);margin:18px 0;}
.md img{max-width:100%;}
@media(max-width:600px){.md{padding:18px;}}
"""

GUARD = """/* Portão da área restrita — GD Engenharia (client-side; ver LEIA-ME). */
(function(){
  var H = "%HASH%";
  try{
    if (sessionStorage.getItem('gd_area_ok') !== H){
      var depth = (document.currentScript.getAttribute('data-depth')||'1');
      var up = ''; for(var i=0;i<parseInt(depth,10);i++) up += '../';
      location.replace(up + 'index.html');
    }
  }catch(e){ location.replace('index.html'); }
})();
function gdSair(){ try{sessionStorage.removeItem('gd_area_ok');}catch(e){} location.reload(); }
"""

LOGIN = """<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Área Restrita — Escola de Obra · GD Engenharia</title>
<style>%CSS%
.login{max-width:420px;margin:60px auto;background:#fff;border-radius:16px;padding:34px;box-shadow:0 6px 24px rgba(14,58,52,.12);text-align:center;}
.login .lz{margin:0 auto 18px;width:56px;height:56px;}
.login h1{font-family:Georgia,serif;color:var(--verde);font-size:1.4rem;margin:0 0 4px;}
.login p{color:var(--cinza);font-size:.88rem;margin:0 0 20px;}
.login input{width:100%;padding:13px;border:1.5px solid #ded6c0;border-radius:10px;font-size:1rem;margin-bottom:12px;}
.login .msg{font-size:.85rem;color:var(--verm);min-height:1.2em;margin-bottom:8px;}
.login button{width:100%;padding:13px;font-size:1rem;}
.login .foot{margin-top:18px;font-size:.72rem;color:var(--cinza);}
</style>
</head>
<body>
<div class="login">
  <div class="lz"><span>GD</span></div>
  <h1 class="serif">Área Restrita</h1>
  <p>Escola de Obra · Padrão Diamante<br>Acesso exclusivo do instrutor (fase de testes)</p>
  <input type="password" id="pw" placeholder="Senha de acesso" autocomplete="current-password" onkeydown="if(event.key==='Enter')entrar()">
  <div class="msg" id="msg"></div>
  <button class="btn" id="bt" onclick="entrar()">Entrar</button>
  <div class="foot">Conteúdo em fase de revisão — não distribuir.<br>GD Engenharia e Perícia · engenhariagd.com.br</div>
</div>
<script>
var SALT="%SALT%", HASH="%HASH%", ITER=%ITER%;
async function pbkdf2(pw){
  var enc=new TextEncoder();
  var key=await crypto.subtle.importKey('raw',enc.encode(pw),{name:'PBKDF2'},false,['deriveBits']);
  var salt=new Uint8Array(SALT.match(/../g).map(function(h){return parseInt(h,16);}));
  var bits=await crypto.subtle.deriveBits({name:'PBKDF2',hash:'SHA-256',salt:salt,iterations:ITER},key,256);
  return Array.from(new Uint8Array(bits)).map(function(b){return b.toString(16).padStart(2,'0');}).join('');
}
async function entrar(){
  var pw=document.getElementById('pw').value, bt=document.getElementById('bt'), msg=document.getElementById('msg');
  if(!pw){msg.textContent='Digite a senha.';return;}
  bt.disabled=true; bt.textContent='Verificando…'; msg.textContent='';
  try{
    var h=await pbkdf2(pw);
    if(h===HASH){ sessionStorage.setItem('gd_area_ok',HASH); location.href='painel.html'; }
    else { msg.textContent='Senha incorreta.'; bt.disabled=false; bt.textContent='Entrar'; }
  }catch(e){ msg.textContent='Erro de criptografia — use um navegador atual em https.'; bt.disabled=false; bt.textContent='Entrar'; }
}
try{ if(sessionStorage.getItem('gd_area_ok')===HASH) location.replace('painel.html'); }catch(e){}
</script>
</body>
</html>
"""

def page(title, body, depth=1, crumb=""):
    up = "../"*depth
    return f"""<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>{html.escape(title)} — Área Restrita GD</title>
<style>{CSS}</style>
<script src="{up}guard.js" data-depth="{depth}"></script>
</head>
<body>
<header class="top"><div class="wrap"><div class="brand">
  <div class="lz"><span>GD</span></div>
  <div><b>Escola de Obra</b><div class="t">Área restrita · fase de testes</div></div>
  <div class="right"><a class="btn-ghost btn" href="{up}painel.html">Painel</a>
  <button class="btn-ghost btn" onclick="gdSair()">Sair</button></div>
</div></div></header>
<main><div class="wrap">
{f'<div class="crumb">{crumb}</div>' if crumb else ''}
{body}
</div></main>
<footer>Conteúdo em revisão pelo instrutor — não distribuir. · GD Engenharia e Perícia · Padrão Diamante</footer>
</body></html>"""

def md2html(path, strip_h1=False):
    raw = open(path, encoding="utf-8").read()
    if strip_h1:
        lines = raw.split("\n")
        if lines and lines[0].startswith("# "): raw = "\n".join(lines[1:])
    return markdown.markdown(raw, extensions=["extra","sane_lists","tables"])

def write(path, content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f: f.write(content)

# ---------- monta a área ----------
if os.path.isdir(AREA): shutil.rmtree(AREA)
os.makedirs(AREA)

write(os.path.join(AREA,"guard.js"), GUARD.replace("%HASH%",HASH))
write(os.path.join(AREA,"index.html"), LOGIN.replace("%CSS%",CSS).replace("%SALT%",SALT).replace("%HASH%",HASH).replace("%ITER%",str(ITER)))

FALTA_GERAL = """
<div class="card"><h2>⚠️ O que ainda falta para os cursos ficarem prontos (resumo)</h2>
<p>Os cursos estão <b>estruturalmente completos</b> (roteiros, quizzes, kits testados, apostilas, copy). O que falta é a <b>camada de produção</b> — e ela é sua:</p>
<ul>
<li><b>1. Gravar as aulas em vídeo.</b> Nenhum curso tem vídeo ainda: o que existe são <b>roteiros de gravação completos</b> (teleprompter, storyboard, minutagem) — prontos para você gravar. ~22–24 micro-aulas por curso. O plano de gravação está em cada curso.</li>
<li><b>2. Fotos do acervo.</b> Todos os materiais usam marcadores <code>[FOTO DO ACERVO: …]</code> — substitua pelas suas fotos reais (lista exata por aula no "Pedido de material" de cada curso).</li>
<li><b>3. Assinar o VALIDAR.md.</b> Valores técnicos marcados 🟡 (aberturas, tempos-limite, tolerâncias, cobrimentos) precisam da sua confirmação e assinatura antes de publicar.</li>
<li><b>4. Logo GD em PNG</b> para substituir o selo textual nos materiais.</li>
<li><b>5. Montar na plataforma (Kiwify):</b> subir vídeos, anexar os kits, montar os quizzes (bancos prontos) e ativar certificado — checklist de publicação pronto no projeto.</li>
<li><b>6. Revalidar preços/âncoras</b> marcados <code>[PESQUISAR]</code> na data do lançamento.</li>
</ul></div>
"""

cards = ""
for c in CURSOS:
    cards += f"""<div class="card">
  <span class="tag">{c['num']}</span>
  <h2 class="serif">{c['nome']}</h2>
  <p class="sub" style="margin-bottom:10px">{c['sub']}</p>
  <p><span class="ok">✔ Pronto:</span> arquitetura · Módulo de Ouro roteirizado ({c['modulo_ouro']}) · quizzes · Kit 8/8 testado · apostila · copy</p>
  <p><span class="warn">⚠ Falta:</span> gravar os vídeos · fotos do acervo · assinar VALIDAR</p>
  <a class="btn" href="{c['slug']}/index.html">Abrir curso</a>
</div>"""

painel = f"""<h1 class="pg serif">Painel dos Cursos</h1>
<p class="sub">4 cursos construídos no Padrão Diamante — Fase A completa + curso piloto. Explore cada um; tudo abaixo é o material real que o aluno receberá.</p>
<div class="avis"><b>Fase de testes:</b> esta área é exclusiva do instrutor. Nada aqui está público nem indexado. Para uma barreira adicional de servidor, ative o Access Control (senha) do Amplify Hosting no console AWS.</div>
{FALTA_GERAL}
<div class="grid">{cards}</div>
"""
write(os.path.join(AREA,"painel.html"), page("Painel", painel, depth=0))

# ---------- páginas por curso ----------
for c in CURSOS:
    src = os.path.join(BASE, c["src"])
    dst = os.path.join(AREA, c["slug"])
    os.makedirs(dst, exist_ok=True)

    # kit: copia inteiro
    shutil.copytree(os.path.join(src,"kit"), os.path.join(dst,"kit"))

    # md -> html
    def sec(fname, title, out, order=None):
        p = os.path.join(src,fname)
        if not os.path.exists(p): return False
        body = f'<div class="md">{md2html(p)}</div>'
        write(os.path.join(dst,out), page(title, body, depth=1,
              crumb=f'<a href="../painel.html">Painel</a> › <a href="index.html">{html.escape(c["nome"])}</a> › {title}'))
        return True

    sec("arquitetura.md","Arquitetura do curso","arquitetura.html")
    sec(os.path.join("quizzes","estrutura-banco.md"),"Banco de quizzes","quizzes.html")
    # copy: cursos novos têm lancamento/copy.md; piloto usa 03-lancamento
    if not sec(os.path.join("lancamento","copy.md"),"Copy de lançamento","copy.html"):
        p = os.path.join(BASE,"03-lancamento","pagina-vendas","copy.md")
        if os.path.exists(p):
            write(os.path.join(dst,"copy.html"), page("Copy de lançamento",
                f'<div class="md">{md2html(p)}</div>',1,
                f'<a href="../painel.html">Painel</a> › <a href="index.html">{html.escape(c["nome"])}</a> › Copy'))
    # pedido de material: piloto usa 00-projeto
    if not sec("PEDIDO-DE-MATERIAL.md","Pedido de material (fotos)","pedido-material.html"):
        p = os.path.join(BASE,"00-projeto","PEDIDO-DE-MATERIAL.md")
        write(os.path.join(dst,"pedido-material.html"), page("Pedido de material (fotos)",
            f'<div class="md">{md2html(p)}</div>',1,
            f'<a href="../painel.html">Painel</a> › <a href="index.html">{html.escape(c["nome"])}</a> › Pedido de material'))
    sec(os.path.join("kit","RELATORIO-QA.md"),"Relatório de QA do Kit","qa.html")

    # aulas do módulo de ouro (concatenadas)
    aulas_dir = os.path.join(src,"roteiros","modulo-ouro")
    aulas = sorted(glob.glob(os.path.join(aulas_dir,"aula-*.md")))
    readme = os.path.join(aulas_dir,"README.md")
    parts = []
    if os.path.exists(readme): parts.append(md2html(readme))
    for a in aulas: parts.append(md2html(a))
    body = '<div class="avis">📽️ <b>Estes são os roteiros de gravação</b> — storyboard + teleprompter na sua voz. As aulas em vídeo ainda precisam ser gravadas por você.</div>' + \
           '<div class="md">' + '<hr style="border-top:3px double var(--dour);margin:30px 0">'.join(parts) + '</div>'
    write(os.path.join(dst,"aulas.html"), page("Roteiros do Módulo de Ouro", body,1,
          f'<a href="../painel.html">Painel</a> › <a href="index.html">{html.escape(c["nome"])}</a> › Roteiros'))

    # kit index links
    kitdir = os.path.join(dst,"kit")
    kit_links = ""
    ferr, ferr_lbl = c["ferramenta"]
    mapping = [
      (f"kit/ferramenta/{ferr}", ferr_lbl, "abra e teste no celular — funciona offline"),
      (f"kit/ferramenta/{c['ferramenta_lite']}", "Versão LITE (isca pública)", "com CTA e consentimento LGPD"),
      (f"kit/planilha/{c['planilha']}", "📊 Planilha inteligente (.xlsx)", "fórmulas testadas — abra no Excel"),
    ]
    for pat,lbl,d in [("kit/checklist/*.pdf","📋 Checklist (PDF)","A4 e A5"),
                      ("kit/apostila/*.pdf","📚 Apostila Diamante (PDF)",""),
                      ("kit/guia-bolso/*.pdf","📱 Guia de bolso (PDF)","formato celular"),
                      ("kit/fluxograma/*.pdf","🔀 Fluxograma de decisão (PDF)",""),
                      ("kit/ebook/*.pdf","📖 Mini e-book (PDF)","10 histórias"),
                      ("kit/relatorio/*.docx","📄 Modelo editável (Word)","relatório/termo/parecer"),
                      ("kit/relatorio/*.pdf","📄 Modelo (PDF)","")]:
        for f in sorted(glob.glob(os.path.join(dst,pat))):
            rel = os.path.relpath(f,dst)
            mapping.append((rel, f"{lbl} — {os.path.basename(f)}", d))
    for rel,lbl,d in mapping:
        if os.path.exists(os.path.join(dst,rel)):
            kit_links += f'<li><a href="{rel}">{html.escape(lbl)}</a> <span class="d">{html.escape(d)}</span></li>'

    idx = f"""<span class="tag">{c['num']}</span>
<h1 class="pg serif">{html.escape(c['nome'])}</h1>
<p class="sub">{html.escape(c['sub'])}</p>
<div class="card"><h2>Status deste curso</h2>
<p><span class="ok">✔ Pronto e testado:</span> arquitetura completa · roteiros do Módulo de Ouro · banco de quizzes · Kit Diamante 8/8 (planilha e ferramenta com testes automatizados) · apostila · copy de lançamento.</p>
<p><span class="warn">⚠ Falta (ação sua):</span> <b>gravar as aulas em vídeo</b> (os roteiros estão prontos) · substituir <code>[FOTO DO ACERVO]</code> pelas suas fotos (ver Pedido de material) · assinar os valores 🟡 do VALIDAR.md · subir na plataforma.</p></div>
<div class="grid">
<div class="card"><h2>📽️ Conteúdo do curso</h2><ul class="links">
<li><a href="arquitetura.html">Arquitetura do curso</a> <span class="d">módulos, aulas, minutagem, arco narrativo</span></li>
<li><a href="aulas.html">Roteiros do Módulo de Ouro</a> <span class="d">{html.escape(c['modulo_ouro'])}</span></li>
<li><a href="quizzes.html">Banco de quizzes</a> <span class="d">5 por módulo + quiz final do certificado</span></li>
</ul></div>
<div class="card"><h2>🎒 Kit Diamante (o que o aluno baixa)</h2><ul class="links">{kit_links}</ul></div>
<div class="card"><h2>🚀 Produção e lançamento</h2><ul class="links">
<li><a href="pedido-material.html">Pedido de material</a> <span class="d">fotos do acervo, aula por aula</span></li>
<li><a href="copy.html">Copy de lançamento</a> <span class="d">página de vendas, blocos e FAQ</span></li>
<li><a href="qa.html">Relatório de QA</a> <span class="d">evidência dos testes do Kit</span></li>
</ul></div>
</div>"""
    write(os.path.join(dst,"index.html"), page(c["nome"], idx, depth=1,
          crumb=f'<a href="../painel.html">Painel</a> › {html.escape(c["nome"])}'))

# guard nos HTMLs das ferramentas do kit copiado (injeção leve)
for c in CURSOS:
    for f in glob.glob(os.path.join(AREA,c["slug"],"kit","**","*.html"), recursive=True):
        raw = open(f,encoding="utf-8").read()
        depth = os.path.relpath(f, AREA).count(os.sep)
        tag = f'<script src="{"../"*depth}guard.js" data-depth="{depth}"></script>'
        if "guard.js" not in raw and "<head>" in raw:
            raw = raw.replace("<head>", "<head>\n"+tag, 1)
            open(f,"w",encoding="utf-8").write(raw)

# LEIA-ME
write(os.path.join(AREA,"LEIA-ME-AREA-RESTRITA.txt"), f"""ÁREA RESTRITA — ESCOLA DE OBRA (fase de testes)
================================================

ACESSO
- URL: /area-restrita/  (sem link no menu público; noindex)
- Senha temporária: definida na geração (guarde com você; troque quando quiser)
- Sessão: dura enquanto a aba estiver aberta (sessionStorage). Botão "Sair" encerra.

TROCAR A SENHA
- Rode de novo o gerador com a senha nova:
  python3 escola-de-obra/_build/gerar_area_restrita.py <pasta_do_site> "MinhaNovaSenha"
  (ele regrava o hash em index.html e guard.js — a senha nunca fica em texto no código)

HONESTIDADE TÉCNICA (mesmo espírito do gd-security.js)
- Site estático: este portão é CLIENT-SIDE. Ele barra acesso casual e mantém o
  conteúdo fora de busca/índices, mas não é barreira de servidor.
- Para barreira real de servidor no Amplify Hosting: console AWS -> App ->
  Access control -> ative senha (Basic Auth) no branch. Recomendado enquanto testa.
- Para os ALUNOS, o destino final é a área de membros da Kiwify (checklist de
  publicação pronto no projeto) — não esta área.

CONTEÚDO
- 4 cursos completos: Fundações (2), Concreto (3), Inspeção (4), Fissuras (5-piloto).
- Cada curso: arquitetura, roteiros do Módulo de Ouro, quizzes, Kit 8/8 (ferramentas
  interativas PRO/LITE, planilhas testadas, PDFs, Word) e copy.
- O painel lista o que ainda falta para publicar (gravar vídeos, fotos, VALIDAR).
""")

print("ÁREA GERADA em", AREA)
print("SALT:", SALT)
print("Cursos:", ", ".join(c["slug"] for c in CURSOS))
