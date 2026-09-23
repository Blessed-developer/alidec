CREATE DATABASE IF NOT EXISTS alidec_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE alidec_db;

CREATE TABLE IF NOT EXISTS users (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(190) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_users_email (email),
    UNIQUE KEY uq_users_phone (phone)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS payment_methods (
    id TINYINT UNSIGNED NOT NULL AUTO_INCREMENT,
    code VARCHAR(30) NOT NULL,
    name VARCHAR(60) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    PRIMARY KEY (id),
    UNIQUE KEY uq_payment_methods_code (code)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS savings_plans (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id INT UNSIGNED NOT NULL,
    period_label VARCHAR(100) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NULL,
    status ENUM('active', 'completed', 'cancelled') NOT NULL DEFAULT 'active',
    balance DECIMAL(14, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_savings_plans_user (user_id),
    CONSTRAINT fk_savings_plans_user
        FOREIGN KEY (user_id) REFERENCES users (id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS savings_transactions (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    plan_id BIGINT UNSIGNED NOT NULL,
    user_id INT UNSIGNED NOT NULL,
    transaction_type ENUM('deposit', 'withdraw') NOT NULL,
    amount DECIMAL(14, 2) NOT NULL,
    payment_method_id TINYINT UNSIGNED NOT NULL,
    contact_account VARCHAR(100) NOT NULL,
    payment_reference VARCHAR(100) NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_savings_transactions_plan (plan_id),
    KEY idx_savings_transactions_user (user_id),
    CONSTRAINT fk_savings_transactions_plan
        FOREIGN KEY (plan_id) REFERENCES savings_plans (id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_savings_transactions_user
        FOREIGN KEY (user_id) REFERENCES users (id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_savings_transactions_payment_method
        FOREIGN KEY (payment_method_id) REFERENCES payment_methods (id)
        ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS investment_plans (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id INT UNSIGNED NOT NULL,
    purpose VARCHAR(100) NOT NULL,
    term_label VARCHAR(50) NOT NULL,
    expected_return_rate DECIMAL(5, 2) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NULL,
    status ENUM('active', 'completed', 'cancelled') NOT NULL DEFAULT 'active',
    principal DECIMAL(14, 2) NOT NULL DEFAULT 0.00,
    current_value DECIMAL(14, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_investment_plans_user (user_id),
    CONSTRAINT fk_investment_plans_user
        FOREIGN KEY (user_id) REFERENCES users (id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS investment_transactions (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    investment_id BIGINT UNSIGNED NOT NULL,
    user_id INT UNSIGNED NOT NULL,
    transaction_type ENUM('deposit', 'withdraw') NOT NULL,
    amount DECIMAL(14, 2) NOT NULL,
    payment_method_id TINYINT UNSIGNED NOT NULL,
    contact_account VARCHAR(100) NOT NULL,
    payment_reference VARCHAR(100) NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_investment_transactions_plan (investment_id),
    KEY idx_investment_transactions_user (user_id),
    CONSTRAINT fk_investment_transactions_plan
        FOREIGN KEY (investment_id) REFERENCES investment_plans (id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_investment_transactions_user
        FOREIGN KEY (user_id) REFERENCES users (id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_investment_transactions_payment_method
        FOREIGN KEY (payment_method_id) REFERENCES payment_methods (id)
        ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

INSERT INTO payment_methods (code, name)
VALUES
    ('Zamtel', 'Zamtel Money'),
    ('Airtel', 'Airtel Money'),
    ('MTN', 'MTN Mobile Money'),
    ('Bank', 'Bank account')
ON DUPLICATE KEY UPDATE name = VALUES(name), is_active = TRUE;
