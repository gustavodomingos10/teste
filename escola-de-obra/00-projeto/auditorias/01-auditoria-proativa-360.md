# 💎 AUDITORIA PROATIVA 360° — ESCOLA DE OBRA
### O que você não viu, o que eu mesmo errei, e o que já foi corrigido
*17/07/2026 | Método: revisão adversarial independente dos 3 documentos + verificações externas (domínio, site, catálogo de normas) | Placar: **20 achados do auditor adversarial (18 acatados, 2 arbitrados com verificação extra) + 9 achados meus de negócio/jurídico** — tudo o que era corrigível em arquivo JÁ ESTÁ CORRIGIDO; o que depende de você está na tabela final.*

---

## PARTE 1 — TRANSPARÊNCIA RADICAL: O QUE EU MESMO ERREI (e já corrigi)

O Padrão Diamante vale para mim também. Coloquei um auditor independente para tentar reprovar meus três documentos. Ele achou. Corrigido:

**1.1 — NBR 16280: minha designação era ambígua.** Eu escrevia "16280:2020 + Em.2024". Fui ao catálogo e arbitrei: o histórico oficial é 2014 → 2015 (emenda) → 2020 (emenda) → 2022 (errata) → **2024 (consolidação vigente, 01/2024)**. Agora todos os arquivos dizem **"NBR 16280:2024 (consolidação 01/2024)"** — designação indiscutível. [Fonte: catálogo Target/Normas.com.br](https://www.normas.com.br/visualizar/abnt-nbr-nm/34088/abnt-nbr16280-reforma-em-edificacoes-sistema-de-gestao-de-reformas-requisitos)

**1.2 — NBR 16636: inconsistência interna.** Um trecho dizia "partes 1-3", outro "1/-2:2017". Unificado: o curso 1 usa as **partes 1 e 2 (2017)**; a parte 3 (2020) é urbanística e está fora do escopo.

**1.3 — Instrução de teste de planilha era INEXECUTÁVEL.** Eu mandava "reabrir com openpyxl e conferir resultados" — mas openpyxl **não calcula fórmulas** (devolve a string da fórmula). Corrigido: recálculo via LibreOffice headless ou validação paralela em Python. Se isso tivesse ido para o Claude Code, a "QA testada" seria teatro.

**1.4 — Contradição offline × CDN.** A ferramenta prometia "funciona offline" mas permitia biblioteca via CDN. Agora: **libs sempre embutidas no arquivo** — offline de verdade.

**1.5 — Matemática do quiz não fechava.** "1 questão por aula" × módulos de 6-10 aulas ≠ "quiz de 5 questões". Regra criada: cada aula gera ≥1 questão; as 5 melhores viram o quiz do módulo; excedentes vão para a prova do certificado.

**1.6 — Numeração dos checkpoints.** "ETAPA N/5" com 6 etapas (0–5) geraria o esquisito "ETAPA 0/5". Padronizado: "ETAPA N — (trilha 0–5)".

**1.7 — Superlativo sem prova.** "Diferencial que NENHUM concorrente tem" → CONAR exige comprovação de superlativo. Agora: "não encontramos em nenhum concorrente pesquisado" + confirmação com fontes na Etapa 1.

**1.8 — Frase-âncora com prazo.** "Em um mês, quero você..." prometia resultado com prazo — tensionava a própria regra 3.6. Reescrita sem prazo.

**1.9 — "Um laudo paga o combo".** Verdadeiro no topo da faixa, mas laudos simples começam em R$ 200 (< combo R$ 497). Corrigido para "um laudo **pode** pagar o combo" + fonte do R$ 625/hora rebaixada para "reporte secundário — conferir tabela oficial IBAPE-SP" antes de qualquer copy.

**1.10 — Nome da empresa divergente.** "Engenharia GD" vs "GD Engenharia e Perícia". Unificado com o dado OFICIAL verificado no seu site: **GD Engenharia e Perícia Ltda — CNPJ 54.705.748/0001-19**.

*O que o auditor tentou reprovar e NÃO conseguiu (conferido): toda a aritmética de taxas (Kiwify R$ 6,98 / Hotmart R$ 8,43 em R$ 49,90), 12×49,70 = R$ 596,40, artigos do CPC/CDC/leis citados, e todas as substituições de norma da auditoria anterior (NM 67→16889, 16752, 16868, 8545 vigente, 16935≠reforço).*

---

## PARTE 2 — RISCOS JURÍDICOS QUE NINGUÉM TINHA POSTO NO PAPEL (corrigidos no prompt)

**2.1 — ⚠️ CRÍTICO: o acervo de fotos podia virar processo.** Suas fotos vêm de obras de clientes e de perícias judiciais. Três riscos empilhados: **sigilo profissional** (Código de Ética CONFEA), **segredo de justiça** (material de processo), e **LGPD/direito de imagem** (fachadas identificáveis, rostos de trabalhadores). As regras N1-N3 tratavam só de VERACIDADE, não de CONFIDENCIALIDADE. Criei a **regra N4** no Bloco 0: só obra própria/autorizada e anonimizada; material de perícia identificável ou de processo em curso está **vetado**; casos-limite passam por advogado. É a diferença entre "tenho muitas fotos" e "posso usar essas fotos".

**2.2 — ⚠️ CRÍTICO: ferramenta pública que classifica risco estrutural.** O "Diagnóstico de Fissuras LITE" aberto ao público (inclusive leigos) pode subavaliar um caso real → responsabilidade civil (CDC art. 14) com potencial de dano físico. Regra criada: **calibragem sempre conservadora** — em cenário grave/ambíguo a ferramenta nunca "libera", sempre encaminha (engenheiro habilitado / Defesa Civil 199 / Bombeiros 193); e a versão pública só vai ao ar com revisão específica assinada por você.

**2.3 — Combo vitalício vendido antes de existirem os 10 cursos = venda de entrega futura.** A oferta vincula (CDC arts. 30 e 35). Regra criada: o combo só entra no ar com **≥ 3 cursos publicados OU cronograma público de lançamento** + política de atraso; âncora sempre no preço cheio (R$ 999), nunca no beta (10×49,90 ≈ R$ 499 esvaziaria a oferta — pego pelo auditor); e "vitalício" ganhou compromisso mínimo objetivo na própria oferta.

**2.4 — Quinta às 19h podia virar "parecer técnico grátis com seu CREA na linha".** Responder sobre a obra específica de um aluno, em grupo, sem contrato nem ART = parecer informal de um perito judicial — prato cheio para responsabilização. Regras do grupo criadas: respostas **em tese**, disclaimer fixo, proibição de dados identificáveis de obra/cliente/**empregador** (o microdesafio pedia foto da obra do aluno — que geralmente é a obra do patrão dele!), e aviso LGPD (números visíveis em grupo).

**2.5 — Depoimento incentivado.** "Beta a R$ 49,90 EM TROCA de depoimento" fere CONAR/CDC (testemunho comprado não declarado). Desvinculado: preço de fundador para todos; depoimento voluntário; qualquer benefício, declarado.

**2.6 — Páginas de venda precisam identificar o fornecedor** (Decreto 7.962/2013 — Lei do E-commerce): razão social, CNPJ, endereço e atendimento em toda página de checkout. **Boa notícia verificada: seu site principal JÁ cumpre** (rodapé com GD Engenharia e Perícia Ltda, CNPJ, endereço, termos e privacidade ✅) — a regra agora obriga o mesmo padrão nas páginas da Kiwify/Hotmart.

---

## PARTE 3 — DESCOBERTAS DE NEGÓCIO (verificadas agora, com fontes)

**3.1 — 🚨 O domínio escoladeobra.com.br JÁ ESTÁ REGISTRADO.** Verificação no Registro.br: status "registrado", expira **26/05/2027**, apontando para servidores de estacionamento (dns-parking, típico de Hostinger). **Se foi você que registrou: ótimo — só falta apontar o DNS. Se NÃO foi você, a marca está exposta**: alternativas — usar `escola.engenhariagd.com.br` (recomendado de toda forma: herda a autoridade do seu domínio e sai de graça), registrar `escoladeobra.eng.br`, ou tentar adquirir o .com.br do titular. AÇÃO HOJE: conferir a titularidade no painel do seu provedor ou via WHOIS no registro.br.

**3.2 — Seu site ainda não tem porta de entrada para a Escola.** A auditoria da home confirmou: menu com Perícias, Treinamentos NR, Plataformas, Blog — **zero menção a cursos para engenheiros civis**. Criar a rota `/escola` com captura própria antes do lançamento (a Etapa 5 do prompt já gera a página).

**3.3 — Marca no INPI.** "Escola de Obra" não tem registro verificado por mim (a busca INPI não é confiável por web pública). Ação: busca prévia + depósito na classe 41 (educação) — nome curto e algo genérico: registrabilidade a avaliar com agente de PI. Enquanto isso, o uso conjunto "Escola de Obra · by GD Engenharia e Perícia" fortalece o conjunto.

**3.4 — E-mail: sequências de lançamento saindo de @hotmail queimam entrega.** Criar e-mail de domínio próprio (ex.: escola@engenhariagd.com.br) com SPF/DKIM antes da primeira sequência — já virou regra na Etapa 5.

**3.5 — WhatsApp: o número publicado é o mesmo do atendimento da empresa.** Para o grupo VIP, usar **WhatsApp Business com número dedicado** (chip barato resolve): separa o canal, permite mensagens automáticas e protege seu número principal de spam quando a escala chegar.

**3.6 — CNPJ ativo confirmado — falta só o enquadramento.** GD Engenharia e Perícia Ltda existe e fatura. Confirmar com o contador se o CNAE de treinamento/cursos (ex.: 85.99-6) está na atividade para emitir NF dos cursos — `[VALIDAR com contador antes da 1ª venda]`.

**3.7 — Pirataria em low-ticket:** verificar o recurso de carimbo/marca d'água com dados do comprador nos PDFs (Hotmart tem; Kiwify `[VALIDAR]`). Já incluído no checklist de publicação.

**3.8 — Certificados:** você JÁ tem gerador de certificado na sua plataforma (visto nas suas telas do curso NR-35) — reaproveitar para a Escola com página de validação por QR no seu domínio; nota de corte de 70% no quiz final agora é regra (certificado sem prova não sustenta credibilidade).

**3.9 — Nota de coerência da vitrine:** os treinamentos NR existentes no site convivem com a nova Escola — vale conferir que os certificados NR seguem os requisitos de capacitação da NR-1 (conteúdo programático, carga horária, avaliação e responsável identificado), porque a mesma vitrine agora carrega a marca "o rigor de quem assina". Fora do escopo desta esteira; fica o registro de quem audita o todo.

---

## PARTE 4 — TABELA DE AÇÕES QUE SÓ VOCÊ PODE FAZER

| # | Ação | Urgência | Antes de quê |
|---|---|---|---|
| 1 | Conferir titularidade de **escoladeobra.com.br** (painel/WHOIS) | 🔴 HOJE | Qualquer material com a marca |
| 2 | Contador: CNAE de cursos + emissão de NF | 🔴 Alta | Primeira venda |
| 3 | Advogado: revisar regra N4 (acervo/perícias), termos, política de vitalício e minutas | 🔴 Alta | Lançamento |
| 4 | Assinatura ABNT Coleção/GEDWEB (acesso legal às normas) | 🟡 Média | Produção das apostilas |
| 5 | Tabela oficial IBAPE-SP vigente (honorários) — baixar com data | 🟡 Média | Copy e cursos 9-10 |
| 6 | Número dedicado WhatsApp Business para a Escola | 🟡 Média | Abertura do grupo VIP |
| 7 | E-mail de domínio próprio (SPF/DKIM) | 🟡 Média | Primeira sequência de e-mails |
| 8 | Busca prévia + depósito INPI classe 41 | 🟢 30 dias | Investimento pesado em marca |
| 9 | Separar as fotos do acervo já aplicando a regra N4 (própria/autorizada/anonimizada) | 🟡 Média | Etapa 3 (roteiros) |

---

## FONTES DESTA AUDITORIA

- [Registro.br — disponibilidade de escoladeobra.com.br (status: registrado, exp. 26/05/2027)](https://registro.br/v2/ajax/avail/raw/escoladeobra.com.br)
- [Site GD Engenharia e Perícia — rodapé com razão social/CNPJ/termos verificados](https://engenhariagd.com.br)
- [Catálogo Target/Normas.com.br — histórico completo da NBR 16280](https://www.normas.com.br/visualizar/abnt-nbr-nm/34088/abnt-nbr16280-reforma-em-edificacoes-sistema-de-gestao-de-reformas-requisitos)
- [Decreto 7.962/2013 — contratação no comércio eletrônico](https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2013/decreto/d7962.htm)
- [CDC — Lei 8.078/1990 (arts. 14, 30, 35, 37, 49)](https://www.planalto.gov.br/ccivil_03/leis/l8078compilado.htm)
- Revisão adversarial independente executada sobre os 3 documentos do projeto (20 achados; relatório interno desta sessão)

*Auditoria 360 Padrão Diamante — auditar os outros é fácil; o rigor de verdade é auditar a si mesmo.*
