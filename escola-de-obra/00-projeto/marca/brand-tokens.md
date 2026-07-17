# 🎨 Brand Tokens — Escola de Obra (GD Engenharia e Perícia)

Fonte única da identidade visual. **Todo** material (PDF, planilha, ferramenta, página)
consome estes tokens. Replicam o DNA já validado no site `engenhariagd.com.br` e nas
apostilas dos cursos NR existentes (fundo verde-petróleo escuro, creme, títulos serifados).

---

## 1. Paleta de cores

| Token | Hex | Uso |
|---|---|---|
| `--gd-verde-petroleo` | `#0E3A34` | Fundo de capa, cabeçalhos, faixas de módulo, títulos principais |
| `--gd-verde-escuro` | `#0A2A25` | Sombra/variante para gradientes e rodapés |
| `--gd-verde-medio` | `#1C5A4E` | Blocos secundários, bordas, realces |
| `--gd-creme` | `#F5EFE0` | Fundo de página de leitura, texto sobre verde |
| `--gd-creme-claro` | `#FBF8F0` | Fundo de tabelas alternadas |
| `--gd-dourado` | `#C9A24B` | Selo, filetes de destaque, "Padrão Diamante", assinatura |
| `--gd-dourado-claro` | `#E3C97E` | Hover, brilho de selo |
| `--gd-carvao` | `#20211E` | Texto corrido sobre creme |
| `--gd-cinza` | `#6B6B63` | Legendas, metadados, notas de rodapé |
| **Semáforo técnico** | | (usado em checklists, planilha, ferramenta) |
| `--sem-verde` | `#2E7D32` | Conforme / aceito |
| `--sem-amarelo` | `#F9A825` | Atenção / monitorar |
| `--sem-vermelho` | `#C62828` | Não conforme / interditar |

## 2. Tipografia

| Papel | Fonte | Fallback web-safe |
|---|---|---|
| Títulos (serifado, autoridade) | **"Playfair Display"** ou **"Merriweather"** | `Georgia, 'Times New Roman', serif` |
| Corpo de texto | **"Inter"** ou **"Source Sans 3"** | `-apple-system, 'Segoe UI', Roboto, Arial, sans-serif` |
| Dados/tabelas/código de norma | **"IBM Plex Mono"** | `'Courier New', monospace` |

> Nos materiais gerados por HTML→PDF e na ferramenta, **os fallbacks web-safe são
> usados por padrão** para garantir renderização offline sem requisições externas.
> Se o instrutor quiser as fontes premium, elas devem ser incorporadas localmente.

## 3. Selo e assinatura (obrigatórios em todo material do Kit)

- **Selo GD:** losango dourado (`--gd-dourado`) com as iniciais **GD** sobre verde-petróleo, e o texto **"Padrão Diamante"** em versalete.
- **Marca d'água em amostras/demonstrativos:** palavra **"DEMONSTRATIVO"** a 45°, opacidade ~8%, em `--gd-dourado`. Some na versão final entregue ao aluno pago.
- **Campo de assinatura (rodapé de todo entregável):**
  > *Revisado e assinado por **Gustavo Domingos** — Engenheiro Civil, CREA-PR 140.964-D.*
- **Rodapé institucional:** `Escola de Obra · GD Engenharia e Perícia · engenhariagd.com.br`

## 4. Tom de voz

- Mentor direto, generoso com bastidor, **zero arrogância**. Alguém que já pagou caro por erros e agora encurta o caminho dos novatos.
- Ângulo de autoridade único: **quem ensina é o perito que é chamado quando a obra dá errado.**
- Humor pontual, **nunca** às custas do aluno.
- Frase-âncora (ajustável à voz do instrutor): *"Em um mês, quero você sendo o júnior que o dono da obra libera de olho fechado."*
- Segunda pessoa ("você"), frases curtas, verbo no imperativo para instruções de campo.

## 5. Componentes visuais recorrentes

| Componente | Especificação |
|---|---|
| **Faixa de módulo** | Barra verde-petróleo, título serifado creme, número do episódio em dourado. |
| **Box "Segredo do Mestre"** | Fundo creme-claro, borda esquerda dourada 4px, ícone 🔑. |
| **Box "Norma de referência"** | Fundo verde-medio 10%, monoespaçada, sempre `NBR nnnnn — nome`. |
| **Semáforo de decisão** | Bolinhas verde/amarelo/vermelho com critério objetivo ao lado. |
| **Tabela** | Cabeçalho verde-petroleo texto creme; linhas zebradas creme/creme-claro. |
| **CTA WhatsApp** | Botão verde `#25D366` com texto branco e ícone; link `wa.me`. |

## 6. Canais e contatos oficiais (para CTAs)

- **Grupo VIP WhatsApp:** (43) 9 9925-9577 — ritual fixo: respostas do instrutor **toda quinta-feira, às 19h**.
- **Site:** engenhariagd.com.br · seção de ferramentas: engenhariagd.com.br/ferramentas
- Link `wa.me` padrão: `https://wa.me/5543999259577`

---

*Estes tokens são a lei visual do projeto. Divergência = defeito de produção.*
