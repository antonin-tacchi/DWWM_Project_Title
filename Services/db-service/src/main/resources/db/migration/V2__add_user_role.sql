-- Ajout du rôle utilisateur (user / admin)
ALTER TABLE users ADD COLUMN role VARCHAR(10) NOT NULL DEFAULT 'user';
