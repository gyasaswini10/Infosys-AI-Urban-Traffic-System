import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import AdminDashboard from './components/AdminDashboard';
import FleetManagerDashboard from './components/FleetManagerDashboard';
import CustomerDashboard from './components/CustomerDashboard';
import Projecthomepage from './components/Projecthomepage';
import Dashboard from './components/Dashboard';
import './App.css';

// Protected Route Wrapper
const ProtectedRoute = ({ children, allowedRoles }) => {
  const userStr = sessionStorage.getItem("user");
  if (!userStr) return <Navigate to="/login" replace />;

  const user = JSON.parse(userStr);
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />; // Or unauthorized page
  }

  // Clone element to pass user props if it's a valid React element
  if (React.isValidElement(children)) {
    return React.cloneElement(children, { role: user.role, userid: user.email });
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Projecthomepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Dispatcher Route */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Admin Route (Role 1) */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={[1]}>
            <AdminDashboard />
          </ProtectedRoute>
        } />

        {/* Fleet Manager Route (Role 2) */}
        <Route path="/fleet-manager" element={
          <ProtectedRoute allowedRoles={[2]}>
            <FleetManagerDashboard />
          </ProtectedRoute>
        } />

        {/* Driver Route (Role 3) - Reuses AdminDashboard logic */}
        <Route path="/driver" element={
          <ProtectedRoute allowedRoles={[3]}>
            <AdminDashboard />
          </ProtectedRoute>
        } />

        {/* Customer Route (Role 4) */}
        <Route path="/customer" element={
          <ProtectedRoute allowedRoles={[4]}>
            <CustomerDashboard />
          </ProtectedRoute>
        } />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
