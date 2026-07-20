# 🧪 Casos de Teste — Planilha de Inspeção Multi-serviço

Casos **injetados e avaliados com motor real de fórmulas** (lib `formulas`).
Script: `../../../_build/testar_planilha_inspecao.py`. **Resultado: 5/5 itens + Dashboard/veredito ✔.**

> Reproduzir: `cd _build && python3 gerar_planilha_inspecao.py && python3 testar_planilha_inspecao.py`

## Lógica testada (aba Inspecao)
- **Situação por item:** `Conforme` → OK · `Pendencia`/`NC critica` reconferida (`Sim`) → RESOLVIDA ·
  `Pendencia` aberta → PENDENTE · `NC critica` aberta → NC CRITICA ABERTA.
- **Veredito global (Dashboard):** TRAVADO se ≥1 NC crítica aberta; LIBERADO COM PENDÊNCIAS se ≥1
  pendente; LIBERADO caso contrário.

## Resultados
| Item | Serviço | Resultado | Reconf. | Situação obtida | ✔ |
|---|---|---|---|---|---|
| Seção 19×40 conferida | Fôrma | Conforme | — | **OK** | ✔ |
| Faltam espaçadores bordo leste | Cobrimento | Pendência | Não | **PENDENTE** | ✔ |
| Sem contraventamento direção Y | Escoramento | NC crítica | Não | **NC CRITICA ABERTA** | ✔ |
| Amarração frouxa — refeita | Armação | Pendência | Sim | **RESOLVIDA** | ✔ |
| Elétrica conferida c/ equipe | Embutidos | Conforme | — | **OK** | ✔ |

**Dashboard:** 5 itens · 2 OK · 1 pendente · 1 NC aberta · 1 resolvida ·
**VEREDITO: "TRAVADO — corrigir NC críticas e reinspecionar" ✔** (a NC de escoramento trava tudo, como deve).

## Recursos validados na geração
2 abas (Inspecao 200 linhas, Dashboard) · validação de dados (serviço, resultado, reconferido) ·
formatação condicional (OK verde / PENDENTE amarelo / NC vermelho / RESOLVIDA azul) · painéis congelados.

> ⚠️ A planilha apoia o Termo de Liberação — não substitui o projeto nem o responsável técnico.
> Entregue vazia ao aluno.
