# FV-CHECK — Como rodar e colocar no site

O FV-CHECK é um **site estático**: só HTML, CSS e JavaScript. **Não tem servidor, não tem
banco de dados e não precisa de “build”/compilação.** Para publicar, basta subir os arquivos.

## ⚠️ Única exigência: HTTPS
O login/segurança usa **Web Crypto** (criptografia do navegador), que só funciona em
**contexto seguro**: `https://…`, `http://localhost` ou abrindo o arquivo direto (`file://`).
Em qualquer hospedagem séria o HTTPS já vem de graça (Netlify, Vercel, GitHub Pages, etc.).
**Não publique em `http://` puro** — a tela de login não abriria.

---

## O que subir
Suba **o conteúdo desta pasta** de modo que o `index.html` fique na **raiz do site**:

```
index.html            ← página inicial (abre sozinha)
demo.html             ← demonstração (dados de exemplo)
fvcheck-preview.html  ← versão de 1 arquivo só (opcional)
app/                  ← css + js (o programa)
```

As pastas `docs/`, `tests/`, `package.json` e `build-preview.js` **não são necessárias no site**
(são documentação e testes) — pode subir ou não, tanto faz.

---

## Opção 1 — Netlify (mais fácil, grátis, HTTPS automático)
1. Crie conta em https://app.netlify.com
2. Menu **Add new site → Deploy manually**.
3. **Arraste a pasta** com os arquivos (a que tem o `index.html`) para a área indicada.
4. Pronto: sai um endereço `https://algum-nome.netlify.app`. Dá para trocar o nome e ligar
   um domínio próprio em **Site settings → Domain**.

## Opção 2 — Vercel (grátis, HTTPS automático)
1. Conta em https://vercel.com
2. **Add New → Project → Deploy** (pode arrastar a pasta ou conectar o GitHub).
3. Como não há build, deixe o *framework* em **Other** e publique. Sai um `https://….vercel.app`.

## Opção 3 — GitHub Pages (usando o repositório que já existe)
O repositório já tem o workflow `.github/workflows/deploy-pages.yml`. Só falta **ligar o Pages** (uma vez):
1. No GitHub, vá em **Settings → Pages**.
2. Em **Build and deployment → Source**, escolha **GitHub Actions**.
3. Faça um push (ou rode o workflow em **Actions → Deploy site → Run workflow**).
4. O site sai em `https://SEU-USUARIO.github.io/teste/` e o FV-CHECK em
   `https://SEU-USUARIO.github.io/teste/fvcheck/`.

> Se aparecer o erro “Resource not accessible by integration / Create Pages site failed”, é porque
> o Pages ainda não foi ligado no passo 2 — é uma ação que só o dono da conta faz, uma vez.

## Opção 4 — Hospedagem própria (cPanel, Hostinger, FTP, etc.)
1. Acesse o **Gerenciador de Arquivos** ou um cliente **FTP** (FileZilla).
2. Entre na pasta pública do site (geralmente `public_html/` ou `www/`).
3. **Envie todos os arquivos** (o `index.html` tem que ficar na raiz dessa pasta).
4. Garanta que o domínio esteja com **certificado SSL/HTTPS** ativado (quase todos os
   provedores oferecem “Let’s Encrypt” grátis no painel).

---

## Rodar no seu computador (sem publicar)
- **Mais simples:** dê dois cliques em `index.html` (ou em `fvcheck-preview.html`).
- **Servindo localmente** (recomendado para testar como ficará no ar):
  ```bash
  # dentro da pasta do programa:
  python3 -m http.server 8080
  # abra http://localhost:8080
  ```

## Rodar os testes (opcional, precisa de Node.js)
```bash
npm test        # 108 (motor) + 81 (relatórios)
```

---

## Depois de publicar
- **Primeiro acesso:** clique em **Criar conta** — a primeira conta vira administradora e
  ativa 14 dias de avaliação automaticamente.
- **Modo demonstração** para mostrar a clientes: acesse `.../demo.html` ou `.../index.html?demo=1`.
- Os projetos ficam salvos **no navegador de cada usuário** (localStorage). Para virar um SaaS
  multiusuário de verdade (contas na nuvem, cobrança, fila de laudos), veja o caminho em
  `docs/MODELO_DE_NEGOCIO.md` — o motor de cálculo já é JavaScript puro e roda igual no servidor.

© GD Engenharia e Perícia Ltda · CNPJ 54.705.748/0001-19 · Eng. Civil Gustavo F. F. Domingos · CREA 140.964-D/PR
