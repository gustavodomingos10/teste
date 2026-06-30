# Memória de Engenharia e Referências Normativas

Este documento registra o **modelo de cálculo** e as **citações normativas** usadas pelo software, conferidas contra os textos oficiais (NR-35, NR-18, ABNT NBR 16325-1/2). Serve de base para auditoria por peritos e seguradoras.

## 1. Modelo estrutural da linha de vida (dispositivo tipo C)

A linha de vida horizontal flexível é modelada como um cabo tensionado submetido a uma carga transversal concentrada `Q` no ponto mais desfavorável (meio-vão), correspondente à força de retenção da queda.

**Equilíbrio** (cabo com carga a meio-vão de um vão `L`, semi-vão `a = L/2`):

```
Q = 2·T·senθ            com   senθ = f / √(a² + f²)
⇒  T = Q·√(a²+f²) / (2f)
```

**Compatibilidade elástica** (alongamento do cabo gera acréscimo de tração sobre a pré-tensão `T₀`):

```
T = T₀ + (2·EA / L)·( √(a²+f²) − a )
```

Igualando as duas expressões obtém-se o resíduo `g(f)`, resolvido por **Newton-Raphson**:

```
g(f)  = Q·√(a²+f²)/(2f) − T₀ − (2EA/L)·(√(a²+f²) − a)
g'(f) = −Q·a²/(2·√(a²+f²)·f²) − 2·EA·f/(L·√(a²+f²))
```

O **absorvedor de energia da linha** (quando presente) limita a tração transmitida à estrutura: `T = min(T_el, F_abs)`.

## 2. Zona Livre de Queda — ZLQ

Conforme **NBR 16325-2, Anexo C.2** (dispositivos de ancoragem tipo C — linhas horizontais), conferido na fonte:

```
ZLQ = queda livre (H_ql) + distância de frenagem (H_fr)
      + 1,5 m (engate do cinturão aos pés, valor fixo padronizado)
      + 1,0 m (distância de segurança, valor fixo padronizado)
      + f (deflexão/flecha da linha de ancoragem horizontal flexível)
```

Critério: `ZLQ ≤ pé-direito livre disponível`. A norma exige meio de limitar a força dinâmica sobre o usuário a **6 kN**.

## 3. Dimensionamento do poste (NBR 8800)

- Reações no topo do poste extremo: `H = T·cosθ`, `V = T·senθ`; momento na base `M_k = H·h`.
- Esforços de cálculo: `M_Sd = γf·M_k`, `N_Sd = γf·N_k` (γf = 1,40).
- Resistências: `M_Rd = Z·fy/γa1`; `N_Rd = χ·A·fy/γa1` (γa1 = 1,10).
- **Flambagem** (item 5.3): `Ne = π²EI/(K·L)²`; `λ₀ = √(A·fy/Ne)`; `χ = 0,658^(λ₀²)` se `λ₀ ≤ 1,5`, senão `χ = 0,877/λ₀²`. Poste em balanço: `K = 2,0`.
- **Interação flexo-compressão** (≤ 1,0) e **cisalhamento** `V_Rd = 0,6·fy·Aw/γa1`.
- **Classe da seção** pela esbeltez de parede `b/t` (Tabela F.1).

Propriedades das seções (W, Z, A, I, i) são calculadas pela **geometria** (ver `app/js/core/sections.js`), conferindo com as tabelas comerciais (erro < 0,3 %).

## 4. Citações normativas (conferidas na fonte oficial)

### NR-35 — Trabalho em Altura (Portaria MTP 4.218/2022)
- **35.2.1** — aplica-se acima de 2,0 m com risco de queda.
- **35.4.2.1** — capacitação inicial mínima de **8 h**.
- **35.6.6** — inspeções inicial (35.6.6.1), rotineira (35.6.6.2) e **periódica ≤ 12 meses** (35.6.6.3); registro (35.6.6.4); descarte de elementos danificados (35.6.6.5).
- **35.6.7** — força de impacto transmitida ao trabalhador **≤ 6 kN**.
- **35.6.9.1.1** — talabarte integrado com absorvedor de energia.
- **35.7** — Emergência e Salvamento (resgate, suspensão inerte).
- **Anexo II 3.1.1** — a estrutura deve resistir à **força máxima aplicável**.
- **Anexo II 3.2.1** — marcação dos pontos (fabricante; lote/série; nº máx. de trabalhadores ou força máxima).
- **Anexo II 4.1.1 / 4.1.2** — inspeção inicial após instalação; periódica ≤ 12 meses.
- **Anexo II 4.3 / 5.1** — sistema permanente: projeto + instalação sob responsável técnico.
- **Anexo II 5.1.1** — o dimensionamento deve determinar: **(a)** a força de impacto de retenção; **(b)** os esforços em cada parte do sistema; **(c)** a zona livre de queda. *(É a espinha dorsal do memorial de cálculo deste software.)*

### NR-18 — Indústria da Construção
- **18.12.12.2 "b"** — dispositivos de ancoragem ≥ **1.500 kgf (15 kN)**.
- **18.12.12.2 "d"** — material resistente às intempéries (inox AISI 316).
- **18.12.12.2.1** — ensaio de comprovação da carga.
- **18.12.12.3** — marcação indelével: razão social + CNPJ; modelo; nº série; material; carga; nº máx. de trabalhadores ou força máxima; pictograma.

### ABNT
- **NBR 16325-1** — classes de dispositivos (A–E); este sistema é **tipo C**.
- **NBR 16325-2 Anexo C.2** — cálculo da ZLQ (tipo C).
- **NBR 8800** — postes de aço (γf, γa1, compressão, cisalhamento, esbeltez).
- **NBR 6120** — ações; **NBR 6118** — concreto (placa de base); **NBR 16489** — absorvedor 6 kN; **ISO 12944-2** — corrosividade.

> **Nota:** a numeração de itens refere-se à edição utilizada na conferência. Como o RT, confirme contra o texto vigente (a NR-35 pode ser atualizada por novas portarias). As citações estão centralizadas em `app/js/core/norms.js` para facilitar a manutenção.
