import bcrypt from 'bcryptjs';
import { getConnection } from '../queries/connect.js';

const client = getConnection('express_project');

// Fonction pour insérer les données avec mots de passe hachés
async function insertData() {
  try {
    // Hacher les mots de passe
    const hashedPasswordAlice = await bcrypt.hash('HelloWorld', 10);
    const hashedPasswordBob = await bcrypt.hash('TestTest', 10);

    // Insertion des utilisateurs
    await client.query(
      `INSERT INTO Utilisateur (nom, email, role, password) VALUES
      ('Alice', 'alice@example.com', 'admin', $1),
      ('Bob', 'bob@example.com', 'user', $2)`,
      [hashedPasswordAlice, hashedPasswordBob]
    );

    // Insertion des projets
    await client.query(
      `INSERT INTO Projet (nom, date_debut, date_fin, statut) VALUES
      ('Projet A', '2024-01-01', '2024-06-30', 'En cours'),
      ('Projet B', '2024-07-01', '2024-12-31', 'Planifié')`
    );

    // Insertion des tâches
    await client.query(
      `INSERT INTO Tache (titre, description, deadline, statut, id_projet) VALUES
      ('Conception', 'Conception de la base de données', '2024-02-15', 'En cours', 1),
      ('Développement', 'Développement de l’interface utilisateur', '2024-04-15', 'Non commencé', 1),
      ('Tests', 'Tests unitaires et d’intégration', '2024-06-01', 'Non commencé', 1)`
    );

    // Insertion des ressources
    await client.query(
      `INSERT INTO Ressource (type, lien, description, id_tache) VALUES
      ('Documentation', 'https://example.com/doc', 'Guide de conception', 1),
      ('Code Source', 'https://example.com/code', 'Référentiel de code', 2)`
    );

    // Insertion des assignations
    await client.query(
      `INSERT INTO Assigne (id_utilisateur, id_tache) VALUES
      (1, 1), -- Alice assignée à Conception
      (2, 2), -- Bob assigné à Développement
      (1, 3)` // Alice assignée à Tests
    );

    console.log('Données insérées avec succès !');
  } catch (error) {
    console.error('Erreur lors de l\'insertion des données :', error);
  } finally {
    client.end();
  }
}

insertData();
