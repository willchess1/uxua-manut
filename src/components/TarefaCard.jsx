// src/components/TarefaCard.jsx
import React from 'react'

export default function TarefaCard({ tarefa, status, tecnico, hora, prioridade }) {
  const statusColors = {
    'pendente': '#f59e0b', // Amarelo
    'em_andamento': '#3b82f6', // Azul
    'concluido': '#22c55e', // Verde
    'cancelado': '#ef4444' // Vermelho
  }
  const prioridadeEmojis = {
    'baixa': '⚪',
    'normal': '🔵',
    'urgente': '🔴'
  }

  return (
    <div style={{
      background: 'rgba(255,255,255,0.05)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '12px',
      padding: '14px',
      marginBottom: '10px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    }}>
      <div style={{ fontSize: '24px' }}>{prioridadeEmojis[prioridade] || '❓'}</div>
      <div style={{ flexGrow: 1 }}>
        <div style={{ color: 'white', fontWeight: '600', fontSize: '15px' }}>{tarefa}</div>
        <div style={{ color: '#9ca3af', fontSize: '12px', marginTop: '4px' }}>
          {tecnico} • {hora}
        </div>
      </div>
      <div style={{
        background: statusColors[status] ? `${statusColors[status]}20` : 'rgba(255,255,255,0.1)',
        color: statusColors[status] || '#9ca3af',
        padding: '6px 10px',
        borderRadius: '8px',
        fontSize: '11px',
        fontWeight: 'bold',
        textTransform: 'capitalize'
      }}>
        {status.replace('_', ' ')}
      </div>
    </div>
  )
}