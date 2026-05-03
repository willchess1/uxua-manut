// src/contexts/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true); // Apenas para o carregamento inicial da sessão

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
          setLoading(false); // Garante que o loading é sempre definido como false após a sessão inicial
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
        // Não definimos setLoading(false) aqui, pois o loading principal já foi definido por getInitialSession
        // Este handler apenas atualiza user/profile.
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // A função login agora apenas chama o Supabase e retorna o erro
  async function login(email, password) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  }

  // A função logout agora apenas chama o Supabase
  async function logout() {
    await supabase.auth.signOut();
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}