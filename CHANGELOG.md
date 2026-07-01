# Changelog

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
