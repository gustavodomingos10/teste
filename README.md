# Suíte GD Engenharia — Softwares Técnicos

Este repositório contém os produtos da suíte GD Engenharia:

| Produto | Pasta | O que faz |
|---|---|---|
| **Linha de Vida GD** | `/` (raiz) | Dimensionamento de linhas de vida horizontais (SPIQ) e prontuário técnico — NR-35/NBR 16325/8800 (PT-BR/EN-US) |
| **FV-CHECK** ⚡ | [`fvcheck/`](fvcheck/) | Verificação estrutural **expressa** para usinas fotovoltaicas em telhado — semáforo técnico (NBR 6123/8681/6120/8800/14762) + laudo assinado com ART. [README](fvcheck/README.md) · [Guia do usuário](fvcheck/GUIA_DO_USUARIO.md) · demo: `fvcheck/demo.html` |

```bash
npm test        # roda os testes das duas aplicações (79 + 148 verificações)
```

---

# Linha de Vida — Software de Dimensionamento e Prontuário

Software profissional para **dimensionamento de linhas de vida horizontais (SPIQ)** e geração do **prontuário técnico completo**, conforme **NR-35**, **NR-18**, **ABNT NBR 16325-1/2** e **NBR 8800**.

Desenvolvido a partir da ferramenta em planilha da **GD Engenharia e Perícia Ltda**, auditada, corrigida e expandida para uso comercial.

![status](https://img.shields.io/badge/testes-79%20passando-brightgreen) ![idiomas](https://img.shields.io/badge/PT--BR%20%C2%B7%20EN--US-bil%C3%ADngue-orange) ![normas](https://img.shields.io/badge/NR--35%20%C2%B7%20OSHA%20%C2%B7%20ANSI%20Z359%20%C2%B7%20EN%20795-conforme-blue)

---

## ✨ Recursos

- **🌎 Internacional (PT-BR / EN-US):** escolha o país na tela inicial — Brasil (Português · SI · NR-35/NBR) ou Estados Unidos (English · Imperial · OSHA/ANSI). Tudo (interface, memoriais, prontuário e **figuras**) e as **unidades** se ajustam automaticamente. Ver [docs/INTERNACIONAL.md](docs/INTERNACIONAL.md).
- **Motor de cálculo verificado** — equilíbrio do cabo por Newton-Raphson, ZLQ (NBR 16325-2 Anexo C.2), verificação do cabo, e dimensionamento do poste pela NBR 8800/AISC (incluindo **flambagem**, **cisalhamento**, **classe da seção**, **vento** NBR 6123/EN 1991, **energia/fator de queda** e **poste de canto**).
- **Memorial de cálculo auditável** estruturado conforme **NR-35 Anexo II 5.1.1 / ANSI Z359.6** (força de impacto → esforços → ZLQ), com fórmulas, valores e referência normativa de cada verificação.
- **Prontuário completo (19 seções):** memoriais, materiais, compatibilidade, quantitativo, APR, PT, inspeção, ensaio de carga, resgate, capacitação, EPI, plaqueta com **QR Code**, termo de liberação e **tabela de equivalência normativa** (BR × EN × USA).
- **Figuras técnicas em SVG:** 3D isométrico, elevação cotada da ZLQ, planta e diagrama de esforços (bilíngues, com unidades automáticas).
- **Gestão de ativos:** **QR Code** de rastreabilidade e **painel de conformidade** com semáforo de vencimento de inspeções.
- **Segurança de acesso:** login com senhas protegidas (PBKDF2), perfis de acesso, bloqueio anti-força-bruta, sessões, licença comercial e trilha de auditoria.
- **Sem dependências e offline:** roda em qualquer navegador moderno; um duplo clique abre o sistema.

## 🚀 Como usar

Veja o **[Guia do Usuário](GUIA_DO_USUARIO.md)**. Em resumo:

```bash
# opção 1 — duplo clique em index.html
# opção 2 — servir localmente (recomendado p/ segurança de acesso):
python3 -m http.server 8000
# acesse http://localhost:8000
```

**Primeiro acesso:** ative a avaliação (30 dias) → login `admin` / `GD-altura@2026` (troca obrigatória).

## 🧪 Testes

```bash
npm test           # roda todos os testes (engenharia + relatórios)
node tests/engine.test.js     # 42 verificações numéricas vs. planilha validada
node tests/report.test.js     # 23 verificações de memoriais/prontuário/figuras
```

A engenharia foi conferida com uma **varredura de 2.304 combinações** de entrada sem erro numérico.

## 📁 Estrutura

```
index.html                 → aplicação (carrega os módulos)
app/css/styles.css         → estilos (tela + impressão)
app/js/core/               → engenharia: sections, data, norms, validate, compat, engine
app/js/security/           → crypto (PBKDF2), auth (RBAC/licença), audit (cadeia de hash)
app/js/data/storage.js     → projetos e backup
app/js/report/             → draw (figuras SVG), report (memoriais), prontuario (dossiê)
app/js/ui/                 → interface (ui, views) + app.js
tests/                     → testes automatizados
docs/                      → AUDITORIA_PLANILHA, ENGENHARIA, SEGURANCA
```

## 📚 Documentação técnica

- **[docs/AUDITORIA_PLANILHA.md](docs/AUDITORIA_PLANILHA.md)** — auditoria da planilha original: o que está correto, lacunas fechadas e recomendações.
- **[docs/ENGENHARIA.md](docs/ENGENHARIA.md)** — modelo de cálculo e citações normativas conferidas na fonte.
- **[docs/SEGURANCA.md](docs/SEGURANCA.md)** — modelo de acesso/licença e caminho para SaaS.

## ⚖️ Responsabilidade técnica

Esta ferramenta **auxilia** o dimensionamento e **não substitui** o julgamento do profissional legalmente habilitado. Os resultados devem ser conferidos, validados em campo e formalizados em projeto e memorial assinados, com a respectiva **ART**.

© GD Engenharia e Perícia Ltda · CNPJ 54.705.748/0001-19 · Eng. Civil Gustavo F. F. Domingos · CREA 140.964-D/PR
