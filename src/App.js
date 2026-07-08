import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Equipment from './pages/Equipment';
import Shipments from './pages/Shipments';
import Requests from './pages/Requests';
import Notifications from './pages/Notifications';

function App() {
  const isLoggedIn = localStorage.getItem('token');

  return (
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route
              path="/dashboard"
              element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />}
          />

          <Route
              path="/equipment"
              element={isLoggedIn ? <Equipment /> : <Navigate to="/login" />}
          />

          <Route
              path="/shipments"
              element={isLoggedIn ? <Shipments /> : <Navigate to="/login" />}
          />

          <Route
              path="/requests"
              element={isLoggedIn ? <Requests /> : <Navigate to="/login" />}
          />

          <Route
              path="/notifications"
              element={isLoggedIn ? <Notifications /> : <Navigate to="/login" />}
          />

          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;