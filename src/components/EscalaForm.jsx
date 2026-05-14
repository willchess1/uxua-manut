// src/components/EscalaForm.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase'; // Ajusta o caminho se necessário

export default function EscalaForm({ onSave, initialData = null }) {
  const [funcionarios, setFuncionarios] = useState([]);
  const [formData, setFormData] = useState({
    funcionario_id: '',
    data_escala: '',
    hora_inicio: '09:00', // Valor padrão
    hora_fim: '17:00',   // Valor padrão
    observacoes: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchFuncionarios();
  }, []);

  useEffect(() => {
    if (initialData) {
      // Formata a data para 'YYYY-MM-DD' para o input type="date"
      const formattedDate = initialData.data_escala ? new Date(initialData.data_escala).toISOString().split('T')[0] : '';
      setFormData({
        funcionario_id: initialData.funcionario_id || '',
        data_escala: formattedDate,
        hora_inicio: initialData.hora_inicio ? initialData.hora_inicio.substring(0, 5) : '09:00',
        hora_fim: initialData.hora_fim ? initialData.hora_fim.substring(0, 5) : '17:00',
        observacoes: initialData.observacoes || '',
      });
    }
  }, [initialData]);

  async function fetchFuncionarios() {
    setLoading(true);
    const { data, error } = await supabase
      .from('users') // Busca da tabela 'users'
      .select('id, nome, cargo')
      .order('nome', { ascending: true });

    if (error) {
      console.error('Erro ao buscar funcionários:', error);
      setError('Erro ao carregar lista de funcionários.');
    } else {
      setFuncionarios(data);
    }
    setLoading(false);
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    // Validação básica
    if (!formData.funcionario_id || !formData.data_escala || !formData.hora_inicio || !formData.hora_fim) {
      setError('Todos os campos obrigatórios devem ser preenchidos.');
      setIsSubmitting(false);
      return;
    }

    let result;
    if (initialData) {
      // Editar escala existente
      result = await supabase
        .from('escalas')
        .update(formData)
        .eq('id', initialData.id)
        .select();
    } else {
      // Adicionar nova escala
      result = await supabase
        .from('escalas')
        .insert([formData])
        .select();
    }

    if (result.error) {
      console.error('Erro ao salvar escala:', result.error);
      setError(`Erro ao salvar escala: ${result.error.message}`);
    } else {
      onSave(result.data[0]); // Chama a função onSave com os dados salvos
      setFormData({ // Limpa o formulário após salvar, se for uma nova entrada
        funcionario_id: '',
        data_escala: '',
        hora_inicio: '09:00',
        hora_fim: '17:00',
        observacoes: '',
      });
    }
    setIsSubmitting(false);
  };

  if (loading) {
    return <div className="p-4 text-white">Carregando funcionários para o formulário...</div>;
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">{initialData ? 'Editar Escala' : 'Adicionar Nova Escala'}</h2>
      {error && <p className="bg-red-500 text-white p-3 rounded mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="funcionario_id" className="block text-sm font-medium text-gray-300">Funcionário</label>
          <select
            id="funcionario_id"
            name="funcionario_id"
            value={formData.funcionario_id}
            onChange={handleChange}
            className="mt-1 block w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
            required
          >
            <option value="">Selecione um funcionário</option>
            {funcionarios.map((func) => (
              <option key={func.id} value={func.id}>
                {func.nome} ({func.cargo})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="data_escala" className="block text-sm font-medium text-gray-300">Data da Escala</label>
          <input
            type="date"
            id="data_escala"
            name="data_escala"
            value={formData.data_escala}
            onChange={handleChange}
            className="mt-1 block w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
            required
          />
        </div>
        <div>
          <label htmlFor="hora_inicio" className="block text-sm font-medium text-gray-300">Hora de Início</label>
          <input
            type="time"
            id="hora_inicio"
            name="hora_inicio"
            value={formData.hora_inicio}
            onChange={handleChange}
            className="mt-1 block w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
            required
          />
        </div>
        <div>
          <label htmlFor="hora_fim" className="block text-sm font-medium text-gray-300">Hora de Fim</label>
          <input
            type="time"
            id="hora_fim"
            name="hora_fim"
            value={formData.hora_fim}
            onChange={handleChange}
            className="mt-1 block w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
            required
          />
        </div>
        <div className="md:col-span-2">
          <label htmlFor="observacoes" className="block text-sm font-medium text-gray-300">Observações (Folga, Férias, etc.)</label>
          <input
            type="text"
            id="observacoes"
            name="observacoes"
            value={formData.observacoes}
            onChange={handleChange}
            className="mt-1 block w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
          />
        </div>
        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300"
          >
            {isSubmitting ? 'Salvando...' : (initialData ? 'Atualizar Escala' : 'Adicionar Escala')}
          </button>
        </div>
      </form>
    </div>
  );
}