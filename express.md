# Découverte d'express et d'API

## Énoncé

**Contexte :**
Créer une API complète pour gérer les soldes et réservations des clients d'une salle de sport, avec MariaDB.

**Base de données à créer :**

```sql
CREATE DATABASE salle_sport CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE salle_sport;

CREATE TABLE clients (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nom VARCHAR(100) NOT NULL,
  prenom VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  solde DECIMAL(10, 2) DEFAULT 0.00,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reservations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  client_id INT NOT NULL,
  activite VARCHAR(100) NOT NULL,
  date_reservation DATE NOT NULL,
  cout DECIMAL(10, 2) NOT NULL,
  statut ENUM('confirmee', 'annulee') DEFAULT 'confirmee',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
);

-- Données de test
INSERT INTO clients (nom, prenom, email, solde) VALUES
  ('Dupont', 'Martin', 'martin.dupont@email.com', 50.00),
  ('Bernard', 'Sophie', 'sophie.bernard@email.com', 75.50),
  ('Petit', 'Lucas', 'lucas.petit@email.com', 120.00);
```

**Endpoints à implémenter :**

1. **Clients**
   - GET /api/clients - Liste tous les clients
   - GET /api/clients/:id - Un client
   - POST /api/clients/:id/recharge - Recharger un solde
     - Body: `{ "montant": 50 }`
   - GET /api/clients/:id/reservations - Réservations d'un client

2. **Réservations**
   - GET /api/reservations - Toutes les réservations
   - POST /api/reservations - Créer une réservation
     - Body: `{ "client_id": 1, "activite": "Yoga", "date_reservation": "2025-01-20", "cout": 15.00 }`
     - Vérifier que le solde est suffisant
     - Déduire le coût du solde du client
   - DELETE /api/reservations/:id - Annuler une réservation
     - Rembourser le solde du client

**Critères de réussite :**
- ✅ Tous les endpoints fonctionnent
- ✅ Validation des données
- ✅ Transactions atomiques (réservation + déduction solde)
- ✅ Gestion des erreurs appropriée
- ✅ Codes de statut HTTP corrects
