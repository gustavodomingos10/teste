# Versão Internacional (PT-BR / EN-US)

A partir da v2.0, o software é **internacional**: ao abrir, o usuário escolhe o **país**, e tudo se ajusta automaticamente.

## Seleção de país (tela inicial)

| País | Idioma | Unidades | Normas | Força máx. trabalhador | Ancoragem mínima |
|---|---|---|---|---|---|
| 🇧🇷 **Brasil** | Português | SI (kN, m, mm) | NR-35, NR-18, NBR 16325/8800/6123 | 6 kN | 15 kN |
| 🇺🇸 **Estados Unidos** | English | Imperial (lbf, ft, in) | OSHA 1926.502, ANSI Z359.6, ASCE 7, AISC 360 | 8 kN (1.800 lbf) | 22,2 kN (5.000 lbf) ou FS ≥ 2 |

A seleção pode ser trocada a qualquer momento pelo botão de país no rodapé da barra lateral.

## O que muda automaticamente ao selecionar EUA

1. **Idioma** — toda a interface, os memoriais, o prontuário e **as figuras** (3D, ZLQ, esforços) passam para o inglês.
2. **Unidades** — conversão automática: kN→lbf, m→ft, mm→in, kN·m→lbf·ft, MPa→ksi, m/s→mph. Separador decimal vira ponto; data fica MM/DD/YYYY.
3. **Critérios normativos** — a força máxima no trabalhador passa a 8 kN (OSHA) e a resistência mínima da ancoragem a 22,2 kN; as verificações do veredito usam esses limites.
4. **Referências** — os relatórios citam OSHA/ANSI/ASCE/AISC em vez de NR/NBR.
5. **Equivalência** — o prontuário inclui uma **tabela de equivalência normativa** (Brasil × EN × USA) para auditores internacionais.

> A engenharia (modelo de cabo, ZLQ, NBR 8800/AISC) é a mesma; mudam os **critérios de aceitação** e a **apresentação**. O caso brasileiro permanece idêntico ao validado.

## Arquitetura da internacionalização

- `app/js/core/paises.js` — perfis de país (normas, unidades, idioma, critérios).
- `app/js/core/i18n.js` — dicionário PT/EN da interface e dos títulos de relatório.
- `app/js/core/units.js` — conversões SI ↔ Imperial.
- Os geradores de relatório (`report.js`, `prontuario.js`, `draw.js`) são **locale-aware**: leem `R.pais` e produzem texto e unidades no idioma correto.

Para adicionar um novo país (ex.: 🇪🇺 EN/SI, 🇲🇽 ES/SI), basta acrescentar um perfil em `paises.js` e, se for um novo idioma, um dicionário em `i18n.js`.

## QR Code de rastreabilidade (gestão de ativos)

Cada sistema recebe um **número de série** e um **QR Code** na plaqueta de identificação (gerado por `app/js/report/qr.js`, sem dependências externas, conforme ISO/IEC 18004 e validado por decodificação). Escanear o QR identifica o sistema — base para a gestão de centenas de pontos de ancoragem em uma planta industrial.

## Painel de conformidade

A aba **Conformidade** mostra o status de inspeção de todos os sistemas em um semáforo (em dia / a vencer / vencida / sem inspeção), com a data da próxima inspeção (NR-35.6.6 — periodicidade ≤ 12 meses). Essencial para multinacionais e grandes plantas (café, agroindústria, silos).
