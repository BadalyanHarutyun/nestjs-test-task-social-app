# Social App – NestJS REST API

A RESTful API for a social application built with NestJS and PostgreSQL, containerized with Docker.

## Tech Stack

- **Framework:** NestJS
- **Database:** PostgreSQL
- **DB Driver:** pg (node-postgres)
- **Architecture:** Repository Pattern (data access layer) + standard NestJS structure

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/)
- Ports **3000** (app) and **5434** (PostgreSQL) must be free.  
  (Change in `docker-compose.yml` and `.env.docker` if needed.)

## Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/BadalyanHarutyun/nestjs-test-task-social-app
   cd nestjs-test-task-social-app
   ```

2. **Run with Docker Compose**
   ```bash
   docker-compose up --build
   ```

   This starts:
   - PostgreSQL on port `5434` (host) → `5432` (container)
   - NestJS app on port `3000`

   The database schema and seed data from `initial.sql` are automatically applied on first run.

3. **Access the API**
   - Base URL: `http://localhost:3000`
   - Swagger documentation: `http://localhost:3000/api-docs`

4. **Stop the containers**  
   Press `Ctrl+C` or run:
   ```bash
   docker-compose down
   ```
   To delete all data (volume), add `-v`.

## Git Hooks (Husky)

This project uses [Husky](https://typicode.github.io/husky) to enforce code quality on every commit.

**Pre-commit hook runs:**
```bash
npm run lint && npm run build && npm run test
```

Husky is set up automatically after installing dependencies:
```bash
npm install
```

> Commits will be blocked if linting, build, or any test fails.

## Notes

- The `initial.sql` script is executed automatically when the PostgreSQL container initialises.
- No additional setup is required – just `docker-compose up --build`.