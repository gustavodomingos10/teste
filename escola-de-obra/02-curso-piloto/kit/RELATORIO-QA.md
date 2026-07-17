# 🔬 RELATÓRIO DE QA — Kit Diamante (Curso Fissuras e Trincas)

Evidência de que os 8 entregáveis do Kit **foram construídos, abrem e funcionam** — não apenas
descritos. Todos os artefatos são reproduzíveis pelos scripts em `../../_build/`.

**Data da QA:** Etapa 4 · **Ambiente:** Python 3.11 (openpyxl, python-docx, markdown, formulas),
Node 22, Chromium headless (HTML→PDF), mermaid-cli (fluxograma).

---

## Resumo — 8/8 entregáveis OK

| # | Entregável | Arquivos | Teste executado | Status |
|---|---|---|---|---|
| 1 | Checklist de Inspeção | `checklist/checklist-fissuras.html`, `-a4.pdf`, `-a5.pdf` | PDFs gerados (A4 e A5), 2 págs, marca e campos renderizados | ✅ |
| 2 | Planilha Inteligente | `planilha/planilha-fissuras.xlsx` + `casos-de-teste.md` | 3 casos injetados e **avaliados com engine de fórmulas**: 3/3 + Dashboard ✔ | ✅ |
| 3 | Relatório Blindado | `relatorio/…docx` + `…html` + `…pdf` | docx aberto (9 seções, 3 tabelas); PDF gerado | ✅ |
| 4 | Guia de Bolso | `guia-bolso/…html` + `…pdf` | PDF vertical (90×160mm), 5 págs | ✅ |
| 5 | Fluxograma de Decisão | `fluxograma/…mmd` + `…svg` + `…pdf` | SVG renderizado via mermaid-cli (120 KB); PDF gerado | ✅ |
| 6 | Mini e-book | `ebook/…md` + `…html` + `…pdf` | markdown → HTML diagramado → PDF (4 págs) | ✅ |
| 7 | ⭐ Ferramenta Interativa | `ferramenta/…-PRO.html`, `…-LITE.html` | **7 casos do motor de diagnóstico testados (Node)**: 7/7 ✔; render headless OK | ✅ |
| 8 | Apostila Diamante | `apostila/…html` + `…pdf` | PDF 11 págs no padrão editorial GD | ✅ |

---

## Detalhe por entregável

### 1. Checklist
- `bash _build/gerar_pdfs.sh` gera A4 e A5 a partir do mesmo HTML (A5 por troca de `@page size`).
- Contém: identificação (obra/data/responsável), 14 itens em 4 seções, **critério de aceitação objetivo + norma de referência** por item, semáforo de prioridade, selo "Revisado e assinado por…".

### 2. Planilha — testada com dados
- **3 abas:** Parametros, Lancamentos, Dashboard.
- **Fórmulas reais** (sintaxe internacional): Δ abertura, Situação (ativa/estável), Gravidade (semáforo), Encaminhamento.
- **Validação de dados** (menus suspensos) em 5 colunas; **formatação condicional** (verde/amarelo/vermelho) na Gravidade; **gráfico de barras** no Dashboard.
- **Teste real:** `python3 _build/testar_planilha.py` → injeta 3 casos, avalia com a lib `formulas`:
  - BAIXA / MÉDIA / ALTA corretos; Encaminhamentos corretos; Dashboard 3/2/1 e 1/1/1. **3/3 ✔.**

### 3. Relatório Blindado
- Word (`python-docx`): 9 seções (identificação, escopo/limitações, metodologia, registro fotográfico 2-colunas, mapa fissuratório, causa raiz, recomendações com prazo/responsável, encaminhamentos, assinatura/CREA).
- PDF equivalente para impressão. Campos preenchíveis destacados em `[colchetes]`.

### 4. Guia de Bolso
- Formato vertical (90×160 mm ≈ 9:16), tipografia legível em tela pequena, tabelas com **fonte normativa**, semáforo, capa + 4 páginas de consulta + CTA do curso.

### 5. Fluxograma
- Fonte **Mermaid** editável (`.mmd`) + **SVG** (render fiel via mermaid-cli) + **PDF** com cabeçalho de marca. Nós de decisão sim/não com critério objetivo; **caminho de emergência destacado** em vermelho.

### 6. Mini e-book
- 10 relatos (contexto → erro → consequência → lição), **todos rotulados N1** (cenário ilustrativo), com placeholders `[FOTO DO ACERVO]` (N2) e sem caso/cifra inventada (N3).

### 7. ⭐ Ferramenta Interativa — testada
- **HTML único**, CSS+JS embutidos, **mobile-first**, **offline** (zero requisições externas), sem coleta de dados no modo aluno.
- Duas versões: **PRO** (aluno, 10 cenários, contato VIP) e **LITE** (pública, 3 cenários, CTA + **consentimento LGPD explícito** antes de qualquer contato, sem armazenar dados).
- **Wizard de diagnóstico** (orientação→local→sinais→abertura→evolução) + **Quiz de 10 cenários** com gabarito comentado + **resultado compartilhável** (link `wa.me`), selo GD.
- **Teste real:** `node _build/testar_ferramenta.js` carrega o JS do HTML e valida o motor em 7 combinações (canto, flexão, cisalhamento, recalque, umidade, risco imediato, craquelê/RAA). **7/7 ✔.**
- Render headless (Chromium) confirma que o wizard popula sem erros de JS.

### 8. Apostila
- Padrão editorial GD (capa verde-petróleo, títulos serifados, faixas de módulo, tabelas de normas, boxes "Segredo do Mestre", rodapé com assinatura/CREA).
- Objetivos por módulo, conteúdo dos 4 módulos + Anexos (protocolo de campo, caso guiado, glossário, FAQ, autoavaliação). 11 páginas A4 (crescerá ao inserir as fotos do acervo).

---

## Reproduzir toda a QA

```bash
cd escola-de-obra/_build
python3 gerar_planilha.py   && python3 testar_planilha.py     # planilha + teste (3/3)
python3 gerar_relatorio.py                                    # relatório .docx
python3 gerar_ferramenta.py && node testar_ferramenta.js      # ferramenta + teste (7/7)
bash   gerar_pdfs.sh                                           # todos os PDFs do Kit
```

## Pendências (não bloqueiam a montagem; bloqueiam a PUBLICAÇÃO)
- 🟡 Substituir **todos** os `[FOTO DO ACERVO: ...]` por registros reais (ver `PEDIDO-DE-MATERIAL.md`).
- 🟡 Confirmar/assinar os valores técnicos 🟡 do `VALIDAR.md` (limiares B1/B9, convenção B2, redações B4–B7).
- 🟡 Confirmar redação das credenciais (D1) e substituir o selo textual pelo **logo/selo GD** em PNG.
- 🟡 Reconfirmar link `wa.me` de vendas (CTA público) na publicação.

**Conclusão:** nada "especificado mas não construído". Todos os arquivos abrem e funcionam; os dois
componentes com lógica (planilha e ferramenta) foram testados com resultados corretos.
