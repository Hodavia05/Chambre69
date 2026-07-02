# 🏛️ Chambre 69 - Boutique de Lingerie Haut de Gamme

Bienvenue sur la plateforme officielle de **Chambre 69**, une expérience numérique de luxe dédiée à l'élégance et au raffinement.

---

## 📖 Pour les Visiteurs (Clients)
**Chambre 69** est conçue pour vous offrir une navigation fluide et immersive dans l'univers de la lingerie de luxe.
- **Boutique Intuitive** : Parcourez nos collections par marque (Curvy Kate, Dita Von Teese, Elomi, etc.) avec des filtres intelligents par catégorie et collection.
- **Détails Produits** : Cliquez sur n'importe quel article pour découvrir ses secrets (matières, entretien, tailles).
- **Commande WhatsApp** : Un coup de cœur ? Commandez directement via WhatsApp en un clic pour un service personnalisé.
- **Expérience Premium** : Un design épuré, lumineux et réactif pour un confort visuel optimal.

---

## 🛠️ Pour les Développeurs (Débutants à Seniors)

### Architecture Technique
Le projet utilise une stack moderne et performante :
- **Frontend** : React 18, TypeScript, Tailwind CSS, Framer Motion (animations).
- **Backend** : Node.js (Express), TypeScript, Prisma ORM.
- **Base de Données** : PostgreSQL.

### Installation Rapide
1. **Clonage** : `git clone https://github.com/votre-repo/Chambre69.git`
2. **Frontend** :
   ```bash
   npm install
   npm run dev
   ```
3. **Backend** :
   ```bash
   cd backend
   npm install
   npx prisma migrate dev
   npm run prisma:seed # Scan automatique des images racine
   npm run dev
   ```

### 🧠 Logique de Scan Dynamique (Seed)
Le script `backend/prisma/seed.ts` est le cœur de l'automatisation. Il parcourt récursivement les dossiers de marques à la racine du dépôt :
- Il détecte automatiquement les **Marques**, **Sous-catégories** et **Collections**.
- Il supporte les formats `.jpg`, `.png`, `.webp` et `.avif`.
- Il génère des URLs encodées pour gérer les espaces et caractères spéciaux dans les noms de dossiers.

---

## 🔐 Système d'Authentification
Nous avons implémenté une authentification sécurisée et esthétique :
- **Glassmorphisme** : Formulaires de connexion/inscription avec effet de verre dépoli.
- **Sécurité** : Hachage des mots de passe avec `bcryptjs` et gestion des sessions via `JSON Web Tokens (JWT)`.
- **Persistance** : Session utilisateur sauvegardée localement pour une navigation sans interruption.

---

## 🎨 Guide de Style (Code Couleur)
- **Fond** : `#FDFDFD` (Blanc cassé / Crème)
- **Accent principal** : `#C9A96E` (Or Chambre 69)
- **Texte** : `#111111` (Noir Profond) / `#999999` (Gris Doux)
- **Typographie** : Serif pour les titres (Élégance), Sans-serif pour le corps (Lisibilité).

---

## 🚀 Déploiement
Un workflow **GitHub Actions** est configuré dans `.github/workflows/main.yml` pour valider chaque build automatiquement et garantir la stabilité du projet.

### Liaison avec le guide de déploiement
Pour la procédure complète de déploiement avec **Neon**, **Render**, et **Vercel**, consultez `DEPLOYMENT.md`.

---
*Développé avec passion pour l'élégance.*
