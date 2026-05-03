// src/components/PrivateRoute.jsx
   import React from 'react';
   import { Navigate } from 'react-router-dom';
   import { useAuth } from '../contexts/AuthContext';

   const PrivateRoute = ({ children }) => {
     const { user, loading } = useAuth();

     // Se ainda estiver a carregar o estado do utilizador, mostra um carregador
     if (loading) {
       return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#1a1a2e', color: 'white' }}>Carregando...</div>;
     }

     // Se o utilizador não estiver autenticado (e já terminou de carregar), redireciona para o login
     if (!user) {
       return <Navigate to="/login" replace />; // 'replace' evita que o utilizador volte para a página protegida
     }

     // Se o utilizador estiver autenticado, renderiza os componentes filhos
     return children;
   };

   export default PrivateRoute;