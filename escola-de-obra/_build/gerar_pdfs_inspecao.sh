#!/usr/bin/env bash
# Gera todos os PDFs do Kit de Inspeção (Curso 4) — Chromium headless, offline.
set -euo pipefail
DIR="$(cd "$(dirname "$0")" && pwd)"
K="$DIR/../06-curso-inspecao/kit"
H2P="$DIR/html2pdf.sh"

# E-book: markdown -> HTML diagramado
python3 - "$K/ebook/historias-inspecao.md" "$K/ebook/historias-inspecao.html" <<'PY'
import markdown, sys
src, out = sys.argv[1], sys.argv[2]
raw = open(src, encoding="utf-8").read()
body = markdown.markdown(raw.split("\n",1)[1], extensions=["extra","sane_lists"])
CSS=""":root{--verde:#0E3A34;--vmed:#1C5A4E;--creme:#F5EFE0;--creme2:#FBF8F0;--dour:#C9A24B;--dour2:#E3C97E;--carvao:#20211E;--cinza:#6B6B63;}
@page{size:A5;margin:14mm 13mm;}*{box-sizing:border-box;}html,body{margin:0;padding:0;}
body{font-family:Georgia,serif;color:var(--carvao);font-size:11px;line-height:1.55;-webkit-print-color-adjust:exact;print-color-adjust:exact;background:#fff;}
.cover{background:var(--verde);color:var(--creme);min-height:180mm;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;padding:20px;page-break-after:always;margin:-14mm -13mm 0;}
.cover .lz{width:60px;height:60px;background:var(--dour);color:var(--verde);transform:rotate(45deg);display:flex;align-items:center;justify-content:center;font-weight:800;font-size:20px;margin-bottom:22px;}.cover .lz span{transform:rotate(-45deg);}
.cover h1{font-family:Georgia,serif;font-size:28px;margin:0 0 10px;color:var(--creme);line-height:1.1;}.cover .sub{color:var(--dour2);font-size:11px;}.cover .foot{margin-top:30px;font-size:9px;color:#cdbd8e;}
h2{font-family:Georgia,serif;color:var(--verde);font-size:15px;margin:18px 0 6px;padding-bottom:3px;border-bottom:2px solid var(--dour);page-break-after:avoid;}h1{display:none;}
p{margin:6px 0;}strong{color:var(--vmed);}blockquote{background:var(--creme2);border-left:4px solid var(--dour);margin:10px 0;padding:8px 14px;font-size:10.5px;color:#333;}blockquote strong{color:var(--verde);}
code{font-family:'Courier New',monospace;font-size:9.5px;background:#eee7d3;color:var(--vmed);padding:1px 3px;border-radius:2px;}hr{border:none;border-top:1px solid var(--dour);margin:14px 0;}.wm{font-size:8px;color:var(--cinza);text-align:center;margin-top:8px;}"""
html=f"""<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>Histórias Reais de Obra — Inspeção</title><style>{CSS}</style></head><body>
<div class="cover"><div class="lz"><span>GD</span></div><h1>Histórias Reais<br>de Obra</h1><div class="sub">Inspeção — 10 relatos baseados em situações reais recorrentes</div>
<div class="foot">Escola de Obra · Padrão Diamante<br>GD Engenharia e Perícia<br><br>Revisado e assinado por Gustavo Domingos — Eng. Civil, CREA-PR 140.964-D</div></div>
{body}
<p class="wm">Cenários ilustrativos baseados em situações reais recorrentes (N1). Fotos do acervo a inserir (N2). Nada publicado como caso específico sem confirmação (N3).</p></body></html>"""
open(out,"w",encoding="utf-8").write(html); print("ebook html ok")
PY

bash "$H2P" "$K/checklist/checklist-liberacao.html" "$K/checklist/checklist-liberacao-a4.pdf"
sed 's/size:A4/size:A5/' "$K/checklist/checklist-liberacao.html" > /tmp/cki-a5.html
bash "$H2P" /tmp/cki-a5.html "$K/checklist/checklist-liberacao-a5.pdf"
bash "$H2P" "$K/guia-bolso/guia-bolso-inspecao.html" "$K/guia-bolso/guia-bolso-inspecao.pdf"
bash "$H2P" "$K/ebook/historias-inspecao.html" "$K/ebook/historias-inspecao.pdf"
bash "$H2P" "$K/apostila/apostila-inspecao.html" "$K/apostila/apostila-inspecao.pdf"
bash "$H2P" "$K/relatorio/termo-liberacao.html" "$K/relatorio/termo-liberacao.pdf"
echo "== PDFs do Kit de Inspeção gerados =="
echo "(fluxograma: SVG via mermaid-cli + wrapper A3 — ver RELATORIO-QA)"
