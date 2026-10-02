# CareerNest — Employers & Job Seeker Platform

CareerNest is a full-stack job portal built from the supplied project brief.

## Stack

- Backend: Spring Boot 3, Java 17, Spring Web, Spring Data MongoDB, Spring Security, JWT
- Frontend: React + TypeScript + Vite, Redux Toolkit, Tailwind CSS
- Database: MongoDB
- SMS: Twilio (optional; app works without credentials in local/demo mode)
- Deployment: Render/Railway/AWS EC2 for backend, Vercel/Netlify for frontend

## Features

### Authentication
- Register as `JOB_SEEKER` or `EMPLOYER`
- JWT login
- Password hashing with BCrypt
- Protected API routes
- Role-based access control

### Employer
- Create, edit and delete job postings
- View own job postings
- Review applications for owned jobs
- Update application status
- SMS notification hooks

### Job Seeker
- Browse all jobs
- Search by keyword
- Filter by location
- View full job details
- Apply to a job
- View own applications
- Prevent duplicate applications

### Notifications
Twilio SMS is supported through environment variables. If Twilio is not configured, notifications are logged instead of failing the core application.

## Run locally

### 1. Start MongoDB

Using Docker:

```bash
docker compose up -d mongodb
```

Or use a local MongoDB installation.

### 2. Backend

```bash
cd backend
./mvnw spring-boot:run
```

Windows:

```powershell
mvnw.cmd spring-boot:run
```

API runs at `http://localhost:8080`.

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`.

Create `frontend/.env` from `.env.example` if the API is not on localhost.

## Environment variables

### Backend

```env
MONGODB_URI=mongodb://localhost:27017/careernest
JWT_SECRET=change-this-to-a-long-random-secret-at-least-32-characters
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=
```

### Frontend

```env
VITE_API_URL=http://localhost:8080/api
```

## Demo accounts

The backend can seed sample jobs automatically when `APP_SEED_DATA=true`.

For real accounts, register through the UI.

## API overview

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`

### Jobs
- `GET /api/jobs`
- `GET /api/jobs/{id}`
- `POST /api/jobs` — EMPLOYER
- `PUT /api/jobs/{id}` — owner EMPLOYER
- `DELETE /api/jobs/{id}` — owner EMPLOYER

### Applications
- `POST /api/applications/jobs/{jobId}` — JOB_SEEKER
- `GET /api/applications/me` — JOB_SEEKER
- `GET /api/applications/employer` — EMPLOYER
- `PATCH /api/applications/{id}/status` — EMPLOYER

## Deployment

### Backend on Render / Railway

Build command:

```bash
./mvnw clean package -DskipTests
```

Start command:

```bash
java -jar target/careernest-backend-1.0.0.jar
```

Set the environment variables listed above. For MongoDB, use MongoDB Atlas and set `MONGODB_URI`.

### Frontend on Vercel / Netlify

```bash
npm run build
```

Publish directory:

```text
dist
```

Set:

```env
VITE_API_URL=https://YOUR-BACKEND-DOMAIN/api
```

### AWS EC2

Install Java 17 and run the packaged JAR behind Nginx. Use MongoDB Atlas rather than hosting MongoDB directly on the same EC2 instance for a simple deployment.

## Project structure

```text
CareerNest/
├── backend/
│   ├── pom.xml
│   └── src/main/java/com/careernest/...
├── frontend/
│   ├── package.json
│   ├── vite.config.ts
│   └── src/...
├── docker-compose.yml
└── README.md
```
