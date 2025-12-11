import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import { useState, useEffect } from 'react';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for authenticated user from backend
    fetch('/auth/current_user')
      .then(res => res.json())
      .then(user => {
        if (user) {
          setUser(user);
        } else {
          setUser(null);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching user", err);
        setLoading(false);
      });
  }, []);

  const logout = () => {
    // Hit backend logout which redirects to home (Login)
    window.location.href = 'http://localhost:3000/auth/logout';
  };

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/" />}
        />
        <Route
          path="/"
          element={user ? <Home user={user} onLogout={logout} /> : <Navigate to="/login" />}
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
