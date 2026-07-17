# 🧪 Casos de Teste — Planilha de Monitoramento de Fissuras

Os 3 casos abaixo foram **injetados e avaliados com um motor real de fórmulas de planilha**
(biblioteca `formulas`, que interpreta as fórmulas exatamente como o Excel/LibreOffice fazem).
Script: `../../../_build/testar_planilha.py`. **Resultado: 3/3 casos + Dashboard ✔.**

> Reproduza a qualquer momento: `cd _build && python3 testar_planilha.py`
> (regenere a planilha antes com `python3 gerar_planilha.py`).

## Parâmetros usados (aba Parametros)
- Limiar de atividade: **0,10 mm** (Δ de abertura que caracteriza fissura ATIVA) — `[VALIDAR B9]`
- Limite de abertura w_k: **0,30 mm** (referência NBR 6118:2023, CAA II/III) — `[VALIDAR B1]`

## Lógica testada (aba Lancamentos)
- **Situação** `J` = `ATIVA` se `|Δ| ≥ limiar`, senão `ESTAVEL`.
- **Gravidade** `N`: `ALTA` se risco imediato = Sim **ou** (origem estrutural {Cisalhamento, Recalque diferencial} **e** ATIVA); `MEDIA` se ATIVA **ou** abertura > w_k; senão `BAIXA`.
- **Encaminhamento** `O`: derivado da gravidade (ALTA→escorar/interditar+calculista; MEDIA→tratar+monitorar; BAIXA→monitorar).

## Resultados

| Caso | Entrada (ini→atual mm, origem, risco) | Situação | Gravidade | Encaminhamento | ✔ |
|---|---|---|---|---|---|
| 1 | 0,25 → 0,28 · canto · risco Não | **ESTAVEL** | **BAIXA** | Monitorar e registrar | ✔ |
| 2 | 0,20 → 0,45 · retração · risco Não | **ATIVA** | **MEDIA** | Tratar a causa + monitorar | ✔ |
| 3 | 0,50 → 0,90 · recalque diferencial · risco Não | **ATIVA** | **ALTA** | Escorar/interditar e acionar calculista | ✔ |

**Cobertura dos ramos de decisão:**
- Caso 1 exercita o ramo "estável + fina" → BAIXA.
- Caso 2 exercita "ativa por crescimento (Δ=0,25 ≥ 0,10)" → MEDIA.
- Caso 3 exercita "origem estrutural (recalque) + ativa" → ALTA **sem** depender do campo de risco imediato (ramo mais difícil).
- (Ramo adicional coberto pela lógica: risco imediato = "Sim" força ALTA — verificável trocando `M` para `Sim`.)

## Dashboard (agregação automática)
| Métrica | Obtido | Esperado | ✔ |
|---|---|---|---|
| Total de fissuras | 3 | 3 | ✔ |
| Ativas | 2 | 2 | ✔ |
| Estáveis | 1 | 1 | ✔ |
| Gravidade ALTA / MEDIA / BAIXA | 1 / 1 / 1 | 1 / 1 / 1 | ✔ |
| Alerta condicional | "HÁ FISSURAS DE GRAVIDADE ALTA…" | dispara com ALTA>0 | ✔ |

## Recursos de planilha validados na geração
- 3 abas: **Parametros**, **Lancamentos**, **Dashboard**.
- **Validação de dados** (menus suspensos) em Orientação, Local, Origem, Umidade, Risco.
- **Formatação condicional** (semáforo) na coluna Gravidade: ALTA=vermelho, MEDIA=amarelo, BAIXA=verde; e Situação ATIVA destacada.
- **Gráfico de barras** "Fissuras por gravidade" no Dashboard.
- Painéis congelados (`freeze_panes`) e formatação de datas `dd/mm/yyyy`.

> ⚠️ Os limiares são **convenção do curso** e devem ser confirmados/assinados pelo instrutor
> (VALIDAR B1/B9) antes da publicação. A planilha é entregue **vazia** ao aluno (as linhas de
> teste acima são injetadas apenas em `/tmp` durante o teste — o arquivo do Kit permanece limpo).
