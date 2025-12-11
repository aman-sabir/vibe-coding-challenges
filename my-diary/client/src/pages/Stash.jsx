import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, Plus, ExternalLink, Loader2, ChevronDown, ChevronUp } from 'lucide-react';

export default function Stash() {
    const [links, setLinks] = useState([]);
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [expandedCards, setExpandedCards] = useState(new Set());

    useEffect(() => {
        fetchLinks();
    }, []);

    const fetchLinks = async () => {
        try {
            const res = await axios.get('/api/links');
            setLinks(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const addLink = async (e) => {
        e.preventDefault();
        if (!url.trim()) return;
        setLoading(true);
        try {
            const res = await axios.post('/api/links', { url });
            setLinks([res.data, ...links]);
            setUrl('');
        } catch (err) {
            console.error(err);
            alert('Failed to summarize link.');
        } finally {
            setLoading(false);
        }
    };

    const deleteLink = async (id) => {
        try {
            await axios.delete(`/api/links/${id}`);
            setLinks(links.filter(l => l.id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    const toggleExpand = (id) => {
        const newExpanded = new Set(expandedCards);
        if (newExpanded.has(id)) {
            newExpanded.delete(id);
        } else {
            newExpanded.add(id);
        }
        setExpandedCards(newExpanded);
    };

    return (
        <div className="main-content">
            <div className="card">
                <h2 style={{ marginTop: 0 }}>Stash</h2>
                <form onSubmit={addLink} className="input-group">
                    <input
                        type="url"
                        className="input-field"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="Paste a URL to summarize..."
                        disabled={loading}
                    />
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? <Loader2 className="animate-spin" size={20} /> : <Plus size={20} />}
                    </button>
                </form>
            </div>

            <div className="link-grid">
                {links.map(link => {
                    const isExpanded = expandedCards.has(link.id);
                    return (
                        <div key={link.id} className={`card link-card ${isExpanded ? 'expanded' : ''}`}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <a href={link.url} target="_blank" rel="noopener noreferrer" className="link-title">
                                    {link.title || link.url} <ExternalLink size={14} style={{ display: 'inline' }} />
                                </a>
                                <button onClick={() => deleteLink(link.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: 0 }}>
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            <p className={`link-summary ${isExpanded ? 'expanded' : ''}`}>{link.summary}</p>

                            <div style={{ marginTop: 'auto' }}>
                                <div className="tags">
                                    {link.tags && link.tags.map((tag, i) => (
                                        <span key={i} className="tag">#{tag}</span>
                                    ))}
                                </div>

                                <button
                                    onClick={() => toggleExpand(link.id)}
                                    className="expand-btn"
                                >
                                    {isExpanded ? (
                                        <>Show Less <ChevronUp size={16} /></>
                                    ) : (
                                        <>Read More <ChevronDown size={16} /></>
                                    )}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
            {links.length === 0 && <p style={{ textAlign: 'center', color: '#9ca3af', fontStyle: 'italic', marginTop: '2rem' }}>No links stashed yet.</p>}
        </div>
    );
}
