import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, Plus } from 'lucide-react';

export default function Checkmate() {
    const [todos, setTodos] = useState([]);
    const [text, setText] = useState('');

    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = async () => {
        try {
            const res = await axios.get('/api/todos');
            setTodos(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const addTodo = async (e) => {
        e.preventDefault();
        if (!text.trim()) return;
        try {
            const res = await axios.post('/api/todos', { text });
            setTodos([...todos, res.data]);
            setText('');
        } catch (err) {
            console.error(err);
        }
    };

    const toggleTodo = async (id, completed) => {
        try {
            const res = await axios.patch(`/api/todos/${id}`, { completed: !completed });
            setTodos(todos.map(t => t.id === id ? res.data : t));
        } catch (err) {
            console.error(err);
        }
    };

    const deleteTodo = async (id) => {
        try {
            await axios.delete(`/api/todos/${id}`);
            setTodos(todos.filter(t => t.id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="main-content">
            <div className="card">
                <h2 style={{ marginTop: 0 }}>Checkmate</h2>
                <form onSubmit={addTodo} className="input-group">
                    <input
                        type="text"
                        className="input-field"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="What needs to be done?"
                    />
                    <button type="submit" className="btn btn-primary">
                        <Plus size={20} />
                    </button>
                </form>

                <div>
                    {todos.map(todo => (
                        <div key={todo.id} className="list-item">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <input
                                    type="checkbox"
                                    checked={todo.completed}
                                    onChange={() => toggleTodo(todo.id, todo.completed)}
                                    style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                                />
                                <span className={`todo-text ${todo.completed ? 'todo-completed' : ''}`}>
                                    {todo.text}
                                </span>
                            </div>
                            <button onClick={() => deleteTodo(todo.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))}
                    {todos.length === 0 && <p style={{ textAlign: 'center', color: '#9ca3af', fontStyle: 'italic' }}>No tasks yet.</p>}
                </div>
            </div>
        </div>
    );
}
