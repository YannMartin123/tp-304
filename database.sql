-- ================================================
-- ICT304 - Système de Transaction Bancaire
-- Script de création de la base de données MySQL
-- ================================================

CREATE DATABASE IF NOT EXISTS banking_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE banking_db;

-- Table des utilisateurs
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  prenom VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  mot_de_passe VARCHAR(255) NOT NULL,
  role ENUM('client', 'agent', 'admin') DEFAULT 'client',
  actif TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des comptes bancaires
CREATE TABLE IF NOT EXISTS comptes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  numero_compte VARCHAR(30) NOT NULL UNIQUE,
  user_id INT NOT NULL,
  solde DECIMAL(15,2) DEFAULT 0.00,
  devise VARCHAR(10) DEFAULT 'XAF',
  actif TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Table des transactions
CREATE TABLE IF NOT EXISTS transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  type ENUM('depot', 'retrait') NOT NULL,
  montant DECIMAL(15,2) NOT NULL,
  devise VARCHAR(10) DEFAULT 'XAF',
  compte_id INT NOT NULL,
  description TEXT,
  statut ENUM('success', 'failed') DEFAULT 'success',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (compte_id) REFERENCES comptes(id)
);

-- Données de test : un client avec un compte
INSERT INTO users (nom, prenom, email, mot_de_passe, role) VALUES
('Dupont', 'Jean', 'jean.dupont@email.com', '$2a$10$example_hash_replace_me', 'client');

INSERT INTO comptes (numero_compte, user_id, solde) VALUES
('ACC-00000001', 1, 100000.00);
