# My-Diary

A unified productivity suite combining task management (Checkmate) and intelligent link aggregation (Stash) into a single web application.

![My-Diary Logo](./client/public/logo.png)

## Overview

My-Diary is a full-stack web application that helps you stay organized by providing two core features:

- **Checkmate**: A clean, intuitive todo list manager for tracking daily tasks
- **Stash**: An intelligent link aggregator that automatically scrapes, summarizes, and tags web articles using AI

## Features

### Checkmate (Todo Management)
- ✅ Create, complete, and delete tasks
- ✅ Clean Material Design interface
- ✅ Real-time task status updates
- ✅ Persistent storage with PostgreSQL

### Stash (Link Aggregation)
- 🔗 Save links with automatic content scraping
- 🤖 AI-powered summarization using Google's Gemini 2.5 Pro
- 🏷️ Automatic tag generation
- 📖 Expandable cards to read full summaries
- 🎨 Beautiful grid layout with Google-inspired design

### Unified Experience
- 🔐 Single sign-on with Google OAuth
- 🎨 Professional Google Material Design theme
- 📱 Responsive layout
- 🚀 Fast navigation between features

## Tech Stack

### Frontend
- **React** - Component-based UI framework
- **Vite** - Fast build tool and dev server
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Lucide React** - Icon library

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web application framework
- **PostgreSQL** - Relational database
- **Passport.js** - Authentication middleware
- **Google Cloud Vertex AI** - AI summarization
- **Cheerio** - Web scraping

## Project Structure

```
my-diary/
├── client/          # React frontend
├── server/          # Express backend
└── README.md        # This file
```

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- Google Cloud Project with:
  - Vertex AI API enabled
  - OAuth 2.0 credentials configured
  - Application Default Credentials set up

## Quick Start

### 1. Database Setup

```bash
cd server
node init-db.js
```

### 2. Environment Configuration

Create `server/.env`:

```env
PORT=3000
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=my_diary
DB_HOST=127.0.0.1
DB_PORT=5432
COOKIE_KEY=your_secret_key
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_CLOUD_PROJECT=your_project_id
```

### 3. Start Backend

```bash
cd server
npm install
npm start
```

Backend runs on `http://localhost:3000`

### 4. Start Frontend

```bash
cd client
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

## Google Cloud Setup

1. Create a project in [Google Cloud Console](https://console.cloud.google.com)
2. Enable the Vertex AI API
3. Create OAuth 2.0 credentials:
   - Authorized redirect URI: `http://localhost:3000/auth/google/callback`
4. Set up Application Default Credentials:
   ```bash
   gcloud auth application-default login
   ```

## Development

See individual README files for more details:
- [Backend Documentation](./server/README.md)
- [Frontend Documentation](./client/README.md)

## License

MIT
