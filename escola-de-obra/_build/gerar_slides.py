#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Motor de SLIDESHOW NARRADO da Escola de Obra.
Renderiza um deck HTML (16:9, marca GD, offline) com TELEPROMPTER embutido:
cada slide mostra o texto de narração na base (tecla R liga/desliga).
Modo impressão => roteiro de narração completo.

Uso: importado por curso_<slug>_slides.py, que define TITULO, SUB, SLIDES e chama render().
Estrutura de cada slide (dict):
  {"tipo":"capa",  "titulo":..., "sub":..., "narr":...}
  {"tipo":"modulo","num":"Módulo 1","titulo":..., "min":"~32 min", "narr":...}
  {"tipo":"conteudo","titulo":..., "sub":?, "bullets":[...]?, "tabela":{"head":[...],"rows":[[...]]}?,
      "norma":?, "mestre":?, "foto":?, "validar":?, "narr":...}
  {"tipo":"quiz","titulo":"Quiz do Módulo N","q":..., "alts":[...], "correta":i, "coment":..., "narr":...}
  {"tipo":"fim","titulo":..., "bullets":[...]?, "narr":...}
"""
import os, html as _h

CSS = r"""
:root{--verde:#0E3A34;--vesc:#0A2A25;--vmed:#1C5A4E;--creme:#F5EFE0;--creme2:#FBF8F0;--dour:#C9A24B;--dour2:#E3C97E;--carvao:#20211E;--cinza:#6B6B63;--verd:#2E7D32;--amar:#F9A825;--verm:#C62828;}
*{box-sizing:border-box;margin:0;padding:0;}
html,body{height:100%;}
body{background:#0b0d0c;font-family:-apple-system,'Segoe UI',Roboto,Arial,sans-serif;color:var(--carvao);overflow:hidden;}
.serif{font-family:Georgia,'Times New Roman',serif;}
/* palco 16:9 */
.stage{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:#0b0d0c;}
.deck{position:relative;width:min(100vw,177.78vh);height:min(56.25vw,100vh);background:var(--creme);overflow:hidden;box-shadow:0 0 60px rgba(0,0,0,.6);}
.slide{position:absolute;inset:0;padding:5.2% 6.5%;display:none;flex-direction:column;}
.slide.on{display:flex;}
/* tipos */
.slide .kick{font-size:1.5vh;letter-spacing:.28em;text-transform:uppercase;color:var(--dour);font-weight:700;margin-bottom:1.2vh;}
.slide h1{font-family:Georgia,serif;color:var(--verde);font-size:5.2vh;line-height:1.08;}
.slide h2{font-family:Georgia,serif;color:var(--verde);font-size:4.2vh;line-height:1.12;margin-bottom:1.4vh;}
.slide .sub{color:var(--vmed);font-size:2.5vh;font-style:italic;margin-bottom:2vh;}
.slide ul{list-style:none;margin:1vh 0;}
.slide li{font-size:2.55vh;line-height:1.5;padding:.7vh 0 .7vh 4vh;position:relative;color:var(--carvao);}
.slide li::before{content:"";position:absolute;left:.6vh;top:1.9vh;width:1.5vh;height:1.5vh;background:var(--dour);transform:rotate(45deg);}
.slide li b{color:var(--vmed);}
table{width:100%;border-collapse:collapse;font-size:2vh;margin:1vh 0;}
th{background:var(--verde);color:var(--creme);text-align:left;padding:.8vh 1.1vh;}
td{padding:.7vh 1.1vh;border-bottom:1px solid #e3dcc7;vertical-align:top;}
tr:nth-child(even) td{background:var(--creme2);}
.norma{background:rgba(28,90,78,.10);border-left:.6vh solid var(--vmed);padding:1.1vh 1.6vh;font-family:'Courier New',monospace;font-size:1.9vh;color:var(--vmed);margin:1.4vh 0;}
.mestre{background:var(--creme2);border-left:.6vh solid var(--dour);padding:1.3vh 1.8vh;font-size:2.15vh;margin:1.4vh 0;}
.mestre b{color:var(--verde);}
.validar{background:rgba(249,168,37,.13);border-left:.6vh solid var(--amar);padding:1vh 1.5vh;font-size:1.85vh;color:#7a5b00;margin:1.2vh 0;}
.foto{flex:1;min-height:14vh;margin:1.4vh 0;background:repeating-linear-gradient(45deg,#e8e1cf,#e8e1cf 2vh,#ded6c0 2vh,#ded6c0 4vh);border:.3vh dashed var(--cinza);color:var(--cinza);display:flex;align-items:center;justify-content:center;text-align:center;padding:2vh;font-size:1.9vh;}
.body{flex:1;overflow:hidden;}
.two{display:grid;grid-template-columns:1fr 1fr;gap:3vh;flex:1;align-items:start;}
/* capa */
.capa{background:linear-gradient(160deg,var(--verde),var(--vesc));color:var(--creme);align-items:center;justify-content:center;text-align:center;}
.capa .lz{width:11vh;height:11vh;background:var(--dour);color:var(--verde);transform:rotate(45deg);display:flex;align-items:center;justify-content:center;font-weight:800;font-size:4vh;margin-bottom:3vh;}
.capa .lz span{transform:rotate(-45deg);}
.capa h1{color:var(--creme);font-size:6vh;}
.capa .sub{color:var(--dour2);font-size:2.8vh;margin-top:1.5vh;}
.capa .autor{margin-top:5vh;color:#d8c99b;font-size:2vh;}
.capa .autor b{color:var(--creme);}
/* módulo divisória */
.mod{background:var(--verde);color:var(--creme);justify-content:center;}
.mod .num{color:var(--dour2);font-size:2.2vh;letter-spacing:.2em;text-transform:uppercase;}
.mod h1{color:var(--creme);font-size:6vh;margin:1.5vh 0;}
.mod .min{color:var(--dour2);font-size:2.2vh;}
/* quiz */
.quiz .q{font-size:3vh;color:var(--verde);font-family:Georgia,serif;margin-bottom:2vh;}
.quiz .alt{font-size:2.4vh;padding:1.2vh 1.8vh;border:.3vh solid #ded6c0;border-radius:1.2vh;margin-bottom:1.3vh;background:#fff;display:flex;gap:1.5vh;}
.quiz .alt .k{width:3.4vh;height:3.4vh;min-width:3.4vh;border-radius:50%;border:.3vh solid var(--vmed);display:flex;align-items:center;justify-content:center;color:var(--vmed);font-weight:700;}
.quiz .alt.ok{border-color:var(--verd);background:rgba(46,125,50,.12);}
.quiz .alt.ok .k{background:var(--verd);border-color:var(--verd);color:#fff;}
.quiz .coment{font-size:2.05vh;color:#333;background:var(--creme2);border-left:.6vh solid var(--dour);padding:1.2vh 1.6vh;margin-top:1vh;}
/* rodapé do slide */
.foot{position:absolute;bottom:2.2vh;left:6.5%;right:6.5%;display:flex;justify-content:space-between;align-items:center;font-size:1.5vh;color:var(--cinza);border-top:1px solid #e3dcc7;padding-top:1vh;}
.foot .lzm{width:2.6vh;height:2.6vh;background:var(--dour);color:var(--verde);transform:rotate(45deg);display:inline-flex;align-items:center;justify-content:center;font-size:1.1vh;font-weight:800;}
.foot .lzm span{transform:rotate(-45deg);}
.mod .foot,.capa .foot{color:var(--dour2);border-top-color:rgba(201,162,75,.3);}
/* teleprompter */
#tp{position:fixed;left:0;right:0;bottom:0;background:rgba(10,13,12,.95);color:#f3ead2;padding:2vh 4vw 2.4vh;font-size:2.3vh;line-height:1.5;max-height:38vh;overflow:auto;border-top:.4vh solid var(--dour);display:none;z-index:30;}
#tp.on{display:block;}
#tp .lab{color:var(--dour2);font-size:1.4vh;letter-spacing:.2em;text-transform:uppercase;margin-bottom:1vh;}
/* controles */
#bar{position:fixed;top:0;right:0;padding:1.4vh 2vw;display:flex;gap:1.2vh;z-index:40;}
#bar button{background:rgba(14,58,52,.85);color:var(--creme);border:1px solid var(--dour);border-radius:.8vh;padding:.9vh 1.4vh;font-size:1.7vh;cursor:pointer;}
#bar button:hover{background:var(--verde);}
#nav{position:fixed;bottom:1.5vh;left:50%;transform:translateX(-50%);display:flex;gap:1.5vh;align-items:center;z-index:40;}
#nav button{background:rgba(14,58,52,.85);color:var(--creme);border:1px solid var(--dour);border-radius:50%;width:5vh;height:5vh;font-size:2.2vh;cursor:pointer;}
#count{color:#d8c99b;font-size:1.8vh;min-width:8vh;text-align:center;}
.hint{position:fixed;top:1.4vh;left:2vw;color:#7d8a80;font-size:1.5vh;z-index:40;}
/* ===== IMPRESSÃO: vira roteiro de narração ===== */
@media print{
  @page{size:A4 landscape;margin:10mm;}
  body{overflow:visible;background:#fff;}
  #bar,#nav,#tp,.hint,.stage{position:static;}
  .stage{display:block;}
  .deck{width:100%;height:auto;box-shadow:none;}
  .slide{position:relative;display:flex!important;inset:auto;height:150mm;border:1px solid #d9d2be;page-break-inside:avoid;margin-bottom:4mm;}
  .roteiro-print{display:block!important;page-break-before:always;padding:8mm;}
}
.roteiro-print{display:none;}
@media print{
  .rp{border-bottom:1px solid #d9d2be;padding:6px 0;font-size:11px;}
  .rp b{color:#0E3A34;}
  .rp .n{color:#C9A24B;font-weight:700;margin-right:6px;}
  .roteiro-print h2{font-family:Georgia,serif;color:#0E3A34;margin-bottom:8px;}
}
"""

JS = r"""
var slides=[].slice.call(document.querySelectorAll('.slide'));
var i=0, tp=document.getElementById('tp'), tpText=document.getElementById('tptext'), count=document.getElementById('count');
function show(n){
  i=Math.max(0,Math.min(slides.length-1,n));
  slides.forEach(function(s,k){s.classList.toggle('on',k===i);});
  count.textContent=(i+1)+' / '+slides.length;
  tpText.innerHTML=slides[i].getAttribute('data-narr')||'—';
}
function next(){show(i+1);} function prev(){show(i-1);}
function toggleTP(){tp.classList.toggle('on');}
function fs(){ if(!document.fullscreenElement){document.documentElement.requestFullscreen&&document.documentElement.requestFullscreen();} else {document.exitFullscreen&&document.exitFullscreen();} }
document.addEventListener('keydown',function(e){
  if(e.key==='ArrowRight'||e.key===' '||e.key==='PageDown'){e.preventDefault();next();}
  else if(e.key==='ArrowLeft'||e.key==='PageUp'){e.preventDefault();prev();}
  else if(e.key.toLowerCase()==='r'){toggleTP();}
  else if(e.key.toLowerCase()==='f'){fs();}
  else if(e.key==='Home'){show(0);} else if(e.key==='End'){show(slides.length-1);}
});
show(0);
"""

def esc(s): return _h.escape(str(s)) if s is not None else ""

def _bullets(bs):
    return "<ul>"+ "".join(f"<li>{b}</li>" for b in bs) +"</ul>" if bs else ""

def _tabela(t):
    if not t: return ""
    head = "".join(f"<th>{esc(h)}</th>" for h in t["head"])
    rows = "".join("<tr>"+"".join(f"<td>{c}</td>" for c in r)+"</tr>" for r in t["rows"])
    return f"<table><thead><tr>{head}</tr></thead><tbody>{rows}</tbody></table>"

def _slide(s, idx, total):
    tp = s["tipo"]; narr = esc(s.get("narr",""))
    foot = ('<div class="foot"><span><span class="lzm"><span>GD</span></span> Escola de Obra · Padrão Diamante</span>'
            f'<span>{idx}/{total}</span></div>')
    if tp=="capa":
        return (f'<section class="slide capa on" data-narr="{narr}">'
                f'<div class="lz"><span>GD</span></div>'
                f'<h1 class="serif">{esc(s["titulo"])}</h1>'
                f'<div class="sub">{esc(s.get("sub",""))}</div>'
                f'<div class="autor">{s.get("autor","")}</div>{foot}</section>')
    if tp=="modulo":
        return (f'<section class="slide mod" data-narr="{narr}">'
                f'<div class="num">{esc(s["num"])}</div><h1 class="serif">{esc(s["titulo"])}</h1>'
                f'<div class="min">{esc(s.get("min",""))}</div>{foot}</section>')
    if tp=="quiz":
        alts=""
        for k,a in enumerate(s["alts"]):
            ok="ok" if k==s["correta"] else ""
            alts+=f'<div class="alt {ok}"><span class="k">{chr(65+k)}</span><span>{a}</span></div>'
        return (f'<section class="slide quiz" data-narr="{narr}">'
                f'<div class="kick">{esc(s["titulo"])}</div>'
                f'<div class="q serif">{esc(s["q"])}</div>{alts}'
                f'<div class="coment"><b>Comentário:</b> {s.get("coment","")}</div>{foot}</section>')
    if tp=="fim":
        blocos = ('<div style="margin-top:2vh;text-align:left">'+_bullets(s["bullets"])+'</div>') if s.get("bullets") else ""
        return ('<section class="slide capa" data-narr="'+narr+'">'
                '<div class="lz"><span>GD</span></div>'
                '<h1 class="serif">'+esc(s["titulo"])+'</h1>'
                +blocos+foot+'</section>')
    # conteudo
    parts=[]
    if s.get("kick"): parts.append(f'<div class="kick">{esc(s["kick"])}</div>')
    parts.append(f'<h2 class="serif">{esc(s["titulo"])}</h2>')
    if s.get("sub"): parts.append(f'<div class="sub">{esc(s["sub"])}</div>')
    body="<div class='body'>"
    if s.get("bullets"): body+=_bullets(s["bullets"])
    if s.get("tabela"): body+=_tabela(s["tabela"])
    if s.get("foto"): body+=f'<div class="foto">[FOTO DO ACERVO: {esc(s["foto"])}]</div>'
    if s.get("norma"): body+=f'<div class="norma">{s["norma"]}</div>'
    if s.get("mestre"): body+=f'<div class="mestre">🔑 <b>Segredo do Mestre.</b> {s["mestre"]}</div>'
    if s.get("validar"): body+=f'<div class="validar">⚠️ {s["validar"]}</div>'
    body+="</div>"
    parts.append(body)
    return f'<section class="slide" data-narr="{narr}">'+"".join(parts)+foot+'</section>'

def render(titulo, sub, slides, out_path):
    total=len(slides)
    secs="".join(_slide(s, k+1, total) for k,s in enumerate(slides))
    # roteiro impresso
    rp="".join(f'<div class="rp"><span class="n">{k+1}</span> <b>{esc(s.get("titulo") or s.get("num") or "Slide")}</b> — {s.get("narr","")}</div>' for k,s in enumerate(slides))
    doc=f"""<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{esc(titulo)} — Slides · Escola de Obra</title>
<style>{CSS}</style></head><body>
<div class="hint">← → navega · <b>R</b> roteiro · <b>F</b> tela cheia · imprimir = roteiro de narração</div>
<div id="bar"><button onclick="toggleTP()">🎙️ Roteiro (R)</button><button onclick="fs()">⛶ Tela cheia (F)</button><button onclick="window.print()">🖨️ Imprimir roteiro</button></div>
<div class="stage"><div class="deck">{secs}</div></div>
<div id="nav"><button onclick="prev()">‹</button><span id="count"></span><button onclick="next()">›</button></div>
<div id="tp"><div class="lab">🎙️ Roteiro de narração — leia enquanto grava</div><div id="tptext"></div></div>
<div class="roteiro-print"><h2>Roteiro de narração completo — {esc(titulo)}</h2>{rp}</div>
<script>{JS}</script>
</body></html>"""
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    with open(out_path,"w",encoding="utf-8") as f: f.write(doc)
    print(f"SLIDES: {out_path}  ({total} slides, {len(doc)} bytes)")
    return out_path
