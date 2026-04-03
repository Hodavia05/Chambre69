import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { pool } from "./db.js";
import authRouter from "./routes/auth.js";

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 4000);
const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";

app.use(
  cors({
    origin: clientUrl,
    credentials: true,
  })
);
app.use(express.json());

app.get("/api/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({
      ok: true,
      message: "API et PostgreSQL connectes",
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: "Connexion PostgreSQL echouee",
      error: error.message,
    });
  }
});

app.use("/api/auth", authRouter);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({
    message: "Erreur interne du serveur",
  });
});

app.listen(port, () => {
  console.log(`Backend pret sur http://localhost:${port}`);
});
