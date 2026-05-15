// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginPage from './pages/Login';
import DashboardPage from './pages/Dashboard';
import VistoriasListPage from './pages/Vistorias/VistoriasListPage';
import VistoriaPage from './pages/Vistorias/VistoriaPage';
import CasasPage from './pages/CasasPage';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
}

// ✅ AppRoutes DENTRO do AuthProvider
function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={
        <PublicRoute><LoginPage /></PublicRoute>
      } />
      <Route path="/dashboard" element={
        <ProtectedRoute><DashboardPage /></ProtectedRoute>
      } />
      <Route path="/casas" element={
        <ProtectedRoute><CasasPage /></ProtectedRoute>
      } />
      <Route path="/vistorias" element={
        <ProtectedRoute><VistoriasListPage /></ProtectedRoute>
      } />
      <Route path="/vistorias/nova" element={
        <ProtectedRoute><VistoriaPage /></ProtectedRoute>
      } />
      <Route path="/vistorias/:id" element={
        <ProtectedRoute><VistoriaPage /></ProtectedRoute>
      } />
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

// ✅ AuthProvider DENTRO do Router, AppRoutes DENTRO do AuthProvider
function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;