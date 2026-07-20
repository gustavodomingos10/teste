#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Conteúdo do SLIDESHOW NARRADO — Curso 5 (piloto): Diagnóstico de Fissuras e Trincas.
Narração ('narr') na voz do instrutor (mentor direto). Rode: python3 curso_fissuras_slides.py"""
import os
from gerar_slides import render

AUTOR = ('Instrutor: <b>Gustavo Domingos</b> — Eng. Civil · CREA-PR 140.964-D<br>'
         'Perito judicial atuante em processos do TJ-PR e do TJ-SP')

S = []
S.append({"tipo":"capa","titulo":"Diagnóstico de Fissuras e Trincas",
  "sub":"Enxergue como um perito — leia o que a fissura está dizendo","autor":AUTOR,
  "narr":"Seja muito bem-vindo. Nas próximas duas horas e meia, você vai parar de olhar a trinca e começar a ler o que ela está dizendo — do jeito que eu faço quando sou chamado para periciar uma obra. Vamos com calma, aula por aula."})

S.append({"tipo":"conteudo","kick":"Como funciona","titulo":"O que você vai levar deste curso",
  "bullets":["<b>Classificar</b> a fissura por abertura e por origem provável",
             "<b>Medir e monitorar</b> para decidir se é ativa ou estabilizada",
             "<b>Avaliar a gravidade</b> e escolher o encaminhamento certo",
             "<b>Registrar e redigir</b> um laudo que protege você"],
  "narr":"O curso tem um objetivo prático: no final, você olha uma fissura e sabe o que fazer. Classificar, medir, decidir se é grave, e escrever o encaminhamento que te protege. Não é teoria — é o que você aplica na próxima obra."})

S.append({"tipo":"conteudo","kick":"Como estudar","titulo":"O curso e o seu Kit",
  "bullets":["4 módulos · aulas curtas · quiz ao fim de cada módulo",
             "⭐ Ferramenta de Diagnóstico Interativo (no celular, offline)",
             "Planilha de monitoramento · Checklist · Guia de bolso · Laudo blindado",
             "Aulas gravadas para revisar quando quiser · gabarito comentado a cada módulo"],
  "narr":"Além dos slides, você tem o Kit: a ferramenta de diagnóstico no celular, a planilha, o checklist, o guia de bolso e o modelo de laudo. Faça os microdesafios e registre no seu caderno de campo; ao fim de cada módulo, o gabarito comentado fecha o raciocínio com você."})

# ---------- MÓDULO 1 ----------
S.append({"tipo":"modulo","num":"Módulo 1","titulo":"O olho que enxerga a fissura certa","min":"~32 min · 5 aulas",
  "narr":"Módulo um. Antes de ler qualquer fissura, a gente precisa afiar o olho: o vocabulário certo, os instrumentos certos e o jeito certo de medir. É a base de tudo."})

S.append({"tipo":"conteudo","kick":"Aula 1.1","titulo":"Fissura não é defeito — é sintoma",
  "bullets":["A fissura é a manifestação visível de um mecanismo (tensão, retração, movimentação, umidade)",
             "Tapar sem diagnosticar é tratar febre sem investigar a infecção",
             "O problema volta — e a sua credibilidade vai junto"],
  "foto":"fachada de casa/sobrado com fissuras visíveis",
  "narr":"Primeira virada de chave: a fissura não é um defeito para tapar, é um sintoma. Ela está te contando que algum mecanismo está agindo. Se você pinta por cima sem entender a causa, o problema volta — e aí quem fica com a fama de picareta é você."})

S.append({"tipo":"conteudo","kick":"Aula 1.2","titulo":"O vocabulário que te dá autoridade",
  "sub":"Fissura → trinca → rachadura → fenda (convenção do curso)",
  "bullets":["Da mais fina à mais larga — uma progressão por abertura",
             "<b>Não existe NBR única</b> que fixe essas faixas em milímetros",
             "Por isso: adotamos a faixa como <b>convenção declarada</b>, nunca como norma"],
  "validar":"A faixa exata em mm será confirmada e assinada pelo instrutor (VALIDAR B2).",
  "narr":"Falar com precisão te separa do palpiteiro. A gente usa a progressão fissura, trinca, rachadura, fenda — da mais fina à mais larga. Mas atenção, e isso é rigor: não existe uma norma única que fixe esses milímetros. Então a gente apresenta como convenção do curso, com honestidade. Nunca diga que é norma o que não é."})

S.append({"tipo":"conteudo","kick":"Aula 1.3","titulo":"Os 4 instrumentos que separam o profissional do palpiteiro",
  "tabela":{"head":["Instrumento","Para quê"],
    "rows":[["Fissurômetro / régua de fissuras","Medir a abertura no ponto mais largo"],
            ["Paquímetro","Conferência fina da abertura"],
            ["Selo de gesso / comparador","Monitorar atividade (ativa × estabilizada)"],
            ["Câmera com escala + lanterna","Registro e realce do relevo (luz rasante)"]]},
  "foto":"fissurômetro, paquímetro e trena sobre a fissura",
  "narr":"Quatro instrumentos. O fissurômetro mede a abertura. O paquímetro confere. O selo de gesso diz se ela está viva. E a câmera com uma escala do lado registra tudo. Com luz rasante, de lado, o relevo da fissura aparece. Esse kit cabe na mochila e muda como você é visto na obra."})

S.append({"tipo":"conteudo","kick":"Aula 1.4","titulo":"Como medir de verdade (e registrar sem erro)",
  "bullets":["Meça sempre no <b>ponto mais largo</b>, com o fissurômetro rente à superfície",
             "Registre o <b>trio mínimo</b>: valor em mm · data · foto com escala",
             "O que não é medido e datado, tecnicamente, não aconteceu"],
  "norma":"NBR 6118:2023 — abertura de fissuras w<sub>k</sub> (da ordem de 0,2 a 0,4 mm conforme a classe de agressividade). [VALIDAR B1]",
  "narr":"Meça no ponto mais largo, sempre. E registre o trio: milímetro, data e foto com escala. Anota isso na planilha do Kit. Porque numa discussão futura, o que você não mediu e não datou simplesmente não aconteceu. Registro é a sua defesa."})

S.append({"tipo":"conteudo","kick":"Aula 1.5","titulo":"O primeiro olhar: do geral ao particular",
  "bullets":["Comece pelo <b>panorama</b>: implantação, fachada, sinais de umidade e recalque",
             "Só depois vá ao detalhe",
             "Muitas vezes o contexto já explica o desenho da fissura"],
  "mestre":"Nunca leia <b>uma</b> fissura. Leia o <b>conjunto</b>. O olho treinado entende o todo antes do detalhe.",
  "narr":"Chegou na obra, não corra para a trinca. Olhe o conjunto primeiro: a fachada, o terreno, sinais de umidade, portas emperrando. O contexto quase sempre explica o desenho. E fica com o Segredo do Mestre: nunca se lê uma fissura sozinha — lê-se o conjunto."})

S.append({"tipo":"quiz","titulo":"Quiz do Módulo 1","q":"O que uma fissura representa, do ponto de vista técnico?",
  "alts":["Um defeito estético que sempre pode ser só pintado","Um sintoma de um mecanismo que precisa ser diagnosticado","Sempre um problema estrutural grave","Sempre erro de mão de obra"],
  "correta":1,"coment":"Fissura é sintoma, não diagnóstico. Tratar sem entender a causa é paliativo.",
  "narr":"Vamos ao quiz do módulo. O que a fissura representa tecnicamente? A resposta certa é a B: um sintoma de um mecanismo que a gente precisa diagnosticar. Guarde isso — é o coração do curso."})

# ---------- MÓDULO 2 (Ouro) ----------
S.append({"tipo":"modulo","num":"Módulo 2 · Módulo de Ouro","titulo":"A fissura fala: leitura do desenho","min":"~48 min · 7 aulas",
  "narr":"Módulo dois, o coração do curso. Aqui você aprende a ler a assinatura de cada esforço no desenho da fissura. Uma regra atravessa tudo: o desenho dá a hipótese; a medição e o monitoramento dão o diagnóstico."})

S.append({"tipo":"conteudo","kick":"Aula 2.1","titulo":"45° saindo do canto da janela",
  "sub":"Concentração de tensão no canto de abertura",
  "bullets":["Toda abertura interrompe o caminho das tensões; o canto concentra",
             "Com movimentação, o canto cede primeiro → fissura escapa a ~45°",
             "É a mais comum do Brasil — e a mais mal diagnosticada",
             "É <b>hipótese</b>, não veredito: confirme com o conjunto"],
  "foto":"fissura a 45° partindo do canto superior de uma janela",
  "narr":"A fissura a quarenta e cinco graus saindo do canto da janela. A abertura é um buraco na parede, e o canto concentra tensão. Quando há movimentação, ele cede e a fissura escapa na diagonal. É a mais comum e a mais mal diagnosticada do país. Mas repita comigo: é pista, não veredito."})

S.append({"tipo":"conteudo","kick":"Aula 2.2","titulo":"Vertical no meio da viga: flexão",
  "bullets":["A viga flexiona: a fibra <b>inferior</b> traciona no meio do vão",
             "Concreto odeia tração → fissura vertical, subindo de baixo",
             "Julgue pelo trio: <b>largura + quantidade + flecha</b>, nunca pela largura só"],
  "norma":"NBR 6118:2023 — a fissuração de serviço é prevista; há limites de abertura (w<sub>k</sub>).",
  "foto":"fissura vertical no meio do vão, face inferior de viga",
  "narr":"Fissura vertical, bem no meio da viga, na parte de baixo. Aí a viga está falando de flexão: a fibra inferior estica, o concreto racha. Mas cuidado — não julgue pela largura sozinha. Julgue pelo trio: largura, quantidade e flecha. Uma fininha pode ser serviço normal; várias com barriga é pedido de socorro."})

S.append({"tipo":"conteudo","kick":"Aula 2.3","titulo":"Inclinada perto do apoio: cisalhamento",
  "bullets":["O cortante é máximo junto aos apoios",
             "A fissura surge inclinada, ~45°, apontando do apoio para o meio",
             "Ruptura pode ser mais <b>brusca</b> → monitorar e comunicar com prioridade"],
  "foto":"fissura inclinada próxima ao apoio de uma viga",
  "narr":"Se a de flexão me faz mudar de postura, essa me faz parar. Fissura inclinada perto do apoio: cisalhamento. É onde o esforço cortante é máximo. E como a ruptura por cisalhamento pode ser mais brusca que a de flexão, essa você monitora hoje e comunica por escrito — não semana que vem."})

S.append({"tipo":"conteudo","kick":"Aula 2.4","titulo":"Mapeada (craquelê): retração ou algo pior?",
  "bullets":["Padrão em malha, tipo casca de ovo → em geral <b>retração superficial</b>",
             "Fica no reboco/pele do concreto: estético, baixa gravidade",
             "<b>Em concreto estrutural</b>: pode ser reação álcali-agregado → investigar por ensaio"],
  "validar":"RAA confirma-se em laboratório, nunca no olho (VALIDAR B6).",
  "foto":"fissuração em malha (craquelê) em reboco ou concreto",
  "narr":"Craquelê, aquele padrão em malha. Na maioria das vezes é retração superficial — fica no reboco, é estético. Mas quando aparece em concreto estrutural, pode ser reação álcali-agregado, que é séria. O profissional não crava nem ignora: ele classifica o suporte e, se for estrutural, encaminha para ensaio."})

S.append({"tipo":"conteudo","kick":"Aula 2.5","titulo":"A diagonal que sobe: recalque de fundação",
  "bullets":["A causa está <b>embaixo</b> (solo/fundação), não na parede",
             "Recalque diferencial: uma parte da fundação baixa mais → a construção rasga na diagonal",
             "A fissura 'aponta' para onde o terreno cedeu",
             "Diagnóstico de <b>conjunto</b>: diagonais + esquadrias travando + piso caído"],
  "norma":"NBR 6122:2019 — projeto e execução de fundações.",
  "foto":"fissura inclinada de recalque, mais aberta em cima, em muro/parede",
  "narr":"A fissura que mais tira o sono. Inclinada, abrindo mais em cima, apontando para um canto que baixou. A causa não está na parede — está no solo. É recalque diferencial. E nunca se lê numa fissura só: você soma as pistas. Diagonais que conversam, portas emperrando, piso caído na mesma direção. Aí sim é recalque."})

S.append({"tipo":"conteudo","kick":"Aula 2.6","titulo":"Horizontal na alvenaria: expansão e umidade",
  "bullets":["Na <b>base</b> + pó branco (eflorescência) → umidade ascendente",
             "No <b>topo</b> (encontro com laje) → expansão de bloco / interface",
             "Erro clássico: culpar a estrutura sem checar umidade e recalque"],
  "norma":"NBR 9575:2010 — impermeabilização (seleção e projeto). [VALIDAR A9]",
  "foto":"fissura horizontal em alvenaria com eflorescência na base",
  "narr":"Fissura horizontal na alvenaria. O vício do júnior é culpar a estrutura. Mas na base, com pó branco, é umidade subindo do solo. No topo, é expansão do bloco ou a interface com a estrutura. E lembre: em fissura com umidade, primeiro seca a origem, depois conserta a cara. Quem inverte, retrabalha de graça."})

S.append({"tipo":"conteudo","kick":"Aula 2.7","titulo":"Juntando tudo: o mapa fissuratório",
  "bullets":["Fotografe a parede inteira · numere cada fissura",
             "Anote o trio: orientação · abertura · hipótese de origem",
             "Procure o <b>padrão dominante</b> — ele hierarquiza o diagnóstico",
             "Vira a sua prova documental"],
  "mestre":"O mapa é o que te dá o direito de falar com calma. Mesma parede, duas reputações.",
  "foto":"parede com fissuras numeradas + croqui do mapa fissuratório",
  "narr":"Na obra real, a parede não tem uma fissura do livro — tem cinco de tipos diferentes. O mapa fissuratório resolve: fotografa, numera, anota o trio de cada uma e acha o padrão dominante. É isso que te deixa apontar para a parede e explicar com calma, em vez de dizer 'acho que não é nada' e rezar."})

S.append({"tipo":"quiz","titulo":"Quiz do Módulo 2","q":"Fissura vertical no terço médio inferior de uma viga aponta para qual esforço?",
  "alts":["Flexão (tração na fibra inferior)","Cisalhamento","Torção pura","Retração plástica"],
  "correta":0,"coment":"No meio do vão a fibra inferior traciona; o concreto fissura à tração — daí a armadura de flexão.",
  "narr":"Quiz do módulo de ouro. Fissura vertical no meio da viga, embaixo: qual esforço? Resposta A, flexão. A fibra inferior estica e o concreto racha. Se você acertou, o olho já está mudando."})

# ---------- MÓDULO 3 ----------
S.append({"tipo":"modulo","num":"Módulo 3","titulo":"Ativa ou estabilizada? O veredito","min":"~34 min · 5 aulas",
  "narr":"Módulo três. Agora você já lê o desenho. Falta o veredito: a fissura ainda está se movendo, ou já parou? E quão grave ela é? É isso que decide o encaminhamento."})

S.append({"tipo":"conteudo","kick":"Aula 3.1","titulo":"O selo de gesso: o teste de R$ 2 que decide o caso",
  "bullets":["Aplique um selo de gesso sobre a fissura e <b>date</b>",
             "Rompeu no período → fissura <b>ATIVA</b>",
             "Íntegro → estabilizada",
             "Instale em 2+ fissuras representativas"],
  "foto":"selo de gesso aplicado sobre fissura, com data",
  "narr":"O teste mais barato e mais poderoso: o selo de gesso. Você aplica sobre a fissura, escreve a data. Se ele rompe, a fissura está viva, ativa. Se fica inteiro, estabilizou. Dois reais de gesso respondem o que o olho não responde."})

S.append({"tipo":"conteudo","kick":"Aula 3.2","titulo":"Ativa ou estabilizada: o critério",
  "bullets":["<b>Ativa</b> = o monitoramento mostra evolução (abertura/comprimento) no período",
             "Atividade se define pela <b>evolução no tempo</b>, não pelo tamanho atual",
             "Grande e parada = história. Pequena e viva = presente."],
  "validar":"Tempo de monitoramento recomendado a confirmar (VALIDAR B9).",
  "narr":"Atividade não é tamanho — é evolução no tempo. Uma fissura enorme e parada é uma cicatriz antiga, história. Uma fissura fininha, mas crescendo, é o presente que te preocupa. Não deixe o tamanho te assustar; deixe a atividade te informar."})

S.append({"tipo":"conteudo","kick":"Aula 3.3","titulo":"Quão grave é? O semáforo de decisão",
  "tabela":{"head":["Nível","Quando","Encaminhamento"],
    "rows":[["🔴 ALTA","Risco imediato, ou estrutural + ativa","Escorar/interditar + calculista"],
            ["🟡 MÉDIA","Ativa (não estrutural) ou abertura > limite","Tratar a causa + monitorar"],
            ["🟢 BAIXA","Estabilizada, fina, sem risco","Monitorar e registrar"]]},
  "narr":"A gravidade em três níveis, como um semáforo. Vermelho: risco imediato ou origem estrutural com fissura ativa — escora, interdita, chama o calculista. Amarelo: ativa, mas não estrutural — trata a causa e monitora. Verde: parada e fina — monitora e registra. A ferramenta do Kit faz esse enquadramento com você."})

S.append({"tipo":"conteudo","kick":"Aula 3.4","titulo":"Fissura + umidade: quando a água muda o diagnóstico",
  "bullets":["Umidade, mancha e eflorescência são <b>pistas diagnósticas</b>",
             "A presença de água pode mudar a causa (infiltração, expansão)",
             "Registre — ignorar a água leva a erro"],
  "foto":"fissura com eflorescência/umidade associada",
  "narr":"Onde tem água, o diagnóstico muda. Umidade, mancha, aquele pó branco — são pistas. Ignorar a água é um dos erros mais comuns. Registre sempre a umidade associada; ela pode ser a verdadeira história por trás da fissura."})

S.append({"tipo":"conteudo","kick":"Aula 3.5","titulo":"Os 5 erros que expõem o engenheiro",
  "bullets":["Dar veredito só no olho, sem medir nem monitorar",
             "Tratar o sintoma (pintar por cima) em vez da causa",
             "Culpar a estrutura sem descartar umidade e recalque",
             "Prometer 'resolvido' quando a física não garante",
             "Não registrar — confiar na memória"],
  "narr":"Os cinco erros que expõem você. Veredito no olho. Tapar sintoma. Culpar a estrutura sem checar. Prometer resolvido. E não registrar. Evite esses cinco e você já está à frente de muita gente com anos de canteiro."})

S.append({"tipo":"quiz","titulo":"Quiz do Módulo 3","q":"O selo de gesso rompeu na visita seguinte. O que isso indica?",
  "alts":["Fissura estabilizada","Fissura ATIVA (em movimento)","Erro de medição","Nada"],
  "correta":1,"coment":"Selo rompido = a fissura se movimentou no período = ativa. Muda a gravidade e o encaminhamento.",
  "narr":"Quiz. O selo de gesso rompeu entre uma visita e outra. O que significa? Letra B: fissura ativa, em movimento. Isso muda tudo no encaminhamento."})

# ---------- MÓDULO 4 ----------
S.append({"tipo":"modulo","num":"Módulo 4","titulo":"Do diagnóstico ao encaminhamento (e ao primeiro laudo)","min":"~36 min · 5 aulas",
  "narr":"Módulo quatro, o fechamento. Diagnóstico sem ação é só observação. Agora a gente transforma o que você viu em decisão, em tratamento e em documento — o laudo que protege e pode virar o seu primeiro honorário."})

S.append({"tipo":"conteudo","kick":"Aula 4.1","titulo":"Três caminhos: monitorar, tratar ou interditar",
  "tabela":{"head":["Gravidade","Caminho"],
    "rows":[["🟢 Baixa","Monitorar e registrar"],["🟡 Média","Tratar a causa + monitorar"],["🔴 Alta","Escorar/interditar + acionar o calculista"]]},
  "narr":"Todo diagnóstico desemboca em um de três caminhos. Baixa: monitora. Média: trata a causa e monitora. Alta: escora, interdita e chama o calculista. O fluxograma do Kit conduz essa decisão com você, passo a passo."})

S.append({"tipo":"conteudo","kick":"Aula 4.2","titulo":"Tratamento na medida",
  "tabela":{"head":["Técnica","Indicação típica"],
    "rows":[["Selagem elástica","Fissuras ativas de pequena movimentação (vedação/estética)"],
            ["Grampeamento / costura","Restabelecer continuidade em alvenaria (conforme projeto)"],
            ["Injeção (resina/epóxi)","Concreto — só após diagnóstico e definição de atividade"]]},
  "validar":"O tratamento segue o diagnóstico. Nunca tratar fissura ativa como estabilizada.",
  "narr":"O tratamento segue o diagnóstico — nunca o contrário. Selar, grampear ou injetar depende da causa e da atividade. E jamais trate uma fissura ativa como se estivesse parada: você só vai maquiar o problema, que volta por baixo do reparo."})

S.append({"tipo":"conteudo","kick":"Aula 4.3","titulo":"A hora de escorar e chamar o calculista",
  "bullets":["Diante de suspeita estrutural ativa ou risco imediato",
             "Estabilize a emergência (escoramento), <b>documente</b> e <b>encaminhe</b>",
             "Conhecer a fronteira da sua alçada é competência, não fraqueza"],
  "narr":"Tem hora de parar e chamar quem calcula. Suspeita estrutural ativa, sinal de risco — você estabiliza, documenta e encaminha. Não banque o herói. Saber o limite da própria alçada é o que te torna um profissional durável."})

S.append({"tipo":"conteudo","kick":"Aula 4.4","titulo":"O laudo que protege você",
  "bullets":["Identificação · escopo e <b>limitações</b> · metodologia",
             "Registro fotográfico padronizado · mapa fissuratório",
             "Causa raiz · recomendações com prazo e responsável",
             "Encaminhamentos · assinatura com CREA"],
  "norma":"NBR 13752:2024 (perícias) · NBR 16747:2020 (inspeção predial). O modelo blindado está no seu Kit.",
  "narr":"Todo caso vira um relatório blindado. Identificação, escopo e limitações, metodologia, registro fotográfico, causa raiz, recomendações com prazo e responsável, e a sua assinatura. O modelo pronto está no Kit, em Word e PDF. É a estrutura que protege quem assina."})

S.append({"tipo":"conteudo","kick":"Aula 4.5","titulo":"Seu primeiro honorário — com ética",
  "bullets":["Vistoria e laudo são serviços técnicos que se cobram",
             "Use referências de mercado como <b>parâmetro</b> (ex.: IBAPE)",
             "<b>Nunca</b> prometa ganho fixo — capacidade, não garantia"],
  "validar":"Honorários entram só como referência de mercado com fonte (VALIDAR C5).",
  "narr":"E aqui a fissura vira renda, com ética. Uma vistoria, um laudo, são serviços que se cobram. Referências como as tabelas do IBAPE servem de parâmetro de mercado. Mas nunca prometa ganho garantido — nem no curso, nem para o seu cliente. Você entrega capacidade, não um cheque."})

S.append({"tipo":"quiz","titulo":"Quiz do Módulo 4","q":"Um relatório técnico 'blindado' obrigatoriamente contém:",
  "alts":["Só uma foto e um 'está tudo bem'","Escopo, limitações, metodologia, causa raiz, recomendações e assinatura/CREA","Opinião sem fundamentação","Promessa de resultado garantido"],
  "correta":1,"coment":"É a estrutura que protege juridicamente (NBR 13752:2024 / NBR 16747:2020).",
  "narr":"Último quiz. O que o laudo blindado tem que ter? Letra B: escopo, limitações, metodologia, causa raiz, recomendações e a assinatura com CREA. Essa estrutura é a sua proteção jurídica."})

# ---------- Encerramento ----------
S.append({"tipo":"conteudo","kick":"Fechamento de carreira","titulo":"Você aprendeu a ler a fissura",
  "bullets":["O próximo passo é aprender a <b>assinar por ela</b> — e a cobrar por isso",
             "Continue na esteira: Patologias · Laudos · Introdução à Perícia",
             "Faça os microdesafios e registre no seu caderno de campo"],
  "narr":"Você chegou ao fim. Aprendeu a ler o que quase ninguém lê. O próximo passo é assinar por isso com segurança e cobrar por isso com ética — é o que os próximos cursos da esteira te dão. Faça os desafios e registre no seu caderno de campo. Quero você sendo o júnior que o dono da obra libera de olho fechado."})

S.append({"tipo":"fim","titulo":"Padrão Diamante — o rigor de quem assina",
  "bullets":["Escola de Obra · GD Engenharia e Perícia · engenhariagd.com.br",
             "Revisado e assinado por Gustavo Domingos — Eng. Civil, CREA-PR 140.964-D",
             "Material do Kit na área de membros · certificado de conclusão com QR"],
  "narr":"Obrigado por estar aqui comigo. Padrão Diamante é o rigor de quem assina — e agora esse rigor é seu também. Um abraço, e bons diagnósticos."})

if __name__ == "__main__":
    out = os.path.abspath(os.path.join(os.path.dirname(__file__),"..","02-curso-piloto","slides","slides-fissuras.html"))
    render("Diagnóstico de Fissuras e Trincas", "Enxergue como um perito", S, out)
