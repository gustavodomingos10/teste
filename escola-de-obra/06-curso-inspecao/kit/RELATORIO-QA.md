# 🔬 RELATÓRIO DE QA — Kit Diamante (Curso 4: Inspeção de Serviços Críticos)

Evidência de que os 8 entregáveis **foram construídos, abrem e funcionam**. Reproduzíveis por `../../_build/`.

**Ambiente:** Python 3.11 (openpyxl, python-docx, markdown, formulas), Node 22, Chromium headless, mermaid-cli.

## Resumo — 8/8 entregáveis OK
| # | Entregável | Arquivos | Teste | Status |
|---|---|---|---|---|
| 1 | Checklist Mestre de Liberação | `checklist/…html`, `-a4.pdf`, `-a5.pdf` | PDFs gerados; 18 itens em 4 seções c/ critério + norma + campo de veredito | ✅ |
| 2 | Planilha de Inspeção multi-serviço | `planilha/planilha-inspecao.xlsx` + `casos-de-teste.md` | **5 itens avaliados com engine de fórmulas + veredito global: 5/5 ✔** | ✅ |
| 3 | Termo de Liberação Blindado | `relatorio/termo-liberacao.docx` + `.html` + `.pdf` | docx (6 seções, 3 tabelas); PDF gerado | ✅ |
| 4 | Guia de Bolso | `guia-bolso/…html` + `.pdf` | PDF vertical (90×160mm), 5 págs | ✅ |
| 5 | Fluxograma liberar/pendências/travar | `fluxograma/…mmd` + `.svg` + `.pdf` | SVG via mermaid-cli; PDF A3 1 página | ✅ |
| 6 | Mini e-book "Histórias — Inspeção" | `ebook/…md` + `.html` + `.pdf` | 10 relatos N1/N2/N3; PDF 4 págs | ✅ |
| 7 | ⭐ Liberador de Concretagem | `ferramenta/liberador-concretagem-PRO.html` + `-LITE.html` | **motor testado (Node): 8/8 ✔**; render headless OK | ✅ |
| 8 | Apostila Diamante | `apostila/…html` + `.pdf` | PDF 8 págs, padrão editorial GD | ✅ |

## Testes com lógica
- **Planilha** (`python3 _build/testar_planilha_inspecao.py`): situações por item (OK/PENDENTE/NC
  CRITICA ABERTA/RESOLVIDA) e veredito global (TRAVADO com NC aberta) — **5/5 + Dashboard ✔**.
- **Liberador** (`node _build/testar_ferramenta_inspecao.js`): 8 combinações (tudo ok; NC de
  escoramento/cobrimento→TRAVADO; pendências→PENDÊNCIAS; embutidos não conferidos; 2 pendências +
  concretagem hoje→TRAVADO por prazo; NC domina pendência) — **8/8 ✔**.

## Rigor normativo (verificado na redação)
- **NBR 14931:2023** (execução/tolerâncias — `[VALIDAR G1]`) · **NBR 6118:2023 Tab. 7.2** (cobrimentos — `[VALIDAR G2]`) ·
  **NBR 15696:2009** (fôrmas/escoramentos, cargas de referência — `[VALIDAR G4]`) · **NBR 8545:1984** (alvenaria — `[VALIDAR G5]`) ·
  **NR-18/NR-35** (segurança).
- **Alçada:** o aluno compara com o projeto e libera/trava conforme ele; alterações são do projetista.
  Prazos de desforma: **plano do RT**, nunca fixados pelo curso (`[VALIDAR G6]`).
- Conexões da esteira: curso 3 (material × serviço), curso 5 (vergas ↔ fissura de canto; encunhamento ↔ fissura horizontal), curso 6 (cobrimento ↔ corrosão).

## Reproduzir
```bash
cd escola-de-obra/_build
python3 gerar_planilha_inspecao.py && python3 testar_planilha_inspecao.py   # 5/5
python3 gerar_ferramenta_inspecao.py && node testar_ferramenta_inspecao.js  # 8/8
python3 gerar_termo_inspecao.py
bash gerar_pdfs_inspecao.sh
```

## Pendências (bloqueiam a PUBLICAÇÃO, não a montagem)
- 🟡 `[FOTO DO ACERVO]` → fotos reais (`../PEDIDO-DE-MATERIAL.md`).
- 🟡 VALIDAR seção G: tolerâncias (G1), cobrimentos (G2), cargas NBR 15696:2009 (G4), NBR 8545:1984 (G5), redação de desforma (G6), encunhamento (G7).

**Conclusão:** nada "especificado mas não construído"; os dois componentes com lógica testados com resultados corretos.
