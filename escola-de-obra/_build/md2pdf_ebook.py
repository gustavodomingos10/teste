#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Converte o e-book markdown em HTML diagramado (capa + estilo de marca) e salva o HTML.
A conversão para PDF é feita pelo html2pdf.sh no gerar_pdfs.sh."""
import os, markdown
BASE = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
SRC = os.path.join(BASE,"02-curso-piloto","kit","ebook","historias-reais-de-obra.md")
OUT = os.path.join(BASE,"02-curso-piloto","kit","ebook","historias-reais-de-obra.html")

raw = open(SRC, encoding="utf-8").read()
# remove o H1 (vira capa) e a primeira linha de marca
body_md = raw.split("\n",1)[1]
html_body = markdown.markdown(body_md, extensions=["extra","sane_lists"])

CSS = """
:root{--verde:#0E3A34;--vmed:#1C5A4E;--creme:#F5EFE0;--creme2:#FBF8F0;--dour:#C9A24B;--dour2:#E3C97E;--carvao:#20211E;--cinza:#6B6B63;}
@page{size:A5;margin:14mm 13mm;}
*{box-sizing:border-box;}
html,body{margin:0;padding:0;}
body{font-family:Georgia,'Times New Roman',serif;color:var(--carvao);font-size:11px;line-height:1.55;
-webkit-print-color-adjust:exact;print-color-adjust:exact;background:#fff;}
.cover{background:var(--verde);color:var(--creme);height:calc(297mm/2 - 0mm);min-height:180mm;display:flex;flex-direction:column;
justify-content:center;align-items:center;text-align:center;padding:20px;page-break-after:always;margin:-14mm -13mm 0;}
.cover .lz{width:60px;height:60px;background:var(--dour);color:var(--verde);transform:rotate(45deg);display:flex;
align-items:center;justify-content:center;font-weight:800;font-size:20px;margin-bottom:22px;}
.cover .lz span{transform:rotate(-45deg);}
.cover h1{font-family:Georgia,serif;font-size:30px;margin:0 0 10px;color:var(--creme);line-height:1.1;}
.cover .sub{color:var(--dour2);font-size:12px;letter-spacing:.05em;}
.cover .foot{margin-top:30px;font-size:9px;color:#cdbd8e;}
h2{font-family:Georgia,serif;color:var(--verde);font-size:16px;margin:18px 0 6px;padding-bottom:3px;border-bottom:2px solid var(--dour);page-break-after:avoid;}
h1{display:none;}
p{margin:6px 0;}
strong{color:var(--vmed);}
blockquote{background:var(--creme2);border-left:4px solid var(--dour);margin:10px 0;padding:8px 14px;font-size:10.5px;color:#333;}
blockquote strong{color:var(--verde);}
code{font-family:'Courier New',monospace;font-size:9.5px;background:#eee7d3;color:var(--vmed);padding:1px 3px;border-radius:2px;}
hr{border:none;border-top:1px solid var(--dour);margin:14px 0;}
.wm{font-size:8px;color:var(--cinza);text-align:center;margin-top:8px;}
"""

html = f"""<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">
<title>Histórias Reais de Obra — Fissuras e Trincas — Escola de Obra</title>
<style>{CSS}</style></head><body>
<div class="cover">
  <div class="lz"><span>GD</span></div>
  <h1>Histórias Reais<br>de Obra</h1>
  <div class="sub">Fissuras &amp; Trincas — 10 relatos baseados em situações reais recorrentes</div>
  <div class="foot">Escola de Obra · Padrão Diamante<br>GD Engenharia e Perícia<br><br>
  Revisado e assinado por Gustavo Domingos — Eng. Civil, CREA-PR 140.964-D</div>
</div>
{html_body}
<p class="wm">Cenários ilustrativos baseados em situações recorrentes (N1). Fotos do acervo a inserir (N2). Nada publicado como caso real sem confirmação (N3).</p>
</body></html>"""

open(OUT,"w",encoding="utf-8").write(html)
print("EBOOK HTML:", OUT, f"({len(html)} bytes)")
