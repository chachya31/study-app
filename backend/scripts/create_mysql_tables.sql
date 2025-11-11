-- MySQL データベーステーブル作成スクリプト
-- Film と Actor の管理システム用

-- films テーブルの作成
CREATE TABLE IF NOT EXISTS films (
    film_id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_path VARCHAR(500),
    release_year INT,
    rating ENUM('G', 'PG', 'PG-13', 'R', 'NC-17') NOT NULL,
    last_update TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    delete_flag BOOLEAN NOT NULL DEFAULT FALSE,
    INDEX idx_delete_flag (delete_flag)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- actors テーブルの作成
CREATE TABLE IF NOT EXISTS actors (
    actor_id VARCHAR(36) PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    last_update TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    delete_flag BOOLEAN NOT NULL DEFAULT FALSE,
    INDEX idx_delete_flag (delete_flag)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
