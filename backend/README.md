# Backend - Adonis.js

- [Backend - Adonis.js](#backend---adonisjs)
  - [Commandes utiles pour le backend :](#commandes-utiles-pour-le-backend-)
  - [Structure du répertoire backend](#structure-du-répertoire-backend)
    - [app](#app)
    - [config](#config)
    - [database](#database)
    - [resources](#resources)
    - [start](#start)
  - [Structure du backend](#structure-du-backend)

## Commandes utiles pour le backend :

Avant d'exécuter les commandes, démarrez la base de données avec `docker-compose up -d` à la racine du projet.

- `npm run dev` : pour démarrer le serveur backend.
- `node ace migration:run` : pour exécuter les migrations.
- `node ace migration:reset` : pour réinitialiser les migrations.
- `node ace migration:refresh --seed` : pour rafraîchir les migrations et peupler la base de données.
- `nplint` : pour vérifier et corriger les erreurs de linting dans le code.

## Structure du répertoire backend

Le backend est construit avec le framework Adonis.js. Il est chargé de gérer les requêtes API et d'interagir avec la base de données.

Le backend est structuré comme suit :

### app

Ce répertoire contient le cœur du code backend. Il est subdivisé comme suit :

- **Controllers** : contient les contrôleurs du backend. Ils sont responsables de gérer les requêtes API et d'interagir avec les services.
- **Middleware** : contient les middlewares du backend. Les middlewares interceptent les requêtes API et effectuent des actions avant qu'elles n'atteignent le contrôleur.
- **Models** : contient les modèles du backend. Les modèles interagissent directement avec la base de données.

### config

Ce répertoire contient les fichiers de configuration pour le backend.

### database

Ce répertoire contient les migrations et les seeds pour la base de données du backend.

### resources

Ce répertoire contient les vues pour le backend. Étant donné que le backend est une API, seules des templates pour les mailers y sont incluses.

### start

Le répertoire `start` est divisé en plusieurs fichiers :

- **kernel.ts** : contient tous les middlewares à exécuter pour chaque requête.
- **routes.ts** : contient les routes définies pour le backend.
- **env.ts** : contient les variables d'environnement utilisées par le backend.

## Structure du backend

```
backend/
├── app/
│   ├── Controllers/
│   ├── Models/
│   ├── Middleware/
│
├── config/
│   ├── app.ts
│   ├── auth.ts
│   ├── database.ts
│   └── etc
│
├── database/
│   ├── migrations/
│   └── seeders/
│
├── resources/
│   ├── views/
│
├── start/
│   ├── routes.ts
│   └── kernel.ts
│
├── .env
├── ace
├── tsconfig.json
└── etc

```
