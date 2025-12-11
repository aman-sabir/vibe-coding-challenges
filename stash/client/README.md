# Stash Client

React-based frontend for intelligent link aggregation and AI-powered article summarization.

## Architecture

```
client/
├── public/          # Static assets
├── src/
│   ├── pages/
│   │   ├── Login.jsx      # Google Sign-In page
│   │   └── Dashboard.jsx  # Main link management
│   ├── styles/
│   │   └── index.css      # Global styles
│   ├── App.jsx            # Main app component
│   └── main.jsx           # Entry point
└── vite.config.js         # Vite configuration
```

## Technology Choices

### React
- **Why**: Industry-standard UI library
- **Benefits**:
  - Component reusability
  - Efficient Virtual DOM
  - Rich ecosystem
  - Hooks for state management

### Vite
- **Why**: Next-generation build tool
- **Benefits**:
  - Instant HMR (Hot Module Replacement)
  - Fast cold starts
  - Optimized builds
  - Native ES modules

### Material Design
- **Why**: Google's design system
- **Benefits**:
  - Professional appearance
  - Consistent UI patterns
  - Accessible components
  - Modern aesthetics

## Component Structure

### App.jsx
Root component managing:
- Authentication state
- Routing (Login vs Dashboard)
- User session fetching
- Protected routes

### Login.jsx
Simple authentication page with:
- "Sign in with Google" button
- Centered card layout
- Redirect to OAuth flow

### Dashboard.jsx
Main application interface featuring:
- URL input form
- Link grid display
- Loading states during AI processing
- Delete functionality
- Sign out button

## State Management

Uses React hooks for local state:

```javascript
// User authentication
const [user, setUser] = useState(null);

// Links collection
const [links, setLinks] = useState([]);

// URL input
const [url, setUrl] = useState('');

// Loading indicator
const [loading, setLoading] = useState(false);
```

## Link Processing Flow

1. User pastes URL and submits
2. Frontend shows loading spinner
3. POST request to `/api/links`
4. Backend scrapes + AI summarizes (takes 2-5 seconds)
5. Response returns with summary and tags
6. New link card appears in grid
7. Loading state cleared

## Styling

Material Design inspired CSS with:

### Color Palette
```css
--primary: #1a73e8;      /* Google Blue */
--bg-light: #f8f9fa;     /* Light gray background */
--text-primary: #202124; /* Dark gray text */
--text-secondary: #5f6368; /* Medium gray */
```

### Key Components
- **Cards**: Elevated with subtle shadows
- **Buttons**: Rounded with hover effects
- **Grid**: Responsive auto-fill layout
- **Tags**: Pill-shaped with blue background

### Layout
```css
.link-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}
```

## API Integration

Configured with Vite proxy:

```javascript
// vite.config.js
server: {
  proxy: {
    '/auth': 'http://localhost:3000',
    '/api': 'http://localhost:3000'
  }
}
```

Allows clean API calls:
```javascript
axios.post('/api/links', { url })
axios.get('/api/links')
axios.delete(`/api/links/${id}`)
```

## Features

### Link Management
- **Add**: Paste URL, automatic scraping and summarization
- **View**: Grid of cards with title, summary, and tags
- **Delete**: Remove links with trash icon
- **Loading**: Visual feedback during AI processing

### UI/UX
- **Responsive Grid**: Adapts to screen size
- **Loading States**: Spinner during processing
- **Error Handling**: Alert on failure
- **Empty State**: Message when no links saved

## User Flow

1. **Login**: Click "Sign in with Google"
2. **Dashboard**: See saved links or empty state
3. **Add Link**: Paste URL and submit
4. **Processing**: See loading indicator (2-5 seconds)
5. **View**: New card appears with summary and tags
6. **Delete**: Click trash icon to remove
7. **Logout**: Sign out button in header

## Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start dev server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Performance

- Vite's optimized bundling
- Code splitting for faster loads
- Lazy loading (can be added)
- Minimal dependencies

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Accessibility

- Semantic HTML
- ARIA labels
- Keyboard navigation
- Focus indicators
- Color contrast compliance
