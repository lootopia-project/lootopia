# lootopia

- anthony MATHIEU (antomth971) <anthonymathieu21@live.fr>
- kévin METRI (metrike) <kevinmetri.pro@gmail.com>
- Yassine HAFFOUD (YassineHaffoud) <yassine.haffoud.sio@gmail.com>

# Projet

Le projet est divisé en deux parties :  
- **Frontend** : construit avec **react.js** et **react native**, sous le framework Expo.   
- **Backend** : construit avec **Node.js** et le framework **adonis.js**  

Une base de données **Postgresql** est utilisée, et un fichier **docker-compose.yml** permet de la lancer facilement.

## Structure du projet

```bash
lootopia project/
│
├── frontend/
│   ├── app/
│   ├── assets/
│   ├── components/
│   ├── constants/
│   ├── hooks/
│   ├── package.json
│   ├── README.md
│   └── .gitignore
│
├── backend/
│   ├── app/
│   ├── config/
│   ├── database/
│   ├── start/
│   ├── README.md
│   └── .gitignore
│
├── docs/
│   ├── diagrammes
│   └── etc
│
├── docker-compose.yml
├── README.md
└── .gitignore
```