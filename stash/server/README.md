# Stash Server

Express.js backend providing Google OAuth, web scraping, and AI-powered link summarization.

## Architecture

```
server/
├── routes/
│   ├── auth.js      # Google OAuth authentication
│   └── links.js     # Link CRUD + AI processing
├── services/
│   ├── ai.js        # Vertex AI integration
│   └── scraper.js   # Web content extraction
├── server.js        # Main application
├── db.js            # PostgreSQL connection
├── schema.sql       # Database schema
└── init-db.js       # Database initialization
```

## Technology Choices

### Express.js
- **Why**: Minimal, flexible web framework
- **Benefits**: Fast development, extensive middleware, simple routing

### PostgreSQL
- **Why**: Robust relational database
- **Benefits**: 
  - ACID compliance
  - Array support for tags
  - Excellent JSON capabilities
  - Strong data integrity

### Google Vertex AI (Gemini 2.5 Pro)
- **Why**: State-of-the-art language model
- **Benefits**:
  - High-quality summaries
  - Structured JSON output
  - Scalable infrastructure
  - Pay-per-use pricing

### Cheerio
- **Why**: Fast, jQuery-like web scraping
- **Benefits**:
  - Lightweight (no browser needed)
  - Familiar syntax
  - Perfect for extracting article content
  - Fast parsing

### Axios
- **Why**: Promise-based HTTP client
- **Benefits**:
  - Used for both API calls and web scraping
  - Automatic error handling
  - Request/response interceptors

## Web Scraping

The scraper extracts:
1. **Page title** from `<title>` tag
2. **Main content** from all `<p>` tags
3. Combines into structured text for AI processing

```javascript
async function scrapeContent(url) {
  const response = await axios.get(url);
  const $ = cheerio.load(response.data);
  
  const title = $('title').text();
  const paragraphs = $('p').map((i, el) => $(el).text()).get();
  const content = paragraphs.join(' ');
  
  return { title, content };
}
```

## AI Summarization

Uses Gemini 2.5 Pro with structured prompts:

```javascript
const prompt = `
  Task: Summarize the following article and generate relevant tags.
  
  Article Title: ${title}
  Article Content: ${content}
  
  Output Format (JSON):
  {
    "summary": "Concise summary...",
    "tags": ["tag1", "tag2", "tag3"]
  }
`;
```

### Model Configuration
- **Model**: gemini-2.5-pro
- **Temperature**: 0.2 (deterministic)
- **Max Tokens**: 2048
- **Top-p**: 0.8
- **Top-k**: 40

## API Documentation

### POST /api/links
Add new link with automatic processing.

**Request**:
```json
{
  "url": "https://example.com/article"
}
```

**Process**:
1. Scrape webpage content
2. Send to Gemini for summarization
3. Parse JSON response
4. Save to database

**Response**:
```json
{
  "id": 1,
  "user_id": 1,
  "url": "https://example.com/article",
  "title": "Article Title",
  "summary": "AI-generated summary...",
  "tags": ["technology", "ai", "web"],
  "created_at": "2024-01-01T00:00:00.000Z"
}
```

### GET /api/links
List all links for authenticated user.

**Response**: Array of link objects

### DELETE /api/links/:id
Delete specific link.

**Response**:
```json
{
  "success": true
}
```

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

CREATE TABLE links (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    url TEXT NOT NULL,
    title TEXT,
    summary TEXT,
    tags TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `DB_USER` | PostgreSQL user | `postgres` |
| `DB_PASSWORD` | Database password | `password` |
| `DB_NAME` | Database name | `link_summerizer` |
| `DB_HOST` | Database host | `127.0.0.1` |
| `DB_PORT` | Database port | `5432` |
| `COOKIE_KEY` | Session secret | `random_key` |
| `GOOGLE_CLIENT_ID` | OAuth client ID | `xxx.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | OAuth secret | `GOCSPX-xxx` |
| `GOOGLE_CLOUD_PROJECT` | GCP project ID | `my-project-123` |

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure `.env` file

3. Set up Google Cloud credentials:
   ```bash
   gcloud auth application-default login
   ```

4. Initialize database:
   ```bash
   node init-db.js
   ```

5. Start server:
   ```bash
   npm start
   ```

## Error Handling

The AI service includes fallback handling:

```javascript
try {
  const result = await model.generateContent(request);
  // Parse JSON response
} catch (error) {
  console.error('Vertex AI error:', error);
  return {
    summary: "AI Summarization unavailable.",
    tags: ["article"]
  };
}
```

This ensures the application continues working even if AI fails.

## Security

- OAuth-only authentication (no passwords)
- Encrypted session cookies
- CORS configured for frontend origin
- Parameterized SQL queries
- Environment variables for secrets

## Performance Considerations

- Scraping and AI processing happen asynchronously
- Frontend shows loading state during processing
- Database indexes on user_id for fast queries
- Connection pooling for PostgreSQL
