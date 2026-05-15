// src/contexts/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  async function fetchProfile(userId) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Erro ao buscar perfil:', error);
      setProfile(null);
      return null;
    } else {
      setProfile(data ?? null);
      return data ?? null;
    }
  }

  useEffect(() => {
    let isMounted = true;

    async function getInitialSession() {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error("Erro ao obter sessão inicial:", error);
          if (isMounted) {
            setUser(null);
            setProfile(null);
          }
        } else {
          if (isMounted) {
            setUser(session?.user ?? null);
          }
          if (session?.user) {
            await fetchProfile(session.user.id);
          } else {
            if (isMounted) {
              setProfile(null);
            }
          }
        }
      } catch (err) {
        console.error("Erro inesperado no getInitialSession:", err);
        if (isMounted) {
          setUser(null);
          setProfile(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (isMounted) {
        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setProfile(null);
        }
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function login(email, password) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  }

  async function logout() {
    await supabase.auth.signOut();
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, login, logout }}>
      {!loading ? children : (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          background: '#1e1e3a',
          color: 'white',
          fontSize: '18px',
          fontFamily: 'system-ui, sans-serif',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <span style={{ fontSize: '40px' }}>⏳</span>
          <span>A carregar sessão...</span>
        </div>
      )}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}