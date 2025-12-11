# Checkmate

A clean, minimalist todo list application with Google OAuth authentication.

## Overview

Checkmate is a full-stack task management application that helps you stay organized with a simple, intuitive interface. Built with React and Express, it features Google Sign-In for secure authentication and PostgreSQL for reliable data persistence.

## Features

- ✅ **Simple Task Management**: Create, complete, and delete tasks effortlessly
- 🔐 **Google Authentication**: Secure login with your Google account
- 💾 **Persistent Storage**: All tasks saved to PostgreSQL database
- 🎨 **Clean UI**: Minimalist design focused on productivity
- ⚡ **Real-time Updates**: Instant task status changes

## Tech Stack

### Frontend
- **React** - UI component library
- **Vite** - Fast build tool and dev server
- **React Router** - Client-side routing
- **Axios** - HTTP requests

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **PostgreSQL** - Database
- **Passport.js** - Google OAuth authentication
- **cookie-session** - Session management

## Project Structure

```
checkmate/
├── frontend/        # React application
├── backend/         # Express server
└── README.md        # This file
```

## Prerequisites

- Node.js (v16+)
- PostgreSQL (v12+)
- Google Cloud Project with OAuth credentials

## Quick Start

### 1. Database Setup

```bash
cd backend
node init-db.js
```

### 2. Configure Backend

Create `backend/.env`:

```env
PORT=3000
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=checkmate
DB_HOST=127.0.0.1
DB_PORT=5432
COOKIE_KEY=your_secret_key
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
```

### 3. Start Backend

```bash
cd backend
npm install
npm start
```

Runs on `http://localhost:3000`

### 4. Start Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs on `http://localhost:5173`

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create OAuth 2.0 credentials
3. Add authorized redirect URI: `http://localhost:3000/auth/google/callback`
4. Copy Client ID and Client Secret to `.env`

## Database Schema

### users
- `id` - Auto-incrementing primary key
- `google_id` - Unique Google account identifier
- `email` - User email address
- `name` - Display name
- `avatar` - Profile picture URL
- `created_at` - Account creation timestamp

### todos
- `id` - Unique task identifier
- `user_id` - Foreign key to users table
- `text` - Task description
- `completed` - Boolean completion status
- `created_at` - Task creation timestamp

## API Endpoints

### Authentication
- `GET /auth/google` - Start Google OAuth flow
- `GET /auth/google/callback` - OAuth callback
- `GET /auth/logout` - End session
- `GET /auth/current_user` - Get logged-in user

### Todos
- `GET /todos` - List user's todos
- `POST /todos` - Create new todo
- `PATCH /todos/:id` - Toggle completion
- `DELETE /todos/:id` - Delete todo

## Development

See detailed documentation:
- [Backend README](./backend/README.md)
- [Frontend README](./frontend/README.md)

## License

MIT
