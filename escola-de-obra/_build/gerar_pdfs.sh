#!/usr/bin/env bash
# Gera todos os PDFs do Kit a partir dos HTML de impressão (Chromium headless, offline).
set -euo pipefail
DIR="$(cd "$(dirname "$0")" && pwd)"
KIT="$DIR/../02-curso-piloto/kit"
H2P="$DIR/html2pdf.sh"

# E-book: markdown -> HTML diagramado
python3 "$DIR/md2pdf_ebook.py"

# Checklist A4 + A5 (variante troca o tamanho de página)
bash "$H2P" "$KIT/checklist/checklist-fissuras.html" "$KIT/checklist/checklist-fissuras-a4.pdf"
sed 's/size:A4/size:A5/' "$KIT/checklist/checklist-fissuras.html" > /tmp/ck-a5.html
bash "$H2P" /tmp/ck-a5.html "$KIT/checklist/checklist-fissuras-a5.pdf"

# Guia de bolso (vertical)
bash "$H2P" "$KIT/guia-bolso/guia-bolso-fissuras.html" "$KIT/guia-bolso/guia-bolso-fissuras.pdf"

# E-book
bash "$H2P" "$KIT/ebook/historias-reais-de-obra.html" "$KIT/ebook/historias-reais-de-obra.pdf"

# Apostila
bash "$H2P" "$KIT/apostila/apostila-fissuras.html" "$KIT/apostila/apostila-fissuras.pdf"

# Relatório (versão PDF; a versão Word é gerada por gerar_relatorio.py)
bash "$H2P" "$KIT/relatorio/relatorio-blindado-fissuras.html" "$KIT/relatorio/relatorio-blindado-fissuras.pdf"

echo "== Todos os PDFs do Kit gerados =="
