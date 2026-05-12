# Chambre 69 - Boutique de Lingerie Haut de Gamme

Bienvenue dans le projet **Chambre 69**, une boutique en ligne élégante et moderne dédiée à la lingerie de luxe.

## 🚀 Technologies Utilisées

### Frontend
- **React** (avec TypeScript)
- **Vite**
- **Tailwind CSS** (pour le style)
- **Lucide React** (pour les icônes)
- **Framer Motion** (pour les animations fluides)

### Backend
- **Node.js**
- **Express**
- **TypeScript**
- **PostgreSQL** (Base de données)
- **Prisma** (ORM)

## 📁 Structure du Projet

```
project_room69/
├── backend/                # Serveur Node.js & Configuration Base de données
│   ├── prisma/             # Schéma et migrations Prisma
│   ├── src/                # Code source du backend (Express)
│   └── .env                # Variables d'environnement (DB URL, Port)
├── src/                    # Code source du frontend (React)
│   ├── components/         # Composants UI réutilisables
│   ├── context/            # Gestion de l'état (Panier)
│   ├── pages/              # Pages principales (Shop, Home, etc.)
│   └── config.ts           # Configuration du frontend (API URL)
├── public/                 # Assets statiques
└── package.json            # Dépendances frontend
```

## 🛠️ Installation et Configuration

### 1. Prérequis
- Node.js (v18+)
- PostgreSQL installé et en cours d'exécution

### 2. Configuration du Backend
1. Allez dans le dossier backend : `cd backend`
2. Installez les dépendances : `npm install`
3. Configurez votre base de données dans le fichier `.env` :
   ```env
   DATABASE_URL="postgresql://votre_utilisateur:votre_mot_de_passe@localhost:5432/votre_base_de_donnees?schema=public"
   ```
4. Générez le client Prisma : `npm run prisma:generate`
5. Appliquez les migrations : `npm run prisma:migrate`
6. (Optionnel) Peuplez la base de données avec des données de test : `npm run prisma:seed`
7. Lancez le serveur : `npm run dev`

### 3. Configuration du Frontend
1. Revenez à la racine : `cd ..`
2. Installez les dépendances : `npm install`
3. Lancez l'application : `npm run dev`

## ✨ Fonctionnalités
- **Navigation fluide** : SPA avec transitions animées.
- **Boutique complète** : Affichage par catégories, filtres et recherche.
- **Panier dynamique** : Ajout/suppression d'articles en temps réel.
- **Design Premium** : Interface sombre et dorée pour une expérience luxueuse.
- **Backend robuste** : API REST avec TypeScript et PostgreSQL.

---
Développé avec ❤️ pour Chambre 69.
