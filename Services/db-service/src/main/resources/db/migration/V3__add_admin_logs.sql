CREATE TABLE admin_logs (
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    admin_id   BIGINT       NOT NULL,
    action     VARCHAR(50)  NOT NULL,
    target_type VARCHAR(30) NOT NULL,
    target_id  BIGINT,
    details    VARCHAR(500),
    created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);
