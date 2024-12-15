import express from "express";
import { body, param } from "express-validator";
import * as Tache from "../queries/Tache.js";
import * as Projet from "../queries/Projet.js";
import { authenticateToken } from "../middlewares/authenticateToken.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import { error } from "console";
import validateRequest from "../middlewares/validateRequest.js";
import { getConnection } from "../queries/connect.js";

const client = getConnection("express_project");
const router = express.Router();

router.get("/GetTasks", (req, res) => {
  Tache.Get_All_Task(client, (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Erreur lors de la récupération des tâches" });
    }
    res.status(200).json(results);
  });
});

router.post(
  "/NewTask",
  authenticateToken,
  [
    body("titre")
      .isString()
      .withMessage("Le titre doit être une chaîne de caractères."),
    body("description")
      .isString()
      .withMessage("La description doit être une chaîne de caractères."),
    body("deadline")
      .isISO8601()
      .withMessage("La date limite doit être au format ISO8601. (YYYY-MM-DD)"),
    body("statut")
      .isIn(["Non commencé", "En cours", "Fait"])
      .withMessage(
        "Statut invalide veuillez choisir entre ('Non commencé', 'En cours' ou 'Fait')."
      ),
    body("id_projet")
      .isInt({ gt: 0 })
      .withMessage("L'identifiant du projet doit être un entier positif."),
  ],
  validateRequest,
  (req, res) => {
    const { titre, description, deadline, statut, id_projet } = req.body;

    Projet.Find_Project(client, id_projet, (err, results) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Erreur lors de la vérification du projet." });
      }

      if (results.length === 0) {
        return res
          .status(404)
          .json({ message: "Le projet spécifié n'existe pas." });
      }

      const newTask = { titre, description, deadline, statut, id_projet };

      Tache.Create_task(client, newTask, (err, results) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "Erreur lors de la création de la tâche" });
        }
        res
          .status(201)
          .json({ message: "Tâche ajoutée avec succès.", results });
      });
    });
  }
);

router.put(
  "/UpdTask/:taskId",
  authenticateToken,
  isAdmin,
  [
    param("taskId")
      .isInt({ gt: 0 })
      .withMessage("L'identifiant de la tâche doit être un entier positif."),
    body("titre")
      .optional()
      .isString()
      .withMessage("Le titre doit être une chaîne de caractères."),
    body("description")
      .optional()
      .isString()
      .withMessage("La description doit être une chaîne de caractères."),
    body("deadline")
      .optional()
      .isISO8601()
      .withMessage("La date limite doit être au format ISO8601. (YYYY-MM-DD)"),
    body("statut")
      .optional()
      .isIn(["Non commencé", "En cours", "Fait"])
      .withMessage(
        "Statut invalide veuillez choisir entre ('Non commencé', 'En cours' ou 'Fait')."
      ),
    body("id_projet")
      .optional()
      .isInt({ gt: 0 })
      .withMessage("L'identifiant du projet doit être un entier positif."),
  ],
  validateRequest,
  (req, res) => {
    const taskId = parseInt(req.params.taskId, 10);
    const { titre, description, deadline, statut, id_projet } = req.body;

    Tache.Find_Task(client, taskId, (err, result) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Erreur lors de la recherche de la tâche." });
      }

      if (result.length === 0) {
        return res
          .status(404)
          .json({ message: "Erreur, la tâche n'existe pas." });
      }

      Projet.Find_Project(client, id_projet, (err, results) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "Erreur lors de la vérification du projet." });
        }

        if (results.length === 0) {
          return res
            .status(404)
            .json({ message: "Le projet spécifié n'existe pas." });
        }

        const updatedTask = { titre, description, deadline, statut, id_projet };

        Tache.Update_task(client, taskId, updatedTask, (err, results) => {
          if (err) {
            return res
              .status(500)
              .json({ message: "Erreur lors de la mise à jour de la tâche." });
          }
          res
            .status(200)
            .json({ message: "Tâche mise à jour avec succès.", results });
        });
      });
    });
  }
);

router.delete(
  "/DelTask/:taskId",
  authenticateToken,
  isAdmin,
  [
    param("taskId")
      .isInt({ gt: 0 })
      .withMessage("L'identifiant de la tâche doit être un entier positif."),
  ],
  validateRequest,
  (req, res) => {
    const taskId = parseInt(req.params.taskId, 10);

    Tache.Find_Task(client, taskId, (err, result) => {
      if (err) {
        return res
          .status(500)
          .json({
            message: "Erreur lors de la recherche de la tâche.",
            error: err,
          });
      }

      if (result.length === 0) {
        return res
          .status(404)
          .json({ message: "Erreur, la tâche n'existe pas." });
      }

      Tache.Delete_task(client, taskId, (err) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "Erreur lors de la suppression", error: err });
        }
        res.json({ message: "Tache supprimé avec succès" });
      });
    });
  }
);

export default router;
