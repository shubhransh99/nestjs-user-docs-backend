# NestJS Assignment – User & Document Management API

A production-grade backend system built using **NestJS**, **PostgreSQL**, and **Sequelize**.  
This project demonstrates a scalable and modular architecture with authentication, role-permission RBAC, document management, ingestion workflows, testing, and Docker deployment.

---

## 🚀 Features

- Modular architecture with SOLID principles
- JWT-based authentication
- Role-based access with dynamic permission checks
- Document upload with file type storage
- Ingestion trigger API with job tracking
- Sequelize migrations & seeders
- Centralized logging (Winston), validation, and response interceptor
- Swagger API documentation
- Unit and e2e tests with Jest (≥70% coverage)
- Dockerized setup with Docker Compose support

---

## 🧪 Local Development

### Prerequisites

- Node.js v18+
- PostgreSQL running locally
- npm or yarn

### Setup Instructions

```bash
# 1. Install dependencies
npm install

# 2. Create your environment config
cp .env.example .env

# 3. Run DB migrations
npm run migrate

# 4. Run DB seeders
npm run seed

# 5. Start the app in dev mode
npm run start:dev
```

App will be accessible at [http://localhost:3000](http://localhost:3000)  
Swagger docs at [http://localhost:3000/api/docs](http://localhost:3000/api/docs)

---

## 🐳 Docker & Deployment

### Prerequisites

- Docker
- Docker Compose

---

### 🔧 Docker Standalone (Manual)

```bash
# Build the Docker image
docker build -t nestjs-assignment .

# Run the app (requires .env file)
docker run -p 3000:3000 --env-file .env nestjs-assignment
```

---

### 🚀 Docker Compose (Recommended)

```bash
# Launch PostgreSQL + NestJS app together
docker-compose up --build
```

This will:
- Start a Postgres database
- Build and run the NestJS app
- Run DB migrations and seeders automatically
- Expose the API on [http://localhost:3000](http://localhost:3000)

To stop:

```bash
docker-compose down           # stop only
docker-compose down -v        # stop and remove volumes
```

---

## ⚙️ Environment Variables

Use the provided `.env.example` as a template. Example config:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=nestjs_assignment

JWT_SECRET=your-secret
```

These are injected automatically in Docker via `environment:` block.

---

## 🧪 Testing

```bash
# Run all unit and e2e tests
npm run test

# Run tests with coverage (threshold: ≥70%)
npm run test:cov
```

---

## 📚 Swagger API Docs

After startup, visit:

```
http://localhost:3000/api/docs
```

Includes full documentation for:
- Authentication
- User CRUD
- Role & permission setup
- Document upload
- Ingestion trigger

---

## 🌐 Production Notes

- Uses multi-stage Dockerfile (`node:18-alpine`) for optimal image size
- Runs app in `start:prod` mode with compiled JS from `dist/`
- DB bootstrap (migrations + seeders) happens at container start
- Cloud-ready: can deploy to AWS EC2, ECS, GCP, Azure, or Render with `.env` injection

_You may extend with NGINX reverse proxy and HTTPS in a real deployment._

---

## 🧱 Sequelize CLI Usage

```bash
# Generate new migration
npx sequelize-cli migration:generate --name add_table_name

# Run all migrations
npm run migrate

# Run all seeders
npm run seed
```

---

## 📂 Project Structure

```
src/
  modules/
    auth/
    users/
    documents/
    ingestion/
  entities/           <-- Sequelize models
  database/           <-- migrations, seeders
  config/             <-- config files
  shared/             <-- shared utils (e.g., env.ts, swagger.ts)
  common/             <-- global filters, guards, pipes
```

---

## 📄 License

MIT License © 2025
