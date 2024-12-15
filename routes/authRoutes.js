import express from "express";
import { body, param } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as Utilisateur from "../queries/Utilisateur.js";
import { authenticateToken } from "../middlewares/authenticateToken.js";
import validateRequest from "../middlewares/validateRequest.js";
import { getConnection } from "../queries/connect.js";

const client = getConnection("express_project");
const router = express.Router();
const secret_key = process.env.SECRET_KEY;

// Inscription
router.post(
  "/signup",
  [
    body("nom").notEmpty().withMessage("Le champ 'nom' est obligatoire."),
    body("email")
      .isEmail()
      .withMessage("Le champ 'email' doit être une adresse email valide."),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Le mot de passe doit contenir au moins 6 caractères."),
  ],
  validateRequest,
  async (req, res) => {
    const { nom, email, password } = req.body;

    try {
      Utilisateur.GetUserByEmail(client, email, async (err, result) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "Erreur lors de la vérification de l'email." });
        }
        if (result.exists) {
          return res
            .status(409)
            .json({ message: "Cet email est déjà utilisé." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        Utilisateur.Insert_user(
          client,
          { nom, email, password: hashedPassword },
          (err, results) => {
            if (err) {
              return res
                .status(500)
                .json({ message: "Erreur lors de l'inscription." });
            }
            res.status(201).json({ message: "Inscription réussie." });
          }
        );
      });
    } catch {
      res.status(500).json({ message: "Erreur lors de l'inscription" });
    }
  }
);

// Connexion
router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("Le champ 'email' doit être une adresse email valide."),
    body("password")
      .notEmpty()
      .withMessage("Le champ 'password' est obligatoire."),
  ],
  validateRequest,
  async (req, res) => {
    const { email, password } = req.body;

    try {
      Utilisateur.GetUserByEmail(client, email, async (err, result) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "Erreur lors de la verification de l'email." });
        }
        if (!result.exists) {
          return res.status(404).json({ message: "Utilisateur non trouvé." });
        }

        const user = result.results[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
          return res
            .status(401)
            .json({ message: "Le mot de passe est incorrect" });
        }

        const token = jwt.sign(
          { id: user.id_utilisateur, email: user.email, role: user.role },
          secret_key,
          { expiresIn: "1h" }
        );

        res
          .status(200)
          .json({
            message: `Connexion réussie. Bienvenue ${user.nom}.`,
            token,
          });
      });
    } catch {
      res.status(500).json({ message: "Erreur lors de la connexion." });
    }
  }
);

router.put(
  "/set_user_to_admin/:id_utilisateur",
  authenticateToken, // Middleware pour vérifier le token
  async (req, res) => {
    const { id_utilisateur } = req.params;

    try {
      Utilisateur.SetUserToAdmin(client, id_utilisateur, (err, result) => {
        if (err) {
          return res.status(500).json({
            message: "Erreur lors de la mise à jour de l'utilisateur.",
          });
        }

        if (result.affectedRows === 0) {
          return res.status(400).json({
            message: "L'utilisateur est déjà admin ou n'existe pas.",
          });
        }

        res.status(200).json({
          message: `L'utilisateur avec ID ${id_utilisateur} est maintenant admin.`,
        });
      });
    } catch {
      res.status(500).json({
        message: "Erreur inattendue lors de la mise à jour.",
      });
    }
  }
);


export default router;
