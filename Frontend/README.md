Installation du projet
1. Cloner le repository
git clone <url-du-repo>

Puis :

cd nom-du-projet
Installation du Frontend (Next.js)
Aller dans le dossier frontend
cd frontend
Installer les dépendances
npm install
Lancer le serveur de développement
npm run dev

Le frontend sera disponible sur :

http://localhost:3000

ou

http://localhost:5173

(selon votre configuration)

Technologies Frontend
React
Next.js
TypeScript
Tailwind CSS
Axios
Installation du Backend
Aller dans le dossier backend
cd backend
Installer les dépendances
npm install
Configuration des variables d’environnement


Prisma
Générer Prisma Client
npx prisma generate
Lancer les migrations
npx prisma migrate dev
Démarrer le backend
npm run dev

Backend disponible sur :

http://localhost:8000
Documentation Swagger

Disponible sur :

http://localhost:8000/api-docs
Fonctionnalités
Authentification JWT
Création de projets
Gestion des contributeurs
Gestion des tâches
Dashboard
Permissions utilisateurs
API REST sécurisée
Documentation Swagger
Scripts utiles
Frontend
npm run dev
npm run build
npm run start
Backend
npm run dev
npm run build
npm run start