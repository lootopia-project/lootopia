# frontend - Expo (React Native)

- [frontend - Expo (React Native)](#frontend---expo-react-native)
  - [Commandes](#commandes)
  - [Structure](#structure)
    - [app](#app)
    - [assets](#assets)
    - [components](#components)
    - [constants](#constants)
    - [hooks](#hooks)
  - [Fichiers supplémentaires](#fichiers-supplémentaires)
- [Squelette](#squelette)

## Commandes

- `npm start` : to start the frontend server (Expo)
- `npm run lint` : to lint the code

## Structure

### app
Le répertoire **app** contient le cœur de l'application Expo. C’est ici que vous pouvez configurer la navigation (par exemple avec React Navigation) et structurer les différentes **screens**.

### assets
Le répertoire **assets** regroupe toutes les ressources statiques nécessaires à l'application, comme les images, les icônes ou encore les polices.

### components
Le répertoire **components** contient tous les composants réutilisables de l’interface utilisateur. Ces composants sont de petites briques d’UI (boutons, champs de formulaire, cartes, etc.) qui peuvent être importées dans les différentes **screens**.

### constants
Le répertoire **constants** stocke les constantes de l’application (par exemple, les couleurs, les tailles de police ou encore les variables d’API). Son objectif est de centraliser les valeurs statiques et d’éviter de les réécrire à plusieurs endroits du code.

### hooks
Le répertoire **hooks** contient des **Hooks personnalisés** utilisés dans l’application. Il s’agit de fonctions TypeScript qui encapsulent une logique réutilisable relative à React (par exemple, un Hook pour la gestion de l’authentification ou un Hook pour les appels API).

## Fichiers supplémentaires

- **package.json** : Fichier de configuration des dépendances et scripts NPM/Yarn.
- **README.md** : Documentation principale du projet. Généralement, il contient les instructions d’installation et d’exécution.
- **.gitignore** : Fichier qui spécifie les dossiers et fichiers à ignorer dans le contrôle de version Git.

---

# Squelette

Le frontend de notre application est construit avec **Expo**, et se présente sous la forme suivante :

```
frontend/
├── app/
│   ├── (tabs)/
│   ├── _layouts
│   └── +not-found
├── assets/
│   ├── fonts/
│   └── images/
├── components/
├── constants/
├── hooks/
│   ├── providers/
│   └── etc
├── services/
│   ├── AuthService.ts
│   └── etc
├── .eslintrc.js
├── package.json
├── README.md
└── .gitignore
```