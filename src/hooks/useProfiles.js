// src/hooks/useProfiles.js
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useProfiles(filters = {}) {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const abortController = new AbortController(); // Cria um AbortController
    const signal = abortController.signal; // Obtém o sinal para passar à requisição

    async function fetchProfiles() {
      setLoading(true);
      setError(null); // Limpa erros anteriores
      try {
        let query = supabase
          .from('profiles')
          .select('*') // Seleciona todas as colunas
          .order('nome', { ascending: true }); // Ordena por nome

        // Aplica filtros se existirem
        if (filters.role) {
          if (Array.isArray(filters.role)) {
            query = query.in('role', filters.role); // Filtra por múltiplos roles
          } else {
            query = query.eq('role', filters.role); // Filtra por um único role
          }
        }
        if (filters.search) {
          query = query.ilike('nome', `%${filters.search}%`); // Filtra por nome (case-insensitive)
        }

        // Executa a query, passando o signal para permitir o abort
        const { data, error } = await query.abortSignal(signal); // Supabase v2 usa .abortSignal()

        if (error) {
          // Se o erro for um AbortError, não o trata como um erro de aplicação
          if (error.name === 'AbortError') {
            console.log('Fetch de perfis abortado (componente desmontado ou requisição cancelada)');
          } else {
            throw error; // Lança outros erros para serem capturados pelo catch
          }
        } else {
          setProfiles(data || []); // Atualiza os perfis
        }
      } catch (err) {
        // Captura e define o erro, se não for um AbortError
        if (err.name !== 'AbortError') {
          setError(err.message);
          console.error('Erro ao buscar perfis:', err);
        }
      } finally {
        // Garante que o estado de carregamento seja definido como false
        // a menos que a requisição tenha sido abortada e o componente já não esteja montado
        if (!signal.aborted) { // Verifica se o sinal não foi abortado antes de definir loading como false
          setLoading(false);
        }
      }
    }

    fetchProfiles();

    // Função de limpeza: aborta a requisição se o componente for desmontado
    return () => {
      abortController.abort();
    };
  }, [filters.role, filters.search]); // Dependências do useEffect

  return { profiles, loading, error };
}