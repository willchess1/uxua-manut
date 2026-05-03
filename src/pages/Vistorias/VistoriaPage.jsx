// src/pages/Vistorias/VistoriaPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom'; // Importa useLocation
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { useCasas } from '../../hooks/useCasas';
import { useProfiles } from '../../hooks/useProfiles';

export default function VistoriaPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation(); // Hook para aceder à query string

  const { profile, loading: authLoading } = useAuth();
  const { casas, loading: loadingCasas } = useCasas();
  const { profiles, loading: loadingProfiles } = useProfiles({ role: ['tecnico', 'supervisor'] });

  const [vistoria, setVistoria] = useState(null);
  const [loadingVistoriaData, setLoadingVistoriaData] = useState(true);
  const [error, setError] = useState(null);
  const [isNewVistoria, setIsNewVistoria] = useState(!id);
  const [selectedCasa, setSelectedCasa] = useState('');
  const [tipoVistoria, setTipoVistoria] = useState('saida');
  const [observacoes, setObservacoes] = useState('');
  const [status, setStatus] = useState('aberta');
  const [assignedTo, setAssignedTo] = useState('');

  // NOVO: useEffect para ler o casaId da URL quando a página é nova
  useEffect(() => {
    if (isNewVistoria) {
      const params = new URLSearchParams(location.search);
      const casaIdFromUrl = params.get('casaId');
      if (casaIdFromUrl) {
        setSelectedCasa(casaIdFromUrl);
      }
    }
  }, [isNewVistoria, location.search]); // Executa quando a página é nova ou a URL muda

  useEffect(() => {
    async function fetchVistoria() {
      if (id) {
        setLoadingVistoriaData(true);
        const { data, error } = await supabase
          .from('vistorias')
          .select(`
            *,
            casa:casas(id, nome),
            feita_por:profiles(id, nome)
          `)
          .eq('id', id)
          .single();

        if (error) {
          setError(error.message);
          console.error('Erro ao buscar vistoria:', error);
        } else {
          setVistoria(data);
          setSelectedCasa(data.casa_id);
          setTipoVistoria(data.tipo);
          setObservacoes(data.observacoes || '');
          setStatus(data.status);
          setAssignedTo(data.feita_por?.id || '');
        }
        setLoadingVistoriaData(false);
      } else {
        setLoadingVistoriaData(false);
      }
    }
    fetchVistoria();
  }, [id]);

  const handleSaveVistoria = async () => {
    if (!selectedCasa) {
      alert('Por favor, selecione uma casa.');
      return;
    }

    setLoadingVistoriaData(true);
    setError(null);

    const vistoriaData = {
      casa_id: selectedCasa,
      tipo: tipoVistoria,
      observacoes: observacoes,
      status: status,
      feita_por: assignedTo || null,
    };

    let result;
    if (isNewVistoria) {
      result = await supabase
        .from('vistorias')
        .insert([vistoriaData])
        .select();
    } else {
      result = await supabase
        .from('vistorias')
        .update(vistoriaData)
        .eq('id', id)
        .select();
    }

    if (result.error) {
      setError(result.error.message);
      console.error('Erro ao salvar vistoria:', result.error);
    } else {
      alert(`Vistoria ${isNewVistoria ? 'criada' : 'atualizada'} com sucesso!`);
      navigate(`/vistorias/${result.data[0].id}`);
    }
    setLoadingVistoriaData(false);
  };

  // Lógica de carregamento e permissão
  if (authLoading || loadingCasas || loadingProfiles || loadingVistoriaData) {
    return <div style={pageStyle}>Carregando...</div>;
  }

  // Verifica a permissão APÓS o carregamento de TUDO
  if (!profile || (profile.role !== 'gerente' && profile.role !== 'supervisor')) {
    navigate('/dashboard', { replace: true });
    return null;
  }

  if (error) {
    return <div style={pageStyle}>Erro: {error}</div>;
  }

  return (
    <div style={pageStyle}>
      <h1 style={titleStyle}>{isNewVistoria ? 'Nova Vistoria' : `Vistoria #${vistoria?.id.substring(0, 8)}`}</h1>

      <div style={formGroupStyle}>
        <label style={labelStyle}>Casa:</label>
        <select
          style={inputStyle}
          value={selectedCasa}
          onChange={(e) => setSelectedCasa(e.target.value)}
          disabled={!isNewVistoria && vistoria?.status !== 'aberta'}
        >
          <option value="">Selecione uma casa</option>
          {casas.map((casa) => (
            <option key={casa.id} value={casa.id}>
              {casa.nome}
            </option>
          ))}
        </select>
      </div>

      <div style={formGroupStyle}>
        <label style={labelStyle}>Tipo de Vistoria:</label>
        <select
          style={inputStyle}
          value={tipoVistoria}
          onChange={(e) => setTipoVistoria(e.target.value)}
        >
          <option value="saida">Saída (Check-out)</option>
          <option value="periodica">Periódica</option>
          <option value="preventiva">Preventiva</option>
        </select>
      </div>

      <div style={formGroupStyle}>
        <label style={labelStyle}>Observações Iniciais:</label>
        <textarea
          style={{ ...inputStyle, minHeight: '80px' }}
          value={observacoes}
          onChange={(e) => setObservacoes(e.target.value)}
          placeholder="Descreva o objetivo da vistoria ou condições iniciais..."
        />
      </div>

      <div style={formGroupStyle}>
        <label style={labelStyle}>Status:</label>
        <select
          style={inputStyle}
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="aberta">Aberta</option>
          <option value="em_andamento">Em Andamento</option>
          <option value="concluida">Concluída</option>
        </select>
      </div>

      <div style={formGroupStyle}>
        <label style={labelStyle}>Atribuir a:</label>
        <select
          style={inputStyle}
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
        >
          <option value="">Não atribuído</option>
          {profiles.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nome} ({p.role})
            </option>
          ))}
        </select>
      </div>

      <button onClick={handleSaveVistoria} style={buttonStyle}>
        {isNewVistoria ? 'Criar Vistoria' : 'Atualizar Vistoria'}
      </button>

      {!isNewVistoria && (
        <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <h2 style={subtitleStyle}>Itens da Vistoria</h2>
          <p style={{ color: '#9ca3af' }}>
            (Funcionalidade de adicionar/editar itens e fotos será implementada aqui)
          </p>
        </div>
      )}
    </div>
  );
}

// Estilos básicos para a página
const pageStyle = {
  maxWidth: '800px',
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

const subtitleStyle = {
  fontSize: '22px',
  fontWeight: 'bold',
  marginBottom: '15px',
  color: '#a78bfa',
};

const formGroupStyle = {
  marginBottom: '15px',
};

const labelStyle = {
  display: 'block',
  marginBottom: '5px',
  fontWeight: '600',
  color: '#d1d5db',
};

const inputStyle = {
  width: '100%',
  padding: '10px',
  borderRadius: '8px',
  border: '1px solid rgba(255,255,255,0.1)',
  background: 'rgba(255,255,255,0.05)',
  color: 'white',
  fontSize: '16px',
  boxSizing: 'border-box',
};

const buttonStyle = {
  width: '100%',
  padding: '12px 20px',
  borderRadius: '10px',
  border: 'none',
  background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
  color: 'white',
  fontSize: '18px',
  fontWeight: 'bold',
  cursor: 'pointer',
  marginTop: '20px',
  transition: 'background 0.3s ease',
};