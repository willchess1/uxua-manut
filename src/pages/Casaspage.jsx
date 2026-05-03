// src/pages/CasasPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCasas } from '../hooks/useCasas';

export default function CasasPage() {
  const { profile, loading: authLoading } = useAuth();
  const { casas, loading: loadingCasas, error: casasError } = useCasas();
  const navigate = useNavigate();

  // Lógica de carregamento
  if (authLoading || loadingCasas) {
    return <div style={pageStyle}>Carregando Casas...</div>;
  }

  // Lógica de permissão
  if (!profile || (profile.role !== 'gerente' && profile.role !== 'supervisor')) {
    navigate('/dashboard', { replace: true });
    return null;
  }

  if (casasError) {
    return <div style={pageStyle}>Erro ao carregar casas: {casasError}</div>;
  }

  const handleIniciarVistoria = (casaId) => {
    navigate(`/vistorias/nova?casaId=${casaId}`);
  };

  // Função auxiliar para exibir "Sim" ou "Não" para booleanos
  const formatBoolean = (value) => (value ? 'Sim' : 'Não');

  return (
    <div style={pageStyle}>
      <h1 style={titleStyle}>Gestão de Casas</h1>
      <div style={casasListStyle}>
        {casas.length === 0 ? (
          <p style={{ color: '#9ca3af' }}>Nenhuma casa encontrada.</p>
        ) : (
          casas.map((casa) => (
            <div key={casa.id} style={casaCardStyle}>
              <h2 style={casaTitleStyle}>{casa.nome} ({casa.sigla})</h2>
              <p style={casaInfoStyle}>Número: {casa.numero}</p>
              <p style={casaInfoStyle}>Suítes: {casa.suites}</p>
              <p style={casaInfoStyle}>Localização: {casa.localizacao}</p>

              <div style={featuresGridStyle}>
                <p style={featureItemStyle}>Piscina: {formatBoolean(casa.tem_piscina)} {casa.tem_piscina && `(${casa.piscina_tipo})`}</p>
                <p style={featureItemStyle}>Ofurô: {formatBoolean(casa.tem_ofuro)}</p>
                <p style={featureItemStyle}>Jacuzzi: {formatBoolean(casa.tem_jacuzzi)}</p>
                <p style={featureItemStyle}>Cozinha: {formatBoolean(casa.tem_cozinha)}</p>
                <p style={featureItemStyle}>Chuveiro Externo: {formatBoolean(casa.tem_chuveiro_externo)}</p>
                <p style={featureItemStyle}>Fogão: {formatBoolean(casa.tem_fogao)}</p>
                <p style={featureItemStyle}>Sauna: {formatBoolean(casa.tem_sauna)}</p>
                <p style={featureItemStyle}>Área Social: {formatBoolean(casa.tem_area_social)}</p>
                <p style={featureItemStyle}>Sala de Massagem: {formatBoolean(casa.tem_sala_massagem)}</p>
              </div>

              <button
                onClick={() => handleIniciarVistoria(casa.id)}
                style={buttonStyle}
              >
                Iniciar Vistoria
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// Estilos básicos para a página (podes reutilizar os da VistoriaPage ou criar novos)
const pageStyle = {
  maxWidth: '900px',
  margin: '20px auto',
  padding: '20px',
  background: '#1e1e3a',
  borderRadius: '16px',
  color: 'white',
  fontFamily: 'system-ui, sans-serif',
};

const titleStyle = {
  fontSize: '28px',
  fontWeight: 'bold',
  marginBottom: '20px',
  color: '#60a5fa',
  textAlign: 'center',
};

const casasListStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
  gap: '20px',
  marginTop: '20px',
};

const casaCardStyle = {
  background: 'rgba(255,255,255,0.05)',
  borderRadius: '12px',
  padding: '15px',
  border: '1px solid rgba(255,255,255,0.1)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
};

const casaTitleStyle = {
  fontSize: '20px',
  fontWeight: 'bold',
  color: '#a78bfa',
  marginBottom: '10px',
};

const casaInfoStyle = {
  fontSize: '14px',
  color: '#d1d5db',
  marginBottom: '5px', // Reduzido para melhor espaçamento
};

const featuresGridStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr', // Duas colunas para as características
  gap: '5px 10px', // Espaçamento entre as características
  marginTop: '10px',
  marginBottom: '15px',
  borderTop: '1px solid rgba(255,255,255,0.05)',
  paddingTop: '10px',
};

const featureItemStyle = {
  fontSize: '13px',
  color: '#9ca3af',
  margin: 0, // Remove margem padrão do parágrafo
};

const buttonStyle = {
  padding: '10px 15px',
  borderRadius: '8px',
  border: 'none',
  background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
  color: 'white',
  fontSize: '16px',
  fontWeight: 'bold',
  cursor: 'pointer',
  marginTop: '10px',
  transition: 'background 0.3s ease',
};