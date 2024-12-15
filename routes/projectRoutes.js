import express from "express";
import { body, param } from "express-validator";
import validateRequest from "../middlewares/validateRequest.js";
import { authenticateToken } from "../middlewares/authenticateToken.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import * as Projet from "../queries/Projet.js";
import { getConnection } from "../queries/connect.js";

const client = getConnection("express_project");
const router = express.Router();

// Obtenir un projet spécifique par ID
router.get(
  "/GetProject/:projectsId",
  [param("projectsId").isInt().withMessage("L'ID doit être un entier valide.")],
  validateRequest,
  (req, res) => {
    const projectId = parseInt(req.params.projectsId, 10);

    Projet.Find_Project(client, projectId, (err, project) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Erreur lors de la récupération du projet." });
      }
      if (!project) {
        return res.status(404).json({ message: "Projet non trouvé." });
      }
      res.status(200).json(project);
    });
  }
);

// Obtenir tous les projets
router.get("/GetProjects", (req, res) => {
  Projet.Get_All_Project(client, (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Erreur lors de la récupération des projets." });
    }
    res.status(200).json(results);
  });
});

// Créer un nouveau projet
router.post(
  "/NewProject",
  authenticateToken,
  isAdmin,
  [
    body("nom").notEmpty().withMessage("Le champ 'nom' est obligatoire."),
    body("date_debut")
      .isISO8601()
      .withMessage(
        "Le champ 'date_debut' doit être une date valide. (YYYY-MM-DD)"
      ),
    body("date_fin")
      .isISO8601()
      .withMessage(
        "Le champ 'date_fin' doit être une date valide. (YYYY-MM-DD)"
      ),
    body("statut").notEmpty().withMessage("Le champ 'statut' est obligatoire."),
  ],
  validateRequest,
  (req, res) => {
    const { nom, date_debut, date_fin, statut } = req.body;
    const newProject = { nom, date_debut, date_fin, statut };

    Projet.Create_Project(client, newProject, (err, results) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Erreur lors de la création du projet." });
      }
      res.status(201).json({ message: "Projet ajouté avec succès.", results });
    });
  }
);

// Mettre à jour un projet par ID
router.put(
  "/UpdProject/:projectsId",
  authenticateToken,
  isAdmin,
  [
    param("projectsId").isInt().withMessage("L'ID doit être un entier valide."),
    body("nom")
      .optional()
      .notEmpty()
      .withMessage("Le champ 'nom' ne peut pas être vide."),
    body("date_debut")
      .optional()
      .isISO8601()
      .withMessage(
        "Le champ 'date_debut' doit être une date valide. (YYYY-MM-DD)"
      ),
    body("date_fin")
      .optional()
      .isISO8601()
      .withMessage(
        "Le champ 'date_fin' doit être une date valide. (YYYY-MM-DD)"
      ),
    body("statut")
      .optional()
      .notEmpty()
      .withMessage("Le champ 'statut' ne peut pas être vide."),
  ],
  validateRequest,
  (req, res) => {
    const projectId = parseInt(req.params.projectsId, 10);
    const updates = req.body;

    Projet.Find_Project(client, projectId, (err, result) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Erreur lors de la recherche du projet." });
      }

      if (result.length === 0) {
        return res
          .status(404)
          .json({ message: "Erreur, le projet n'existe pas." });
      }

      Projet.Update_Project(client, projectId, updates, (err, results) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "Erreur lors de la mise à jour du projet." });
        }
        res
          .status(200)
          .json({ message: "Projet mis à jour avec succès.", results });
      });
    });
  }
);

// Supprimer un projet par ID
router.delete(
  "/DelProject/:projectsId",
  authenticateToken,
  isAdmin,
  [param("projectsId").isInt().withMessage("L'ID doit être un entier valide.")],
  validateRequest,
  (req, res) => {
    const projectId = parseInt(req.params.projectsId, 10);

    Projet.Find_Project(client, projectId, (err, result) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Erreur lors de la recherche du projet." });
      }

      if (result.length === 0) {
        return res
          .status(404)
          .json({ message: "Erreur, le projet n'existe pas." });
      }

      Projet.Delete_Project(client, projectId, (err) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "Erreur lors de la suppression." });
        }
        res.status(200).json({ message: "Projet supprimé avec succès." });
      });
    });
  }
);

export default router;
