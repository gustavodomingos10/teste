# FV-CHECK — Modelo de Negócio e Caminho SaaS

## 1. O problema (e o tamanho dele)

- O Brasil ultrapassou **3 milhões de sistemas fotovoltaicos** conectados, a grande maioria em telhados;
- Estima-se **>20 mil empresas integradoras** ativas — quase nenhuma com engenheiro de estruturas no quadro;
- A pergunta "o telhado aguenta?" é respondida hoje no olho. Quando o telhado colapsa (vento, sobrecarga,
  corrosão), a responsabilidade civil recai sobre o integrador (CDC art. 14; Código Civil art. 927/931),
  o seguro nega cobertura e a reputação acaba;
- Não existe ferramenta nacional de triagem estrutural para FV em telhado. **Oceano azul.**

## 2. A proposta de valor

| Para quem | Dor | Entrega |
|---|---|---|
| Integrador (técnico) | Não sabe se pode instalar; perde venda ou assume risco | Semáforo em minutos, linguagem de obra, memorial para anexar à proposta |
| Cliente final | Medo de dano ao imóvel | Documento técnico com normas brasileiras |
| Calculista da rede | Custo alto de captação e levantamento | Dossiê pronto (geometria, perfis, vento, resultados) — laudo em horas, não dias |
| Seguradora/banco | Risco desconhecido | Triagem padronizada e auditável (trilha de hash) |

## 3. Receitas

1. **Assinatura do integrador** (SaaS):
   - Integrador — R$ 189/mês (verificações ilimitadas, memorial, 2 usuários);
   - Integrador Pro — R$ 349/mês (logo no memorial, 1 laudo/ano, prioridade);
   - Engenharia/Rede — R$ 749/mês (multi-filial, API, comissão de indicação);
2. **Laudo assinado com ART** (marketplace): R$ 1.490 até 500 m² + R$ 1,20/m² adicional, prazo 5 dias úteis.
   O software gera o dossiê completo → margem alta para o calculista (a GD Engenharia é o primeiro nó da rede;
   escala credenciando calculistas por UF com repasse de 60–70%);
3. Futuro: white-label para distribuidores de kits, integração com plataformas de dimensionamento elétrico,
   dados agregados para seguradoras.

### Unit economics (hipótese conservadora)
- 400 assinantes × R$ 189 ≈ **R$ 75 mil/mês** recorrentes;
- 5% dos ~8 mil checks/mês viram laudo (400 laudos × R$ 1.490 × 30% take-rate) ≈ **R$ 178 mil/mês** de GMV de laudos;
- CAC baixo: canal = distribuidores de kits FV, grupos de integradores, conteúdo técnico ("seu telhado aguenta?").

## 4. Por que agora e por que nós

- Regulação do setor amadurecendo (NBR 16690, exigências de concessionárias e seguradoras crescendo);
- Sinistros de vento em usinas de telhado viraram notícia recorrente — o medo é o vendedor;
- Diferencial GD: quem assina os laudos é do ramo (perícias em galpões), e o método expresso já nasce
  auditável (memória de engenharia pública, testes com verificação independente, trilha de auditoria).

## 5. Estado atual × produção

Esta versão roda 100% no navegador (localStorage), com licenças simuladas por chave assinada localmente.
Caminho para produção:

1. **Backend** (contas, cobrança, projetos, fila de laudos): Node/Postgres + Stripe/Pagar.me; o motor de
   cálculo já é módulo JS puro — roda no servidor sem alteração;
2. **Autenticação** real (OAuth/e-mail) mantendo PBKDF2/argon2; auditoria em banco append-only;
3. **Painel do calculista**: fila de dossiês, upload do laudo em PDF, assinatura digital ICP-Brasil, ART automática (API CREA/SITAC onde houver);
4. LGPD: dados do cliente final minimizados; termos de uso e de responsabilidade na ativação;
5. Telemetria de uso para calibrar os limiares do semáforo com a base real.

## 6. Métricas norte

- Ativação: % de contas que rodam 1ª verificação em 24 h;
- Conversão trial→pago; churn mensal < 3%;
- **Taxa laudo/verificação** (motor do marketplace);
- NPS do laudo (prazo prometido × cumprido).
