# WA1PAPER — API

Backend em Node.js + Express + PostgreSQL para o frontend React do WA1PAPER.

Cobre cadastro e login, perfil, galeria, favoritos, downloads, geração de
wallpapers por IA (Google Gemini) e checkout de planos/créditos (Mercado Pago).

---

## 1. O que você precisa instalar

Só o **Node.js 20+** (<https://nodejs.org>).

Você **não** precisa instalar o PostgreSQL. O projeto já vem com um PostgreSQL
de verdade (versão 18) que roda a partir da pasta `back`, sem instalador, sem
senha de administrador e sem serviço do Windows. Os dados ficam em
`back/.pgdata`.

---

## 2. Rodar

```bash
npm install
npm run dev
```

Pronto. Na primeira vez o comando cria o `back/.env` (a partir do
`.env.example`, já com um `JWT_SECRET` aleatório), prepara o banco, cria as
tabelas e preenche a galeria sozinho — leva alguns segundos a mais. Depois
disso sobe na hora.

> A geração por IA só funciona depois que você preencher `GEMINI_API_KEY` nesse
> `back/.env`. Sem a chave, o resto do site funciona normalmente e a geração
> responde com um aviso explicando o que falta.

Conta de demonstração criada automaticamente:

```
demo@wa1paper.app / wa1paper123
```

Para conferir se subiu: <http://localhost:4000/api/health>

### Comandos

| Comando | O que faz |
|---|---|
| `npm run dev` | Sobe a API recarregando a cada alteração. |
| `npm start` | Sobe a API em modo produção. |
| `npm run migrate` | Cria/atualiza as tabelas (seguro rodar várias vezes). |
| `npm run seed` | Repõe os wallpapers de exemplo. |
| `npm run setup` | `migrate` + `seed`. |

> Para começar o banco do zero, pare a API e apague a pasta `back/.pgdata`.
> Ela é recriada e repovoada na próxima execução.

---

## 3. Usar um PostgreSQL seu (opcional)

Se mais pra frente você quiser um PostgreSQL instalado na máquina ou na nuvem
(Neon, Supabase, Railway), ajuste o `back/.env`:

```env
EMBEDDED_POSTGRES=false
DATABASE_URL=postgres://usuario:senha@host:5432/wa1paper
DATABASE_SSL=true
```

Depois rode `npm run setup` uma vez para criar as tabelas lá. Como é o mesmo
PostgreSQL, nada mais muda no código.

---

## 4. Variáveis do `.env`

| Variável | Para que serve |
|---|---|
| `PORT` | Porta da API (padrão `4000`). |
| `PUBLIC_URL` | Endereço público da API. Monta o link das imagens geradas. |
| `FRONTEND_URL` | Endereço do frontend. Libera o CORS e monta o link de recuperação de senha. |
| `EMBEDDED_POSTGRES` | `true` usa o PostgreSQL embutido; `false` usa a `DATABASE_URL`. |
| `DATABASE_URL` | Conexão com o PostgreSQL. |
| `DATABASE_SSL` | `true` em serviços de nuvem. |
| `JWT_SECRET` | Segredo que assina a sessão. **Nunca** publique este valor. |
| `GEMINI_PROVIDER` | `vertex` cobra dos créditos do Google Cloud; `aistudio` usa o saldo pré-pago do AI Studio. |
| `GEMINI_API_KEY` | Chave do provedor escolhido. Uma chave de um dá 403 no outro. |
| `GEMINI_IMAGE_MODEL` | Modelo de imagem (padrão `gemini-3.1-flash-image`). |

> As imagens são geradas em **1536×2752** (acima de Full HD) e o download entrega
> o arquivo original, pela rota `GET /api/wallpapers/:id/download`.
| `MERCADOPAGO_ACCESS_TOKEN` | Opcional. Sem ele, só o checkout fica indisponível. |

---

## 5. Rodar junto com o frontend

São **dois terminais**:

```bash
# terminal 1 — API
cd back
npm run dev

# terminal 2 — frontend (na raiz do projeto)
npm run dev
```

O Vite redireciona `/api` e `/uploads` para `http://localhost:4000`
(ver `vite.config.js`), então frontend e API ficam na mesma origem e o cookie
de sessão funciona sem configuração extra.

---

## 6. Endpoints

Todas as rotas ficam sob `/api`. A sessão viaja em um cookie `httpOnly`
(`wa1paper_session`), então o navegador a envia sozinho — não há token para
guardar no `localStorage`.

### Contas

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/auth/register` | Cria a conta e já faz login. `{ name, email, password }` |
| `POST` | `/auth/login` | Entra. `{ email, password }` |
| `POST` | `/auth/logout` | Encerra a sessão. |
| `GET` | `/auth/me` | Usuário da sessão (ou `null`). |
| `POST` | `/auth/verify-email` | `{ token }` — confirma o e-mail e atualiza os privilégios elegíveis. |
| `POST` | `/auth/verify-email/resend` | Reenvia o link para a sessão autenticada. |
| `POST` | `/auth/change-password` | `{ current_password, new_password }` |
| `POST` | `/auth/forgot-password` | `{ email }` — envia o link de recuperação. |
| `POST` | `/auth/reset-password` | `{ token, password }` |

### Perfil

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/users/me` | Dados do perfil. |
| `PATCH` | `/users/me` | `{ name?, username?, isPrivate?, avatar_url? }` |

### Galeria

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/wallpapers` | Lista pública. Aceita `search`, `category`, `limit`, `offset`. |
| `GET` | `/wallpapers/categories` | Categorias com a contagem de cada uma. |
| `GET` | `/wallpapers/mine` | Wallpapers do usuário logado. |
| `GET` | `/wallpapers/downloads` | Histórico de downloads da conta autenticada. |
| `GET` | `/wallpapers/:id` | Um wallpaper. |
| `POST` | `/wallpapers` | Publica. `{ title, description, image_url, category, tags[] }` |
| `POST` | `/wallpapers/:id/download` | Registra um download. |
| `DELETE` | `/wallpapers/:id` | Apaga (só o dono). |

### Favoritos

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/favorites` | Favoritos do usuário. |
| `POST` | `/favorites/:wallpaperId` | Favorita. |
| `DELETE` | `/favorites/:wallpaperId` | Desfavorita. |

### Pastas

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/folders` | Pastas da conta autenticada; visitantes recebem apenas pastas públicas. |
| `GET` | `/folders?visibility=public` | Pastas públicas da comunidade. |
| `POST` | `/folders` | Cria uma pasta privada ou pública e associa wallpapers acessíveis. |
| `POST` | `/folders/:folderId/items` | Adiciona um wallpaper acessível a uma pasta própria. |
| `DELETE` | `/folders/:folderId` | Remove uma pasta própria. |

### Geração por IA

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/images/generate` | `{ prompt, aspect_ratio?, category?, tags?, is_public? }` → gera e salva; privado por padrão. |
| `POST` | `/images/edit` | `{ wallpaper_id, prompt, aspect_ratio?, category?, tags? }` → edita um wallpaper próprio/acessível gerado pela IA, preservando o original. |
| `GET` | `/images/history` | Histórico de gerações. |

`aspect_ratio` aceita apenas `"9:16"` (celular, vertical — padrão) e `"16:9"`
(desktop, horizontal). As imagens saem em 2K. Veja
[`../README.md`](../README.md) na seção "Geração com IA".

### Cobrança

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/billing/me` | Plano, saldo de créditos e cota do mês. |
| `POST` | `/billing/checkout` | `{ product_key }` → devolve a URL do Mercado Pago. |
| `GET` | `/billing/orders` | Histórico de compras. |
| `POST` | `/billing/webhook` | Recebe a confirmação de pagamento. |

`product_key` aceita `premium`, `pro`, `credit-50`, `credit-100`,
`credit-250` e `credit-500`.

---

## 7. Planos e créditos

| Plano | Preço | Gerações por mês |
|---|---|---|
| Grátis | R$ 0 | 5 |
| Premium | R$ 19,90 | 50 |
| Pro | R$ 39,90 | ilimitado |

Quando a cota do mês acaba, cada geração consome **1 crédito**. Sem cota e sem
crédito, a API responde `402` com uma mensagem explicando a situação.

O crédito só é debitado **depois** que a imagem chega. Se a IA falhar, nada é
cobrado e nada é gravado.

---

## 8. Segurança

- Senhas com **bcrypt** (12 rounds); o hash nunca sai da API.
- Sessão em cookie `httpOnly` + `SameSite=Lax` (`Secure` em produção), fora do
  alcance de scripts da página.
- **Rate limiting**: 20 tentativas/15 min nas rotas de conta, 6 gerações/min.
- Login e recuperação de senha respondem igual para e-mail existente ou não,
  para não revelar quem tem conta.
- Tokens de recuperação são guardados como **hash**, valem 1 hora e só podem
  ser usados uma vez.
- A confirmação de e-mail é necessária para conceder o benefício Premium
  exclusivo; em desenvolvimento, o link de confirmação é mostrado no terminal
  da API, assim como os e-mails de recuperação.
- Wallpapers gerados são privados por padrão. A API verifica a permissão
  também ao consultar, favoritar, editar, baixar ou servir o arquivo direto.
- Pastas e itens são associados ao usuário autenticado no PostgreSQL; nomes,
  ids enviados pelo frontend e o `localStorage` não concedem acesso.
- `POST /wallpapers` exige **HTTPS** e recusa endereços internos
  (`localhost`, `10.x`, `192.168.x`, `.local`…), bloqueando SSRF.
- Consultas sempre parametrizadas — sem concatenação de SQL.
- `helmet` nos cabeçalhos e CORS restrito ao `FRONTEND_URL`; em desenvolvimento,
  também aceita origens HTTP locais para acomodar portas alternativas do Vite.

---

## 9. Problemas comuns

**"Ja existe um PostgreSQL deste projeto rodando"**
A API já está aberta em outro terminal. Feche-o e rode de novo. Se não houver
nenhum, a própria mensagem traz o comando `taskkill` com o número do processo.

**O banco não inicia e nada mais resolve**
Pare a API e apague a pasta `back/.pgdata`. Ela é recriada com os wallpapers de
exemplo na próxima execução. (Você perde as contas criadas nos testes.)

**`ECONNREFUSED` com `EMBEDDED_POSTGRES=false`**
Nesse modo a API usa a `DATABASE_URL` do `.env`: confira se o seu PostgreSQL
está mesmo rodando e se o endereço está certo.

**`A conta do Google Gemini esta sem creditos`**
A chave é válida, mas o projeto do Google não tem saldo. Ative o faturamento em
<https://ai.studio/projects>. Até lá, todo o resto do site funciona — só a
geração por IA fica indisponível.

**`O modelo ... nao esta disponivel`**
Ajuste `GEMINI_IMAGE_MODEL` no `.env`. Para ver os modelos da sua chave:

```bash
curl -H "x-goog-api-key: SUA_CHAVE" https://generativelanguage.googleapis.com/v1beta/models
```

**`O pagamento ainda nao foi configurado`**
Falta o `MERCADOPAGO_ACCESS_TOKEN`. Só o checkout depende dele.

---

## 10. Estrutura

```
back/
├── src/
│   ├── config/      env.js (variáveis), plans.js (planos e pacotes)
│   ├── db/          pool.js, schema.sql, migrate.js, seed.js
│   ├── middleware/  auth.js, rateLimit.js, errorHandler.js
│   ├── routes/      auth, users, wallpapers, favorites, images, billing
│   ├── services/    gemini.js, billing.js, mailer.js, tokens.js, usage.js, wallpapers.js
│   ├── utils/       http.js (erros), validate.js
│   ├── app.js       monta o Express
│   └── server.js    sobe o servidor
└── uploads/wallpapers/   imagens geradas pela IA
```

---

## 11. Publicar em produção

1. `NODE_ENV=production` e um `JWT_SECRET` novo, com 32+ caracteres.
2. `PUBLIC_URL` e `FRONTEND_URL` com os domínios reais.
3. `DATABASE_SSL=true` se o banco for gerenciado.
4. Trocar o `sendMail` em `src/services/mailer.js` por um provedor real
   (hoje ele apenas imprime o link no console).
5. A pasta `uploads/` precisa ser persistente. Em plataformas com disco
   efêmero (Heroku, Render free), use um bucket S3/R2 no lugar.
6. O rate limiter é em memória; com mais de uma instância, troque por Redis.
