# Guia do Usuário — Software Linha de Vida

Bem-vindo! Este guia explica, em linguagem simples, como usar o software para **dimensionar** uma linha de vida horizontal e **emitir o prontuário técnico** completo.

## 1. Como abrir o software

Não precisa instalar nada. Há duas formas:

- **No seu computador:** dê um duplo clique no arquivo `index.html`. Ele abre no navegador (Chrome, Edge ou Firefox).
  - *Observação:* para o controle de acesso funcionar plenamente, o ideal é abrir por um endereço `http://` (ver abaixo) — alguns navegadores restringem recursos de segurança no modo "arquivo".
- **Publicado na internet:** o software pode ser hospedado (ex.: GitHub Pages, Netlify) e acessado por um link. Veja o `README.md`.

### Rodar localmente por http (recomendado)
Se tiver o Python instalado, abra a pasta do software no terminal e rode:
```
python3 -m http.server 8000
```
Depois acesse `http://localhost:8000` no navegador.

## 2. Primeiro acesso

1. Na **tela inicial**, escolha o **país**: 🇧🇷 Brasil (Português, normas NR, unidades SI) ou 🇺🇸 Estados Unidos (Inglês, normas OSHA/ANSI, unidades imperiais). Tudo se ajusta sozinho — você pode trocar depois pelo botão de país na barra lateral.
2. Na tela de **ativação**, clique em **"Iniciar avaliação (30 dias)"** (ou informe a chave de licença).
2. Faça login com:
   - Usuário: **`admin`**
   - Senha: **`GD-altura@2026`**
3. O sistema pedirá para você **criar uma nova senha** (obrigatório, por segurança).

> Guarde bem a nova senha. Em **Administração** você pode criar usuários para sua equipe (engenheiro, inspetor, leitor).

## 3. Criando um projeto e dimensionando

1. No **Painel**, clique em **"+ Novo projeto"**. Ele já vem com valores de exemplo preenchidos.
2. Na aba **Projeto**, preencha/ajuste os campos (obra, local, vão, cabo, poste, etc.). As listas suspensas evitam erros.
3. Clique em **"Salvar e calcular"**.
4. Na aba **Resultados**, veja:
   - O **VEREDITO** (verde = APROVADO; vermelho = revisar).
   - As **figuras**: 3D da estrutura, elevação da Zona Livre de Queda, planta e esforços no poste.
   - A **memória de cálculo** completa, com todas as verificações normativas.
5. Ajuste os dados (vão, bitola do cabo, absorvedor, perfil do poste) até ficar **APROVADO**.

## 4. Emitindo os documentos

- Na aba **Resultados**: botão **"Imprimir memorial de cálculo"** ou **"Memorial descritivo"**.
- Na aba **Prontuário**: gera o **dossiê técnico completo** (18 seções) e o botão **"Imprimir / Salvar PDF"**.
  - Na janela de impressão do navegador, escolha **"Salvar como PDF"** para gerar o arquivo.

### Registros (inspeções, ensaios, EPI...)
Na aba **Registros** você adiciona, ao longo do tempo: inspeções, ensaios de carga das ancoragens, capacitação dos trabalhadores e EPI. Tudo isso entra automaticamente no prontuário.

## 5. Backup dos seus dados (IMPORTANTE)

Os projetos ficam salvos **no navegador da máquina**. Para não perder nada:
- No **Painel**, clique em **"Backup (exportar)"** e guarde o arquivo `.json` em local seguro (pen drive, nuvem).
- Para restaurar em outra máquina: **"Restaurar backup"** e escolha o arquivo.

## 6. Administração (apenas perfil admin)

Em **Administração** você pode:
- **Usuários:** criar/remover, definir o perfil, resetar senhas.
- **Licença:** gerar chaves para seus clientes (para comercializar).
- **Dados do escritório:** nome, CNPJ, CREA — aparecem no cabeçalho dos relatórios.
- **Auditoria:** ver o histórico de ações e verificar a integridade.

## 7. Dúvidas frequentes

- **"Deu REPROVADO, e agora?"** Veja qual indicador está vermelho. Geralmente: reduzir o vão, usar absorvedor de linha, aumentar a bitola do cabo ou o perfil do poste.
- **"A ZLQ está maior que o pé-direito."** Reduza o vão (diminui a flecha), use absorvedor de linha menor ou ancore mais alto.
- **"Posso confiar nos cálculos?"** Os cálculos reproduzem a planilha validada e foram testados automaticamente (ver `docs/AUDITORIA_PLANILHA.md`). **Mas** os resultados devem sempre ser conferidos e assinados pelo responsável técnico, com a ART — o software é uma **ferramenta de apoio**, não substitui o engenheiro.

---
GD Engenharia e Perícia Ltda · Suporte: (43) 9 9925-9577
