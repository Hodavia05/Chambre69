# Backend Node.js + PostgreSQL

## 1. Installer les dependances

Dans le dossier `backend/` :

```bash
npm install
```

Tu peux ensuite lancer :

```bash
npm run server
```

## 2. Configurer l environnement

Copie `backend/.env.example` vers `backend/.env` puis adapte :

```env
PORT=4000
CLIENT_URL=http://localhost:5173
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/chambre69
```

Si tu veux rendre l URL API configurable cote frontend, ajoute aussi un fichier `.env` a la racine :

```env
VITE_API_URL=http://localhost:4000/api
```

## 3. Creer la base PostgreSQL

Exemple :

```sql
CREATE DATABASE chambre69;
```

Puis execute le schema `backend/sql/schema.sql`.

## 4. Routes disponibles

- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/auth/login`

## 5. Page frontend connectee

La page `src/pages/Connexion.jsx` envoie maintenant les formulaires d inscription et de connexion vers l API.
