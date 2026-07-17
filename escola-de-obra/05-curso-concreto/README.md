# 🏗️ Curso 3 — Receber e Liberar Concreto com Critério

**O procedimento de 8 minutos que protege a sua estrutura.**
Terceiro curso completo da esteira (Fase A — Executar bem), no Padrão Diamante.

## Conexões da esteira
**← Curso 2 (Fundações):** a fundação triada lá é concretada aqui. **→ Curso 5 (Fissuras):** concreto
mal recebido/curado vira a fissura que o piloto ensina a diagnosticar. **→ Curso 4 (Inspeção):** lá o
serviço (forma/armação), aqui o material.

## Como navegar
| Pasta / arquivo | Conteúdo |
|---|---|
| `arquitetura.md` | 4 módulos (2h30), objetivo terminal, arco, mapa de aulas. |
| `roteiros/modulo-ouro/` | M2 "A hora do caminhão" — 6 aulas gravaveis. |
| `quizzes/estrutura-banco.md` | 5 questões/módulo + quiz final. |
| `kit/` | Kit Diamante 8/8 testado (`kit/RELATORIO-QA.md`). |
| `lancamento/copy.md` | Copy específica (infra compartilhada em `../03-lancamento/`). |
| `PEDIDO-DE-MATERIAL.md` | Fotos do acervo por aula. |

## Kit Diamante (8/8, testados)
Checklist de Recebimento · **Planilha de Controle (testes 6/6, incl. horários)** · Registro de
Concretagem (Word+PDF) · Guia de bolso · Fluxograma (mmd+svg+pdf) · e-book ·
**Simulador de Recebimento PRO+LITE (testes 9/9)** · Apostila.

## Rigor
**NBR 12655** (aceitação provisória/definitiva) · **NBR 7212** (tempos, tolerâncias, redosagem) ·
**NBR 16889** (slump) · **NBR 5738/5739** (CPs) · **NBR 8953** (classes) · **NBR 14931** (cura) ·
**NBR 7680** (extração). Valores em `../00-projeto/VALIDAR.md` seção F. Alçada: aceitação do fresco
é do aluno; decisões estruturais são do RT/projetista.

## Regenerar binários
```bash
cd ../_build
python3 gerar_planilha_concreto.py && python3 testar_planilha_concreto.py
python3 gerar_ferramenta_concreto.py && node testar_ferramenta_concreto.js
python3 gerar_registro_concreto.py
bash gerar_pdfs_concreto.sh
```
