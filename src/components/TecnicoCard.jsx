// src/components/TecnicoCard.jsx
import React from 'react'

export default function TecnicoCard({ nome, emoji, status, tarefas }) {
  const statusColor = status === 'Disponível' ? '#22c55e' : status === 'Em tarefa' ? '#f59e0b' : '#6b7280'
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
      <div style={{ fontSize: '24px' }}>{emoji}</div>
      <div style={{ flexGrow: 1 }}>
        <div style={{ color: 'white', fontWeight: '600', fontSize: '15px' }}>{nome}</div>
        <div style={{ color: statusColor, fontSize: '12px', marginTop: '4px' }}>
          {status}
        </div>
      </div>
      <div style={{
        background: 'rgba(255,255,255,0.1)',
        color: '#9ca3af',
        padding: '6px 10px',
        borderRadius: '8px',
        fontSize: '11px',
        fontWeight: 'bold'
      }}>
        {tarefas} tarefas
      </div>
    </div>
  )
}