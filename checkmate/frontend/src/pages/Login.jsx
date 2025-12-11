import React from 'react';
import '../index.css';

function Login() {
    const handleGoogleLogin = () => {
        window.location.href = 'http://localhost:3000/auth/google';
    };

    return (
        <div className="auth-container">
            <div className="card auth-box" style={{ textAlign: 'center' }}>
                <h1 className="page-title">Checkmate</h1>
                <p className="page-subtitle">Get things done.</p>

                <button className="btn btn-primary" onClick={handleGoogleLogin} style={{ width: '100%', justifyContent: 'center', backgroundColor: '#4285F4', borderColor: '#4285F4', color: 'white' }}>
                    Sign in with Google
                </button>
            </div>
        </div>
    );
}

export default Login;
