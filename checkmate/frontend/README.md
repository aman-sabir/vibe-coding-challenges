# Checkmate Frontend

React-based single-page application for task management.

## Architecture

```
frontend/
├── public/          # Static assets
├── src/
│   ├── pages/       # Route components
│   │   ├── Login.jsx
│   │   └── Home.jsx
│   ├── App.jsx      # Main app component
│   ├── main.jsx     # Entry point
│   └── index.css    # Global styles
└── vite.config.js   # Vite configuration
```

## Technology Choices

### React
- **Why**: Popular, well-supported UI library
- **Benefits**:
  - Component-based architecture
  - Efficient rendering with Virtual DOM
  - Large ecosystem of tools and libraries
  - Hooks for clean state management

### Vite
- **Why**: Modern build tool optimized for speed
- **Benefits**:
  - Instant server start
  - Lightning-fast HMR (Hot Module Replacement)
  - Optimized production builds
  - Native ES modules support

### React Router
- **Why**: Standard routing solution for React
- **Benefits**:
  - Declarative routing
  - Browser history management
  - Protected routes
  - Simple navigation API

### Axios
- **Why**: Feature-rich HTTP client
- **Benefits**:
  - Automatic JSON transformation
  - Request/response interceptors
  - Better error handling than fetch
  - Consistent API

## Component Structure

### App.jsx
Main application component that:
- Manages authentication state
- Handles routing between Login and Home
- Fetches current user on mount
- Redirects unauthenticated users to login

### Login.jsx
Authentication page featuring:
- "Sign in with Google" button
- Clean, centered layout
- Redirects to backend OAuth endpoint

### Home.jsx
Todo management interface with:
- Input form for new tasks
- Task list with checkboxes
- Delete buttons for each task
- Real-time updates

## State Management

Uses React's built-in state management:

```javascript
// User authentication state
const [user, setUser] = useState(null);

// Todo list state
const [todos, setTodos] = useState([]);

// Input field state
const [newTodo, setNewTodo] = useState('');
```

## API Integration

All API calls use Axios with proxy configuration:

```javascript
// vite.config.js
server: {
  proxy: {
    '/auth': 'http://localhost:3000',
    '/todos': 'http://localhost:3000'
  }
}
```

This allows clean relative URLs:
```javascript
axios.get('/todos')
axios.post('/todos', { text: 'New task' })
```

## Styling

The application uses vanilla CSS with:
- CSS variables for theming
- Flexbox for layouts
- Mobile-first responsive design
- Smooth transitions

### Key CSS Classes
- `.container` - Main content wrapper
- `.card` - Card component for login/content
- `.todo-item` - Individual task styling
- `.btn` - Button styles
- `.input` - Input field styles

## User Flow

1. **Unauthenticated User**:
   - Lands on Login page
   - Clicks "Sign in with Google"
   - Redirected to Google OAuth
   - Returns to app with session
   - Redirected to Home page

2. **Authenticated User**:
   - Lands on Home page
   - Sees list of todos
   - Can add new todos
   - Can toggle completion
   - Can delete todos
   - Can sign out

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

## Environment

The frontend expects the backend to run on `http://localhost:3000`. This is configured in `vite.config.js` and can be changed if needed.

## Features

### Task Management
- **Add**: Type task and press Enter or click Add
- **Complete**: Click checkbox to toggle completion
- **Delete**: Click trash icon to remove task
- **Persist**: All changes saved to database immediately

### Authentication
- **Google Sign-In**: Secure OAuth 2.0 flow
- **Session Management**: Automatic session handling
- **Sign Out**: Clear session and return to login

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Performance

- Vite's optimized build process
- Code splitting for faster loads
- Minimal bundle size
- Fast HMR during development
