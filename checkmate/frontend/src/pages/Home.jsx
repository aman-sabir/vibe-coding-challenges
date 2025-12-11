import { useState, useEffect } from 'react';
import { Plus, Trash2, LogOut, Check, CheckSquare } from 'lucide-react'; // Changed icons

export default function Home({ user, onLogout }) {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTodos();
    }, [user.id]);

    const fetchTodos = async () => {
        try {
            const response = await fetch('http://localhost:3000/todos', {
                credentials: 'include'
            });
            if (response.ok) {
                const data = await response.json();
                setTodos(data);
            }
        } catch (error) {
            console.error('Failed to fetch todos:', error);
        } finally {
            setLoading(false);
        }
    };

    const addTodo = async (e) => {
        e.preventDefault();
        if (!newTodo.trim()) return;

        try {
            const response = await fetch('http://localhost:3000/todos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ text: newTodo }),
            });

            if (response.ok) {
                const data = await response.json();
                setTodos([...todos, data]);
                setNewTodo('');
            }
        } catch (error) {
            console.error('Failed to add todo:', error);
        }
    };

    const deleteTodo = async (id) => {
        try {
            const response = await fetch(`http://localhost:3000/todos/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            if (response.ok) {
                setTodos(todos.filter(t => t.id !== id));
            }
        } catch (error) {
            console.error('Failed to delete todo:', error);
        }
    };

    // Optional: Toggle completion (UI only since backend doesn't persist it efficiently in this MVP without PATCH)
    // Actually I added PATCH to backend so let's use it.
    const toggleTodo = async (id, completed) => {
        try {
            const response = await fetch(`http://localhost:3000/todos/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ completed: !completed }),
            });

            if (response.ok) {
                setTodos(todos.map(t => t.id === id ? { ...t, completed: !completed } : t));
            }
        } catch (error) {
            console.error('Failed to toggle todo:', error);
        }
    };

    return (
        <div style={{ backgroundColor: 'var(--bg-secondary)', minHeight: '100vh' }}>
            <header className="header">
                <div className="logo"><CheckSquare className="logo-icon" size={24} strokeWidth={2.5} /> Checkmate</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>{user.username}</span>
                    <button onClick={onLogout} className="btn" style={{ color: 'var(--text-secondary)', padding: '0.5rem' }} title="Logout">
                        <LogOut size={20} />
                    </button>
                </div>
            </header>

            <div className="container" style={{ maxWidth: '700px' }}> {/* Slightly narrower for task list focus */}
                <div className="card" style={{ maxWidth: '600px', margin: '2rem auto' }}>
                    <h2 className="page-title" style={{ fontSize: '1.5rem' }}>My Tasks</h2>

                    <form onSubmit={addTodo} style={{
                        display: 'flex',
                        gap: '0.5rem',
                        marginBottom: '2rem',
                        backgroundColor: 'white',
                        padding: '0.5rem 0.5rem 0.5rem 1.5rem',
                        borderRadius: 'var(--radius-pill)',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)'
                    }}>
                        <input
                            type="text"
                            style={{ border: 'none', flex: 1, outline: 'none', fontSize: '1rem' }}
                            placeholder="Add a task"
                            value={newTodo}
                            onChange={(e) => setNewTodo(e.target.value)}
                        />
                        <button type="submit" className="btn btn-primary" style={{ padding: '0.5rem', width: '36px', height: '36px', borderRadius: '50%', minWidth: 'auto' }} disabled={!newTodo.trim()}>
                            <Plus size={24} />
                        </button>
                    </form>

                    <div className="todo-list-containercard" style={{ backgroundColor: 'transparent', boxShadow: 'none', padding: 0 }}>
                        <div className="todo-list" style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 2px 0 rgba(60,64,67,0.3)', overflow: 'hidden' }}>
                            {loading ? (
                                <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>Loading tasks...</p>
                            ) : todos.length === 0 ? (
                                <div className="empty-state">
                                    <span style={{ display: 'block', fontSize: '3rem', marginBottom: '1rem' }}>🎉</span>
                                    <p>No tasks yet. Enjoy your day!</p>
                                </div>
                            ) : (
                                todos.map(todo => (
                                    <div key={todo.id} className="todo-item" style={{ padding: '0.75rem 1.5rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                                            <button
                                                onClick={() => toggleTodo(todo.id, todo.completed)}
                                                className={`todo-check-btn ${todo.completed ? 'completed' : ''}`}
                                                title={todo.completed ? "Mark as incomplete" : "Mark as complete"}
                                            >
                                                {todo.completed ? <CheckSquare size={24} /> : <div style={{ width: 20, height: 20, border: '2px solid var(--text-secondary)', borderRadius: '50%' }} />}
                                            </button>
                                            <span className={`todo-text ${todo.completed ? 'completed' : ''}`}>
                                                {todo.text}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => deleteTodo(todo.id)}
                                            className="btn-danger"
                                            title="Delete task"
                                            style={{ opacity: 0.7 }}
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
