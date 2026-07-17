# 🔬 RELATÓRIO DE QA — Kit Diamante (Curso 2: Tipos de Fundações)

Evidência de que os 8 entregáveis **foram construídos, abrem e funcionam**. Reproduzíveis pelos
scripts em `../../_build/`.

**Data da QA:** fase do Kit · **Ambiente:** Python 3.11 (openpyxl, python-docx, markdown, formulas), Node 22, Chromium headless, mermaid-cli.

## Resumo — 8/8 entregáveis OK
| # | Entregável | Arquivos | Teste | Status |
|---|---|---|---|---|
| 1 | Checklist de liberação de fundação | `checklist/…html`, `-a4.pdf`, `-a5.pdf` | PDFs gerados (A4/A5), 15 itens c/ critério + norma | ✅ |
| 2 | Planilha Seletor/Comparador | `planilha/planilha-fundacoes.xlsx` + `casos-de-teste.md` | **4 casos avaliados com engine de fórmulas: 4/4 + Dashboard ✔** | ✅ |
| 3 | Parecer de Fundação (blindado) | `relatorio/parecer-fundacao.docx` + `.html` + `.pdf` | docx (9 seções, 2 tabelas); PDF gerado | ✅ |
| 4 | Guia de Bolso (tipos + quando) | `guia-bolso/…html` + `.pdf` | PDF vertical (90×160mm), 5 págs | ✅ |
| 5 | Fluxograma de decisão rasa × profunda | `fluxograma/…mmd` + `.svg` + `.pdf` | SVG via mermaid-cli (137 KB); PDF gerado | ✅ |
| 6 | Mini e-book "Histórias de Obra — Fundações" | `ebook/…md` + `.html` + `.pdf` | 10 relatos N1/N2/N3; PDF 4 págs | ✅ |
| 7 | ⭐ Seletor Interativo de Fundação | `ferramenta/seletor-fundacao-PRO.html` + `-LITE.html` | **motor testado (Node): 8/8 ✔**; render headless OK | ✅ |
| 8 | Apostila Diamante | `apostila/…html` + `.pdf` | PDF 9 págs, padrão editorial GD | ✅ |

## Testes com lógica (os dois componentes "vivos")
- **Planilha** (`python3 _build/testar_planilha_fundacoes.py`): triagem RASA/PROFUNDA/ZONA CINZENTA,
  tipos candidatos e alertas (NA, vizinhança, carga) — 4/4 casos + Dashboard (1/2/1) ✔.
- **Seletor interativo** (`node _build/testar_ferramenta_fundacoes.js`): 8 combinações
  (sem sondagem→exigir SPT; rasa; profunda; vizinho→hélice/escavada; zona cinzenta; NA alto;
  divisa→associada/alavancada; acesso→raiz/Strauss) — 8/8 ✔.

## Rigor normativo (verificado na redação)
- Definições rasa/profunda **pela NBR 6122** (rasa < 2× menor dimensão; profunda > 8× e ≥ 3 m) — E1/E2.
- SPT: **NBR 6484**; provas de carga: **NBR 6489** (direta), **NBR 12131** (estacas), **NBR 16903** (profunda); concreto: **NBR 6118**.
- **Regra de alçada** repetida em todo o material: a escolha e o dimensionamento finais são do
  projetista de fundações/geotécnico; o júnior lê, tria, encaminha e fiscaliza.
- Valores/faixas com fonte ou marcador `[VALIDAR]` (ver `../../00-projeto/VALIDAR.md` seção E).

## Reproduzir
```bash
cd escola-de-obra/_build
python3 gerar_planilha_fundacoes.py && python3 testar_planilha_fundacoes.py   # 4/4
python3 gerar_ferramenta_fundacoes.py && node testar_ferramenta_fundacoes.js  # 8/8
python3 gerar_parecer_fundacoes.py                                            # parecer .docx
bash gerar_pdfs_fundacoes.sh                                                   # todos os PDFs
```

## Pendências (não bloqueiam a montagem; bloqueiam a PUBLICAÇÃO)
- 🟡 Substituir os `[FOTO DO ACERVO: ...]` por registros reais (`../PEDIDO-DE-MATERIAL.md`).
- 🟡 Confirmar/assinar os valores 🟡 do `VALIDAR.md` seção E (limiares, faixas N-SPT, NBR 13208).
- 🟡 Confirmar edições vigentes das NBR na data da gravação.

**Conclusão:** nada "especificado mas não construído". Os dois componentes com lógica foram testados
com resultados corretos; todos os arquivos abrem e funcionam.
