# Changelog

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
