#!/usr/bin/env bash
# Converte um HTML em PDF via Chromium headless (offline, sem CDN).
# Uso: html2pdf.sh entrada.html saida.pdf
set -euo pipefail
CHROME="${CHROME:-/opt/pw-browsers/chromium}"
IN="$1"; OUT="$2"
"$CHROME" --headless --no-sandbox --disable-gpu --disable-dev-shm-usage \
  --no-pdf-header-footer --print-to-pdf-no-header \
  --print-to-pdf="$OUT" "file://$(readlink -f "$IN")" 2>/dev/null || \
"$CHROME" --headless --no-sandbox --disable-gpu \
  --print-to-pdf="$OUT" "file://$(readlink -f "$IN")" 2>/dev/null
echo "OK: $OUT ($(stat -c%s "$OUT") bytes)"
