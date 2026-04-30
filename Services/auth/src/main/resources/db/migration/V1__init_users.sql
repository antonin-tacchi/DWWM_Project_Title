CREATE TABLE IF NOT EXISTS users (
  id                BIGINT PRIMARY KEY AUTO_INCREMENT,
  username          VARCHAR(50) UNIQUE NOT NULL,
  email             VARCHAR(100) UNIQUE NOT NULL,
  password_hash     VARCHAR(255) NOT NULL,
  avatar_url        VARCHAR(255),
  bio               TEXT,
  language          ENUM('fr', 'en') DEFAULT 'fr',
  theme             ENUM('light', 'dark') DEFAULT 'dark',
  level             INT DEFAULT 1,
  xp                INT DEFAULT 0,
  banner_tmdb_id    BIGINT DEFAULT NULL,
  banner_media_type ENUM('movie', 'tv') DEFAULT NULL,
  created_at        DATETIME DEFAULT CURRENT_TIMESTAMP
);