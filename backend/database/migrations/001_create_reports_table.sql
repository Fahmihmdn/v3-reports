CREATE TABLE IF NOT EXISTS reports (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    status ENUM('open', 'in_progress', 'resolved', 'blocked') NOT NULL DEFAULT 'open',
    status_label VARCHAR(50) NOT NULL,
    due_date DATE NOT NULL,
    progress TINYINT UNSIGNED NOT NULL DEFAULT 0,
    owner_name VARCHAR(120) NOT NULL,
    owner_role VARCHAR(120) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    resolved_at DATETIME NULL,
    on_time TINYINT(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
