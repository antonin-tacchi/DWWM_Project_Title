CREATE TABLE IF NOT EXISTS history (
  id           BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id      BIGINT NOT NULL,
  tmdb_id      BIGINT NOT NULL,
  media_type   ENUM('movie', 'tv') NOT NULL,
  consulted_at DATETIME DEFAULT CURRENT_TIMESTAMP
);