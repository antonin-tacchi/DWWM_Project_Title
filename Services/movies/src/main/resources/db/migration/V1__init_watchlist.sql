CREATE TABLE IF NOT EXISTS watchlist_entries (
    id          BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_email  VARCHAR(100) NOT NULL,
    tmdb_id     BIGINT NOT NULL,
    media_type  ENUM('movie', 'tv') NOT NULL,
    added_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_user_media (user_email, tmdb_id, media_type)
);