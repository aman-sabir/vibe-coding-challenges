import React from 'react';

function Login() {
    const handleGoogleLogin = () => {
        window.location.href = 'http://localhost:3000/auth/google';
    };

    return (
        <div className="auth-container">
            <div className="card auth-box">
                <div style={{ marginBottom: '24px' }}>
                    <img src="/logo.png" alt="My-Diary" style={{ width: '64px', height: '64px' }} />
                </div>
                <h1 className="google-text" style={{ fontSize: '1.75rem', marginBottom: '8px' }}>
                    <span className="g-blue">M</span><span className="g-red">y</span>
                    <span style={{ color: '#5f6368' }}>-</span>
                    <span className="g-blue">D</span><span className="g-green">i</span><span className="g-yellow">a</span><span className="g-red">r</span><span className="g-blue">y</span>
                </h1>
                <p style={{ marginBottom: '40px', color: '#5f6368' }}>Sign in to continue</p>

                <button className="btn-google" onClick={handleGoogleLogin}>
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" style={{ width: '20px', height: '20px' }} />
                    Sign in with Google
                </button>
            </div>
        </div>
    );
}

export default Login;
