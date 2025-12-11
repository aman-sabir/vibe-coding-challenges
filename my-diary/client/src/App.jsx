import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Checkmate from './pages/Checkmate';
import Stash from './pages/Stash';
import './styles/index.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/auth/current_user')
      .then(res => res.json())
      .then(user => {
        if (user && user.id) {
          setUser(user);
        } else {
          setUser(null);
        }
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', marginTop: '4rem' }}>Loading...</div>;

  return (
    <Router>
      {!user ? (
        <Routes>
          <Route path="*" element={<Login />} />
        </Routes>
      ) : (
        <div className="app-container">
          <Navbar user={user} />
          <Routes>
            <Route path="/checkmate" element={<Checkmate />} />
            <Route path="/stash" element={<Stash />} />
            <Route path="*" element={<Navigate to="/checkmate" replace />} />
          </Routes>
        </div>
      )}
    </Router>
  );
}

export default App;
