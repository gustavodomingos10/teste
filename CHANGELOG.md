# Changelog

## [2.2.0] — Versão de demonstração (amostra pública para o site)

- Novo modo **DEMONSTRAÇÃO** (`demo.html` ou `?demo=1`): entra direto, sem login/licença, para uma amostra pública.
- Na demonstração: **calcula e mostra resultados/figuras/comparativo**, mas **bloqueia salvar, exportar (Word/PDF/Excel) e imprimir**; o memorial completo e o prontuário aparecem como prévia bloqueada.
- **Nada é persistido** (armazenamento em memória — recarregar zera tudo).
- **Marca d'água** "AMOSTRA · GD ENGENHARIA" sobre toda a tela (aparece em qualquer captura), faixa fixa de demonstração e **anti-cópia** (clique-direito, seleção, Ctrl+S/P/C e impressão inibidos).
- A versão completa (`index.html`) permanece inalterada. E2E cobre o fluxo de demonstração (12 verificações).

> Observação honesta: nenhuma página web impede 100% uma foto de tela (câmera do celular / Print Screen). A marca d'água garante que toda captura saia identificada como amostra sem valor oficial.

## [2.1.1] — Auditoria completa e correções (rigor de engenharia)

Auditoria multi-frente (6 revisões independentes + verificação adversarial de cada achado) que confirmou e corrigiu 20 pontos:

### Correção — Segurança
- **Controle de acesso (RBAC) reforçado**: as telas de Resultados, Prontuário, Conformidade e Registros passam a verificar a permissão do perfil (defesa em profundidade), além do menu.
- Senha temporária de reset com maior entropia (~48 bits) e aderente à política.

### Correção — Cálculos de engenharia
- **Efeito da temperatura**: os extremos de pré-tensão estavam invertidos — corrigido (o frio TENSIONA e o calor RELAXA o cabo).
- **Classe de seção (perfil RHS)**: a esbeltez local passa a distinguir **mesa (largura b)** e **alma (altura d)**, cada uma contra o seu limite (NBR 8800 Tabela F.1) — antes usava a dimensão errada.
- **Absorvedor de linha insuficiente (F_abs < Q/2)**: o equilíbrio impossível (senθ > 1) agora é detectado, avisado e bloqueado, em vez de gerar flecha absurda silenciosa.
- Rótulo da figura de esforços indica quando o momento inclui a ação do vento.

### Correção — Robustez
- Guardas contra **NaN/∞** (tração nula, pré-tensão nula, nº de chumbadores/braço nulos).
- **Validação bloqueante** para valores fisicamente inválidos (L, h, T₀, nº de usuários, chumbadores, braço); Resultados/Prontuário não são emitidos sobre dados inválidos.

### Correção — Internacionalização (sem vazamento de PT em modo EN)
- Prontuário: cenário, substrato, ambiente e a coluna “Tema” da equivalência normativa agora traduzem; valor da ancoragem na APR deixa de sumir.
- Memorial: `máx/mín`, `γ_aço`, e os separadores decimais (1,5 → 1.5; FS = 2.0; φ = 1.0) seguem o idioma.
- Planilha (.xls): a lista de materiais/EPI usa descrições traduzidas e converte comprimentos para o sistema imperial; indicador de ancoragem com ponto decimal em EN.

### Correção — Dados
- **Matriz de compatibilidade** completa: todos os substratos dos cenários (inclusive Solo e Silo/Industrial) passam a ter ancoragens recomendadas (casamento tolerante de nomes + linhas novas).

### Testes
- Motor **71** casos, relatórios **49** casos, E2E **48** verificações (PT+EN) — todos com regressões que travam cada correção acima.

## [2.1.0] — Dimensionamento automático, exportação unificada e experiência premium

### Dimensionamento automático ("Calcule para mim")
- Botão **⚡ Calcule para mim / Calculate for me** no formulário e nos resultados: o software busca no catálogo a combinação **poste + cabo mais leve APROVADA** em todas as verificações do país selecionado (`Engine.otimizar`).
- A escolha **manual** de material, perfil e vão continua totalmente disponível — o automático é opcional.
- Resultado detalhado (perfil, bitola, massa linear kg/m, utilização governante, alternativas válidas) e diagnóstico claro quando a limitação é **geométrica** (ZLQ) ou de carga.

### Gerar Prontuário Completo (exportação unificada)
- Botão único **📑 Gerar Prontuário Completo** abre um painel com **caixas de seleção de cada seção** (Memorial de Cálculo, Descritivo, Lista de Materiais, Lista de EPIs, …), com **Selecionar todos / Desmarcar todos** e opção de incluir a capa.
- Exporta em **Word (.doc editável)**, **PDF (impressão/assinatura)** e **Planilha (.xls editável, 4 abas)** — todos com **logotipo/emblema, dados de contato e rodapé institucional** com as normas.
- Upload de **logotipo do escritório** na Administração (aparece no cabeçalho e na capa de todos os documentos).

### Comparativo internacional (Brasil × EUA) — a "cereja do bolo"
- Painel nos resultados que avalia o **mesmo projeto sob as duas jurisdições lado a lado** (`Engine.comparar`), destacando quando o veredito **DIVERGE** (aprovado no Brasil e reprovado nos EUA, por conta dos métodos, limites e exigências distintos).

### Layout premium
- Emblema do **país habilitado em cor** e unidades na barra lateral; **nome da empresa sutil** no rodapé; botões primários refinados; modais e cartões com acabamento profissional.

### Marca do fabricante
- Nova aba **Sobre / About** apresentando a **GD Engenharia e Perícia como fabricante do software** (dados oficiais, versão, recursos, normas atendidas e aviso de responsabilidade técnica), bilíngue.
- Crédito discreto **"Desenvolvido por GD Engenharia e Perícia / Developed by …"** no canto da área de trabalho e na barra lateral, ambos clicáveis para a aba Sobre.

### Testes
- Motor: 52 casos (inclui `otimizar` e `comparar`, com o cenário BR-aprova/EUA-reprova).
- Relatórios: 37 casos. **E2E (Playwright, PT e EN): 37 verificações**, incluindo geração real de `.xls` sem `NaN` e ausência de vazamento de português na versão em inglês.

## [2.0.0] — Versão internacional

### Internacionalização (PT-BR / EN-US)
- **Seleção de país** na tela inicial: Brasil (Português · SI · NR-35/NBR) e Estados Unidos (English · Imperial · OSHA/ANSI).
- **Tradução completa** ao selecionar EUA: interface, memoriais, prontuário e **figuras** (3D, ZLQ, esforços) em inglês.
- **Unidades automáticas** SI ↔ Imperial (kN/lbf, m/ft, mm/in, kN·m/lbf·ft, MPa/ksi); decimal e data localizados.
- **Critérios por país** no motor (EUA: 8 kN / 22,2 kN; Brasil: 6 kN / 15 kN) — o caso brasileiro permanece idêntico ao validado.
- **Tabela de equivalência normativa** internacional (BR × EN × USA) no prontuário.

### Engenharia avançada (verificada, opcional, não altera o caso-base)
- **Ação do vento** nos postes (NBR 6123 / EN 1991) — essencial para silos/estruturas expostas.
- **Método de energia e fator de queda** (NBR 16325 / EN 355) — confirma adequação do absorvedor.
- **Efeito da temperatura** na pré-tensão; **poste de canto** (resultante 2·T·sen(β/2)); fator multiusuário.

### Catálogos ampliados
- Cabos: inox 316/304, 1x19 rígido, galvanizado EIPS 6x36 (29 opções).
- Perfis: SHS/RHS/CHS/tubos até Ø219 (29 opções, propriedades por geometria).
- Aços: ASTM, ABNT e EN S235/S275/S355.

### Produto / gestão de ativos
- **QR Code** de rastreabilidade na plaqueta (gerador próprio, ISO/IEC 18004, validado por decodificação).
- **Painel de conformidade** com semáforo de vencimento de inspeções (≤ 12 meses).
- Cenários de **silo / industrial** na matriz de compatibilidade.

## [1.0.0] — Versão inicial (software)

Transformação da planilha `Linha_de_Vida_GD_Engenharia_1.xlsx` em software comercializável, com auditoria de engenharia, segurança de acesso, mais dados técnicos e visualizações.

### Engenharia (verificado)
- Motor de cálculo que **reproduz exatamente** a planilha validada (42 testes numéricos; varredura de 2.304 casos sem erro).
- Citações normativas **conferidas na fonte oficial** (NR-35 + Anexo II, NR-18, NBR 16325-1/2).
- Memorial de cálculo estruturado conforme **NR-35 Anexo II 5.1.1** (força de impacto → esforços → ZLQ).

### Acréscimos de engenharia (lacunas da planilha fechadas)
- Verificação de **flambagem** do poste (NBR 8800 5.3 — `Ne`, `λ₀`, `χ`).
- Verificação de **cisalhamento** (`V_Rd = 0,6·fy·Aw/γa1`).
- Verificação de **classe da seção** (esbeltez de parede, Tabela F.1).
- Verificação da **placa de base** (esmagamento do concreto, NBR 6118).
- **Newton-Raphson** robusto (tolerância, convergência, proteção numérica).
- **Validação** de dados de entrada (faixas e regras normativas).
- Catálogo ampliado: cabos Ø6–16 mm; perfis SHS/RHS/CHS por geometria; aços selecionáveis.

### Segurança de acesso (novo)
- Login com senhas protegidas por **PBKDF2-SHA-256** (210k iterações, sal por usuário).
- **Perfis de acesso** (admin/engenheiro/inspetor/leitor), bloqueio anti-força-bruta, sessões com expiração.
- **Licença comercial** com chave assinada e validade.
- **Trilha de auditoria** encadeada por hash (à prova de adulteração).

### Documentação e dados de segurança (novo)
- **Prontuário completo (18 seções)**: memoriais, materiais, compatibilidade, quantitativo, APR, PT, plano de inspeção, ensaio de carga, plano de resgate, capacitação, EPI, plaqueta de identificação (NR-18 18.12.12.3) e termo de liberação.

### Visualizações (novo)
- **3D isométrico** simplificado (postes, cabo com flecha, trabalhadores).
- **Elevação cotada da ZLQ**, **planta** e **diagrama de esforços** no poste.

### Documentos
- `docs/AUDITORIA_PLANILHA.md`, `docs/ENGENHARIA.md`, `docs/SEGURANCA.md`, `GUIA_DO_USUARIO.md`, `README.md`.
