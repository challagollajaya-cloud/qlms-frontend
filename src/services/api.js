import axios from 'axios';

const API_GATEWAY = 'http://135.237.251.99:8080';

const getHeaders = () => ({
    headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
    }
});

// Auth
export const login = (username, password) =>
    axios.post(`${API_GATEWAY}/api/auth/login`, {
        username,
        password
    });

// Inventory
export const getEquipment = () =>
    axios.get(`${API_GATEWAY}/api/inventory/equipment`, getHeaders());

export const addEquipment = (equipment) =>
    axios.post(`${API_GATEWAY}/api/inventory/equipment`, equipment, getHeaders());

export const deleteEquipment = (id) =>
    axios.delete(`${API_GATEWAY}/api/inventory/equipment/${id}`, getHeaders());

// Shipments
export const getShipments = () =>
    axios.get(`${API_GATEWAY}/api/shipments`, getHeaders());

export const createShipment = (shipment) =>
    axios.post(`${API_GATEWAY}/api/shipments`, shipment, getHeaders());

export const updateShipmentStatus = (id, status) =>
    axios.put(
        `${API_GATEWAY}/api/shipments/${id}/status?status=${status}`,
        {},
        getHeaders()
    );

// Requests
export const getRequests = () =>
    axios.get(`${API_GATEWAY}/api/requests`, getHeaders());

export const createRequest = (request) =>
    axios.post(`${API_GATEWAY}/api/requests`, request, getHeaders());

export const approveRequest = (id, approvedBy) =>
    axios.put(
        `${API_GATEWAY}/api/requests/${id}/approve?approvedBy=${approvedBy}`,
        {},
        getHeaders()
    );

export const rejectRequest = (id, reason) =>
    axios.put(
        `${API_GATEWAY}/api/requests/${id}/reject?reason=${reason}`,
        {},
        getHeaders()
    );

// Notifications
export const getNotifications = () =>
    axios.get(`${API_GATEWAY}/api/notifications`, getHeaders());