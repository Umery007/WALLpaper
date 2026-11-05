-- =====================================================================
-- WA1PAPER - esquema do banco (PostgreSQL)
-- Este arquivo e idempotente: pode ser executado quantas vezes precisar.
-- =====================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS citext;

-- Contas -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name           TEXT        NOT NULL,
  email          CITEXT      NOT NULL UNIQUE,
  email_verified BOOLEAN     NOT NULL DEFAULT FALSE,
  username       CITEXT      UNIQUE,
  password_hash  TEXT        NOT NULL,
  avatar_url     TEXT,
  is_private     BOOLEAN     NOT NULL DEFAULT FALSE,
  plan           TEXT        NOT NULL DEFAULT 'gratis',
  plan_expires_at TIMESTAMPTZ,
  credits        INTEGER     NOT NULL DEFAULT 0 CHECK (credits >= 0),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN NOT NULL DEFAULT FALSE;

CREATE TABLE IF NOT EXISTS email_verifications (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash  TEXT        NOT NULL UNIQUE,
  expires_at  TIMESTAMPTZ NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS email_verifications_user_idx ON email_verifications(user_id);

-- Recuperacao de senha ------------------------------------------------
-- Guardamos apenas o hash do token; o valor original so vai para o e-mail.
CREATE TABLE IF NOT EXISTS password_resets (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash  TEXT        NOT NULL UNIQUE,
  expires_at  TIMESTAMPTZ NOT NULL,
  used_at     TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS password_resets_user_idx ON password_resets(user_id);

-- Galeria --------------------------------------------------------------
CREATE TABLE IF NOT EXISTS wallpapers (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        REFERENCES users(id) ON DELETE SET NULL,
  title       TEXT        NOT NULL,
  description TEXT        NOT NULL DEFAULT '',
  image_url   TEXT        NOT NULL,
  category    TEXT        NOT NULL DEFAULT '',
  tags        TEXT[]      NOT NULL DEFAULT '{}',
  source      TEXT        NOT NULL DEFAULT 'upload' CHECK (source IN ('upload', 'ai', 'seed')),
  prompt      TEXT,
  is_public   BOOLEAN     NOT NULL DEFAULT TRUE,
  downloads   INTEGER     NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS wallpapers_created_idx  ON wallpapers(created_at DESC);
CREATE INDEX IF NOT EXISTS wallpapers_user_idx     ON wallpapers(user_id);
CREATE INDEX IF NOT EXISTS wallpapers_category_idx ON wallpapers(lower(category));
CREATE INDEX IF NOT EXISTS wallpapers_tags_idx     ON wallpapers USING GIN(tags);
-- Busca textual por titulo + descricao
CREATE INDEX IF NOT EXISTS wallpapers_search_idx ON wallpapers
  USING GIN(to_tsvector('portuguese', title || ' ' || description));

-- Favoritos ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS favorites (
  user_id      UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  wallpaper_id UUID        NOT NULL REFERENCES wallpapers(id) ON DELETE CASCADE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, wallpaper_id)
);
CREATE INDEX IF NOT EXISTS favorites_user_idx ON favorites(user_id, created_at DESC);

-- Pastas individuais --------------------------------------------------
CREATE TABLE IF NOT EXISTS wallpaper_folders (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name        TEXT        NOT NULL,
  visibility  TEXT        NOT NULL DEFAULT 'private' CHECK (visibility IN ('private', 'public')),
  cover_image TEXT        NOT NULL DEFAULT '',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, name)
);
CREATE INDEX IF NOT EXISTS wallpaper_folders_user_idx ON wallpaper_folders(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS wallpaper_folders_public_idx ON wallpaper_folders(visibility, created_at DESC);

CREATE TABLE IF NOT EXISTS wallpaper_folder_items (
  folder_id   UUID        NOT NULL REFERENCES wallpaper_folders(id) ON DELETE CASCADE,
  wallpaper_id UUID       NOT NULL REFERENCES wallpapers(id) ON DELETE CASCADE,
  position    INTEGER     NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (folder_id, wallpaper_id)
);
CREATE INDEX IF NOT EXISTS wallpaper_folder_items_wallpaper_idx ON wallpaper_folder_items(wallpaper_id);

-- Seguidores -----------------------------------------------------------
-- follower_id segue following_id. A chave primaria dupla ja impede seguir
-- duas vezes, e o CHECK impede seguir a si mesmo.
CREATE TABLE IF NOT EXISTS follows (
  follower_id  UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  following_id UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (follower_id, following_id),
  CONSTRAINT follows_nao_a_si_mesmo CHECK (follower_id <> following_id)
);
-- "Quem segue fulano" e "quem fulano segue" sao as duas leituras comuns.
CREATE INDEX IF NOT EXISTS follows_following_idx ON follows(following_id, created_at DESC);
CREATE INDEX IF NOT EXISTS follows_follower_idx  ON follows(follower_id, created_at DESC);

-- Downloads ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS downloads (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  wallpaper_id UUID        NOT NULL REFERENCES wallpapers(id) ON DELETE CASCADE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS downloads_user_idx ON downloads(user_id, created_at DESC);

-- Historico de geracoes por IA (usado para a cota mensal) ---------------
CREATE TABLE IF NOT EXISTS generations (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  wallpaper_id UUID        REFERENCES wallpapers(id) ON DELETE SET NULL,
  prompt       TEXT        NOT NULL,
  model        TEXT        NOT NULL DEFAULT '',
  charged_credit BOOLEAN   NOT NULL DEFAULT FALSE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS generations_user_month_idx ON generations(user_id, created_at DESC);

-- Creditos e pagamentos --------------------------------------------------
CREATE TABLE IF NOT EXISTS credit_transactions (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  delta      INTEGER     NOT NULL,
  reason     TEXT        NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS credit_transactions_user_idx ON credit_transactions(user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS billing_orders (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_key   TEXT        NOT NULL,
  kind          TEXT        NOT NULL CHECK (kind IN ('plan', 'credits')),
  amount_cents  INTEGER     NOT NULL,
  credits       INTEGER     NOT NULL DEFAULT 0,
  plan          TEXT,
  provider      TEXT        NOT NULL DEFAULT 'mercadopago',
  provider_ref  TEXT,
  status        TEXT        NOT NULL DEFAULT 'pending'
                            CHECK (status IN ('pending', 'paid', 'failed', 'cancelled')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS billing_orders_user_idx     ON billing_orders(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS billing_orders_provider_idx ON billing_orders(provider_ref);

-- updated_at automatico ----------------------------------------------------
CREATE OR REPLACE FUNCTION set_updated_at() RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS users_updated_at ON users;
CREATE TRIGGER users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS billing_orders_updated_at ON billing_orders;
CREATE TRIGGER billing_orders_updated_at BEFORE UPDATE ON billing_orders
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
