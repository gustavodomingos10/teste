# 🔬 RELATÓRIO DE QA — Kit Diamante (Curso 3: Receber e Liberar Concreto)

Evidência de que os 8 entregáveis **foram construídos, abrem e funcionam**. Reproduzíveis por `../../_build/`.

**Ambiente:** Python 3.11 (openpyxl, python-docx, markdown, formulas), Node 22, Chromium headless, mermaid-cli.

## Resumo — 8/8 entregáveis OK
| # | Entregável | Arquivos | Teste | Status |
|---|---|---|---|---|
| 1 | Checklist de Recebimento | `checklist/…html`, `-a4.pdf`, `-a5.pdf` | PDFs gerados; 14 itens c/ critério + norma | ✅ |
| 2 | Planilha de Controle (Recebimento + CPs) | `planilha/planilha-concreto.xlsx` + `casos-de-teste.md` | **6 casos avaliados com engine de fórmulas (incl. aritmética de horários): 6/6 + Dashboard ✔** | ✅ |
| 3 | Registro de Concretagem Blindado | `relatorio/registro-concretagem.docx` + `.html` + `.pdf` | docx (8 seções, 4 tabelas); PDF gerado | ✅ |
| 4 | Guia de Bolso (8 minutos) | `guia-bolso/…html` + `.pdf` | PDF vertical (90×160mm), 5 págs | ✅ |
| 5 | Fluxograma aceitar/corrigir/recusar | `fluxograma/…mmd` + `.svg` + `.pdf` | SVG via mermaid-cli; PDF gerado | ✅ |
| 6 | Mini e-book "Histórias — Concreto" | `ebook/…md` + `.html` + `.pdf` | 10 relatos N1/N2/N3; PDF 4 págs | ✅ |
| 7 | ⭐ Simulador de Recebimento | `ferramenta/simulador-recebimento-PRO.html` + `-LITE.html` | **motor testado (Node): 9/9 ✔**; render headless OK | ✅ |
| 8 | Apostila Diamante | `apostila/…html` + `.pdf` | PDF 8 págs, padrão editorial GD | ✅ |

## Testes com lógica
- **Planilha** (`python3 _build/testar_planilha_concreto.py`): tempo decorrido a partir de horários
  reais, veredito (LIBERADO / CORRIGIR VIA CENTRAL / RECUSAR-tempo / RECUSAR-fluido), triagem de CPs
  e Dashboard — **6/6 ✔**.
- **Simulador** (`node _build/testar_ferramenta_concreto.js`): 9 combinações (ok, nota divergente,
  tempo estourado, fluido, seco→central, procedimento incompleto, aspecto anormal, pressão de água,
  seco+relógio apertado) — **9/9 ✔**.

## Rigor normativo (verificado na redação)
- **NBR 12655:2022** (aceitação provisória/definitiva) · **NBR 7212:2021** (tempos-limite, tolerâncias, redosagem — `[VALIDAR F2/F4/F5]`) ·
  **NBR 16889:2020** (slump; substituiu a NM 67) · **NBR 5738:2015/5739** (CPs) · **NBR 8953** (classes) ·
  **NBR 14931:2023** (cura) · **NBR 7680-1:2015** (extração — `[VALIDAR F10]`).
- **Alçada:** aluno decide a aceitação do concreto **fresco**; decisões estruturais (fck não atendido) são do RT/projetista.
- Conexões da esteira: fundações (Curso 2) → recebimento (Curso 3) → fissuras/cura (Curso 5) explicitadas.

## Reproduzir
```bash
cd escola-de-obra/_build
python3 gerar_planilha_concreto.py && python3 testar_planilha_concreto.py   # 6/6
python3 gerar_ferramenta_concreto.py && node testar_ferramenta_concreto.js  # 9/9
python3 gerar_registro_concreto.py
bash gerar_pdfs_concreto.sh
```

## Pendências (bloqueiam a PUBLICAÇÃO, não a montagem)
- 🟡 `[FOTO DO ACERVO]` → fotos reais (`../PEDIDO-DE-MATERIAL.md`).
- 🟡 VALIDAR seção F: tempos-limite/condições (F2), tolerância de slump (F4), condições de redosagem (F5), amostragem (F7), NBR 7680-1:2015/13208 (F10/E8).

**Conclusão:** nada "especificado mas não construído"; os dois componentes com lógica testados com resultados corretos.
