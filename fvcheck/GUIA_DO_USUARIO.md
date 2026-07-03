# FV-CHECK — Guia do Usuário (para quem instala, não para engenheiro)

## Abrir o sistema

1. Dê dois cliques em `index.html` (ou rode `python3 -m http.server 8080` e acesse `http://localhost:8080`);
2. Quer só ver funcionando? Abra `demo.html` — entra com uma conta de demonstração e dois projetos prontos
   (um VERDE e um REPROVADO);
3. Primeiro uso de verdade: clique em **Criar conta** — a primeira conta vira administradora e ativa
   **14 dias grátis** automaticamente.

## O que você precisa ter em mãos (5 minutos com uma trena)

| Medida | Como pegar |
|---|---|
| Largura e comprimento do galpão | Medir por fora, em metros |
| Altura da parede (pé-direito) | Do chão até onde começa o telhado |
| Inclinação do telhado | Quanto o telhado **sobe** em 1 m na horizontal (subiu 10 cm = 10%) |
| Distância entre as treliças/tesouras | De um pilar ao próximo, no sentido do comprimento |
| Distância entre as terças | Sobre o telhado, de um "ferro" ao outro |
| O perfil da terça | Olhe de lado: "C" aberto = U · "C" com dobrinha = U enrijecido · "Z" = perfil Z · tubo fechado = metalon. Meça altura, largura e espessura da chapa (mm) |
| A telha | Tipo (fibrocimento, metálica, sanduíche…) |
| Os painéis | Modelo (potência), quantidade e como serão presos |

Não sabe o tipo de aço? Deixe **"Não sei"** — o sistema usa um valor seguro.

## Os 6 passos

1. **O projeto** — nome, cliente, cidade e Estado (o vento da sua região entra sozinho);
2. **Local e vento** — o que existe ao redor (campo aberto? casas? prédios?), terreno e se o barracão é
   **fechado ou aberto de um lado** (barracão aberto pega vento por dentro!);
3. **O galpão** — medidas e inclinação;
4. **Estrutura do telhado** — material da estrutura e das terças, perfil, distâncias, "ferrinhos" (correntes),
   se as terças são contínuas e o estado de conservação;
5. **A telha** — escolha no cartão;
6. **Os painéis** — modelo, quantidade, fixação e montagem. Clique em **⚡ Executar verificação**.

## Entendendo o resultado

- 🟢 **VERDE** — passou com folga nas 7 verificações. Imprima o memorial e anexe à proposta;
- 🟡 **ATENÇÃO** — está no limite ou tem ressalva (ex.: telha no limite, acréscimo de peso relevante).
  Recomendamos o **laudo assinado** antes de instalar;
- 🔴 **REPROVADO** — alguma verificação estourou. **Não instale.** Solicite o laudo — muitas vezes um
  reforço simples (mais correntes, terça adicional) resolve.

Cada item tem uma explicação simples ("O vento consegue arrancar o telhado?") e, clicando em
**Detalhe técnico**, as fórmulas e normas para o engenheiro conferir.

## Contratar o laudo assinado (ART)

No resultado, clique em **✍ Contratar laudo assinado** → o sistema mostra o orçamento pela área do telhado,
gera um **protocolo**, baixa o **dossiê técnico** (JSON) e abre o e-mail pronto para o calculista da rede.
Acompanhe o status na aba **Laudos assinados**.

## Planos, backup e segurança

- **Planos & Licença**: assine (a demo gera a chave na hora) ou ative por chave `GD-FV-…`;
- **Painel → Exportar backup**: baixa todos os projetos em JSON (guarde!). Importa na mesma tela;
- **Conta & Segurança**: troca de senha, usuários da equipe e **trilha de auditoria** com verificação
  de integridade (cada ação gera um hash encadeado — prova de que nada foi adulterado).

## Aviso importante

O FV-CHECK é uma **triagem**. Ele reduz seu risco e organiza a informação, mas **não substitui** o laudo
assinado por engenheiro com ART. Verde não é alvará; é folga técnica pelas verificações expressas —
as premissas e limitações estão escritas no memorial.
