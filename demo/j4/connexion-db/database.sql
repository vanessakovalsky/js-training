-- Créer la base de données
CREATE DATABASE stock_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE stock_db;

-- Table produits
CREATE TABLE produits (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nom VARCHAR(255) NOT NULL,
  prix DECIMAL(10, 2) NOT NULL,
  quantite INT NOT NULL DEFAULT 0,
  categorie VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_categorie (categorie),
  INDEX idx_nom (nom)
);

-- Table clients
CREATE TABLE clients (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nom VARCHAR(100) NOT NULL,
  prenom VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  solde DECIMAL(10, 2) DEFAULT 0.00,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_email (email)
);

-- Table reservations
CREATE TABLE reservations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  client_id INT NOT NULL,
  produit_id INT NOT NULL,
  quantite INT NOT NULL,
  montant_total DECIMAL(10, 2) NOT NULL,
  date_reservation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  statut ENUM('confirmee', 'annulee') DEFAULT 'confirmee',
  FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
  FOREIGN KEY (produit_id) REFERENCES produits(id) ON DELETE CASCADE,
  INDEX idx_client (client_id),
  INDEX idx_produit (produit_id),
  INDEX idx_statut (statut)
);

-- Insérer des données de test
INSERT INTO produits (nom, prix, quantite, categorie) VALUES
  ('Souris sans fil', 29.99, 50, 'Périphériques'),
  ('Clavier mécanique', 89.99, 15, 'Périphériques'),
  ('Écran 24 pouces', 199.99, 8, 'Moniteurs'),
  ('Webcam HD', 49.99, 30, 'Vidéo');

INSERT INTO clients (nom, prenom, email, solde) VALUES
  ('Dupont', 'Martin', 'martin.dupont@email.com', 100.00),
  ('Bernard', 'Sophie', 'sophie.bernard@email.com', 150.00),
  ('Petit', 'Lucas', 'lucas.petit@email.com', 200.00);

CREATE USER 'nest'@'localhost' IDENTIFIED BY 'password';
GRANT ALL ON stock_db.* TO 'nest'@'localhost';