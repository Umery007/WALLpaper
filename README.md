# WA1PAPER

Galeria de wallpapers com geração por inteligência artificial.
Frontend em React + Vite, backend em Node.js + Express + PostgreSQL.

```
WA1PAPER-main/
├── src/        frontend React (Vite)
│   ├── Pages/        páginas
│   ├── components/   componentes (Chatbot, Prompt, Cards, Perfil...)
│   ├── contexts/     autenticação
│   └── services/     cliente da API
├── back/       API Node.js + PostgreSQL
│   ├── src/routes/       endpoints Express
│   ├── src/services/     regras de negócio (gemini, billing, mailer...)
│   ├── src/db/           schema, migrations e seed
│   ├── uploads/          imagens geradas/publicadas
│   └── .env              configuração local (não versionar)
└── dist/       build do frontend
```

---

## Começar

Você só precisa do **Node.js 20+**. O PostgreSQL já vem junto com o projeto —
não precisa instalar nada além disso.

Na raiz do projeto, instale as dependências do frontend e da API:

```bash
npm run install:all
```

Depois, inicie os dois com um único comando:

```bash
npm run dev:all
```

O site abre em <http://localhost:5173>. Para rodar cada parte separadamente,
use dois terminais:

```bash
# Terminal 1 — API
cd back
npm run dev

# Terminal 2 — frontend (na raiz do projeto)
npm run dev
```

Na primeira vez a API demora alguns segundos a mais: ela prepara o banco, cria
as tabelas e enche a galeria sozinha. Já vem uma conta pronta para testar:

```
demo@wa1paper.app / wa1paper123
```

---

## O que funciona

| Recurso | Onde |
|---|---|
| Cadastro, login e logout | `/criar-conta`, `/cadastro` |
| Perfil (nome, @usuário, conta privada) | `/perfil` |
| Trocar a senha | `/alterar-senha` |
| Recuperar a senha por e-mail | `/esqueci-senha` |
| Galeria com busca e filtro por categoria | `/` |
| Favoritar e listar favoritos | `/favoritados` |
| Wallpapers baixados | `/baixados` |
| Comunidade e seguir usuários | `/comunidade` |
| Pastas de wallpapers | `/salvos` |
| Publicar wallpaper por URL | `/wallpapers/novo` |
| Gerar wallpaper com IA | botão de conversa, em qualquer tela |
| Editar um wallpaper gerado | botão **Editar** na imagem gerada |
| Planos, créditos e dispositivos | `/planos`, `/credito`, `/dispositivos-conectados` |
| Notificações e PIN | `/notificacoes`, `/pin` |

A documentação completa da API, os endpoints e as decisões de segurança estão
em [`back/README.md`](back/README.md).

---

## Geração com IA

A geração acontece pela **conversa** (botão flutuante, janela normal ou tela
cheia). Você descreve o wallpaper e ele é salvo na sua biblioteca.

### Formato do wallpaper

Na barra de conversa há um seletor com dois ícones:

| Ícone | Formato | Uso | Como fica a cena |
|---|---|---|---|
| 📱 Celular | `9:16` (padrão) | Vertical | Sujeitos afastados das bordas, espaço equilibrado para ícones e relógio |
| 🖥️ Desktop | `16:9` | Horizontal | Elementos distribuídos na largura, um lado mais calmo para os ícones da área de trabalho |

O formato é enviado para a API no campo `aspect_ratio` do
`POST /api/images/generate` (aceita só `"9:16"` ou `"16:9"`, padrão `"9:16"`).
As imagens saem em **2K** (~1536×2752 vertical, ~2752×1536 horizontal).

O enquadramento de cada formato é aplicado no prompt enviado ao modelo, em
`back/src/services/gemini.js` (constante `COMPOSITION`).

### Limite de uso

São **6 gerações por minuto** por conta (`generateLimiter` em
`back/src/middleware/rateLimit.js`). Acima disso a API responde com uma
mensagem pedindo para esperar.

### ⚠️ A geração de imagem é paga no Google

Isso é importante e costuma causar confusão:

> **Todos os modelos de imagem do Gemini API são pagos.** Free tier só cobre
> texto, voz e embedding. Na página de preços do Google, os modelos de imagem
> aparecem como *"Not available"* no Free Tier.

Na prática, sem billing ativo o erro é `429 RESOURCE_EXHAUSTED` com
**`limit: 0`** — não é cota estourada (aí o limite seria um número e liberaria
à meia-noite), é **cota que nunca existiu**, então **esperar não resolve**.

Como o erro aparece no site: a conversa responde com
*"O limite de geracoes por minuto foi atingido"* e o resto do site segue
normal.

Para liberar:

1. Ative o saldo pré-pago em <https://aistudio.google.com/billing> (mínimo de US$ 5)
2. Confirme em <https://aistudio.google.com/apikeys> que a *Billing tier* do projeto saiu de "Free trial"
3. **Não precisa trocar a chave** — a mesma passa a valer assim que o billing ativar

Chave e projeto são válidos quando o modelo de **texto** responde normalmente
(ex.: `gemini-3.5-flash` dá 200) e só os de imagem dão `limit: 0`.

### Solução de problemas da geração

| Sintoma | Causa | O que fazer |
|---|---|---|
| `429` com `limit: 0` em modelo de imagem | Free tier não inclui imagem | Ativar billing (passos acima) |
| "Voce esta gerando imagens rapido demais" | 6 gerações/min por conta | Esperar um minuto |
| "A chave da API do Gemini e invalida" | `GEMINI_API_KEY` errada ou revogada | Corrigir em `back/.env` |
| 403 na geração | Chave de um provedor no endpoint do outro | Trocar `GEMINI_PROVIDER` e a chave juntos |
| "O modelo ... nao esta disponivel" | `GEMINI_IMAGE_MODEL` inexistente | Ajustar no `back/.env` |
| "A IA demorou demais" | Timeout de 120s | Tentar de novo |

---

## Configuração (`back/.env`)

As variáveis estão documentadas em
[`back/README.md` §4](back/README.md). As que mais se usam:

| Variável | O que é |
|---|---|
| `PORT`, `PUBLIC_URL`, `FRONTEND_URL` | porta da API e origens liberadas no CORS |
| `EMBEDDED_POSTGRES`, `DATABASE_URL` | banco embutido (padrão) ou PostgreSQL seu |
| `JWT_SECRET`, `JWT_EXPIRES_IN` | sessão |
| `GEMINI_PROVIDER` | `aistudio` (saldo pré-pago) ou `vertex` (créditos do Cloud) |
| `GEMINI_API_KEY` | chave do provedor escolhido |
| `GEMINI_IMAGE_MODEL` | modelo de imagem (padrão `gemini-3.1-flash-image`) |
| `MERCADOPAGO_ACCESS_TOKEN` | checkout dos planos |

**Trocar qualquer valor de `back/.env` exige reiniciar a API** — o
`node --watch` reinicia sozinho ao mudar arquivos de `src/`, mas **não** o
`.env`. Pare o processo (Ctrl+C) e rode `npm run dev` de novo.

---

## Observações

**Pagamentos** — o checkout do Mercado Pago está implementado, mas precisa de
`MERCADOPAGO_ACCESS_TOKEN` em `back/.env`. Sem o token, apenas o botão de
compra avisa que o pagamento não foi configurado.

**E-mails** — em desenvolvimento, o link de recuperação de senha é impresso no
terminal da API em vez de enviado. Para produção, veja a seção 11 do
[`back/README.md`](back/README.md).

**Chaves de API** — não commite o `.env` nem cole chaves em conversas, issues
ou repositórios. Uma chave exposta deve ser **revogada** e substituída em
`back/.env`, seguida de reinício da API.

---

## Comandos úteis

```bash
npm run install:all   # instala frontend + API
npm run dev:all       # API + frontend juntos
npm run dev           # só o frontend
npm run build         # build de produção em dist/
npm run lint          # ESLint
npm --prefix back run dev     # só a API
npm --prefix back run setup   # cria tabelas e popula a galeria
```
# WALLpaper
