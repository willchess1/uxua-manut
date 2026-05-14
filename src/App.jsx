import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginPage from './pages/Login';
import DashboardPage from './pages/Dashboard';
import VistoriasListPage from './pages/Vistorias/VistoriasListPage'; // ✅ Lista
import VistoriaPage from './pages/Vistorias/VistoriaPage';           // ✅ Criar/Editar
import CasasPage from './pages/CasasPage';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div>Carregando autenticação...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route path="/dashboard" element={
            <ProtectedRoute><DashboardPage /></ProtectedRoute>
          } />

          <Route path="/casas" element={
            <ProtectedRoute><CasasPage /></ProtectedRoute>
          } />

          {/* ✅ Lista de vistorias */}
          <Route path="/vistorias" element={
            <ProtectedRoute><VistoriasListPage /></ProtectedRoute>
          } />

          {/* ✅ Nova vistoria - ANTES de /:id para não colidir! */}
          <Route path="/vistorias/nova" element={
            <ProtectedRoute><VistoriaPage /></ProtectedRoute>
          } />

          {/* ✅ Editar vistoria */}
          <Route path="/vistorias/:id" element={
            <ProtectedRoute><VistoriaPage /></ProtectedRoute>
          } />

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;