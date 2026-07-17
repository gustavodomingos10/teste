# 🏗️ Curso 4 — Inspeção de Serviços Críticos

**Forma, armação, escoramento e alvenaria — pegue o erro enquanto dá para corrigir.**
Quarto curso completo da esteira — **fecha a Fase A (Executar bem)**, no Padrão Diamante.

## Conexões da esteira
**← Curso 3 (Concreto):** lá o material (o caminhão), aqui o serviço que o recebe — este checklist é o
"pare e confira" que antecede os 8 minutos. **→ Curso 5 (Fissuras):** vergas ↔ fissura de canto;
encunhamento ↔ fissura horizontal. **→ Curso 6 (Patologias):** cobrimento ↔ corrosão.

## Como navegar
| Pasta / arquivo | Conteúdo |
|---|---|
| `arquitetura.md` | 4 módulos (2h40), objetivo terminal, arco, mapa de aulas. |
| `roteiros/modulo-ouro/` | M2 "A liberação de concretagem" — 7 aulas gravaveis. |
| `quizzes/estrutura-banco.md` | 5 questões/módulo + quiz final. |
| `kit/` | Kit Diamante 8/8 testado (`kit/RELATORIO-QA.md`). |
| `lancamento/copy.md` | Copy específica (infra compartilhada em `../03-lancamento/`). |
| `PEDIDO-DE-MATERIAL.md` | Fotos do acervo por aula. |

## Kit Diamante (8/8, testados)
Checklist Mestre de Liberação · **Planilha de Inspeção (testes 5/5 + veredito global)** · Termo de
Liberação (Word+PDF) · Guia de bolso · Fluxograma A3 (mmd+svg+pdf) · e-book ·
**Liberador de Concretagem PRO+LITE (testes 8/8)** · Apostila.

## Rigor
**NBR 14931:2023** (execução/tolerâncias) · **NBR 6118:2023 Tab. 7.2** (cobrimentos) · **NBR 15696:2009**
(fôrmas/escoramentos) · **NBR 8545:1984** (alvenaria) · **NR-18/35**. Valores em `../00-projeto/VALIDAR.md`
seção G. Alçada: o aluno libera/trava **conforme o projeto**; alterações são do projetista; prazos de
desforma vêm do plano do RT.

## Regenerar binários
```bash
cd ../_build
python3 gerar_planilha_inspecao.py && python3 testar_planilha_inspecao.py
python3 gerar_ferramenta_inspecao.py && node testar_ferramenta_inspecao.js
python3 gerar_termo_inspecao.py
bash gerar_pdfs_inspecao.sh
```
