import React from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
    const navigate = useNavigate();
    const username = localStorage.getItem('username');
    const role = localStorage.getItem('role');
    const lab = localStorage.getItem('lab');

    const cards = [
        {
            title: 'Equipment Inventory',
            description: 'Track quantum equipment across all labs',
            icon: '🔬',
            color: '#0078d4',
            path: '/equipment'
        },
        {
            title: 'Shipment Tracking',
            description: 'Monitor equipment shipments globally',
            icon: '📦',
            color: '#107c10',
            path: '/shipments'
        },
        {
            title: 'Equipment Requests',
            description: 'Submit and manage equipment requests',
            icon: '📋',
            color: '#8764b8',
            path: '/requests'
        },
        {
            title: 'Notifications',
            description: 'View calibration and shipment alerts',
            icon: '🔔',
            color: '#d83b01',
            path: '/notifications'
        }
    ];

    return (
        <div style={{
            minHeight: '100vh',
            background: '#f3f2f1',
            fontFamily: 'Segoe UI, Arial, sans-serif'
        }}>
            {/* Header */}
            <div style={{
                background: '#0078d4',
                color: 'white',
                padding: '16px 32px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                        display: 'inline-grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '2px'
                    }}>
                        <div style={{ width: '8px', height: '8px', background: '#f25022' }}></div>
                        <div style={{ width: '8px', height: '8px', background: '#7fba00' }}></div>
                        <div style={{ width: '8px', height: '8px', background: '#00a4ef' }}></div>
                        <div style={{ width: '8px', height: '8px', background: '#ffb900' }}></div>
                    </div>
                    <span style={{ fontWeight: '600', fontSize: '18px' }}>
                        QLMS - Quantum Lab Management System
                    </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span style={{ fontSize: '14px' }}>
                        👤 {username} | {role} | {lab}
                    </span>
                    <button
                        onClick={() => {
                            localStorage.clear();
                            navigate('/login');
                        }}
                        style={{
                            background: 'transparent',
                            border: '1px solid white',
                            color: 'white',
                            padding: '6px 16px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '13px'
                        }}>
                        Sign Out
                    </button>
                </div>
            </div>

            {/* Welcome Banner */}
            <div style={{
                background: 'white',
                padding: '24px 32px',
                borderBottom: '1px solid #e0e0e0'
            }}>
                <h1 style={{
                    color: '#1B3A5C',
                    margin: 0,
                    fontSize: '24px',
                    fontWeight: '600'
                }}>
                    Welcome back, {username}! 👋
                </h1>
                <p style={{ color: '#666', margin: '4px 0 0', fontSize: '14px' }}>
                    Quantum Computing Infrastructure | {lab} Lab
                </p>
            </div>

            {/* Cards */}
            <div style={{
                padding: '32px',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: '20px'
            }}>
                {cards.map(card => (
                    <div
                        key={card.path}
                        onClick={() => navigate(card.path)}
                        style={{
                            background: 'white',
                            borderRadius: '8px',
                            padding: '24px',
                            cursor: 'pointer',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                            borderTop: `4px solid ${card.color}`,
                            transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.transform = 'translateY(-4px)';
                            e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                        }}>
                        <div style={{ fontSize: '40px', marginBottom: '12px' }}>
                            {card.icon}
                        </div>
                        <h3 style={{
                            color: card.color,
                            margin: '0 0 8px',
                            fontSize: '16px',
                            fontWeight: '600'
                        }}>
                            {card.title}
                        </h3>
                        <p style={{
                            color: '#666',
                            margin: 0,
                            fontSize: '13px',
                            lineHeight: '1.5'
                        }}>
                            {card.description}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Dashboard;