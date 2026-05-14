import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

export default function VistoriasListPage() {
  const navigate = useNavigate();
  const { profile, loading: authLoading } = useAuth();
  const [vistorias, setVistorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtroStatus, setFiltroStatus] = useState('todos');

  useEffect(() => {
    async function fetchVistorias() {
      setLoading(true);
      let query = supabase
        .from('vistorias')
        .select(`
          *,
          casa:casas(id, nome),
          feita_por:profiles(id, nome)
        `)
        .order('created_at', { ascending: false });

      if (filtroStatus !== 'todos') {
        query = query.eq('status', filtroStatus);
      }

      const { data, error } = await query;

      if (error) {
        setError(error.message);
        console.error('Erro ao buscar vistorias:', error);
      } else {
        setVistorias(data || []);
      }
      setLoading(false);
    }

    fetchVistorias();
  }, [filtroStatus]);

  const statusColor = {
    aberta: '#3b82f6',
    em_andamento: '#f59e0b',
    concluida: '#10b981',
  };

  const statusLabel = {
    aberta: '🔵 Aberta',
    em_andamento: '🟡 Em Andamento',
    concluida: '🟢 Concluída',
  };

  const tipoLabel = {
    saida: 'Saída',
    periodica: 'Periódica',
    preventiva: 'Preventiva',
  };

  const podeGerir = profile?.role === 'gerente' || profile?.role === 'supervisor';

  if (authLoading || loading) {
    return <div style={pageStyle}>⏳ A carregar vistorias...</div>;
  }

  if (error) {
    return <div style={pageStyle}>❌ Erro: {error}</div>;
  }

  return (
    <div style={pageStyle}>

      {/* Header */}
      <div style={headerStyle}>
        <h1 style={titleStyle}>📋 Vistorias</h1>
        {podeGerir && (
          <button
            onClick={() => navigate('/vistorias/nova')}
            style={buttonStyle}
          >
            + Nova Vistoria
          </button>
        )}
      </div>

      {/* Filtros de Status */}
      <div style={filtrosStyle}>
        {['todos', 'aberta', 'em_andamento', 'concluida'].map((s) => (
          <button
            key={s}
            onClick={() => setFiltroStatus(s)}
            style={{
              ...filtroButtonStyle,
              background: filtroStatus === s ? '#3b82f6' : 'rgba(255,255,255,0.05)',
              fontWeight: filtroStatus === s ? 'bold' : 'normal',
            }}
          >
            {s === 'todos' ? '📋 Todos' :
             s === 'aberta' ? '🔵 Abertas' :
             s === 'em_andamento' ? '🟡 Em Andamento' : '🟢 Concluídas'}
          </button>
        ))}
      </div>

      {/* Contador */}
      <p style={{ color: '#9ca3af', marginBottom: '16px', fontSize: '14px' }}>
        {vistorias.length} vistoria{vistorias.length !== 1 ? 's' : ''} encontrada{vistorias.length !== 1 ? 's' : ''}
      </p>

      {/* Lista vazia */}
      {vistorias.length === 0 && (
        <div style={emptyStyle}>
          <p style={{ fontSize: '48px', margin: '0' }}>🔍</p>
          <p>Nenhuma vistoria encontrada.</p>
          {podeGerir && (
            <button onClick={() => navigate('/vistorias/nova')} style={buttonStyle}>
              Criar primeira vistoria
            </button>
          )}
        </div>
      )}

      {/* Cards de vistorias */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {vistorias.map((v) => (
          <div
            key={v.id}
            onClick={() => navigate(`/vistorias/${v.id}`)}
            style={cardStyle}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
          >
            {/* Linha 1 - Casa e Status */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, color: '#60a5fa', fontSize: '18px' }}>
                🏠 {v.casa?.nome || 'Casa não definida'}
              </h3>
              <span style={{
                background: statusColor[v.status] || '#6b7280',
                color: 'white',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '13px',
                fontWeight: 'bold',
                whiteSpace: 'nowrap',
              }}>
                {statusLabel[v.status] || v.status}
              </span>
            </div>

            {/* Linha 2 - Tipo e Técnico */}
            <div style={{ display: 'flex', gap: '20px', marginTop: '8px', color: '#9ca3af', fontSize: '14px', flexWrap: 'wrap' }}>
              <span>🔧 {tipoLabel[v.tipo] || v.tipo}</span>
              <span>👤 {v.feita_por?.nome || 'Não atribuído'}</span>
            </div>

            {/* Linha 3 - Data e ID */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', color: '#6b7280', fontSize: '13px' }}>
              <span>
                📅 {new Date(v.created_at).toLocaleDateString('pt-PT', {
                  day: '2-digit', month: '2-digit', year: 'numeric',
                  hour: '2-digit', minute: '2-digit'
                })}
              </span>
              <span style={{ fontFamily: 'monospace' }}>
                #{v.id.substring(0, 8)}
              </span>
            </div>

            {/* Observações */}
            {v.observacoes && (
              <div style={{
                marginTop: '8px',
                color: '#d1d5db',
                fontSize: '14px',
                fontStyle: 'italic',
                borderTop: '1px solid rgba(255,255,255,0.05)',
                paddingTop: '8px'
              }}>
                "{v.observacoes.length > 120
                  ? v.observacoes.substring(0, 120) + '...'
                  : v.observacoes}"
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Botão voltar */}
      <button
        onClick={() => navigate('/dashboard')}
        style={{ ...buttonStyle, background: 'rgba(255,255,255,0.1)', marginTop: '24px', width: '100%' }}
      >
        ← Voltar ao Dashboard
      </button>

    </div>
  );
}

// Estilos
const pageStyle = {
  maxWidth: '900px',
  margin: '20px auto',
  padding: '20px',
  background: '#1e1e3a',
  borderRadius: '16px',
  color: 'white',
  fontFamily: 'system-ui, sans-serif',
  minHeight: '400px',
};

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '20px',
};

const titleStyle = {
  fontSize: '28px',
  fontWeight: 'bold',
  color: '#60a5fa',
  margin: 0,
};

const buttonStyle = {
  padding: '10px 20px',
  borderRadius: '10px',
  border: 'none',
  background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
  color: 'white',
  fontSize: '15px',
  fontWeight: 'bold',
  cursor: 'pointer',
};

const filtrosStyle = {
  display: 'flex',
  gap: '8px',
  marginBottom: '16px',
  flexWrap: 'wrap',
};

const filtroButtonStyle = {
  padding: '6px 14px',
  borderRadius: '20px',
  border: '1px solid rgba(255,255,255,0.15)',
  color: 'white',
  fontSize: '13px',
  cursor: 'pointer',
};

const cardStyle = {
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '12px',
  padding: '16px',
  cursor: 'pointer',
  transition: 'background 0.2s',
};

const emptyStyle = {
  textAlign: 'center',
  padding: '40px',
  color: '#9ca3af',
};