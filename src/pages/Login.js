import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await login(username, password);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('username', response.data.username);
            localStorage.setItem('role', response.data.role);
            localStorage.setItem('lab', response.data.lab);
            navigate('/dashboard');
        } catch (err) {
            setError('Invalid username or password!');
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0078d4 0%, #005a9e 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'Segoe UI, Arial, sans-serif'
        }}>
            <div style={{
                background: 'white',
                borderRadius: '12px',
                padding: '48px',
                width: '400px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div style={{
                        display: 'inline-grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '3px',
                        marginBottom: '16px'
                    }}>
                        <div style={{ width: '20px', height: '20px', background: '#f25022' }}></div>
                        <div style={{ width: '20px', height: '20px', background: '#7fba00' }}></div>
                        <div style={{ width: '20px', height: '20px', background: '#00a4ef' }}></div>
                        <div style={{ width: '20px', height: '20px', background: '#ffb900' }}></div>
                    </div>
                    <h2 style={{
                        color: '#1B3A5C',
                        marginBottom: '4px',
                        fontSize: '24px',
                        fontWeight: '600'
                    }}>
                        QLMS
                    </h2>
                    <p style={{ color: '#666', fontSize: '14px' }}>
                        Quantum Lab Management System
                    </p>
                </div>

                {error && (
                    <div style={{
                        background: '#fde7e9',
                        color: '#a80000',
                        padding: '12px',
                        borderRadius: '4px',
                        marginBottom: '16px',
                        fontSize: '14px'
                    }}>
                        ❌ {error}
                    </div>
                )}

                <form onSubmit={handleLogin}>
                    <div style={{ marginBottom: '16px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '6px',
                            fontSize: '14px',
                            fontWeight: '600',
                            color: '#333'
                        }}>
                            Username
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            placeholder="Enter username"
                            required
                            style={{
                                width: '100%',
                                padding: '10px 14px',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                fontSize: '14px',
                                outline: 'none',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '6px',
                            fontSize: '14px',
                            fontWeight: '600',
                            color: '#333'
                        }}>
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="Enter password"
                            required
                            style={{
                                width: '100%',
                                padding: '10px 14px',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                fontSize: '14px',
                                outline: 'none',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '12px',
                            background: '#0078d4',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            letterSpacing: '0.5px'
                        }}>
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div style={{
                    marginTop: '24px',
                    padding: '12px',
                    background: '#f5f5f5',
                    borderRadius: '4px',
                    fontSize: '12px',
                    color: '#666'
                }}>
                    <strong>Test Credentials:</strong><br />
                    admin / admin123 (Admin)<br />
                    researcher / research123 (Researcher)<br />
                    labmanager / manager123 (Lab Manager)
                </div>
            </div>
        </div>
    );
}

export default Login;