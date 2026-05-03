// src/hooks/useTarefas.js
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useTarefas(filtros = {}) {
  const [tarefas, setTarefas] = useState([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState(null)

  async function buscarTarefas() {
    setLoading(true)
    try {
      let query = supabase
        .from('tarefas')
        .select(`
          *,
          casa:casas(id, nome),
          tecnico:profiles!tarefas_tecnico_id_fkey(id, nome),
          criador:profiles!tarefas_criado_por_fkey(id, nome)
        `)
        .order('created_at', { ascending: false })
  // Filtros opcionais
  if (filtros.status) query = query.eq('status', filtros.status)
  if (filtros.tecnico_id) query = query.eq('tecnico_id', filtros.tecnico_id)
  if (filtros.data) query = query.eq('data_prevista', filtros.data)
  if (filtros.prioridade) query = query.eq('prioridade', filtros.prioridade)

  const { data, error } = await query

  if (error) throw error
  setTarefas(data || [])
} catch (err) {
  setErro(err.message)
  console.error('Erro ao buscar tarefas:', err)
} finally {
  setLoading(false)
}
  }

  async function criarTarefa(novaTarefa) {
    try {
      const { data, error } = await supabase
        .from('tarefas')
        .insert([novaTarefa])
        .select()
  if (error) throw error
  await buscarTarefas()
  return { sucesso: true, data }
} catch (err) {
  console.error('Erro ao criar tarefa:', err)
  return { sucesso: false, erro: err.message }
}
  }

  async function atualizarTarefa(id, campos) {
    try {
      const { error } = await supabase
        .from('tarefas')
        .update({ ...campos, updated_at: new Date().toISOString() })
        .eq('id', id)
  if (error) throw error
  await buscarTarefas()
  return { sucesso: true }
} catch (err) {
  console.error('Erro ao atualizar tarefa:', err)
  return { sucesso: false, erro: err.message }
}
  }

  async function apagarTarefa(id) {
    try {
      const { error } = await supabase
        .from('tarefas')
        .delete()
        .eq('id', id)
  if (error) throw error
  await buscarTarefas()
  return { sucesso: true }
} catch (err) {
  console.error('Erro ao apagar tarefa:', err)
  return { sucesso: false, erro: err.message }
}
  }

  async function mudarStatus(id, novoStatus) {
    return atualizarTarefa(id, { status: novoStatus })
  }

  useEffect(() => {
    buscarTarefas()
  }, [filtros.status, filtros.tecnico_id, filtros.data, filtros.prioridade])

  return {
    tarefas,
    loading,
    erro,
    buscarTarefas,
    criarTarefa,
    atualizarTarefa,
    apagarTarefa,
    mudarStatus
  }
}