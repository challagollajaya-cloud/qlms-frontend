import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getShipments, createShipment, updateShipmentStatus } from '../services/api';

function Shipments() {
    const [shipments, setShipments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [message, setMessage] = useState('');
    const [form, setForm] = useState({
        equipmentName: '', sourceLab: '',
        destinationLab: '', carrier: 'FedEx',
        specialHandling: ''
    });
    const navigate = useNavigate();

    useEffect(() => { loadShipments(); }, []);

    const loadShipments = async () => {
        try {
            const res = await getShipments();
            setShipments(res.data);
            setLoading(false);
        } catch (err) {
            if (err.response?.status === 401) navigate('/login');
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createShipment(form);
            setMessage('Shipment created! ✅');
            setShowForm(false);
            loadShipments();
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            setMessage('Failed! ❌');
        }
    };

    const handleStatusUpdate = async (id, status) => {
        await updateShipmentStatus(id, status);
        loadShipments();
    };

    const statusColors = {
        'PENDING': '#8764b8',
        'PICKED_UP': '#0078d4',
        'IN_TRANSIT': '#d83b01',
        'DELIVERED': '#107c10',
        'CANCELLED': '#666'
    };

    if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><p>Loading...</p></div>;

    return (
        <div style={{ fontFamily: 'Segoe UI, Arial, sans-serif', minHeight: '100vh', background: '#f3f2f1' }}>

            <div style={{ background: '#107c10', color: 'white', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: '600', fontSize: '18px' }}>📦 Shipment Tracking</span>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={() => setShowForm(!showForm)}
                            style={{ background: 'white', color: '#107c10', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: '600' }}>
                        + New Shipment
                    </button>
                    <button onClick={() => navigate('/dashboard')}
                            style={{ background: 'transparent', color: 'white', border: '1px solid white', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}>
                        ← Dashboard
                    </button>
                </div>
            </div>

            <div style={{ padding: '24px 32px' }}>
                {message && <div style={{ background: '#dff6dd', color: '#107c10', padding: '12px', borderRadius: '4px', marginBottom: '16px' }}>{message}</div>}

                {showForm && (
                    <div style={{ background: 'white', padding: '24px', borderRadius: '8px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                        <h3 style={{ color: '#107c10', marginTop: 0 }}>Create New Shipment</h3>
                        <form onSubmit={handleSubmit}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                {[
                                    { label: 'Equipment Name', key: 'equipmentName', placeholder: 'Dilution Refrigerator DR-001' },
                                    { label: 'Source Lab', key: 'sourceLab', placeholder: 'Redmond' },
                                    { label: 'Destination Lab', key: 'destinationLab', placeholder: 'Sydney' },
                                    { label: 'Special Handling', key: 'specialHandling', placeholder: 'Keep upright!' }
                                ].map(field => (
                                    <div key={field.key}>
                                        <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: '600' }}>{field.label}</label>
                                        <input
                                            placeholder={field.placeholder}
                                            value={form[field.key]}
                                            onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                                            style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '13px', boxSizing: 'border-box' }}
                                        />
                                    </div>
                                ))}
                                <div>
                                    <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: '600' }}>Carrier</label>
                                    <select value={form.carrier} onChange={e => setForm({ ...form, carrier: e.target.value })}
                                            style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '13px' }}>
                                        <option>FedEx</option>
                                        <option>DHL</option>
                                        <option>Internal</option>
                                    </select>
                                </div>
                            </div>
                            <div style={{ marginTop: '16px', display: 'flex', gap: '12px' }}>
                                <button type="submit" style={{ background: '#107c10', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '4px', cursor: 'pointer', fontWeight: '600' }}>
                                    Create Shipment
                                </button>
                                <button type="button" onClick={() => setShowForm(false)}
                                        style={{ background: '#f3f2f1', color: '#333', border: '1px solid #ddd', padding: '10px 24px', borderRadius: '4px', cursor: 'pointer' }}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                        <tr style={{ background: '#107c10', color: 'white' }}>
                            {['Shipment #', 'Equipment', 'From', 'To', 'Carrier', 'Status', 'Update Status'].map(h => (
                                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px' }}>{h}</th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {shipments.map((s, i) => (
                            <tr key={s.id} style={{ background: i % 2 === 0 ? 'white' : '#f9f9f9', borderBottom: '1px solid #e0e0e0' }}>
                                <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: '600', color: '#107c10' }}>{s.shipmentNumber}</td>
                                <td style={{ padding: '12px 16px', fontSize: '13px' }}>{s.equipmentName}</td>
                                <td style={{ padding: '12px 16px', fontSize: '13px' }}>{s.sourceLab}</td>
                                <td style={{ padding: '12px 16px', fontSize: '13px' }}>{s.destinationLab}</td>
                                <td style={{ padding: '12px 16px', fontSize: '13px' }}>{s.carrier}</td>
                                <td style={{ padding: '12px 16px' }}>
                                        <span style={{ background: statusColors[s.status] || '#666', color: 'white', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '600' }}>
                                            {s.status}
                                        </span>
                                </td>
                                <td style={{ padding: '12px 16px' }}>
                                    <select onChange={e => handleStatusUpdate(s.id, e.target.value)} defaultValue={s.status}
                                            style={{ padding: '4px 8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px' }}>
                                        <option value="PENDING">PENDING</option>
                                        <option value="PICKED_UP">PICKED UP</option>
                                        <option value="IN_TRANSIT">IN TRANSIT</option>
                                        <option value="DELIVERED">DELIVERED</option>
                                        <option value="CANCELLED">CANCELLED</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    {shipments.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '48px', color: '#666' }}>No shipments found!</div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Shipments;