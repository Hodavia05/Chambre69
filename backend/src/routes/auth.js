import bcrypt from "bcryptjs";
import express from "express";
import { query } from "../db.js";

const router = express.Router();

router.post("/register", async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email et mot de passe obligatoires",
    });
  }

  try {
    const existingUser = await query(
      "SELECT id FROM users WHERE email = $1 LIMIT 1",
      [email.toLowerCase()]
    );

    if (existingUser.rowCount > 0) {
      return res.status(409).json({
        message: "Un compte existe deja avec cet email",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const result = await query(
      `INSERT INTO users (first_name, last_name, email, password_hash)
       VALUES ($1, $2, $3, $4)
       RETURNING id, first_name, last_name, email, created_at`,
      [
        firstName || null,
        lastName || null,
        email.toLowerCase(),
        passwordHash,
      ]
    );

    return res.status(201).json({
      message: "Compte cree avec succes",
      user: result.rows[0],
    });
  } catch (error) {
    return next(error);
  }
});

router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email et mot de passe obligatoires",
    });
  }

  try {
    const result = await query(
      `SELECT id, first_name, last_name, email, password_hash, created_at
       FROM users
       WHERE email = $1
       LIMIT 1`,
      [email.toLowerCase()]
    );

    if (result.rowCount === 0) {
      return res.status(401).json({
        message: "Identifiants invalides",
      });
    }

    const user = result.rows[0];
    const passwordMatches = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatches) {
      return res.status(401).json({
        message: "Identifiants invalides",
      });
    }

    return res.json({
      message: "Connexion reussie",
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        created_at: user.created_at,
      },
    });
  } catch (error) {
    return next(error);
  }
});

export default router;
