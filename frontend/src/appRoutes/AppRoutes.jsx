import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import PrivateRoute from '../components/PrivateRoute';
import Navbar from '../components/Navbar';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ConsumerDashboard from '../pages/consumer/ConsumerDashboard';
import CreateComplaint from '../pages/consumer/CreateComplaint';
import AgentDashboard from '../pages/agent/AgentDashboard';
import SupportDashboard from '../pages/support/SupportDashboard';
import AdminDashboard from '../pages/admin/AdminDashboard';
import ComplaintModal from '../components/common/ComplaintModal';
import StaffManagement from '../pages/admin/StaffManagement';
import TenantDetails from '../pages/tenant/TenantDetails';
import TotalComplaints from '../pages/admin/TotalComplaints';
import ManagerDashboard from '../pages/manager/ManagerDashboard';

function AppRoutes() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register />} />
          
          <Route
            path="/consumer"
            element={
              <PrivateRoute allowedRoles={['consumer']}>
                <ConsumerDashboard />
              </PrivateRoute>
            }
          />
          
          <Route
            path="/consumer/new-complaint"
            element={
              <PrivateRoute allowedRoles={['consumer']}>
                <CreateComplaint />
              </PrivateRoute>
            }
          />
          <Route
            path="/complaint/:id"
            element={
              <PrivateRoute allowedRoles={['consumer','hm','ha','admin','sp']}>
                <ComplaintModal />
              </PrivateRoute>
            }
          />
          
          <Route
            path="/agent"
            element={
              <PrivateRoute allowedRoles={['ha']}>
                <AgentDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/manager"
            element={
              <PrivateRoute allowedRoles={['hm']}>
                <ManagerDashboard />
              </PrivateRoute>
            }
          />
          
          <Route
            path="/support"
            element={
              <PrivateRoute allowedRoles={['sp']}>
                <SupportDashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <PrivateRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          
          <Route
            path="/admin/staff"
            element={
              <PrivateRoute allowedRoles={['admin']}>
                <StaffManagement />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/tenants"
            element={
              <PrivateRoute allowedRoles={['admin']}>
                <TenantDetails />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/complaints"
            element={
              <PrivateRoute allowedRoles={['admin']}>
                <TotalComplaints/>
              </PrivateRoute>
            }
          />
          
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/unauthorized" element={<div className="p-8 text-center"><h1 className="text-2xl">Access Denied</h1></div>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default AppRoutes;