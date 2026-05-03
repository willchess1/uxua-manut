// src/hooks/useCasas.js
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useCasas() {
  const [casas, setCasas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCasas() {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from('casas')
          .select('*')
          .order('nome', { ascending: true });

        if (error) throw error;
        setCasas(data || []);
      } catch (err) {
        setError(err.message);
        console.error('Erro ao buscar casas:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchCasas();
  }, []); // Dependência vazia para carregar apenas uma vez na montagem

  return { casas, loading, error };
}