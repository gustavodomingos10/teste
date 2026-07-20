# 🏗️ Escola de Obra — Projeto Diamante

> Linha educacional da **GD Engenharia e Perícia** ([engenhariagd.com.br](https://engenhariagd.com.br))
> Assinatura da marca: **Padrão Diamante — o rigor de quem assina.**

Esta pasta contém a **esteira completa de 10 cursos premium** para engenheiros civis
recém-formados, construída no padrão Diamante v3.0. Ao contrário de uma pilha de PDFs
soltos, aqui está tudo o que o instrutor **Gustavo Domingos** precisa para gravar,
montar e lançar — do catálogo estratégico aos arquivos prontos para publicar.

O curso piloto entregue por completo é **Diagnóstico de Fissuras e Trincas**.

---

## Como navegar

| Pasta | O que contém |
|---|---|
| `00-projeto/` | Fonte da verdade do projeto: controle de qualidade (`VALIDAR.md`), progresso, pedido de material ao instrutor e tokens da marca. |
| `01-estrategia/` | Pesquisa de mercado, catálogo dos 10 cursos, oferta do combo e justificativa do piloto. |
| `02-curso-piloto/` | O curso de Fissuras e Trincas inteiro: arquitetura, roteiros do Módulo de Ouro, banco de quizzes e o **Kit Diamante** (8 entregáveis construídos e testados). |
| `03-lancamento/` | Tudo entre os arquivos e o caixa: plano de gravação, copy, e-mails, WhatsApp, reels, plano de 3 fases e checklist de publicação. |
| `acervo/` | **Onde o instrutor deposita as fotos/vídeos reais** de obra. Convenção de nomes em `00-projeto/PEDIDO-DE-MATERIAL.md`. |
| `_build/` | Scripts geradores (planilha, PDFs, docx). Não é entregável — é a "fábrica". |

---

## Ordem de leitura recomendada (para o instrutor)

1. **`00-projeto/VALIDAR.md`** — a lista do que só você (engenheiro) pode confirmar/assinar. É o coração do controle de qualidade. **Nada publica com pendência aberta.**
2. **`00-projeto/PEDIDO-DE-MATERIAL.md`** — as fotos e vídeos que você precisa buscar no seu acervo, aula por aula.
3. **`01-estrategia/catalogo-10-cursos.md`** — a esteira inteira num relance.
4. **`02-curso-piloto/arquitetura.md`** — o curso piloto explicado como um videomaker leria.
5. **`02-curso-piloto/kit/`** — abra os arquivos: planilha, checklist, ferramenta interativa, apostila.
6. **`03-lancamento/`** — quando decidir lançar.

---

## Regra de ouro do projeto

> Tudo o que é afirmado sobre o instrutor sai **exclusivamente** de `00-projeto/` (Bloco 0).
> Biografia inventada é proibida. A autoridade deste produto vem de credenciais reais e
> verificáveis — CREA-PR 140.964-D, CREA-SP 5071652757, perito judicial atuante — e é isso
> que o separa de "curso de guru".

## Padrão de execução

Os materiais do Kit **não são descritos — são construídos, testados e versionados**.
Especificação sem arquivo funcionando é etapa incompleta.

---

## Convenções técnicas

- **Nomes de arquivo:** kebab-case, sem acentos ou espaços (`checklist-fissuras-a4.pdf`).
- **Planilhas:** `.xlsx` via openpyxl, fórmulas em sintaxe internacional (o Excel PT-BR converte a exibição).
- **PDFs:** compostos em HTML+CSS de impressão e convertidos com Chromium headless.
- **Ferramenta interativa:** HTML5 único, mobile-first, funciona offline, sem coleta de dados no modo aluno.
- **Versionamento:** um commit por etapa, mensagem descritiva.

## Como regenerar os arquivos binários do Kit

```bash
cd escola-de-obra/_build
python3 gerar_planilha.py       # -> kit/planilha/planilha-fissuras.xlsx
python3 gerar_relatorio.py      # -> kit/relatorio/relatorio-blindado-fissuras.docx
bash   gerar_pdfs.sh            # -> todos os PDFs (checklist, guia, ebook, apostila, fluxograma)
```

*Escola de Obra — Padrão Diamante: o rigor de quem assina.*
