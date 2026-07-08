import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getNotifications } from '../services/api';

function Notifications() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        loadNotifications();
    }, []);

    const loadNotifications = async () => {
        try {
            const res = await getNotifications();
            setNotifications(res.data);
            setLoading(false);
        } catch (err) {
            setLoading(false);
        }
    };

    const typeColors = {
        'CALIBRATION_REMINDER': '#d83b01',
        'SHIPMENT_UPDATE': '#0078d4',
        'REQUEST_APPROVED': '#107c10',
        'REQUEST_REJECTED': '#d83b01'
    };

    if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><p>Loading...</p></div>;

    return (
        <div style={{ fontFamily: 'Segoe UI, Arial, sans-serif', minHeight: '100vh', background: '#f3f2f1' }}>

            <div style={{ background: '#d83b01', color: 'white', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: '600', fontSize: '18px' }}>🔔 Notifications</span>
                <button onClick={() => navigate('/dashboard')}
                        style={{ background: 'transparent', color: 'white', border: '1px solid white', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}>
                    ← Dashboard
                </button>
            </div>

            <div style={{ padding: '24px 32px' }}>
                {notifications.length === 0 ? (
                    <div style={{ background: 'white', borderRadius: '8px', padding: '48px', textAlign: 'center', color: '#666', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔔</div>
                        <h3>No notifications yet!</h3>
                    </div>
                ) : (
                    notifications.map(n => (
                        <div key={n.id} style={{
                            background: 'white', borderRadius: '8px', padding: '16px 24px',
                            marginBottom: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                            borderLeft: `4px solid ${typeColors[n.type] || '#666'}`
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <span style={{
                                        background: typeColors[n.type] || '#666',
                                        color: 'white', padding: '2px 10px',
                                        borderRadius: '12px', fontSize: '11px',
                                        fontWeight: '600', marginRight: '12px'
                                    }}>
                                        {n.type}
                                    </span>
                                    <span style={{ fontSize: '14px', color: '#333' }}>{n.message}</span>
                                </div>
                                <span style={{ fontSize: '12px', color: '#999' }}>
                                    To: {n.recipient}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default Notifications;