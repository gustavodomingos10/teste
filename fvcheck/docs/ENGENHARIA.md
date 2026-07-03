# FV-CHECK — Memória de Engenharia do Método Expresso

Este documento registra, para auditoria por calculistas e peritos, **todas as hipóteses,
fórmulas e envoltórias** do método expresso implementado em `app/js/core/`.
O método é uma **triagem**: conservador onde simplifica, e explícito sobre o que
não verifica. O texto oficial das normas ABNT prevalece sempre.

---

## 1. Escopo

- Coberturas **metálicas** de galpões (uma ou duas águas, planta retangular) com terças de aço:
  U simples, U enrijecido, Z enrijecido (NBR 6355), tubo retangular e perfis W laminados (catálogo);
- Telhas: fibrocimento (ondulada/estrutural), metálicas (trapezoidal/ondulada/zipada), termoacústicas;
- Módulos FV em montagem **coplanar** (afastamento ≤ 20 cm), fixados nas terças ou na telha;
- **Fora do escopo** (bloqueado com direcionamento ao laudo): estruturas/terças de madeira (NBR 7190),
  terças de concreto (NBR 6118), telha cerâmica, montagem inclinada em triângulos, h/b > 3/2.

## 2. Ação do vento — NBR 6123

- `Vk = V0·S1·S2·S3`; `q = 0,613·Vk²` (N/m²).
- **V0**: informado pelo usuário; padrão conservador por UF (envoltória das isopletas da Fig. 1).
- **S1**: 1,0 (plano) · 1,10 (topo de talude/morro — envoltória; o valor exato de 5.2(b) fica p/ o laudo) · 0,9 (vale protegido).
- **S2** = `b·Fr·(z/10)^p` com Tabela 1 completa (categorias I–V × classes A/B/C). Para **terças, telhas e
  fixações** usa-se **classe A** (NBR 6123 5.3.2 — unidades de vedação e suas fixações); para o indicador
  global (V7), a classe da edificação. `z` = cota da cumeeira (conservador); abaixo de 5 m adota-se 5 m.
- **S3**: grupo 2 = 1,00 (padrão), grupo 1 = 1,10, grupo 3 = 0,95.
- **Ce (telhado duas águas)**: Tabela 5 para `h/b ≤ 1/2`, vento a 90° (interpolação linear em θ nos pontos
  0°:−0,8/−0,4 · 5°:−0,9/−0,4 · 10°:−1,2/−0,4 · 15°:−1,0/−0,4 · 20°:−0,4/−0,4 · 30°:0/−0,4 · 45°:+0,3/−0,5 · 60°:+0,7/−0,6);
  vento a 0° coberto pela envoltória `Ce = −0,8`. Sucção governante = mínimo das hipóteses.
  Para `1/2 < h/b ≤ 3/2`, majoração de 15% nas sucções (envoltória declarada). Uma água: tratada pela mesma
  envoltória (conservadora para sucção).
- **Ci**: ±0,2/−0,3 (permeabilidade típica, 6.2.5). Barracão **aberto de um lado** → Ci = **+0,8**
  (envoltória máxima de abertura dominante a barlavento).
- **Zonas de borda**: para a demanda de fixação dos módulos usa-se Ce médio local = **−2,0** (nota da Tabela 5).
- Pressão efetiva: `ΔP = (Ce − Ci)·q`, normal à água.

## 3. Ações e combinações — NBR 8681 / NBR 6120 / NBR 8800

Cargas por m² de superfície: telha (catálogo típico), sistema FV `g_fv = peso do módulo/área + trilhos`
(padrão 0,03 kN/m²), peso próprio da terça (0,785·A kg/m ≈ aço 78,5 kN/m³ na área da seção), sobrecarga de
cobertura **0,25 kN/m² em projeção horizontal** (NBR 6120:2019 Tab. 10; NBR 8800 B.5.1).

Cargas lineares na terça crítica (espaçamento `s` no plano da água), decompostas em
normal (`·cosθ`) e tangencial (`·senθ`; vão lateral `Ly = L/(n_correntes+1)`):

- **C1** `1,25·G_terça + 1,35·(G_telha+G_fv) + 1,50·Q` (γ da NBR 8800 Tab. 1)
- **C2** `1,25/1,35·G + 1,40·W⁺` (quando há sobrepressão externa, θ alto)
- **C3** `1,00·G + 1,40·W⁻` (permanentes favoráveis — NBR 8681 5.1.4.1)
- **ELS (raras)** `G + Q` e `G + W⁻`, limite de flecha **L/180** (NBR 8800 Anexo C, Tab. C.1)

Coeficientes de esforço por vinculação: biapoiada `M=0,125wL²`, `V=0,5wL`, `δ=5/384·wL⁴/EI`;
contínua 2 vãos `0,125 · 0,625 · 0,00541`; contínua ≥3 vãos `0,105 · 0,600 · 0,00688`.
Flexão tangencial nos subvãos com `0,125·w_t·Ly²` (conservador).

## 4. Resistências — NBR 14762 (γ = 1,10) / NBR 8800 (γa1 = 1,10)

- **Flambagem local (triagem)**: para cada elemento comprimido, `λp = (b/t)/[0,95·√(k·E/fy)]` e
  ρ de Winter `(1−0,22/λp)/λp` — k = 4,0 (AA), 0,43 (AL), 24 (alma em flexão). Aplica-se **ρ_mín ao módulo
  W inteiro** (conservador; o cálculo exato da seção efetiva e a flambagem distorcional ficam para o laudo).
  Enrijecedor curto (D < 0,2·bf) rebaixa a mesa para k = 0,43.
- **Flexão gravitacional**: `M_Rd = W_ef·fy/γ` — mesa comprimida travada continuamente pela telha parafusada.
- **Levantamento (FLT)**: método do **fator R** (NBR 14762 9.8.2.2 / AISI D6.1.2) — flange conectado por
  parafusos passantes: R = 0,40 (U/Ue biapoiada) · 0,50 (Z biapoiada) · 0,60 (U/Ue contínua) · 0,70 (Z contínua);
  tubo fechado: FLT dispensada (R = 1); perfil W: envoltória R = 0,50 (a FLT completa do Anexo G fica p/ o laudo);
  telha **zipada** (clips deslizantes, sem travamento): R reduzido à metade + ressalva (o sistema exige ensaio).
- **Cortante**: NBR 14762 9.8.3, kv = 5,0, três ramos (`0,6·fy·h·t` · `0,65·t²·√(kv·fy·E)` · `0,905·E·kv·t³/h`).
- **Interação biaxial**: `Mx/MRdx + My/MRdy ≤ 1` (linear, conservadora).
- **Estado de conservação**: bom ×1,00 · corrosão superficial ×0,90 (e teto ATENÇÃO) · corrosão severa → REPROVADO + vistoria.

## 5. Telha (V5), fixações (V6) e estrutura principal (V7)

- **V5**: vão real ≤ vão máximo típico; capacidade típica corrigida ao vão real por `(vão_máx/vão)²` (≤ 4×).
  Demanda gravitacional = 0,25·cosθ (+ g_fv se apoiado na telha). A sucção de vento é comparada como
  **condição preexistente** (módulos coplanares fixados nas terças não a agravam) — vira ATENÇÃO informativa.
  Tabela do fabricante prevalece (declarado).
- **V6**: demanda por ponto (4 fixações/módulo) no centro (`ΔP_suc`) e na borda (`Ce local −2,0`); o resultado
  exige do fornecedor **ensaio de arrancamento ≥ demanda**. Fixação na telha: só onde tecnicamente admissível
  (fibrocimento → bloqueado) e sempre com ressalva.
- **V7**: acréscimo de cálculo `1,35·g_fv·cobertura` comparado ao **caso governante do pórtico**
  (máx. entre gravitacional e sucção com S2 da edificação). ≤5% desprezível (prática consolidada de avaliação
  de estruturas existentes, cf. IEBC 502.4) · ≤10% atenção · >10% laudo obrigatório. **Não recalcula** pórticos,
  ligações, contraventamentos e fundações.

## 6. Semáforo

Por item: razão ≤ 0,85 → VERDE · ≤ 1,00 → ATENÇÃO · > 1,00 → REPROVADO (+ tetos qualitativos:
zipada/kalhetão/telha no limite → ATENÇÃO; fora de escopo → REPROVADO). Global = pior item; qualquer
resultado ≠ VERDE aciona a recomendação de laudo. O sistema também roda o modelo **sem o FV** e alerta
quando a estrutura já não atenderia (problema preexistente).

## 7. Reserva de capacidade

As verificações gravitacionais são lineares em `g_fv`; o sistema resolve `razão = 1` por extrapolação linear
e informa a folga em kgf/m² (não vale para V7/estrutura principal — declarado).

## 8. Verificação e testes

- `tests/engine.test.js`: 88 asserções — propriedades de seção conferidas por **integração numérica
  independente** (grade de 0,1 mm, Python), cadeia de vento/ações reproduzida à mão, fator R, três ramos do
  cortante, semáforo, validação e varredura de **3.888 combinações** sem erro numérico;
- `tests/report.test.js`: 60 asserções — memorial (conteúdo normativo, ausência de `NaN`/`undefined`),
  figuras SVG bem-formadas, orçamento/dossiê/e-mail do laudo, coerência de preços.

## 9. Evoluções recomendadas (roadmap técnico)

1. Seção efetiva exata + flambagem distorcional (NBR 14762 9.7.2/Anexo C);
2. Tabela 5 completa (h/b até 6) e Tabelas 6/7 p/ uma água; coeficientes locais por zona;
3. Terças de concreto (NBR 6118) e madeira (NBR 7190);
4. Banco de telhas por fabricante (cargas admissíveis reais) e de módulos por datasheet;
5. Interação com correntes/travamentos discretos no modelo de FLT;
6. Módulo de pórticos (verificação da estrutura principal) para o calculista da rede.
