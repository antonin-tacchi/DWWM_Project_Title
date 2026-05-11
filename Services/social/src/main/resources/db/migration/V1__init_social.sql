CREATE TABLE IF NOT EXISTS ratings (
    id          BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id     BIGINT NOT NULL,
    tmdb_id     BIGINT NOT NULL,
    media_type  ENUM('movie', 'tv') NOT NULL,
    score       TINYINT NOT NULL,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_rating (user_id, tmdb_id, media_type)
    );

CREATE TABLE IF NOT EXISTS comments (
    id          BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id     BIGINT NOT NULL,
    tmdb_id     BIGINT NOT NULL,
    media_type  ENUM('movie', 'tv') NOT NULL,
    content     TEXT NOT NULL,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );

CREATE TABLE IF NOT EXISTS comment_likes (
    id          BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id     BIGINT NOT NULL,
    comment_id  BIGINT NOT NULL,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_like (user_id, comment_id),
    FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE CASCADE
    );

CREATE TABLE IF NOT EXISTS favorites (
    id          BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id     BIGINT NOT NULL,
    tmdb_id     BIGINT NOT NULL,
    media_type  ENUM('movie', 'tv') NOT NULL,
    added_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_favorite (user_id, tmdb_id, media_type)
    );

CREATE TABLE IF NOT EXISTS lists (
    id          BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id     BIGINT NOT NULL,
    name        VARCHAR(100) NOT NULL,
    description VARCHAR(500),
    is_default  BOOLEAN DEFAULT FALSE,
    is_public   BOOLEAN DEFAULT FALSE,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
    );

CREATE TABLE IF NOT EXISTS list_items (
    id          BIGINT PRIMARY KEY AUTO_INCREMENT,
    list_id     BIGINT NOT NULL,
    tmdb_id     BIGINT NOT NULL,
    media_type  ENUM('movie', 'tv') NOT NULL,
    added_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_list_item (list_id, tmdb_id, media_type),
    FOREIGN KEY (list_id) REFERENCES lists(id) ON DELETE CASCADE
);