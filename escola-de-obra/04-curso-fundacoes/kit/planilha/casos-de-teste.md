# 🧪 Casos de Teste — Planilha Seletor/Comparador de Fundações

Os 4 casos abaixo foram **injetados e avaliados com um motor real de fórmulas** (lib `formulas`).
Script: `../../../_build/testar_planilha_fundacoes.py`. **Resultado: 4/4 casos + Dashboard ✔.**

> Reproduzir: `cd _build && python3 gerar_planilha_fundacoes.py && python3 testar_planilha_fundacoes.py`

## Parâmetros usados (aba Parametros)
- Limite camada RASA: **≤ 3,0 m** · Limite camada PROFUNDA: **≥ 8,0 m** · NA alto se profundidade **< 2,0 m**.
- Todos marcados `[VALIDAR]` (convenção do curso — a decisão final é do projetista de fundações).

## Lógica testada (aba Seletor)
- **Família:** `RASA` se camada resistente ≤ limite raso **e** carga ≠ alta; `PROFUNDA` se camada ≥ limite profundo **ou** carga alta; senão `ZONA CINZENTA`.
- **Tipos candidatos:** derivados da família + restrições (vizinhança → hélice/escavada; acesso restrito → raiz/Strauss).
- **Alerta:** NA alto (tubulão a céu aberto), vizinhança sensível (trepidação), zona cinzenta (custo da falha), carga alta (dimensionamento).

## Resultados
| Caso | Entrada (camada m / NA m / carga / vizinho) | Família | Tipos | Alerta | ✔ |
|---|---|---|---|---|---|
| 1 | 1,5 / 10 / leve / Não | **RASA** | Sapata ou radier | (vazio) | ✔ |
| 2 | 9 / 10 / alta / Não | **PROFUNDA** | Estaca (pré-moldada/hélice) ou tubulão | "Carga alta: dimensionamento pelo projetista" | ✔ |
| 3 | 9 / 1 / média / Sim | **PROFUNDA** | Hélice contínua/escavada (sem trepidação) | "NA alto…" + "Vizinhança sensível…" | ✔ |
| 4 | 5 / 10 / média / Não | **ZONA CINZENTA** | Levar ao projetista | "Decisão do projetista; custo da falha" | ✔ |

## Dashboard (agregação automática)
| Métrica | Obtido | Esperado | ✔ |
|---|---|---|---|
| Casos analisados | 4 | 4 | ✔ |
| RASA / PROFUNDA / ZONA CINZENTA | 1 / 2 / 1 | 1 / 2 / 1 | ✔ |

## Recursos validados na geração
- 4 abas: **Parametros, Seletor, Comparador, Dashboard**.
- Fórmulas reais de triagem (família, tipos, alerta); validação de dados (carga, vizinhança, acesso);
  formatação condicional (RASA verde / PROFUNDA azul / ZONA CINZENTA amarelo); painéis congelados.
- **Comparador**: matriz de referência de 14 tipos (rasas e profundas) com "quando entra" e "cuidado/limite".

> ⚠️ A planilha é uma **ferramenta de triagem** entregue vazia ao aluno. Os limiares são convenção do
> curso (`[VALIDAR]`) e **não substituem o projeto de fundações** — a decisão e o dimensionamento
> finais são do projetista de fundações/geotécnico (NBR 6122).
