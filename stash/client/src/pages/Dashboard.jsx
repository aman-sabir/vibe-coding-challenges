import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, ExternalLink, Loader2, LayoutGrid } from 'lucide-react';

const Dashboard = () => {
    const [links, setLinks] = useState([]);
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch links on mount
    useEffect(() => {
        fetchLinks();
    }, []);

    const fetchLinks = async () => {
        try {
            const res = await axios.get('http://localhost:3000/api/links', { withCredentials: true });
            setLinks(res.data);
        } catch (err) {
            if (err.response && err.response.status === 401) {
                window.location.href = '/'; // Redirect to login
            }
            console.error('Failed to fetch links', err);
        }
    };

    const handleAddLink = async (e) => {
        e.preventDefault();
        if (!url) return;

        setLoading(true);
        setError(null);
        try {
            const res = await axios.post('http://localhost:3000/api/links', { url }, { withCredentials: true });
            setLinks([res.data, ...links]);
            setUrl('');
        } catch (err) {
            console.error('Error adding link', err);
            setError('Failed to process link. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this link?')) return;
        try {
            await axios.delete(`http://localhost:3000/api/links/${id}`, { withCredentials: true });
            setLinks(links.filter(link => link.id !== id));
        } catch (err) {
            console.error('Failed to delete', err);
        }
    };

    return (
        <div className="container">
            <header className="header" style={{ marginBottom: '2rem', borderRadius: 'var(--radius-card)' }}>
                <div className="logo">
                    <LayoutGrid size={24} className="logo-icon" />
                    <span>Stash</span>
                </div>
                <button className="btn btn-google" onClick={() => window.location.href = 'http://localhost:3000/auth/logout'}>
                    Sign Out
                </button>
            </header>

            <div className="card">
                <form onSubmit={handleAddLink} style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ flexGrow: 1 }}>
                        <input
                            type="url"
                            className="input-field"
                            placeholder="Paste a URL to summarize (e.g. https://example.com/article)"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
                        {loading ? 'Processing...' : 'Summarize'}
                    </button>
                </form>
                {error && <div style={{ color: 'var(--danger)', marginTop: '0.5rem', fontSize: '0.9rem' }}>{error}</div>}
            </div>

            <div className="link-grid">
                {links.map(link => (
                    <div key={link.id} className="card link-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                            <a href={link.url} target="_blank" rel="noopener noreferrer" className="link-title">
                                {link.title || link.url} <ExternalLink size={14} style={{ marginLeft: '4px' }} />
                            </a>
                            <button className="btn-danger" onClick={() => handleDelete(link.id)} style={{ cursor: 'pointer', background: 'none', border: 'none', color: 'var(--text-secondary)' }}>
                                <Trash2 size={16} />
                            </button>
                        </div>
                        <p className="link-summary">
                            {link.summary}
                        </p>
                        <div className="tags">
                            {link.tags && link.tags.map((tag, idx) => (
                                <span key={idx} className="tag">#{tag}</span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {links.length === 0 && !loading && (
                <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
                    <p>No links saved yet. Add one above!</p>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
