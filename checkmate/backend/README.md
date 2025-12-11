# Checkmate Backend

Express.js server providing Google OAuth authentication and todo management API.

## Architecture

```
backend/
├── server.js        # Main application entry point
├── db.js            # PostgreSQL connection
├── schema.sql       # Database schema
├── init-db.js       # Database initialization
├── migration.sql    # Google Auth migration
└── run-migration.js # Migration runner
```

## Technology Choices

### Express.js
- **Why**: Minimal, unopinionated web framework
- **Benefits**: Fast development, extensive middleware ecosystem, simple routing

### PostgreSQL
- **Why**: Robust relational database with excellent data integrity
- **Benefits**: ACID compliance, strong typing, reliable transactions

### Passport.js with Google OAuth 2.0
- **Why**: Industry-standard authentication library
- **Benefits**: 
  - Secure authentication without storing passwords
  - Leverages Google's security infrastructure
  - Simple session management
  - Supports multiple strategies

### cookie-session
- **Why**: Lightweight session middleware
- **Benefits**: 
  - Stores session data in cookies (no server-side storage needed)
  - Works well with Passport.js
  - Simple configuration

## Authentication Flow

1. User clicks "Sign in with Google"
2. Frontend redirects to `/auth/google`
3. Server redirects to Google OAuth consent screen
4. User authorizes application
5. Google redirects to `/auth/google/callback`
6. Server creates/retrieves user from database
7. Session established with encrypted cookie
8. User redirected to frontend

## Database Schema

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    google_id VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    avatar TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE todos (
    id VARCHAR(255) PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    text TEXT NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## API Documentation

### Authentication Endpoints

#### GET /auth/google
Initiates Google OAuth flow.

**Response**: Redirect to Google consent screen

#### GET /auth/google/callback
Handles OAuth callback from Google.

**Response**: Redirect to frontend with session cookie

#### GET /auth/logout
Ends user session.

**Response**: Redirect to frontend login page

#### GET /auth/current_user
Returns currently authenticated user.

**Response**:
```json
{
  "id": 1,
  "google_id": "123456789",
  "email": "user@example.com",
  "name": "John Doe",
  "avatar": "https://..."
}
```

### Todo Endpoints

All todo endpoints require authentication.

#### GET /todos
List all todos for current user.

**Response**:
```json
[
  {
    "id": "abc123",
    "user_id": 1,
    "text": "Buy groceries",
    "completed": false,
    "created_at": "2024-01-01T00:00:00.000Z"
  }
]
```

#### POST /todos
Create new todo.

**Request Body**:
```json
{
  "text": "Buy groceries"
}
```

**Response**: Created todo object

#### PATCH /todos/:id
Toggle todo completion status.

**Request Body**:
```json
{
  "completed": true
}
```

**Response**: Updated todo object

#### DELETE /todos/:id
Delete todo.

**Response**:
```json
{
  "success": true
}
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port | Yes |
| `DB_USER` | PostgreSQL username | Yes |
| `DB_PASSWORD` | PostgreSQL password | Yes |
| `DB_NAME` | Database name | Yes |
| `DB_HOST` | Database host | Yes |
| `DB_PORT` | Database port | Yes |
| `COOKIE_KEY` | Session encryption key | Yes |
| `GOOGLE_CLIENT_ID` | OAuth client ID | Yes |
| `GOOGLE_CLIENT_SECRET` | OAuth client secret | Yes |

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env` file with required variables

3. Initialize database:
   ```bash
   node init-db.js
   ```

4. Start server:
   ```bash
   npm start
   ```

## Migration from Username/Password

If migrating from the old username/password system:

```bash
node run-migration.js
```

This adds Google OAuth columns while preserving existing data.

## Security Features

- **No password storage**: Authentication delegated to Google
- **Encrypted sessions**: cookie-session with secret key
- **CORS protection**: Configured for specific frontend origin
- **SQL injection prevention**: Parameterized queries
- **Session-based auth**: Secure cookie with httpOnly flag

## Error Handling

All endpoints include proper error handling:
- `400` - Bad request (missing parameters)
- `401` - Unauthorized (not logged in)
- `404` - Resource not found
- `500` - Internal server error

## Development

The server includes a Passport.js compatibility shim for `cookie-session`:

```javascript
app.use((req, res, next) => {
    if (req.session && !req.session.regenerate) {
        req.session.regenerate = (cb) => { cb(); };
    }
    if (req.session && !req.session.save) {
        req.session.save = (cb) => { cb(); };
    }
    next();
});
```

This ensures compatibility with Passport.js 0.6+.
