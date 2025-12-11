# My-Diary Frontend

React-based single-page application providing a unified interface for task management and link aggregation.

## Architecture

The frontend follows a component-based architecture with React Router for navigation:

```
client/
├── public/          # Static assets
│   └── logo.png     # Application logo
├── src/
│   ├── components/  # Reusable UI components
│   │   └── Navbar.jsx
│   ├── pages/       # Route-level components
│   │   ├── Login.jsx
│   │   ├── Checkmate.jsx
│   │   └── Stash.jsx
│   ├── styles/      # CSS stylesheets
│   │   └── index.css
│   ├── App.jsx      # Main application component
│   └── main.jsx     # Application entry point
└── vite.config.js   # Vite configuration
```

## Technology Choices

### React
- **Why**: Industry-standard UI library
- **Benefits**:
  - Component reusability
  - Virtual DOM for performance
  - Large ecosystem and community
  - Hooks for state management

### Vite
- **Why**: Next-generation frontend build tool
- **Benefits**:
  - Lightning-fast hot module replacement (HMR)
  - Optimized production builds
  - Native ES modules support
  - Minimal configuration

### React Router
- **Why**: De facto routing library for React
- **Benefits**:
  - Declarative routing
  - Nested routes support
  - Browser history management
  - Simple navigation API

### Axios
- **Why**: Promise-based HTTP client
- **Benefits**:
  - Automatic JSON transformation
  - Request/response interceptors
  - Better error handling than fetch
  - Consistent API across browsers

### Lucide React
- **Why**: Modern icon library
- **Benefits**:
  - Tree-shakeable (only imports used icons)
  - Consistent design language
  - Customizable size and color
  - React-optimized components

## Design System

The application uses a **Google Material Design** inspired theme:

### Color Palette
```css
--blue: #4285F4      /* Google Blue - Primary actions */
--red: #EA4335       /* Google Red - Accents */
--yellow: #FBBC05    /* Google Yellow - Accents */
--green: #34A853     /* Google Green - Accents */
```

### Typography
- Font: Google Sans, Roboto, Arial
- Headings: 400 weight (light)
- Body: 500 weight (medium)

### Components
- **Pill-shaped buttons** for primary actions
- **Rounded cards** with subtle shadows
- **Smooth transitions** on hover/focus
- **Responsive grid layouts**

## Key Features

### Authentication Flow
1. User lands on Login page
2. Clicks "Sign in with Google"
3. Redirected to Google OAuth
4. Returns to app with session cookie
5. App fetches user info from `/auth/current_user`
6. Redirects to Checkmate by default

### Checkmate (Todo List)
- Real-time task creation
- Checkbox toggle for completion
- Strike-through styling for completed tasks
- Delete with trash icon
- Persistent storage via backend API

### Stash (Link Aggregation)
- URL input with validation
- Loading state during AI processing
- Grid layout for link cards
- **Expandable summaries** with "Read More" button
- Tag display with wrapping
- External link icon for opening articles

## Component Details

### App.jsx
Main application component that:
- Manages authentication state
- Handles routing
- Shows loading state during auth check
- Renders Navbar for authenticated users

### Navbar.jsx
Navigation component featuring:
- Multi-colored "My-Diary" logo text
- Active tab highlighting
- User name display
- Logout button

### Checkmate.jsx
Todo management page with:
- Input form for new tasks
- Task list with checkboxes
- Delete buttons
- Empty state message

### Stash.jsx
Link aggregation page with:
- URL input form
- Grid of link cards
- Expandable/collapsible summaries
- Tag display
- Loading indicators

## State Management

The application uses React's built-in state management:
- `useState` for component-level state
- `useEffect` for data fetching
- `useLocation` for route awareness

### Example: Expandable Cards
```javascript
const [expandedCards, setExpandedCards] = useState(new Set());

const toggleExpand = (id) => {
  const newExpanded = new Set(expandedCards);
  if (newExpanded.has(id)) {
    newExpanded.delete(id);
  } else {
    newExpanded.add(id);
  }
  setExpandedCards(newExpanded);
};
```

## API Integration

All API calls use Axios with proxy configuration in `vite.config.js`:

```javascript
server: {
  proxy: {
    '/auth': 'http://localhost:3000',
    '/api': 'http://localhost:3000'
  }
}
```

This allows relative URLs in the frontend:
```javascript
axios.get('/api/todos')  // Proxied to http://localhost:3000/api/todos
```

## Styling Approach

The application uses **vanilla CSS** with:
- CSS custom properties (variables) for theming
- BEM-like naming conventions
- Mobile-first responsive design
- Flexbox and Grid for layouts

### Key CSS Classes
- `.card` - Base card component
- `.btn-primary` - Primary action button
- `.nav-link` - Navigation tab
- `.link-card` - Stash link card
- `.expand-btn` - Summary expand/collapse button

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

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Performance Optimizations

- Vite's code splitting for faster loads
- Lazy loading of routes (can be added)
- Optimized images and assets
- Minimal bundle size with tree-shaking

## Accessibility

- Semantic HTML elements
- ARIA labels where needed
- Keyboard navigation support
- Focus states on interactive elements
- Sufficient color contrast ratios
