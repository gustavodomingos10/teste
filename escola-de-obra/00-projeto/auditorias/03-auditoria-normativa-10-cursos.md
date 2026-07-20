# 💎 AUDITORIA NORMATIVA — OS 10 CURSOS DA ESCOLA DE OBRA
### Verificação norma a norma, com fontes — nada segue adiante sem base
*Auditoria executada em 17/07/2026 | 3 frentes de pesquisa paralelas | ~35 normas verificadas em catálogos e fontes técnicas*

---

## COMO LER ESTE DOCUMENTO

Cada curso da trilha recebeu: **(a)** o que a auditoria encontrou e corrigiu; **(b)** a espinha dorsal normativa com **edição vigente verificada**; **(c)** os valores-chave que as aulas devem citar com fonte; **(d)** referências complementares (sempre rotuladas); **(e)** as fontes da verificação.

**Limite honesto da auditoria:** o que se verifica pela internet é o *metadado* da norma (número, título oficial, edição vigente, emendas, status). O *conteúdo* (tabelas, valores, itens) é texto pago da ABNT — por isso, todo valor numérico citado em aula carrega a regra: **conferir no texto oficial da norma antes de gravar** (via ABNT Coleção/GEDWEB). Isso não é fraqueza do projeto — é exatamente o rigor que a marca vende.

---

## ACHADOS GLOBAIS DA AUDITORIA (o que foi corrigido)

**A1 — O prompt tinha a regra do rigor, mas não tinha o mapa.** A v3.0 exigia "normas por número e nome" e o VALIDAR.md, mas não fixava QUAIS normas ancoram CADA curso, nem as edições. Corrigido: este documento + **Anexo A** adicionado ao prompt (v3.1) com a base normativa por curso. O gerador de conteúdo agora não tem como "escolher errado".

**A2 — NBR 6118 mudou, e quase todo o mercado ensina a versão velha.** A edição vigente é a **NBR 6118:2023** (com erratas 11/2023 e 01/2024) **+ Emenda 1 de 11/03/2026** (que trata, entre outros, de reforço contra colapso de marquises). Curso que ensina "6118:2014" em 2026 já nasce desatualizado — e será o caso da maioria dos concorrentes. Isso vira diferencial de marketing legítimo: *"atualizado à 6118:2023 com a Emenda de 2026"*. [Fonte: ABECE](https://site.abece.com.br/nbr-6118-tem-emenda-publicada-pela-abnt/)

**A3 — Execução de concreto: título e edição novos.** A **NBR 14931:2023** substituiu a edição 2004 e mudou de título: *"Execução de estruturas de concreto armado, protendido e com fibras — Requisitos"*. Citar o título antigo denuncia material desatualizado. [Fonte: ABECE](https://site.abece.com.br/nova-nbr-14931-e-publicada/)

**A4 — Slump test: a NBR NM 67 está CANCELADA desde 12/2020.** O ensaio de abatimento é regido pela **NBR 16889:2020** (confirmada em 01/2025). Enorme quantidade de material didático no mercado ainda cita "NM 67" — nos cursos da Escola de Obra isso é **proibido** (regra adicionada ao prompt e à QA). [Fonte: Busca Normas](https://buscanormas.com.br/norma/nbr-16889-concreto-determinacao-da-consistencia-pelo-abatimento-do-tronco-de-cone)

**A5 — Perícias: a NBR 13752 ganhou edição 2024.** Vigente desde 22/10/2024, substituiu a de **1996** — modelos de laudo que circulam por aí ainda citam a antiga. Cursos 9 e 10 nascem na edição nova. [Fonte: Normas.com.br](https://www.normas.com.br/visualizar/abnt-nbr-nm/10297/abnt-nbr13752-pericias-de-engenharia-na-construcao-civil)

**A6 — Reforço estrutural: NÃO EXISTE norma brasileira geral — e uma armadilha foi desarmada.** Confirmado com fonte: não há NBR que trate de forma exaustiva a recuperação/reforço de estruturas de concreto. E atenção à pegadinha: a **NBR 16935:2021 NÃO é norma de reforço com fibra colada (PRF)** — ela trata de *concreto reforçado com fibras* (fibras na massa, CRF); e a NBR 16974:2022 é ensaio de agregado (abrasão Los Angeles). O curso 8 tratará a lacuna com honestidade: base nas NBRs de projeto/execução/diagnóstico + referências internacionais **rotuladas como internacionais** (ACI 562, ACI 440.2R, EN 1504). Quem apresenta isso corretamente transmite MAIS autoridade, não menos. [Fontes: IBRACON](http://ibracon.org.br/Site_revista/Concreto_Construcoes/pdfs/edicao105/P%C3%A1ginas%20de%20Revista%20Concreto%20IBRACON%20105%20-%20noramlizacao.pdf) · [Statera](https://stateraengenharia.com.br/2024/08/recuperacao-de-estruturas-de-concreto-no-brasil-um-olhar-sobre-normas-e-particularidades/)

**A7 — Trio manutenção/reforma atualizado por emendas de 23/01/2024.** NBR 5674 (manutenção), NBR 14037 (manual de uso) e NBR 16280 (reformas) receberam emendas em 2024 — citar sem a emenda é desatualizado. *Correção da auditoria 360:* a designação vigente da 16280 é a **consolidação de 01/2024 ("NBR 16280:2024")** — histórico completo no catálogo: 2014 → 2015 (emenda) → 2020 (emenda) → 2022 (errata) → 2024 ([Target/Normas.com.br](https://www.normas.com.br/visualizar/abnt-nbr-nm/34088/abnt-nbr16280-reforma-em-edificacoes-sistema-de-gestao-de-reformas-requisitos)). [Fonte: Boletim CBIC 2024](https://cbic.org.br/wp-content/uploads/2025/02/boletim-alteracoes-de-normas-tecnicas-setor-da-construcao-civil-2024.pdf)

**A8 — NBR 15575 ganhou emendas em 12/2025 (desempenho térmico).** Partes 1, 4 e 5 emendadas para alinhar ao novo zoneamento bioclimático da NBR 15220-3 (jun/2025). Citar como "NBR 15575:2013 com emendas (última: 12/2025)". [Fonte: Busca Normas](https://buscanormas.com.br/guias/nbr-15575)

**A9 — Normas EM REVISÃO exigem rechecagem na véspera da gravação.** Situação em jul/2026: **NBR 15696** (fôrmas/escoramentos — consulta nacional encerrada 08/2025, novo título já no catálogo, ano da nova edição não confirmado), **NBR 9574/9575** (impermeabilização — revisão em fase final), **NBR 11682** (encostas — revisão em andamento, vigente a 2009). Regra criada no prompt: essas normas entram no VALIDAR.md com checagem obrigatória de catálogo na semana da gravação.

**A10 — Direito autoral da ABNT (risco jurídico que ninguém te contou).** As normas são texto protegido e pago. Os cursos podem — e devem — **citar** ("conforme NBR 6118:2023, item X"), mas **não podem reproduzir tabelas e trechos extensos** em apostilas, slides e checklists. Regra adicionada ao prompt: parafrasear com redação própria + citação de número:ano e item; e o instrutor precisa de acesso legal aos textos (ABNT Coleção/GEDWEB) para a conferência final que o Padrão Diamante promete. Isso protege a escola de takedown e processo.

**A11 — Alvenaria: duas normas, dois mundos.** Alvenaria **estrutural** = NBR 16868:2020 (partes 1-3; substituiu as antigas 15961 e 15812). Alvenaria de **vedação** cerâmica = **NBR 8545:1984, que segue VIGENTE** (reconfirmada em 02/2022) — erro comum é tratá-la como cancelada. Curso 4 usa as duas, cada uma no seu lugar. [Fonte: CBIC](https://cbic.org.br/novas-normas-de-alvenaria-estrutural-corrigem-antiga-distorcao/) · [Target](https://www.normas.com.br/visualizar/abnt-nbr-nm/5767/abnt-nbr8545-execucao-de-alvenaria-sem-funcao-estrutural-de-tijolos-e-blocos-ceramicos-procedimento)

**A12 — Curso 1 também é curso de norma (sua exigência, confirmada).** Leitura de projetos tem espinha normativa própria: **NBR 16752:2020** (folhas de desenho — substituiu as antigas NBR 10068, 10582 e 13142), **NBR 6492:2021** (novo título: *Documentação técnica para projetos arquitetônicos e urbanísticos*) e **NBR 16636** (partes 1 e 2:2017 — a parte 3:2020 é urbanística, fora do escopo do curso). Nenhum concorrente pesquisado no low-ticket ensina leitura de projetos citando essas normas — mais um diferencial.

---

## FASE A — EXECUTAR BEM

### CURSO 1 — Ler e interpretar projetos executivos
**Veredito:** ⚠️ ajustado — era o curso mais "solto" normativamente; agora tem espinha própria.
**Correções da auditoria:** ancorado nas normas de documentação técnica (ninguém esperava que "ler projeto" tivesse norma — tem, e mais de uma); proibido citar NBR 10068/10582/13142 (canceladas, absorvidas pela 16752).

| Base normativa (edição verificada) | O que rege dentro do curso |
|---|---|
| NBR 16752:2020 | Folhas de desenho: formatos, legenda/carimbo, dobramento — como "decodificar" a prancha |
| NBR 6492:2021 | Documentação de projetos de arquitetura: o que cada peça (planta, corte, fachada, memorial) deve conter |
| NBR 16636-1/-2:2017 | Etapas de projeto (estudo preliminar → anteprojeto → executivo): o que é exigível em cada fase |
| NBR 6118:2023 + Em.1:2026 | O que o projeto estrutural deve apresentar (detalhamento de armaduras, cobrimentos, notas de projeto) |
| NBR 14931:2023 | A ponte projeto→execução: o que a obra precisa extrair da prancha antes de executar |

**Valores-chave a citar em aula (conferir no texto oficial antes de gravar):** formatos de folha e margens (16752); conteúdo mínimo do carimbo (16752); peças obrigatórias do projeto executivo (6492/16636).
**Complementares (rotular):** manuais de representação da ABECE (prática de mercado).
**Segurança em campo:** NR-18 (circulação no canteiro durante conferência de projeto).

### CURSO 2 — Fundações de casas e sobrados
**Veredito:** ✅ aprovado com edições fixadas.
**Correções da auditoria:** fixada a 6122 com emenda (2019/Em.1:2022); incluída a NBR 8036:1983 — antiga porém **vigente e reconfirmada em 12/2023** (quantidade/locação de sondagens), que quase ninguém cita.

| Base normativa (edição verificada) | O que rege dentro do curso |
|---|---|
| NBR 6122:2019 (VC 2021 + Em.1:2022) | Projeto e execução de fundações: tipos, desempenho, controle |
| NBR 6484:2020 | Sondagem SPT: como ler um boletim de sondagem sem depender de ninguém |
| NBR 8036:1983 (reconfirmada 2023) | Quantas sondagens a obra precisa e onde locá-las |
| NBR 6118:2023 | Elementos estruturais de fundação em concreto (sapatas, blocos, vigas baldrame) |
| NBR 12655:2022 + NBR 14931:2023 | Concreto da fundação: preparo, recebimento e execução |

**Valores-chave a citar em aula (conferir no texto oficial):** número mínimo de sondagens por área de projeção (8036); critérios de parada de sondagem (6484); tolerâncias executivas de fundações (6122).
**Complementares (rotular):** Velloso & Lopes, *Fundações* (literatura clássica).
**Segurança em campo:** NR-18 (escavações), NR-06 (EPI).

### CURSO 3 — Receber e liberar concreto com critério
**Veredito:** ⚠️ ajustado — aqui morava o erro mais comum do mercado.
**Correções da auditoria:** **NM 67 banida** (cancelada em 2020 — slump é NBR 16889:2020); fixadas 12655:2022 e 7212:2021; cadeia completa do caminhão ao laudo de não conformidade fechada com normas de ensaio.

| Base normativa (edição verificada) | O que rege dentro do curso |
|---|---|
| NBR 12655:2022 | O CORAÇÃO do curso: responsabilidades, recebimento e ACEITAÇÃO do concreto (quem responde pelo quê) |
| NBR 7212:2021 | Concreto dosado em central: o que exigir da concreteira, tempo de transporte, nota fiscal do traço |
| NBR 16889:2020 | Ensaio de abatimento (slump): procedimento e critérios — **nunca citar NM 67** |
| NBR 5738:2015 (VC 2016) + NBR 5739:2018 | Moldagem/cura e ensaio de corpos de prova: o lastro do fck |
| NBR 14931:2023 | Lançamento, adensamento, cura, juntas de concretagem |
| NBR 6118:2023 | Classes de agressividade, cobrimentos e fck de projeto (o porquê dos limites) |
| NBR 7680-1:2015 | Plano B: extração de testemunhos quando o corpo de prova não atinge fck |
| (opcional) NBR 15823:2017 | Concreto autoadensável, se o curso tocar no tema |

**Valores-chave a citar em aula (conferir no texto oficial):** tolerância de abatimento vs. pedido (16889/7212); tempo-limite entre mistura e fim da descarga (7212); a/c máx e consumo mínimo por CAA (12655); cobrimentos nominais por CAA (6118, tabela de cobrimentos).
**Complementares (rotular):** boletins técnicos IBRACON.
**Segurança em campo:** NR-18 (concretagem), NR-35 se bombeamento em altura.

### CURSO 4 — Inspecionar serviços críticos (forma, armação, escoramento e alvenaria)
**Veredito:** ⚠️ ajustado — norma de escoramento está EM REVISÃO; regra de rechecagem criada.
**Correções da auditoria:** NBR 15696 marcada como "rechecar catálogo na semana da gravação" (nova edição iminente, título novo já no catálogo); separação correta alvenaria estrutural (16868:2020) × vedação (8545:1984, vigente).

| Base normativa (edição verificada) | O que rege dentro do curso |
|---|---|
| NBR 14931:2023 | Tolerâncias e requisitos de execução: formas, armação, concretagem |
| NBR 15696:2009 ⚠️ em revisão | Fôrmas e escoramentos: projeto, dimensionamento e procedimentos — **[VALIDAR nova edição no catálogo ABNT antes de gravar]** |
| NBR 6118:2023 | Armadura: cobrimento, espaçadores, emendas, dobras — o que conferir antes de liberar |
| NBR 16868-2:2020 | Execução e controle de alvenaria ESTRUTURAL (substituiu 15961/15812) |
| NBR 8545:1984 (reconfirmada 2022) | Execução de alvenaria de VEDAÇÃO cerâmica — vigente, apesar da idade |
| NBR 15575-4:2013 (+ emendas) | Desempenho exigível das vedações (o "porquê" da boa execução) |

**Valores-chave a citar em aula (conferir no texto oficial):** tolerâncias dimensionais de forma e prumo (14931); prazos/condições de desforma (14931); requisitos de escoramento e reescoramento (15696).
**Complementares (rotular):** manuais de fôrmas ABRASFE (setoriais).
**Segurança em campo:** NR-18 (escoramentos e trabalho em lajes), NR-35.

### CURSO 5 — Fissuras e trincas: diagnosticar como um perito (PILOTO)
**Veredito:** ✅ aprovado — e agora com a régua normativa que separa "estética" de "estrutural".
**Correções da auditoria:** fixados os dois eixos do diagnóstico (limites de abertura da 6118:2023; desempenho/VUP da 15575 com emendas 12/2025); método de inspeção ancorado na 16747:2020 + norma IBAPE; impermeabilização (fissura × infiltração) com alerta de revisão em curso.

| Base normativa (edição verificada) | O que rege dentro do curso |
|---|---|
| NBR 6118:2023 + Em.1:2026 | Limites de abertura de fissura por classe de agressividade; durabilidade — a régua do "aceitável × alarmante" |
| NBR 15575:2013 (+ Em.1:2021 e emendas 12/2025) | Desempenho, vida útil e limites de estado de serviço — a régua do usuário |
| NBR 16747:2020 | Método profissional de inspeção: como olhar, classificar e priorizar |
| Norma de Inspeção Predial IBAPE Nacional (2012) | Classificação de anomalias (endógena/exógena/funcional), grau de risco — vocabulário de perito |
| NBR 9575:2010 / NBR 9574:2008 ⚠️ em revisão | Fissura × infiltração: quando a causa é impermeabilização — **[VALIDAR nova edição antes de gravar]** |
| NBR 13752:2024 | Quando o diagnóstico vira laudo: forma e conteúdo (ponte para o curso 9) |

**Valores-chave a citar em aula (conferir no texto oficial):** aberturas-limite wk por CAA (6118); prazos de garantia/VUP usuais (15575); classificação de grau de risco (IBAPE).
**Complementares (rotular):** Ercio Thomaz, *Trincas em edifícios* (a bíblia do tema); acervo fotográfico próprio do instrutor.
**Segurança em campo:** NR-35 (inspeção de fachada/altura quando aplicável).

---

## FASE B — DIAGNOSTICAR E CORRIGIR

### CURSO 6 — Patologias do concreto e das edificações
**Veredito:** ✅ aprovado com edições fixadas (trio de manutenção com emendas 2024).

| Base normativa (edição verificada) | O que rege dentro do curso |
|---|---|
| NBR 6118:2023 | Durabilidade: classes de agressividade, qualidade do concreto, cobrimento — a raiz da prevenção |
| NBR 12655:2022 | Relação a/c, consumo mínimo e classe por CAA — onde a patologia começa (ou é evitada) |
| NBR 15575:2013 (+ emendas até 12/2025) | Vida útil de projeto e desempenho ao longo do tempo |
| NBR 5674:2012 + Emenda 01/2024 | Manutenção: quando a patologia nasce de gestão omissa |
| NBR 14037:2011 + Emenda 01/2024 | Manual de uso e operação: responsabilidades do usuário × construtor |
| NBR 16747:2020 | Inspeção como método de diagnóstico |
| NBR 7680-1:2015 | Testemunhos: investigação de resistência em estrutura existente |

**Valores-chave a citar em aula (conferir no texto oficial):** a/c e classe mínima por CAA (12655); periodicidades típicas de manutenção (5674); VUP por sistema (15575).
**Complementares (rotular como literatura/intern.):** Helene, *Manual de reparo, proteção e reforço* (Red Rehabilitar); Souza & Ripper, *Patologia, recuperação e reforço*; EN 1504 (produtos e sistemas de reparo — internacional).
**Segurança em campo:** NR-35 (fachadas), NR-06.

### CURSO 7 — Muros de arrimo e contenções
**Veredito:** ⚠️ ajustado — norma-mãe em revisão + normas de 2021 que o mercado ainda não incorporou.
**Correções da auditoria:** incluídas as NBR 16920-1/-2:2021 (solos reforçados/solo grampeado — novíssimas na prática de mercado); NBR 11682:2009 mantida como vigente com alerta de revisão em andamento (ABMS); tirantes na 5629:2018.

| Base normativa (edição verificada) | O que rege dentro do curso |
|---|---|
| NBR 11682:2009 ⚠️ em revisão | Estabilidade de encostas: a norma-mãe — **[rechecar catálogo antes de gravar]** |
| NBR 16920-1/-2:2021 | Muros e taludes em solos reforçados; solo grampeado — as normas novas do tema |
| NBR 5629:2018 | Tirantes ancorados: projeto, execução e ensaios |
| NBR 6122:2019 (Em.1:2022) | Fundação do muro; empuxos e verificações geotécnicas |
| NBR 6118:2023 | Muro de concreto armado: dimensionamento e detalhamento |
| NBR 9575:2010 ⚠️ em revisão | Impermeabilização e drenagem associada (barbacãs, dreno de tardoz) |

**Valores-chave a citar em aula (conferir no texto oficial):** fatores de segurança por nível de segurança da obra (11682); ensaios de recebimento de tirantes (5629); sinais de alerta executivos (drenagem cega, tardoz sem dreno — prática + acervo do instrutor, rotulado como experiência).
**Complementares (rotular como manuais públicos):** manuais GeoRio; publicações ABMS.
**Segurança em campo:** NR-18 (escavações e taludes — risco de soterramento).

### CURSO 8 — Reforço estrutural: quando escorar, quando interditar, quem chamar
**Veredito:** ⚠️ o mais ajustado de todos — aqui a auditoria desarmou uma bomba.
**Correções da auditoria:** (1) confirmada a **lacuna normativa brasileira** — não existe NBR geral de recuperação/reforço; o curso assume isso ABERTAMENTE (isso é autoridade, não fraqueza); (2) **armadilha desarmada:** NBR 16935:2021 é *concreto com fibras* (CRF), NÃO reforço colado com PRF — citá-la como "norma de reforço" seria erro técnico público; (3) a **Emenda 1:2026 da NBR 6118** (reforço contra colapso de marquises) entra como gancho de atualidade — pouquíssimos sabem dela.

| Base normativa (edição verificada) | O que rege dentro do curso |
|---|---|
| NBR 6118:2023 **+ Emenda 1 de 03/2026** | Verificação estrutural; a emenda traz exigências ligadas a marquises/colapso — atualidade que vira aula |
| NBR 14931:2023 | Execução do reforço em concreto (inclui estruturas com fibras no novo escopo) |
| NBR 15696:2009 ⚠️ em revisão | Escoramento provisório e emergencial — coração do "quando escorar" |
| NBR 7680-1:2015 | Diagnóstico de resistência antes de reforçar |
| NBR 12655:2022 | Concreto do reforço: especificação e controle |
| NBR 16280:2024 (consolidação 01/2024) | Reforma com alteração estrutural: exigência de responsável e projeto — blindagem legal do júnior |
| **Lacuna declarada** | Não há NBR geral de reforço → referências internacionais SEMPRE rotuladas: ACI 562 (avaliação/reparo), ACI 440.2R (PRF colado), EN 1504 (produtos de reparo) |

**Valores-chave a citar em aula (conferir no texto oficial):** critérios de interdição/escoramento emergencial (15696 + boas práticas rotuladas); exigências da 16280 para reforma estrutural; o que a Emenda 1:2026 da 6118 alterou.
**Complementares (rotular):** Helene (Red Rehabilitar); Souza & Ripper; cadernos ABECE.
**Segurança em campo:** NR-18, NR-35 (escoramento e trabalho em altura) — em reforço, segurança é conteúdo, não rodapé.

---

## FASE C — DOCUMENTAR E FATURAR

### CURSO 9 — Laudos, vistorias e relatórios blindados
**Veredito:** ⚠️ ajustado — a norma central do curso trocou de edição em out/2024.
**Correções da auditoria:** **NBR 13752:2024** fixada como espinha (modelos de mercado ainda citam 1996 — os do curso não); vistoria cautelar ancorada em norma IBAPE-SP específica (2013) + NBR 12722:1992 (vigente, reconfirmada 2023); avaliação de bens somente com 14653 (Parte 1:2019; Parte 2:2011 confirmada 2024); acrescentada a base LEGAL (não só ABNT).

| Base normativa/legal (edição verificada) | O que rege dentro do curso |
|---|---|
| **NBR 13752:2024** | Forma, conteúdo e método de perícias/laudos — a edição NOVA (out/2024) |
| NBR 16747:2020 + Norma IBAPE Nacional (2012) | Inspeção predial: método, classificação de anomalias, grau de risco |
| Norma IBAPE-SP de Vistoria de Vizinhança (2013) | O laudo cautelar de vizinhança passo a passo — a "primeira renda" do júnior |
| NBR 12722:1992 (vigente) | Discriminação de serviços — apoio à vistoria de obra |
| NBR 14653-1:2019 e 14653-2:2011 | Avaliação de imóveis urbanos (quando o laudo envolve valor) |
| NBR 5674 / 14037 / 16280 (todas c/ emendas 2024) | Laudos de manutenção, entrega e reforma |
| Lei 5.194/1966 + Lei 6.496/1977 + Res. CONFEA 1.025/2009 | Exercício profissional, ART e acervo técnico — **[VALIDAR: conferir resoluções CONFEA vigentes em 2026]** |
| Código Civil, art. 1.277 (vizinhança) | Fundamento jurídico da vistoria cautelar |

**Valores-chave a citar em aula (conferir na fonte):** estrutura mínima de laudo (13752:2024); referencial de honorários IBAPE-SP (hora técnica — citar como referencial com fonte e data, jamais como promessa) **[VALIDAR tabela vigente]**.
**Complementares (rotular):** modelos próprios do instrutor (perito atuante — aqui o acervo dele é ouro).

### CURSO 10 — Introdução à perícia de engenharia
**Veredito:** ✅ aprovado — com base legal explicitada (era só ABNT antes).

| Base normativa/legal (edição verificada) | O que rege dentro do curso |
|---|---|
| NBR 13752:2024 | Método e documentos da perícia de engenharia |
| CPC — Lei 13.105/2015, arts. 156–158 e 464–480 | O perito no processo: nomeação, impedimento, prazos, laudo, quesitos |
| CPC, art. 95 + tabelas dos TJs | Honorários periciais — **[VALIDAR tabela/procedimento do TJ-PR e TJ-SP vigentes]** |
| Res. CNJ 233/2016 | Cadastro eletrônico de peritos (CPTEC) — como entrar no radar dos juízes **[VALIDAR atualizações]** |
| NBR 14653 (1:2019; 2:2011) | Quando a perícia envolve valor de imóvel |
| Normas IBAPE (2012/2013) | Vocabulário e classificação reconhecidos pelo Judiciário |

**Valores-chave a citar em aula (conferir na fonte):** prazos processuais do perito (CPC); fluxo de nomeação e escusa; estrutura de laudo judicial (13752:2024 + prática do instrutor como perito atuante no TJ-PR/TJ-SP — credencial real do Bloco 0).
**Complementares (rotular):** manuais dos próprios TJs; a vivência do instrutor (12 anos, casos anonimizados conforme regras N1/N2/N3).

---

## PENDÊNCIAS ABERTAS (VALIDAR.md — nada disso trava a produção, mas trava a PUBLICAÇÃO)

| # | Pendência | Ação | Quando |
|---|---|---|---|
| 1 | NBR 15696 — nova edição (título novo já no catálogo) | Conferir catálogo ABNT | Semana da gravação dos cursos 4 e 8 |
| 2 | NBR 9574/9575 — revisão em fase final | Conferir catálogo ABNT | Antes de gravar cursos 5 e 7 |
| 3 | NBR 11682 — revisão em andamento (ABMS) | Conferir catálogo ABNT | Antes de gravar curso 7 |
| 4 | Resoluções CONFEA vigentes (ART) e Res. CNJ 233 | Conferir confea.org.br / cnj.jus.br | Antes de gravar cursos 9 e 10 |
| 5 | Tabelas de honorários periciais TJ-PR / TJ-SP e referencial IBAPE-SP | Conferir fontes oficiais + data | Antes da copy e dos cursos 9–10 |
| 6 | Todos os VALORES NUMÉRICOS de norma citados em aula | Conferir no texto oficial (ABNT Coleção/GEDWEB) | Revisão final de cada roteiro — assinatura do instrutor |
| 7 | Acesso legal às normas (assinatura ABNT Coleção ou GEDWEB) | Contratar/confirmar | Antes da produção das apostilas |

---

## FONTES DA VERIFICAÇÃO (principais)

- [ABECE — NBR 6118:2023 Emenda 1 publicada (mar/2026)](https://site.abece.com.br/nbr-6118-tem-emenda-publicada-pela-abnt/) · [ABECE — nova NBR 14931](https://site.abece.com.br/nova-nbr-14931-e-publicada/)
- [Target/Normas.com.br — catálogo (6118, 6122, 8036, 8545, 11682, 12722, 13752, 14037, 16280, 16920)](https://www.normas.com.br)
- [Busca Normas — NBR 16889 substitui NM 67](https://buscanormas.com.br/norma/nbr-16889-concreto-determinacao-da-consistencia-pelo-abatimento-do-tronco-de-cone) · [Guia NBR 15575](https://buscanormas.com.br/guias/nbr-15575)
- [CBIC — Boletim de alterações de normas 2024 (emendas 5674/14037/16280)](https://cbic.org.br/wp-content/uploads/2025/02/boletim-alteracoes-de-normas-tecnicas-setor-da-construcao-civil-2024.pdf) · [CBIC — NBR 16868 alvenaria estrutural](https://cbic.org.br/novas-normas-de-alvenaria-estrutural-corrigem-antiga-distorcao/)
- [IBRACON — Concreto & Construções nº 105 (normalização/16935)](http://ibracon.org.br/Site_revista/Concreto_Construcoes/pdfs/edicao105/P%C3%A1ginas%20de%20Revista%20Concreto%20IBRACON%20105%20-%20noramlizacao.pdf)
- [Statera — lacuna normativa em recuperação estrutural](https://stateraengenharia.com.br/2024/08/recuperacao-de-estruturas-de-concreto-no-brasil-um-olhar-sobre-normas-e-particularidades/)
- [IBAPE Nacional — Norma de Inspeção Predial (2012)](https://biblioteca.ibape-nacional.com.br/wp-content/uploads/2012/12/Norma-de-Inspe%c3%a7%c3%a3o-Predial-IBAPE-Nacional.pdf) · [IBAPE-SP — Norma de Vistoria de Vizinhança (2013)](https://www.ibape-sp.org.br/adm/upload/uploads/1545075689-NORMA-DE-VISTORIA-DE-VIZINHANCA-Procedimentos-basicos-executivos.pdf)
- [ABRASFE — consulta nacional da NBR 15696](https://abrasfe.org.br/blog/consulta-nacional-da-abnt-nbr-15696/) · [Revista Impermeabilizar — revisão 9574/9575](https://revistaimpermeabilizar.com.br/revisao-da-abnt-nbr-9574-e-abnt-nbr-9575-na-reta-final-da-revisao) · [ABMS — revisão da NBR 11682](https://www.abms.com.br/noticia/revisao-da-norma-tecnica-de-estabilidade-de-encostas-esta-em-andamento)

*Auditoria Padrão Diamante — o rigor de quem assina. Nenhum curso avança para produção sem fechar as pendências da sua linha na tabela acima.*

