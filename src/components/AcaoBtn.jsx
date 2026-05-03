// src/components/AcaoBtn.jsx
import React from 'react'

export default function AcaoBtn({ emoji, label, cor, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: `linear-gradient(135deg, ${cor}, ${cor}d0)`, // Cor mais escura
        border: 'none',
        borderRadius: '12px',
        color: 'white',
        padding: '12px 16px',
        fontSize: '14px',
        cursor: 'pointer',
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        flexGrow: 1,
        justifyContent: 'center'
      }}
    >
      <span style={{ fontSize: '18px' }}>{emoji}</span>
      {label}
    </button>
  )
}