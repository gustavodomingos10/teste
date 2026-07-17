# 🏗️ Curso 2 — Tipos de Fundações e Quando Usar Cada Uma

**Da sondagem à escolha certa — rasa ou profunda, sem chute.**
Segundo curso completo da esteira Escola de Obra (Fase A — Executar bem), no Padrão Diamante.

## Como navegar
| Pasta / arquivo | Conteúdo |
|---|---|
| `arquitetura.md` | O curso inteiro: 4 módulos, objetivo terminal, arco narrativo, mapa de aulas. |
| `roteiros/modulo-ouro/` | Módulo de Ouro (M4 — "A decisão") roteirizado: 6 aulas gravaveis. |
| `quizzes/estrutura-banco.md` | 5 questões por módulo + quiz final, com gabarito. |
| `kit/` | **Kit Diamante** — 8 entregáveis construídos e testados (ver `kit/RELATORIO-QA.md`). |
| `lancamento/copy.md` | Copy de vendas específica (infra de e-mails/WhatsApp compartilhada com o piloto). |
| `PEDIDO-DE-MATERIAL.md` | Fotos do acervo por aula. |
| `acervo/` | Onde o instrutor deposita as fotos reais. |

## Kit Diamante (8/8, testados)
Checklist de liberação · **Planilha Seletor/Comparador (testes 4/4)** · Parecer blindado (Word+PDF) ·
Guia de bolso · Fluxograma de decisão (mmd+svg+pdf) · e-book · **Seletor Interativo PRO+LITE (testes 8/8)** · Apostila.

## Rigor
Definições rasa/profunda pela **NBR 6122**; SPT **NBR 6484**; provas de carga **NBR 6489/12131/16903**;
concreto **NBR 6118**. Valores no `../00-projeto/VALIDAR.md` (seção E). **A escolha e o dimensionamento
finais são do projetista de fundações/geotécnico** — o curso ensina o júnior a ler, triar, encaminhar e fiscalizar.

## Regenerar binários do Kit
```bash
cd ../_build
python3 gerar_planilha_fundacoes.py && python3 testar_planilha_fundacoes.py
python3 gerar_ferramenta_fundacoes.py && node testar_ferramenta_fundacoes.js
python3 gerar_parecer_fundacoes.py
bash gerar_pdfs_fundacoes.sh
```
