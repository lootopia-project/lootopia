# backend - adonis.js

- [backend - adonis.js](#backend---adonisjs)
  - [Useful commands for the backend :](#useful-commands-for-the-backend-)
  - [Backend directory structure](#backend-directory-structure)
    - [app](#app)
    - [config](#config)
    - [database](#database)
    - [resources](#resources)
    - [start](#start)
  - [Backend skeleton](#backend-skeleton)


## Useful commands for the backend :

Before running the commands lunch the database with `docker-compose up -d` at the root of the project.

- `npm run dev` : to start the backend server
- `node ace migration:run` : to run the migrations
- `node ace migration:reset` : to reset the migrations
- `node ace migration:refresh --seed` : to refresh the migrations and seed the database
- `nplint` : to lint the code

## Backend directory structure

The backend is built using the Adonis.js framework. The backend is responsible for handling the API requests and interacting with the database.

The backend is structured as follows:

### app

This directory contains the main codebase of the backend. The app directory is further divided into the following directories:

- **Controllers**: This directory contains the controllers for the backend. The controllers are responsible for handling the API requests and interacting with the services.
- **Middleware**: This directory contains the middleware for the backend. The middleware is responsible for intercepting the API requests and performing actions before the request reaches the controller.
- **Models**: This directory contains the models for the backend. The models are responsible for interacting with the database.

### config

This directory contains the configuration files for the backend.

### database

This directory contains the database migrations and seeds for the backend.

### resources

This directory contains the views for the backend. Since the backend is an API, just templates are used for mailers.

### start

The start directory is further divided into the following files:

- **kernel.ts**: This file contains all the middleware that should be executed for each request.
- **routes.ts**: This file contains the routes for the backend.
- **env.ts**: This file contains the environment variables for the backend.

## Backend skeleton

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
