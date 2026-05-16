# Team Task Manager

A production-ready, full-stack Team Task Manager web application built with the MERN stack and TypeScript. The application features a premium SaaS-quality UI, role-based access control, and dynamic analytics dashboards.

## Features

- **Authentication & Authorization**: Secure JWT-based auth with bcrypt password hashing. Two roles: Admin and Member.
- **Projects**: Admins can create projects and assign members. Members can only view projects they belong to.
- **Tasks**: Kanban-style task boards. Tasks have priorities, statuses, due dates, and assignees.
- **Dashboard**: Real-time analytics and statistics powered by Recharts.
- **Premium UI**: Built with Tailwind CSS and Radix UI primitives, featuring dark/light mode support (defaulting to dark-friendly styles), fully responsive design, and smooth interactions.

## Tech Stack

### Frontend
- React (Vite)
- TypeScript
- Tailwind CSS & shadcn/ui (custom tailored)
- React Router DOM
- Axios
- Recharts
- Lucide React

### Backend
- Node.js & Express
- TypeScript
- MongoDB Atlas & Mongoose
- JWT (JSON Web Tokens)
- bcrypt

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB connection string (local or Atlas)

### Local Setup

1. **Clone the repository** (if not already local).
2. **Install all dependencies**:
   From the root directory, run:
   ```bash
   npm run install:all
   ```
3. **Environment Variables**:
   In the `server/` directory, copy `.env.example` to `.env` and fill in your details:
   ```env
   MONGO_URI=mongodb+srv://<your-cluster>.mongodb.net/taskmanager
   JWT_SECRET=your_super_secret_key
   JWT_EXPIRE=30d
   PORT=5000
   CLIENT_URL=http://localhost:5173
   ```
4. **Seed the Database** (Optional):
   To populate test data, run:
   ```bash
   cd server
   npm run seed
   ```
   **Seed Users**:
   - Admin: `admin@test.com` / `password123`
   - Member: `member@test.com` / `password123`

5. **Run the Application**:
   From the root directory, start both frontend and backend concurrently:
   ```bash
   npm run dev
   ```
   - Frontend will run on `http://localhost:5173`
   - Backend API will run on `http://localhost:5000`

## Deployment to Railway

This repository is configured as a monorepo for seamless deployment on Railway using Nixpacks.

1. Create a new project on Railway.
2. Link your GitHub repository.
3. Add the necessary Environment Variables in the Railway Dashboard:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `CLIENT_URL` (your final frontend domain or leave open)
   - `NODE_ENV=production`
4. Railway will automatically detect the `railway.json` file, build both the frontend and backend, and start the application using the scripts defined in the root `package.json`.
