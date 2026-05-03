// src/components/StatCard.jsx
import React from 'react'

export default function StatCard({ emoji, label, valor, cor }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '16px',
      padding: '16px',
      width: 'calc(50% - 6px)', // Para 2 por linha em mobile
      maxWidth: '180px', // Limite em desktop
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center'
    }}>
      <div style={{ fontSize: '28px', marginBottom: '8px' }}>{emoji}</div>
      <div style={{ color: '#9ca3af', fontSize: '12px', marginBottom: '4px' }}>{label}</div>
      <div style={{ color: cor, fontSize: '24px', fontWeight: 'bold' }}>{valor}</div>
    </div>
  )
}