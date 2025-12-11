# Stash

An intelligent link aggregation tool with AI-powered summarization and automatic tagging.

## Overview

Stash (formerly Link-Summerizer) is a full-stack web application that helps you save and organize web articles. Simply paste a URL, and Stash automatically scrapes the content, generates an AI summary, and creates relevant tags using Google's Gemini AI.

## Features

- 🔗 **Smart Link Saving**: Paste any URL to save articles
- 🤖 **AI Summarization**: Automatic summaries using Gemini 2.5 Pro
- 🏷️ **Auto-Tagging**: Intelligent tag generation
- 📖 **Content Scraping**: Extracts article text automatically
- 🎨 **Beautiful UI**: Material Design inspired interface
- 🔐 **Google Auth**: Secure login with your Google account

## Tech Stack

### Frontend
- **React** - UI component library
- **Vite** - Fast build tool
- **React Router** - Client-side routing
- **Axios** - HTTP client

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **PostgreSQL** - Database
- **Passport.js** - Google OAuth
- **Google Vertex AI** - AI summarization (Gemini 2.5 Pro)
- **Cheerio** - Web scraping
- **Axios** - HTTP requests for scraping

## Project Structure

```
stash/
├── client/          # React frontend
├── server/          # Express backend
└── README.md        # This file
```

## Prerequisites

- Node.js (v16+)
- PostgreSQL (v12+)
- Google Cloud Project with:
  - Vertex AI API enabled
  - OAuth 2.0 credentials
  - Application Default Credentials

## Quick Start

### 1. Database Setup

```bash
cd server
node init-db.js
```

### 2. Configure Backend

Create `server/.env`:

```env
PORT=3000
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=link_summerizer
DB_HOST=127.0.0.1
DB_PORT=5432
COOKIE_KEY=your_secret_key
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_CLOUD_PROJECT=your_project_id
```

### 3. Google Cloud Setup

```bash
# Authenticate for Vertex AI
gcloud auth application-default login

# Enable Vertex AI API
gcloud services enable aiplatform.googleapis.com
```

### 4. Start Backend

```bash
cd server
npm install
npm start
```

Runs on `http://localhost:3000`

### 5. Start Frontend

```bash
cd client
npm install
npm run dev
```

Runs on `http://localhost:5173`

## How It Works

1. **User pastes URL** into the input field
2. **Backend scrapes** the webpage using Cheerio
3. **AI processes** the content with Gemini 2.5 Pro
4. **Summary and tags** are generated
5. **Data is saved** to PostgreSQL
6. **Frontend displays** the link card with summary and tags

## Database Schema

### users
- `id` - Auto-incrementing primary key
- `google_id` - Unique Google identifier
- `email` - User email
- `name` - Display name
- `avatar` - Profile picture URL
- `created_at` - Account creation timestamp

### links
- `id` - Auto-incrementing primary key
- `user_id` - Foreign key to users
- `url` - Original link URL
- `title` - Scraped page title
- `summary` - AI-generated summary
- `tags` - Array of relevant tags
- `created_at` - Link save timestamp

## API Endpoints

### Authentication
- `GET /auth/google` - Start OAuth flow
- `GET /auth/google/callback` - OAuth callback
- `GET /auth/logout` - End session
- `GET /auth/current_user` - Get user info

### Links
- `GET /api/links` - List user's links
- `POST /api/links` - Add new link (scrapes + summarizes)
- `DELETE /api/links/:id` - Delete link

## AI Configuration

The application uses Google's Gemini 2.5 Pro with:
- **Temperature**: 0.2 (more deterministic)
- **Max Tokens**: 2048
- **Top-p**: 0.8
- **Top-k**: 40

Prompts are structured to return JSON:
```json
{
  "summary": "Concise article summary...",
  "tags": ["tag1", "tag2", "tag3"]
}
```

## Development

See detailed documentation:
- [Server README](./server/README.md)
- [Client README](./client/README.md)

## Google Cloud Requirements

1. Create project in [Google Cloud Console](https://console.cloud.google.com)
2. Enable Vertex AI API
3. Create OAuth 2.0 credentials
4. Add redirect URI: `http://localhost:3000/auth/google/callback`
5. Set up Application Default Credentials

## License

MIT
