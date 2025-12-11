import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckSquare, Link as LinkIcon, LogOut } from 'lucide-react';

export default function Navbar({ user }) {
    const location = useLocation();

    const isActive = (path) => location.pathname === path ? 'active' : '';

    const handleLogout = () => {
        window.location.href = 'http://localhost:3000/auth/logout';
    };

    return (
        <nav className="navbar">
            <Link to="/" className="nav-brand">
                <img src="/logo.png" alt="Logo" className="logo-img" />
                <span className="google-text">
                    <span className="g-blue">M</span>
                    <span className="g-red">y</span>
                    <span className="g-text-secondary">-</span>
                    <span className="g-blue">D</span>
                    <span className="g-green">i</span>
                    <span className="g-yellow">a</span>
                    <span className="g-red">r</span>
                    <span className="g-blue">y</span>
                </span>
            </Link>

            <div className="nav-links">
                <Link to="/checkmate" className={`nav-link ${isActive('/checkmate')}`}>
                    <CheckSquare size={18} /> Checkmate
                </Link>
                <Link to="/stash" className={`nav-link ${isActive('/stash')}`}>
                    <LinkIcon size={18} /> Stash
                </Link>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <span style={{ fontWeight: 500 }}>{user.name}</span>
                <button onClick={handleLogout} className="btn-logout" title="Logout">
                    <LogOut size={20} />
                </button>
            </div>
        </nav>
    );
}
