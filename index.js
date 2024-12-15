//lancer la commande node index.js pour effectuer tout les test necessaire

import express from "express";
import 'dotenv/config';

import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import { logRequests } from './middlewares/logRequest.js'; // Import du middleware de log

const app = express();
const port = 8000;

app.use(express.json());

// Ajout du middleware de log pour toutes les requêtes
app.use(logRequests);

app.use('/auth', authRoutes);
app.use('/projects', projectRoutes);
app.use('/tasks', taskRoutes);

app.get('/', (req, res) => res.send("Bonjour, pour tester les différents endpoints vous pouvez consulter le fichier \'endpoints.txt\' pour avoir une indication des tests réalisable."));
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
