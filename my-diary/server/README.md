# My-Diary Backend

Express.js backend server providing authentication, todo management, and AI-powered link summarization.

## Architecture

The backend follows a modular architecture with clear separation of concerns:

```
server/
├── routes/          # API route handlers
│   ├── auth.js      # Google OAuth authentication
│   ├── todos.js     # Todo CRUD operations
│   └── links.js     # Link scraping and AI summarization
├── services/        # Business logic
│   ├── ai.js        # Vertex AI integration
│   └── scraper.js   # Web content extraction
├── db.js            # PostgreSQL connection
├── schema.sql       # Database schema
├── init-db.js       # Database initialization script
└── server.js        # Main application entry point
```

## Technology Choices

### Express.js
- **Why**: Minimal, flexible Node.js web framework
- **Benefits**: 
  - Large ecosystem of middleware
  - Simple routing
  - Easy to integrate with various databases and services

### PostgreSQL
- **Why**: Robust relational database
- **Benefits**:
  - ACID compliance for data integrity
  - Excellent support for complex queries
  - Strong JSON support for flexible data structures

### Passport.js
- **Why**: Proven authentication middleware
- **Benefits**:
  - Supports 500+ authentication strategies
  - Simple integration with Express
  - Session management built-in

### Google Cloud Vertex AI
- **Why**: State-of-the-art AI models
- **Benefits**:
  - Access to Gemini 2.5 Pro for high-quality summaries
  - Scalable infrastructure
  - Pay-per-use pricing

### Cheerio
- **Why**: Fast, flexible web scraping
- **Benefits**:
  - jQuery-like syntax
  - Lightweight (no browser needed)
  - Perfect for extracting article content

## API Endpoints

### Authentication
- `GET /auth/google` - Initiate Google OAuth flow
- `GET /auth/google/callback` - OAuth callback handler
- `GET /auth/logout` - End user session
- `GET /auth/current_user` - Get current user info

### Todos
- `GET /api/todos` - List all todos for current user
- `POST /api/todos` - Create new todo
- `PATCH /api/todos/:id` - Update todo completion status
- `DELETE /api/todos/:id` - Delete todo

### Links
- `GET /api/links` - List all links for current user
- `POST /api/links` - Add new link (triggers scraping + AI summarization)
- `DELETE /api/links/:id` - Delete link

## Database Schema

### users
```sql
id          SERIAL PRIMARY KEY
google_id   VARCHAR(255) UNIQUE NOT NULL
email       VARCHAR(255) NOT NULL
name        VARCHAR(255)
avatar      TEXT
created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```

### todos
```sql
id          VARCHAR(255) PRIMARY KEY
user_id     INTEGER REFERENCES users(id)
text        TEXT NOT NULL
completed   BOOLEAN DEFAULT FALSE
created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```

### links
```sql
id          SERIAL PRIMARY KEY
user_id     INTEGER REFERENCES users(id)
url         TEXT NOT NULL
title       TEXT
summary     TEXT
tags        TEXT[]
created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `DB_USER` | PostgreSQL username | `postgres` |
| `DB_PASSWORD` | PostgreSQL password | `password` |
| `DB_NAME` | Database name | `my_diary` |
| `DB_HOST` | Database host | `127.0.0.1` |
| `DB_PORT` | Database port | `5432` |
| `COOKIE_KEY` | Session encryption key | `random_secret_key` |
| `GOOGLE_CLIENT_ID` | OAuth client ID | `xxx.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | OAuth client secret | `GOCSPX-xxx` |
| `GOOGLE_CLOUD_PROJECT` | GCP project ID | `my-project-123` |

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables in `.env`

3. Initialize database:
   ```bash
   node init-db.js
   ```

4. Start server:
   ```bash
   npm start
   ```

## Development

The server uses `dotenv` for environment configuration and includes automatic session management with Passport.js.

### Adding New Routes

1. Create route file in `routes/`
2. Import and mount in `server.js`
3. Use `requireLogin` middleware for protected routes

### AI Summarization

The AI service uses Google's Gemini 2.5 Pro model with the following configuration:
- Temperature: 0.2 (more deterministic)
- Max tokens: 2048
- Top-p: 0.8
- Top-k: 40

Prompts are structured to return JSON with `summary` and `tags` fields.

## Error Handling

All routes include try-catch blocks with appropriate HTTP status codes:
- `400` - Bad request (missing parameters)
- `401` - Unauthorized (not logged in)
- `404` - Not found
- `500` - Server error

## Security

- Passwords are never stored (OAuth only)
- Sessions are encrypted with `cookie-session`
- CORS configured for frontend origin
- SQL injection prevented with parameterized queries
