// App.jsx (Exemplo)
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginPage from './pages/Login';
import DashboardPage from './pages/Dashboard';
import VistoriaPage from './pages/Vistorias/VistoriaPage';
import CasasPage from './pages/CasasPage'; // Importa a nova página

// Componente de rota protegida
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Carregando autenticação...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/casas" element={<ProtectedRoute><CasasPage /></ProtectedRoute>} /> {/* Nova rota */}
          <Route path="/vistorias/nova" element={<ProtectedRoute><VistoriaPage /></ProtectedRoute>} />
          <Route path="/vistorias/:id" element={<ProtectedRoute><VistoriaPage /></ProtectedRoute>} /> {/* Para editar vistoria */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          {/* Adiciona outras rotas protegidas aqui */}
        </Routes>
      </AuthProvider>
    </Router>
  );
}