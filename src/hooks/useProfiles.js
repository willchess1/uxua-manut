import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useProfiles(filterRole = null, filterSearch = null) {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchProfiles() {
      setLoading(true);
      setError(null);

      try {
        let query = supabase
          .from('profiles')
          .select('*')
          .order('nome', { ascending: true });

        // Aplica filtro de role
        if (filterRole) {
          if (Array.isArray(filterRole)) {
            query = query.in('role', filterRole);
          } else {
            query = query.eq('role', filterRole);
          }
        }

        // Aplica filtro de pesquisa
        if (filterSearch) {
          query = query.ilike('nome', `%${filterSearch}%`);
        }

        const { data, error } = await query;

        if (!isMounted) return; // Componente desmontado, ignora

        if (error) throw error;

        setProfiles(data || []);

      } catch (err) {
        if (isMounted) {
          setError(err.message);
          console.error('Erro ao buscar perfis:', err);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchProfiles();

    return () => { isMounted = false; };

  }, [JSON.stringify(filterRole), filterSearch]); // ✅ Evita loop com arrays!

  return { profiles, loading, error };
}