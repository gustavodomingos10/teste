# Linha de Vida — Software de Dimensionamento e Prontuário

Software profissional para **dimensionamento de linhas de vida horizontais (SPIQ)** e geração do **prontuário técnico completo**, conforme **NR-35**, **NR-18**, **ABNT NBR 16325-1/2** e **NBR 8800**.

Desenvolvido a partir da ferramenta em planilha da **GD Engenharia e Perícia Ltda**, auditada, corrigida e expandida para uso comercial.

![status](https://img.shields.io/badge/testes-65%20passando-brightgreen) ![normas](https://img.shields.io/badge/NR--35%20%C2%B7%20NR--18%20%C2%B7%20NBR%2016325%2F8800-conforme-blue)

---

## ✨ Recursos

- **Motor de cálculo verificado** — equilíbrio do cabo por Newton-Raphson, ZLQ (NBR 16325-2 Anexo C.2), verificação do cabo, e dimensionamento do poste pela NBR 8800 (incluindo **flambagem**, **cisalhamento** e **classe da seção** — acréscimos à planilha original).
- **Memorial de cálculo auditável** estruturado conforme **NR-35 Anexo II 5.1.1** (força de impacto → esforços → ZLQ), com fórmulas, valores e referência normativa de cada verificação.
- **Prontuário completo (18 seções):** memoriais, materiais, compatibilidade, quantitativo, APR, PT, plano de inspeção, ensaio de carga, plano de resgate, capacitação, EPI, plaqueta de identificação (NR-18 18.12.12.3) e termo de liberação.
- **Figuras técnicas em SVG:** 3D isométrico, elevação cotada da ZLQ, planta e diagrama de esforços.
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
