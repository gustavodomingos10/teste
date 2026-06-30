# Auditoria de Engenharia da Planilha Original

**Objeto:** `Linha_de_Vida_GD_Engenharia_1.xlsx` — Ferramenta de dimensionamento de Linha de Vida Horizontal (SPIQ).
**Finalidade:** verificar a correção dos cálculos e das informações, identificar lacunas e registrar as melhorias incorporadas ao software, de modo a torná-lo **incontestável** em auditoria de peritos e seguradoras.

> **Conclusão geral:** a engenharia da planilha está **correta e bem fundamentada**. Não foram encontrados *erros* de cálculo. Foram identificadas **lacunas** (verificações que a boa técnica recomenda e que a planilha não fazia) — todas **fechadas** no software, com testes automatizados.

---

## 1. O que foi verificado e está CORRETO

Cada fórmula foi reproduzida no motor de cálculo e conferida numericamente (ver `tests/engine.test.js`, 42 verificações; e a varredura de 2.304 combinações sem erro numérico).

| Item | Fórmula da planilha | Veredito |
|---|---|---|
| Rigidez axial do cabo | `EA = E·A/1000` | ✔ correto (unidades coerentes: MPa·mm²→kN) |
| Equilíbrio do cabo (flecha/tração) | `Q = 2·T·senθ`, `T = T₀ + (2EA/L)(√(a²+f²)−a)` | ✔ modelo de cabo com carga concentrada a meio-vão, elasticamente correto |
| Newton-Raphson | resíduo `g(f)` e derivada `g'(f)` | ✔ derivada **analiticamente correta** (conferida termo a termo) |
| Tração com absorvedor | `T = min(T_el, F_abs)` | ✔ correto — o absorvedor de linha limita a carga transmitida à estrutura |
| Ângulo / flecha | `senθ = Q/(2T)`, `f = a·tanθ` | ✔ correto |
| **ZLQ** | `H_ql + H_fr + 1,5 + 1,0 + f` | ✔ **confirmado na fonte:** NBR 16325‑2 Anexo C.2 (dispositivo tipo C) |
| FS do cabo | `F_rup/T ≥ 2` ; `F_rup/T₀ ≥ 5` | ✔ correto (dinâmico ≥ 2; serviço ≥ 5 — NR‑18) |
| Reações no poste | `H = T·cosθ`, `V = T·senθ`, `M_k = H·h` | ✔ correto para o poste extremo (mais solicitado) |
| Peso próprio do poste | `A·10⁻⁴·h·77` | ✔ correto (γ_aço = 77 kN/m³) |
| Momento resistente | `M_Rd = Z·fy/γa1` | ✔ correto **para seção compacta** (ver lacuna L1) |
| Interação flexo‑compressão | fórmula H1 da NBR 8800 | ✔ correto |
| Propriedades dos perfis (W, Z, A) | tabela embutida | ✔ conferem com o cálculo pela geometria (erro < 0,3 %) |

As tabelas de cabos (E, A, MBL) têm valores compatíveis com cabos de aço comerciais (módulo efetivo de cabo trançado, área metálica com fator de preenchimento, MBL típica).

---

## 2. Lacunas identificadas (não eram erros) e como foram fechadas

| # | Lacuna na planilha | Risco em auditoria | Tratamento no software |
|---|---|---|---|
| **L1** | Usava `Z` (módulo plástico) sem verificar a **compactação da seção** | Auditor pode questionar se a seção plastifica antes da flambagem local | Adicionada verificação de **classe da seção** (esbeltez de parede `b/t`, NBR 8800 Tab. F.1); avisa se não compacta |
| **L2** | `N_Rd = A·fy/γa1` **sem flambagem** (só nota textual) | Para postes esbeltos, superestima a resistência axial | Implementada a **curva de flambagem** da NBR 8800 (`Ne`, `λ₀`, `χ`); `N_Rd = χ·A·fy/γa1` |
| **L3** | **Cisalhamento no poste** não verificado | A força horizontal H gera cortante não checado | Adicionada verificação `V_Sd ≤ V_Rd = 0,6·fy·Aw/γa1` |
| **L4** | Newton‑Raphson com **7 iterações fixas**, sem aferir convergência | Em casos extremos poderia não convergir silenciosamente | Iteração com **tolerância e flag de convergência**, proteção contra divisão por zero e recuperação robusta (testado em 2.304 casos) |
| **L5** | `senθ` limitado por `MIN(0,999;…)` **silenciosamente** | Mascara geometria impossível (carga > capacidade) | Mantida a proteção **e** adicionados avisos de validação |
| **L6** | **Placa de base / concreto** não verificados | Falha comum apontada por seguradora | Adicionada verificação de **esmagamento do concreto** (σ ≤ 0,85·fcd, NBR 6118) e estimativa de espessura da placa |
| **L7** | Entrada **sem validação de faixa** | Dados absurdos passariam | Módulo `validate.js` com faixas físicas, regras normativas e mensagens |
| **L8** | Premissa **força‑6 kN como entrada** (circular) | "De onde vem o 6 kN?" | Documentado o critério (NR‑35.6.7 + absorvedor NBR 16489) e travada a entrada Fₜ ≤ 6 kN |

---

## 3. Recomendações de rigor adicional (para o RT avaliar caso a caso)

Itens que **não** alteram o resultado do caso típico, mas que o responsável técnico pode acrescentar conforme o projeto:

1. **Verificação por energia (fator de queda):** complementar o método baseado em força com um balanço de energia (energia da queda ⇐ absorvedor + alongamento do cabo + flecha), confirmando que o absorvedor pessoal de fato limita a 6 kN. O método de força adotado é **conservador** quando há absorvedor compatível (NBR 16489).
2. **Postes de canto / mudança de direção:** o modelo assume traçado **reto**. Em mudanças de direção, o poste de canto recebe a **resultante** das trações dos dois tramos — deve ser dimensionado à parte.
3. **Efeito da temperatura na pré‑tensão:** cabos expostos sofrem variação de T₀ com ΔT (α≈12·10⁻⁶/°C). Para vãos longos ao tempo, avaliar.
4. **Ações da NBR 6120 / vento:** para postes altos ou em locais expostos, somar as ações de vento conforme NBR 6120 e NBR 6123.
5. **Ensaio de arrancamento:** registrar o ensaio de carga das ancoragens (≥ 15 kN ou força máxima) — já há seção dedicada no prontuário (NR‑18 18.12.12.2.1).

---

## 4. Informações que foram acrescentadas para deixar a ferramenta mais robusta

- **Catálogo ampliado:** cabos Ø6–16 mm (inox e galvanizado); perfis SHS/RHS/CHS com propriedades calculadas pela geometria; aços selecionáveis (fy 250–350 MPa).
- **Categorias de corrosividade (ISO 12944‑2)** orientando material e revestimento.
- **Matriz de compatibilidade** substrato × ancoragem com notas normativas.
- **Prontuário completo (18 seções)**: memoriais, APR, PT, plano de inspeção, ensaio de carga, plano de resgate, capacitação, EPI, plaqueta de identificação (NR‑18 18.12.12.3) e termo de liberação.
- **Figuras técnicas**: 3D isométrico, elevação cotada da ZLQ, planta e diagrama de esforços.
- **Referências normativas conferidas na fonte** (NR‑35, NR‑18, NBR 16325‑1/2) — ver `docs/ENGENHARIA.md`.

---

*Documento gerado como parte do desenvolvimento do software Linha de Vida — GD Engenharia. As verificações automatizadas estão em `tests/`. Os resultados devem ser conferidos e validados pelo responsável técnico, com a respectiva ART.*
