# 🧪 Casos de Teste — Planilha de Controle de Concreto

Casos **injetados e avaliados com motor real de fórmulas** (lib `formulas`).
Script: `../../../_build/testar_planilha_concreto.py`. **Resultado: 4 caminhões + 2 CPs + Dashboard ✔.**

> Reproduzir: `cd _build && python3 gerar_planilha_concreto.py && python3 testar_planilha_concreto.py`

## Parâmetros (aba Parametros)
Slump pedido **100 mm** · tolerância **±20 mm** `[VALIDAR F4]` · tempo-limite **150 min** `[VALIDAR F2]` · fck **30 MPa**.

## Lógica testada
- **Tempo decorrido** = (fim descarga − hora da água) × 1440 (minutos).
- **Veredito**: RECUSAR/REGISTRAR se nota não confere, aspecto anormal ou água adicionada; RECUSAR-tempo se decorrido > limite; LIBERADO se |slump−pedido| ≤ tolerância; CORRIGIR VIA CENTRAL se seco; RECUSAR-fluido se acima.
- **CPs (triagem)**: OK se resultado ≥ fck; ALERTA (aplicar critérios NBR 12655:2022 / acionar RT) caso contrário.

## Resultados
| Caso | Entrada | Tempo | Veredito | ✔ |
|---|---|---|---|---|
| NF-1 | água 10:00 → fim 11:30, slump 105 | 90 min | **LIBERADO** | ✔ |
| NF-2 | água 10:00 → fim 13:00, slump 100 | 180 min | **RECUSAR - tempo** | ✔ |
| NF-3 | slump 70 (seco) | 60 min | **CORRIGIR VIA CENTRAL** | ✔ |
| NF-4 | slump 150 (fluido) | 60 min | **RECUSAR - fluido** | ✔ |
| CP-1 | 32,5 MPa | — | **OK (≥ fck)** | ✔ |
| CP-2 | 26,0 MPa | — | **ALERTA: critérios NBR 12655:2022 / RT** | ✔ |

**Dashboard:** Caminhões 4 · Liberados 1 · Corrigir 1 · Recusados 2 · CPs 2 (1 OK / 1 alerta) — tudo ✔.

## Recursos validados na geração
4 abas (Parametros, Recebimento, CPs, Dashboard) · fórmulas de tempo com horários reais (hh:mm) ·
validação de dados (Sim/Não) · formatação condicional (verde/amarelo/vermelho) · painéis congelados.

> ⚠️ A coluna "situação" dos CPs é **triagem de alerta** — a aceitação definitiva segue os critérios
> estatísticos da **NBR 12655:2022**, aplicados pelo responsável técnico. Planilha entregue vazia ao aluno.
