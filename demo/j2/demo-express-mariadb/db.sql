CREATE DATABASE stock_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE stock_db;

CREATE TABLE produits (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nom VARCHAR(255) NOT NULL,
  prix DECIMAL(10, 2) NOT NULL,
  quantite INT NOT NULL DEFAULT 0,
  categorie VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insérer des données de test
INSERT INTO produits (nom, prix, quantite, categorie) VALUES
  ('Souris sans fil', 29.99, 50, 'Périphériques'),
  ('Clavier mécanique', 89.99, 15, 'Périphériques'),
  ('Écran 24 pouces', 199.99, 8, 'Moniteurs');