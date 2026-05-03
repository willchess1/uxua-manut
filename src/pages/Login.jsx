// src/pages/Login.jsx
import { useState, useEffect } from 'react'; // Importa useEffect
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loadingForm, setLoadingForm] = useState(false); // Renomeado para evitar conflito com o loading do AuthContext
  const { login, user, loading: authLoading } = useAuth(); // Pega o user e o loading do AuthContext
  const navigate = useNavigate();

  // useEffect para redirecionar quando o utilizador estiver autenticado
  useEffect(() => {
    // Se o AuthContext já terminou de carregar (authLoading é false)
    // E se houver um utilizador autenticado (user não é null)
    // Então, redireciona para o dashboard.
    if (!authLoading && user) {
      navigate('/dashboard', { replace: true }); // Usa replace para não voltar para o login
    }
  }, [user, authLoading, navigate]); // Dependências: user, authLoading e navigate

  async function handleLogin(e) {
    e.preventDefault();
    setErro('');
    setLoadingForm(true); // Ativa o carregamento do botão do formulário

    try {
      const { error } = await login(email, senha);

      if (error) {
        setErro('Email ou senha incorretos!');
      } else {
        // Se o login for bem-sucedido, o useEffect acima vai lidar com o redirecionamento
        // assim que o AuthContext atualizar o 'user'.
        // Não precisamos de um navigate aqui.
      }
    } catch (err) {
      console.error("Erro inesperado durante o login:", err);
      setErro("Ocorreu um erro inesperado. Tente novamente.");
    } finally {
      setLoadingForm(false); // Desativa o carregamento do botão do formulário, independentemente do resultado
    }
  }

  // Se o AuthContext estiver a carregar a sessão inicial, podemos mostrar um carregamento global
  if (authLoading) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '24px' }}>Carregando sessão...</div>;
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%)'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '420px',
        padding: '40px',
        borderRadius: '16px',
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        backdropFilter: 'blur(10px)'
      }}>

        {/* LOGO */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '48px', marginBottom: '8px' }}>🏠</div>
          <h1 style={{ color: 'white', fontSize: '28px', fontWeight: 'bold', margin: 0 }}>
            UXUA
          </h1>
          <p style={{ color: '#9ca3af', fontSize: '14px', marginTop: '4px' }}>
            Sistema de Manutenção
          </p>
          <div style={{
            width: '60px',
            height: '3px',
            background: '#3b82f6',
            margin: '12px auto 0',
            borderRadius: '2px'
          }}></div>
        </div>

        {/* FORM */}
        <form onSubmit={handleLogin}>

          {/* EMAIL */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              color: '#d1d5db',
              fontSize: '14px',
              display: 'block',
              marginBottom: '8px'
            }}>
              📧 Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '10px',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
                color: 'white',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* SENHA */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              color: '#d1d5db',
              fontSize: '14px',
              display: 'block',
              marginBottom: '8px'
            }}>
              🔒 Senha
            </label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="••••••••"
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '10px',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
                color: 'white',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* ERRO */}
          {erro && (
            <div style={{
              padding: '12px',
              borderRadius: '8px',
              background: 'rgba(255,0,0,0.1)',
              border: '1px solid rgba(255,0,0,0.2)',
              color: '#f87171',
              fontSize: '14px',
              textAlign: 'center',
              marginBottom: '16px'
            }}>
              ⚠️ {erro}
            </div>
          )}

          {/* BOTÃO */}
          <button
            type="submit"
            disabled={loadingForm} // Usa loadingForm aqui
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '10px',
              background: loadingForm // Usa loadingForm aqui
                ? 'rgba(59,130,246,0.5)'
                : 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              border: 'none',
              color: 'white',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loadingForm ? 'not-allowed' : 'pointer', // Usa loadingForm aqui
              marginTop: '8px'
            }}
          >
            {loadingForm ? '⏳ Entrando...' : '🚀 Entrar'}
          </button>

        </form>

        <p style={{
          textAlign: 'center',
          color: '#6b7280',
          fontSize: '12px',
          marginTop: '32px'
        }}>
          UXUA Manutenção © 2026
        </p>

      </div>
    </div>
  );
}