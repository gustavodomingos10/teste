# FV-CHECK — Verificação Estrutural Expressa para Fotovoltaico em Telhado

**"O telhado aguenta a usina solar? Descubra em 3 minutos."**

SaaS para **integradores fotovoltaicos** (técnicos instaladores, não engenheiros): o usuário responde perguntas simples — distância entre treliças e entre terças, tipo de telha e de perfil, se o barracão é aberto ou fechado, o que existe ao redor — e o sistema roda a **verificação estrutural simplificada** pelas normas brasileiras, devolvendo um **semáforo técnico**:

| Semáforo | Significado |
|---|---|
| 🟢 **VERDE** | Apto pelo método expresso (razões ≤ 0,85, sem ressalvas) |
| 🟡 **ATENÇÃO** | Próximo do limite ou com ressalva de escopo — laudo recomendado |
| 🔴 **REPROVADO** | Verificação violada — não instalar sem laudo/reforço |

Quando indicado, um clique gera o **dossiê técnico completo** e a solicitação do **laudo assinado com ART** pelo calculista da rede (GD Engenharia).

![testes](https://img.shields.io/badge/testes-189%20Node%20%2B%2029%20E2E-brightgreen) ![normas](https://img.shields.io/badge/NBR%206123%20%C2%B7%208681%20%C2%B7%206120%20%C2%B7%208800%20%C2%B7%2014762-conforme-blue) ![público](https://img.shields.io/badge/feito%20para-instaladores-orange)

---

## ✨ O que o sistema verifica (método expresso)

1. **V1** Flexão da terça sob cargas gravitacionais (telha + FV + sobrecarga 0,25 kN/m²) — NBR 14762/8800
2. **V2** Flexão da terça sob **levantamento pelo vento** (fator R — NBR 14762 9.8.2.2) — o caso que mais reprova
3. **V3** Cisalhamento da alma — NBR 14762 9.8.3 (3 ramos)
4. **V4** Flecha L/180 (ELS) — NBR 8800 Anexo C
5. **V5** Telha: vão entre terças e cargas (dados típicos de fabricante, capacidade corrigida ao vão real)
6. **V6** Fixação dos módulos: demanda de arrancamento por ponto, incluindo zonas de borda (Ce local −2,0)
7. **V7** Estrutura principal: indicador de **acréscimo de carga** sobre o caso governante do pórtico (≤5% ✓ · ≤10% atenção · >10% reprovado, laudo/reforço)

Extras: **reserva de capacidade** (quantos kgf/m² ainda cabem), diagnóstico de **estrutura já deficitária sem o FV**, **seção efetiva reconstruída** (larguras efetivas por elemento — mais preciso que ρ·W), **coeficientes de viga contínua por nº real de vãos**, estados de conservação, envoltórias de vento documentadas.

### 📐 Conferência de medidas (croqui 2D + isométrico 3D **cotados**)
Antes de calcular, o sistema desenha automaticamente o **croqui cotado** do galpão (planta + corte) e a **perspectiva isométrica 3D com cotas** para o instalador **confirmar que as medidas batem com o local** — evitando resultado errado por medida digitada errada. No resultado ainda entram a **planta de distribuição dos painéis com as zonas de borda** (alta sucção) e o **diagrama de esforços na terça**. Todos os desenhos vão para o memorial imprimível.

## 🧑‍🔧 Feito para quem instala

- Wizard em 6 passos com **linguagem de obra** ("distância entre as treliças", "ferrinhos ligando as terças", "barracão aberto de um lado") e dicas de **como medir com trena**;
- Ambiente de vento em cards ilustrados (campo aberto → centro de cidade) que viram categoria de rugosidade da NBR 6123;
- Resultado com explicações simples + **detalhe técnico completo** (fórmulas, valores e referência normativa) para o engenheiro conferir;
- **Memorial expresso imprimível** com todas as premissas e limitações declaradas.

## 💰 Modelo de negócio

- **Licença mensal** do integrador (Integrador / Pro / Engenharia) — ver `app/js/core/dados.js` (`PRECOS`);
- **Laudo assinado por ART**: R$ 1.490 até 500 m² + R$ 1,20/m² adicional, prazo 5 dias úteis — receita recorrente do calculista da rede;
- Trial de 14 dias sem cartão. Detalhes em [docs/MODELO_DE_NEGOCIO.md](docs/MODELO_DE_NEGOCIO.md).

## 🚀 Como usar

```bash
# opção 1 — duplo clique em index.html (ou demo.html para dados de exemplo)
# opção 2 — servir localmente:
cd fvcheck && python3 -m http.server 8080
# acesse http://localhost:8080  (demo: http://localhost:8080/index.html?demo=1)

# PRÉVIA AUTOCONTIDA (um único arquivo, abre com duplo clique, já em modo demo):
node build-preview.js        # gera fvcheck-preview.html (CSS+JS embutidos)
```

**Primeiro acesso:** crie a conta administradora (ativa o trial de 14 dias automaticamente).

## 🧪 Testes

```bash
npm test                      # engine (108) + relatórios (81)
node tests/engine.test.js     # valores conferidos com cálculo independente (Python)
node tests/report.test.js     # memorial, figuras SVG, laudo, preços
```

A robustez do motor é varrida em **3.888 combinações** de entrada sem erro numérico, o fluxo completo tem
**29 asserções E2E** no navegador real (Playwright) e o motor passou por **revisão adversarial independente**
com 8 achados confirmados e corrigidos (ver `docs/ENGENHARIA.md` §8).

## 📁 Estrutura

```
index.html                  → aplicação (carrega os módulos)
app/css/styles.css          → identidade visual + impressão do memorial
app/js/core/                → norms, dados, sections, vento, acoes, engine, validate
app/js/security/            → crypto (PBKDF2), auth (licença/planos), audit (hash-chain)
app/js/data/storage.js      → projetos, laudos e backup
app/js/report/              → draw (SVG), memorial, laudo
app/js/ui/                  → ui, views (landing/wizard/resultado) + app.js
tests/                      → testes automatizados
docs/                       → ENGENHARIA, MODELO_DE_NEGOCIO
```

## ⚖️ Responsabilidade técnica

O FV-CHECK é uma **triagem assistida por software** e **não substitui** laudo/projeto assinado com ART por profissional legalmente habilitado (Lei 5.194/66; Res. CONFEA 1.025/2009). Todas as envoltórias e limitações do método estão declaradas no memorial e em [docs/ENGENHARIA.md](docs/ENGENHARIA.md).

© GD Engenharia e Perícia Ltda · CNPJ 54.705.748/0001-19 · Eng. Civil Gustavo F. F. Domingos · CREA 140.964-D/PR
