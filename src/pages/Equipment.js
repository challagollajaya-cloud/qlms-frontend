import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getEquipment, addEquipment, updateEquipmentStatus, deleteEquipment } from '../services/api';

function Equipment() {
    const [equipment, setEquipment] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [message, setMessage] = useState('');
    const [form, setForm] = useState({
        assetId: '', serialNumber: '',
        equipmentType: '', status: 'AVAILABLE',
        vendor: '', purchasePrice: '',
        specialHandling: ''
    });
    const navigate = useNavigate();
    const role = localStorage.getItem('role');

    useEffect(() => {
        loadEquipment();
    }, []);

    const loadEquipment = async () => {
        try {
            const res = await getEquipment();
            setEquipment(res.data);
            setLoading(false);
        } catch (err) {
            if (err.response?.status === 401) navigate('/login');
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addEquipment({
                ...form,
                purchasePrice: parseFloat(form.purchasePrice)
            });
            setMessage('Equipment added! ✅');
            setShowForm(false);
            setForm({
                assetId: '', serialNumber: '',
                equipmentType: '', status: 'AVAILABLE',
                vendor: '', purchasePrice: '',
                specialHandling: ''
            });
            loadEquipment();
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            setMessage('Failed to add equipment! ❌');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this equipment?')) {
            await deleteEquipment(id);
            loadEquipment();
        }
    };

    const statusColors = {
        'AVAILABLE': '#107c10',
        'IN_USE': '#0078d4',
        'MAINTENANCE': '#d83b01',
        'IN_TRANSIT': '#8764b8'
    };

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <p>Loading equipment...</p>
        </div>
    );

    return (
        <div style={{ fontFamily: 'Segoe UI, Arial, sans-serif', minHeight: '100vh', background: '#f3f2f1' }}>

            {/* Header */}
            <div style={{ background: '#0078d4', color: 'white', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: '600', fontSize: '18px' }}>🔬 Equipment Inventory</span>
                <div style={{ display: 'flex', gap: '12px' }}>
                    {role === 'ADMIN' && (
                        <button onClick={() => setShowForm(!showForm)}
                                style={{ background: 'white', color: '#0078d4', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: '600' }}>
                            + Add Equipment
                        </button>
                    )}
                    <button onClick={() => navigate('/dashboard')}
                            style={{ background: 'transparent', color: 'white', border: '1px solid white', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}>
                        ← Dashboard
                    </button>
                </div>
            </div>

            <div style={{ padding: '24px 32px' }}>

                {message && (
                    <div style={{ background: '#dff6dd', color: '#107c10', padding: '12px', borderRadius: '4px', marginBottom: '16px' }}>
                        {message}
                    </div>
                )}

                {/* Add Form */}
                {showForm && (
                    <div style={{ background: 'white', padding: '24px', borderRadius: '8px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                        <h3 style={{ color: '#0078d4', marginTop: 0 }}>Add New Equipment</h3>
                        <form onSubmit={handleSubmit}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                {[
                                    { label: 'Asset ID', key: 'assetId', placeholder: 'MSFT-DR-001' },
                                    { label: 'Serial Number', key: 'serialNumber', placeholder: 'DR2024001' },
                                    { label: 'Equipment Type', key: 'equipmentType', placeholder: 'DILUTION_REFRIGERATOR' },
                                    { label: 'Vendor', key: 'vendor', placeholder: 'BlueFors' },
                                    { label: 'Purchase Price ($)', key: 'purchasePrice', placeholder: '500000' },
                                    { label: 'Special Handling', key: 'specialHandling', placeholder: 'Keep upright!' }
                                ].map(field => (
                                    <div key={field.key}>
                                        <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: '600', color: '#333' }}>
                                            {field.label}
                                        </label>
                                        <input
                                            placeholder={field.placeholder}
                                            value={form[field.key]}
                                            onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                                            style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '13px', boxSizing: 'border-box' }}
                                        />
                                    </div>
                                ))}
                                <div>
                                    <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: '600', color: '#333' }}>Status</label>
                                    <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}
                                            style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '13px' }}>
                                        <option>AVAILABLE</option>
                                        <option>IN_USE</option>
                                        <option>MAINTENANCE</option>
                                        <option>IN_TRANSIT</option>
                                    </select>
                                </div>
                            </div>
                            <div style={{ marginTop: '16px', display: 'flex', gap: '12px' }}>
                                <button type="submit" style={{ background: '#0078d4', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '4px', cursor: 'pointer', fontWeight: '600' }}>
                                    Save Equipment
                                </button>
                                <button type="button" onClick={() => setShowForm(false)}
                                        style={{ background: '#f3f2f1', color: '#333', border: '1px solid #ddd', padding: '10px 24px', borderRadius: '4px', cursor: 'pointer' }}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Equipment Table */}
                <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                        <tr style={{ background: '#0078d4', color: 'white' }}>
                            {['Asset ID', 'Type', 'Vendor', 'Status', 'Price', 'Handling', 'Actions'].map(h => (
                                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600' }}>{h}</th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {equipment.map((eq, i) => (
                            <tr key={eq.id} style={{ background: i % 2 === 0 ? 'white' : '#f9f9f9', borderBottom: '1px solid #e0e0e0' }}>
                                <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: '600', color: '#0078d4' }}>{eq.assetId}</td>
                                <td style={{ padding: '12px 16px', fontSize: '13px' }}>{eq.equipmentType}</td>
                                <td style={{ padding: '12px 16px', fontSize: '13px' }}>{eq.vendor}</td>
                                <td style={{ padding: '12px 16px' }}>
                                        <span style={{
                                            background: statusColors[eq.status] || '#666',
                                            color: 'white', padding: '4px 10px',
                                            borderRadius: '12px', fontSize: '12px', fontWeight: '600'
                                        }}>
                                            {eq.status}
                                        </span>
                                </td>
                                <td style={{ padding: '12px 16px', fontSize: '13px' }}>
                                    ${eq.purchasePrice?.toLocaleString()}
                                </td>
                                <td style={{ padding: '12px 16px', fontSize: '12px', color: '#666' }}>{eq.specialHandling}</td>
                                <td style={{ padding: '12px 16px' }}>
                                    {role === 'ADMIN' && (
                                        <button onClick={() => handleDelete(eq.id)}
                                                style={{ background: '#d83b01', color: 'white', border: 'none', padding: '4px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>
                                            Delete
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    {equipment.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '48px', color: '#666' }}>
                            No equipment found! Add some equipment.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Equipment;