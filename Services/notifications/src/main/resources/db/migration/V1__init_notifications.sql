    CREATE TABLE IF NOT EXISTS notifications (
    id         BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id    BIGINT NOT NULL,
    type       VARCHAR(50) NOT NULL,
    message    VARCHAR(500) NOT NULL,
    is_read    BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);