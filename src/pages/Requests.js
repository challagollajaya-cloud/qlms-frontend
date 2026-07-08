import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRequests, createRequest, approveRequest, rejectRequest } from '../services/api';

function Requests() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [message, setMessage] = useState('');
    const [form, setForm] = useState({
        equipmentName: '', requestedBy: '',
        researcherEmail: '', justification: '',
        priority: 'NORMAL', startDate: '', endDate: ''
    });
    const navigate = useNavigate();
    const role = localStorage.getItem('role');
    const username = localStorage.getItem('username');

    useEffect(() => { loadRequests(); }, []);

    const loadRequests = async () => {
        try {
            const res = await getRequests();
            setRequests(res.data);
            setLoading(false);
        } catch (err) {
            if (err.response?.status === 401) navigate('/login');
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createRequest({ ...form, requestedBy: username });
            setMessage('Request submitted! ✅');
            setShowForm(false);
            loadRequests();
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            setMessage('Failed! ❌');
        }
    };

    const handleApprove = async (id) => {
        await approveRequest(id, username);
        loadRequests();
    };

    const handleReject = async (id) => {
        const reason = prompt('Rejection reason:');
        if (reason) {
            await rejectRequest(id, reason);
            loadRequests();
        }
    };

    const statusColors = {
        'PENDING': '#8764b8',
        'APPROVED': '#107c10',
        'REJECTED': '#d83b01',
        'COMPLETED': '#0078d4'
    };

    if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><p>Loading...</p></div>;

    return (
        <div style={{ fontFamily: 'Segoe UI, Arial, sans-serif', minHeight: '100vh', background: '#f3f2f1' }}>

            <div style={{ background: '#8764b8', color: 'white', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: '600', fontSize: '18px' }}>📋 Equipment Requests</span>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={() => setShowForm(!showForm)}
                            style={{ background: 'white', color: '#8764b8', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: '600' }}>
                        + New Request
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
                        <h3 style={{ color: '#8764b8', marginTop: 0 }}>Submit Equipment Request</h3>
                        <form onSubmit={handleSubmit}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                {[
                                    { label: 'Equipment Name', key: 'equipmentName', placeholder: 'Signal Generator SG-001' },
                                    { label: 'Your Email', key: 'researcherEmail', placeholder: 'researcher@microsoft.com' },
                                    { label: 'Start Date', key: 'startDate', type: 'date' },
                                    { label: 'End Date', key: 'endDate', type: 'date' },
                                    { label: 'Justification', key: 'justification', placeholder: 'Need for qubit experiment' }
                                ].map(field => (
                                    <div key={field.key}>
                                        <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: '600' }}>{field.label}</label>
                                        <input
                                            type={field.type || 'text'}
                                            placeholder={field.placeholder}
                                            value={form[field.key]}
                                            onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                                            style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '13px', boxSizing: 'border-box' }}
                                        />
                                    </div>
                                ))}
                                <div>
                                    <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: '600' }}>Priority</label>
                                    <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}
                                            style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '13px' }}>
                                        <option>LOW</option>
                                        <option>NORMAL</option>
                                        <option>HIGH</option>
                                        <option>URGENT</option>
                                    </select>
                                </div>
                            </div>
                            <div style={{ marginTop: '16px', display: 'flex', gap: '12px' }}>
                                <button type="submit" style={{ background: '#8764b8', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '4px', cursor: 'pointer', fontWeight: '600' }}>
                                    Submit Request
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
                        <tr style={{ background: '#8764b8', color: 'white' }}>
                            {['Request #', 'Equipment', 'Requested By', 'Priority', 'Dates', 'Status', 'Actions'].map(h => (
                                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px' }}>{h}</th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {requests.map((r, i) => (
                            <tr key={r.id} style={{ background: i % 2 === 0 ? 'white' : '#f9f9f9', borderBottom: '1px solid #e0e0e0' }}>
                                <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: '600', color: '#8764b8' }}>{r.requestNumber}</td>
                                <td style={{ padding: '12px 16px', fontSize: '13px' }}>{r.equipmentName}</td>
                                <td style={{ padding: '12px 16px', fontSize: '13px' }}>{r.requestedBy}</td>
                                <td style={{ padding: '12px 16px' }}>
                                        <span style={{ background: r.priority === 'HIGH' || r.priority === 'URGENT' ? '#d83b01' : '#8764b8', color: 'white', padding: '4px 8px', borderRadius: '12px', fontSize: '11px' }}>
                                            {r.priority}
                                        </span>
                                </td>
                                <td style={{ padding: '12px 16px', fontSize: '12px', color: '#666' }}>
                                    {r.startDate} → {r.endDate}
                                </td>
                                <td style={{ padding: '12px 16px' }}>
                                        <span style={{ background: statusColors[r.status] || '#666', color: 'white', padding: '4px 10px', borderRadius: '12px', fontSize: '12px' }}>
                                            {r.status}
                                        </span>
                                </td>
                                <td style={{ padding: '12px 16px' }}>
                                    {(role === 'ADMIN' || role === 'LAB_MANAGER') && r.status === 'PENDING' && (
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button onClick={() => handleApprove(r.id)}
                                                    style={{ background: '#107c10', color: 'white', border: 'none', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>
                                                ✓ Approve
                                            </button>
                                            <button onClick={() => handleReject(r.id)}
                                                    style={{ background: '#d83b01', color: 'white', border: 'none', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>
                                                ✗ Reject
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    {requests.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '48px', color: '#666' }}>No requests found!</div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Requests;