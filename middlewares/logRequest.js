import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { format } from 'date-fns';

// Recréez __dirname pour les modules ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Crée un chemin pour le fichier de journalisation
const logFilePath = path.join(__dirname, '../requests.log');

// Middleware pour journaliser les requêtes
export function logRequests(req, res, next) {
  const now = new Date();
  const formattedDate = format(now, 'yyyy-MM-dd (HH:mm:ss)');

  // Créer une copie du corps de la requête pour ne pas modifier req.body directement
  const body = { ...req.body };

  // Masquer le mot de passe si présent
  if (body.password) {
    body.password = '****'; // Masquer le mot de passe
  }

  // Construire le message de log
  const log = `${formattedDate} | ${req.method} ${req.url} | Body: ${JSON.stringify(body)} | IP: ${req.ip}\n`;

  // Append le log dans le fichier requests.log
  fs.appendFile(logFilePath, log, (err) => {
    if (err) {
      console.error("Erreur lors de l'écriture dans le fichier de log :", err);
    }
  });

  next(); // Passe au middleware suivant
}
