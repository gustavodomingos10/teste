# Segurança de Acesso e Modelo de Licenciamento

Este documento descreve os controles de **segurança de acesso** do software e o caminho de evolução para um produto comercial multiempresa (SaaS).

## 1. O que já está implementado

| Recurso | Como funciona | Arquivo |
|---|---|---|
| **Senhas protegidas** | PBKDF2-SHA-256, 210.000 iterações, sal aleatório por usuário. A senha **nunca** é gravada — só o hash. | `security/crypto.js` |
| **Perfis de acesso (RBAC)** | `admin`, `engenheiro (RT)`, `inspetor`, `leitor` — cada um com um conjunto de permissões. | `security/auth.js` |
| **Bloqueio anti-força-bruta** | Após 5 tentativas erradas, a conta é bloqueada por 15 min. | `security/auth.js` |
| **Sessões com expiração** | Expira em 8 h e por 30 min de inatividade. | `security/auth.js` |
| **Troca de senha obrigatória** | No primeiro acesso e em senhas resetadas pelo admin. | `security/auth.js` |
| **Política de senha forte** | Mínimo 8 caracteres com maiúscula, minúscula e número. | `security/crypto.js` |
| **Licença comercial** | Chave assinada (`GDLV-CLIENTE-VALIDADE-PLANO-ASSINATURA`) validada localmente; com data de expiração. | `security/auth.js` |
| **Trilha de auditoria** | Cada ação (login, cálculo, prontuário, inspeção) é encadeada por hash (livro-razão); adulteração quebra a cadeia. | `security/audit.js` |

### Perfis e permissões

| Permissão | admin | engenheiro | inspetor | leitor |
|---|:--:|:--:|:--:|:--:|
| Ver / imprimir | ✔ | ✔ | ✔ | ✔ |
| Editar projeto e calcular | ✔ | ✔ | – | – |
| Emitir prontuário / assinar (RT) | ✔ | ✔ | – | – |
| Registrar inspeções/ensaios | ✔ | ✔ | ✔ | – |
| Gerenciar usuários e licença | ✔ | – | – | – |

### Primeiro acesso
Usuário **`admin`**, senha inicial **`GD-altura@2026`** (troca obrigatória). Recomenda-se criar um usuário nominal para cada operador e manter o `admin` apenas para administração.

## 2. Limites do modelo atual (seja transparente com o cliente)

O software é **100 % local** (roda no navegador, dados em `localStorage`). Isso é ótimo para portabilidade e privacidade, mas implica:

- A autenticação e a licença são verificadas **no cliente**. Um usuário tecnicamente avançado, com acesso ao computador, poderia contornar a verificação. É um **controle comercial**, não uma barreira criptográfica de servidor.
- Os dados ficam **no navegador da máquina**. Faça **backup** (Painel → Exportar) com regularidade. Limpar os dados do navegador apaga os projetos.
- Não há, ainda, sincronização entre máquinas nem multiempresa central.

## 3. Caminho para produto comercial robusto (quando desejar escalar)

1. **Backend de autenticação** (Node/.NET/etc.) com banco de dados; mover login, RBAC e auditoria para o servidor (tokens JWT, refresh, 2FA).
2. **Licenciamento server-side**: ativação online, contagem de assentos, revogação, expiração verificada no servidor (a assinatura local vira apenas cache).
3. **Multiempresa (multi-tenant)**: cada cliente com seu espaço isolado; projetos no servidor com backup automático.
4. **Assinatura digital** dos memoriais (ICP-Brasil) para validade jurídica do PDF.
5. **Hospedagem** (HTTPS) — pode ser publicado em qualquer servidor estático para a versão atual; o backend exige um servidor de aplicação.

> O código atual foi escrito de forma modular justamente para facilitar essa migração: a lógica de engenharia (`core/`) e os relatórios (`report/`) não mudam; troca-se apenas a camada de `security/` e `data/` por chamadas ao servidor.

## 4. Gerar chaves de licença para clientes

No painel **Administração → Licença comercial**: informe o nome do cliente, a validade (AAAAMMDD) e o plano, e clique em **Gerar chave**. Entregue a chave ao cliente, que a informa na tela de ativação. O segredo do produto está em `security/auth.js` (`SEGREDO_PRODUTO`) — **altere-o** antes de distribuir e mantenha-o confidencial.
