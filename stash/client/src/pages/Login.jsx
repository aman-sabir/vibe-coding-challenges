import React from 'react';
import { LayoutGrid } from 'lucide-react';

const Login = () => {
    const handleGoogleLogin = () => {
        window.location.href = 'http://localhost:3000/auth/google';
    };

    return (
        <div className="auth-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
            <div className="card auth-box" style={{ maxWidth: '400px', width: '100%', textAlign: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem', color: 'var(--accent-primary)' }}>
                    <LayoutGrid size={48} />
                </div>
                <h1 className="page-title">Link Summerizer</h1>
                <p className="page-subtitle">Save, summarize, and categorize your reading list with AI.</p>

                <button className="btn btn-google" onClick={handleGoogleLogin} style={{ width: '100%', justifyContent: 'center', padding: '12px' }}>
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" style={{ width: '18px', height: '18px' }} />
                    Sign in with Google
                </button>
            </div>
        </div>
    );
};

export default Login;
