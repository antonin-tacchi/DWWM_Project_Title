-- ============================================================
-- db-service — migration initiale
-- Toutes les tables de l'application Clap! en un seul script
-- Compatible H2 en mode MySQL (VARCHAR au lieu d'ENUM)
-- ============================================================

-- Utilisateurs (auth-service)
CREATE TABLE IF NOT EXISTS users (
  id                   BIGINT PRIMARY KEY AUTO_INCREMENT,
  username             VARCHAR(50)  NOT NULL,
  email                VARCHAR(100) NOT NULL,
  password_hash        VARCHAR(255) NOT NULL,
  avatar_url           VARCHAR(255),
  bio                  TEXT,
  language             VARCHAR(10)  DEFAULT 'fr',
  theme                VARCHAR(10)  DEFAULT 'dark',
  level                INT          DEFAULT 1,
  xp                   INT          DEFAULT 0,
  banner_tmdb_id       BIGINT       DEFAULT NULL,
  banner_media_type    VARCHAR(10)  DEFAULT NULL,
  banner_backdrop_path VARCHAR(500) DEFAULT NULL,
  created_at           DATETIME     DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uq_users_username UNIQUE (username),
  CONSTRAINT uq_users_email    UNIQUE (email)
);

-- Historique de consultation (movies-service)
CREATE TABLE IF NOT EXISTS history (
  id           BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id      BIGINT      NOT NULL,
  tmdb_id      BIGINT      NOT NULL,
  media_type   VARCHAR(10) NOT NULL,
  consulted_at DATETIME    DEFAULT CURRENT_TIMESTAMP
);

-- Notifications (notifications-service)
CREATE TABLE IF NOT EXISTS notifications (
  id         BIGINT       PRIMARY KEY AUTO_INCREMENT,
  user_id    BIGINT       NOT NULL,
  type       VARCHAR(50)  NOT NULL,
  message    VARCHAR(500) NOT NULL,
  is_read    BOOLEAN      DEFAULT FALSE,
  created_at DATETIME     DEFAULT CURRENT_TIMESTAMP
);

-- Notes (social-service)
CREATE TABLE IF NOT EXISTS ratings (
  id         BIGINT      PRIMARY KEY AUTO_INCREMENT,
  user_id    BIGINT      NOT NULL,
  tmdb_id    BIGINT      NOT NULL,
  media_type VARCHAR(10) NOT NULL,
  score      TINYINT     NOT NULL CHECK (score BETWEEN 1 AND 10),
  created_at DATETIME    DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uq_rating UNIQUE (user_id, tmdb_id, media_type)
);

-- Commentaires (social-service)
CREATE TABLE IF NOT EXISTS comments (
  id         BIGINT      PRIMARY KEY AUTO_INCREMENT,
  user_id    BIGINT      NOT NULL,
  tmdb_id    BIGINT      NOT NULL,
  media_type VARCHAR(10) NOT NULL,
  content    TEXT        NOT NULL,
  created_at DATETIME    DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME    DEFAULT CURRENT_TIMESTAMP
);

-- Likes sur les commentaires (social-service)
CREATE TABLE IF NOT EXISTS comment_likes (
  id         BIGINT   PRIMARY KEY AUTO_INCREMENT,
  user_id    BIGINT   NOT NULL,
  comment_id BIGINT   NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uq_like UNIQUE (user_id, comment_id),
  CONSTRAINT fk_comment_likes_comment FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE CASCADE
);

-- Favoris (social-service)
CREATE TABLE IF NOT EXISTS favorites (
  id         BIGINT      PRIMARY KEY AUTO_INCREMENT,
  user_id    BIGINT      NOT NULL,
  tmdb_id    BIGINT      NOT NULL,
  media_type VARCHAR(10) NOT NULL,
  added_at   DATETIME    DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uq_favorite UNIQUE (user_id, tmdb_id, media_type)
);

-- Listes personnalisées (social-service)
CREATE TABLE IF NOT EXISTS lists (
  id          BIGINT       PRIMARY KEY AUTO_INCREMENT,
  user_id     BIGINT       NOT NULL,
  name        VARCHAR(100) NOT NULL,
  description VARCHAR(500),
  is_default  BOOLEAN      DEFAULT FALSE,
  is_public   BOOLEAN      DEFAULT FALSE,
  created_at  DATETIME     DEFAULT CURRENT_TIMESTAMP
);

-- Éléments des listes (social-service)
CREATE TABLE IF NOT EXISTS list_items (
  id         BIGINT      PRIMARY KEY AUTO_INCREMENT,
  list_id    BIGINT      NOT NULL,
  tmdb_id    BIGINT      NOT NULL,
  media_type VARCHAR(10) NOT NULL,
  added_at   DATETIME    DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uq_list_item UNIQUE (list_id, tmdb_id, media_type),
  CONSTRAINT fk_list_items_list FOREIGN KEY (list_id) REFERENCES lists(id) ON DELETE CASCADE
);
