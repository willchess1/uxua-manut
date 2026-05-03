// src/pages/Dashboard.jsx

import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useTarefas } from '../hooks/useTarefas'
import { useCasas } from '../hooks/useCasas'
import { supabase } from '../lib/supabase'

// IMPORTAÇÕES DOS COMPONENTES
import StatCard from '../components/StatCard'
import AcaoBtn from '../components/AcaoBtn'
import TarefaCard from '../components/TarefaCard'
import TecnicoCard from '../components/TecnicoCard'


export default function Dashboard() {
  const { user, profile, logout } = useAuth()
  const navigate = useNavigate()
  const [abaAtiva, setAbaAtiva] = useState('inicio')
  const [menuAberto, setMenuAberto] = useState(false)

  // Busca as tarefas do dia
  const { tarefas, loading: loadingTarefas, erro: erroTarefas } = useTarefas({
    data: new Date().toISOString().split('T')[0] // Filtra por data de hoje
  })

  // Busca todas as casas (para usar em filtros ou criação de tarefas)
  const { casas, loading: loadingCasas } = useCasas()

  // Simula dados para as estatísticas
  const tarefasHoje = tarefas.length
  const tarefasConcluidasHoje = tarefas.filter(t => t.status === 'concluido').length
  const tarefasUrgentesHoje = tarefas.filter(t => t.prioridade === 'urgente' && t.status !== 'concluido').length

  // Simula equipe ativa (precisaríamos de uma tabela de técnicos ou status online)
  const equipeAtiva = 4 // Placeholder

  async function handleLogout() {
    await logout()
    navigate('/login')
  }

  const role = profile?.role || 'tecnico'
  const nome = profile?.nome || 'Utilizador'

  const saudacao = () => {
    const hora = new Date().getHours()
    if (hora < 12) return 'Bom dia'
    if (hora < 18) return 'Boa tarde'
    return 'Boa noite'
  }

  // Abas disponíveis por role
  const abas = {
    gerente: [
      { id: 'inicio', emoji: '🏠', label: 'Início' },
      { id: 'equipe', emoji: '👥', label: 'Equipe' },
      { id: 'tarefas', emoji: '📋', label: 'Tarefas' },
      { id: 'escalas', emoji: '📅', label: 'Escalas' },
      { id: 'relatorios', emoji: '📊', label: 'Relatórios' },
    ],
    supervisor: [
      { id: 'inicio', emoji: '🏠', label: 'Início' },
      { id: 'equipe', emoji: '👥', label: 'Equipe' },
      { id: 'tarefas', emoji: '📋', label: 'Tarefas' },
      { id: 'escalas', emoji: '📅', label: 'Escalas' },
    ],
    tecnico: [
      { id: 'inicio', emoji: '🏠', label: 'Início' },
      { id: 'tarefas', emoji: '📋', label: 'Minhas Tarefas' },
      { id: 'escalas', emoji: '📅', label: 'Minha Escala' },
    ],
  }

  const minhasAbas = abas[role] || abas.tecnico

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%)',
      fontFamily: 'system-ui, sans-serif',
      color: 'white'
    }}>

      {/* ── HEADER ── */}
      <div style={{
        background: 'rgba(255,255,255,0.03)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        padding: '0 20px',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backdropFilter: 'blur(10px)'
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '28px' }}>🏠</span>
          <div>
            <div style={{ fontWeight: 'bold', fontSize: '16px', lineHeight: 1 }}>UXUA</div>
            <div style={{ color: '#9ca3af', fontSize: '10px' }}>Manutenção</div>
          </div>
        </div>

        {/* Avatar + menu */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setMenuAberto(!menuAberto)}
            style={{
              background: 'rgba(59,130,246,0.2)',
              border: '1px solid rgba(59,130,246,0.4)',
              borderRadius: '50px',
              padding: '8px 16px',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px'
            }}
          >
            <span>👤</span>
            <span style={{ fontWeight: '600' }}>{nome}</span>
            <span style={{ fontSize: '10px' }}>{menuAberto ? '▲' : '▼'}</span>
          </button>

          {menuAberto && (
            <div style={{
              position: 'absolute',
              right: 0,
              top: '48px',
              background: '#1e1e3a',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
              padding: '8px',
              minWidth: '180px',
              zIndex: 200
            }}>
              <div style={{
                padding: '10px 14px',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
                marginBottom: '8px'
              }}>
                <div style={{ color: 'white', fontWeight: '600', fontSize: '14px' }}>{nome}</div>
                <div style={{
                  color: '#60a5fa',
                  fontSize: '11px',
                  textTransform: 'capitalize',
                  marginTop: '2px'
                }}>
                  {role === 'gerente' ? '👑 Gerente' :
                    role === 'supervisor' ? '🔧 Supervisor' : '🛠️ Técnico'}
                </div>
              </div>
              <button
                onClick={handleLogout}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  background: 'rgba(239,68,68,0.1)',
                  border: '1px solid rgba(239,68,68,0.2)',
                  borderRadius: '8px',
                  color: '#f87171',
                  cursor: 'pointer',
                  fontSize: '14px',
                  textAlign: 'left'
                }}
              >
                🚪 Sair
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── CONTEÚDO ── */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '24px 16px 100px' }}>

        {/* Saudação */}
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 'bold' }}>
            {saudacao()}, {nome}! 👋
          </h2>
          <p style={{ margin: '4px 0 0', color: '#9ca3af', fontSize: '14px' }}>
            {new Date().toLocaleDateString('pt-BR', {
              weekday: 'long', day: 'numeric', month: 'long'
            })}
          </p>
        </div>

        {/* ── ABA: INÍCIO ── */}
        {abaAtiva === 'inicio' && (
          <div>
            {/* Stats */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '24px' }}>
              <StatCard emoji="📋" label="Tarefas Hoje" valor={tarefasHoje} cor="#3b82f6" />
              <StatCard emoji="✅" label="Concluídas" valor={tarefasConcluidasHoje} cor="#22c55e" />
              <StatCard emoji="⚠️" label="Urgentes" valor={tarefasUrgentesHoje} cor="#ef4444" />
              {role !== 'tecnico' && (
                <StatCard emoji="👥" label="Equipe Ativa" valor={equipeAtiva} cor="#a78bfa" />
              )}
            </div>

             {/* Ações rápidas */}
            <div style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '16px',
              padding: '20px',
              marginBottom: '24px'
            }}>
              <h3 style={{ margin: '0 0 16px', fontSize: '15px', color: '#d1d5db' }}>
                ⚡ Ações Rápidas
              </h3>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <AcaoBtn emoji="➕" label="Nova Tarefa" cor="#3b82f6"
                  onClick={() => setAbaAtiva('tarefas')} />
                <AcaoBtn emoji="📅" label="Ver Escala" cor="#a78bfa"
                  onClick={() => setAbaAtiva('escalas')} />
                {role !== 'tecnico' && (
                  <AcaoBtn emoji="👥" label="Ver Equipe" cor="#22c55e"
                    onClick={() => setAbaAtiva('equipe')} />
                )}
                {role === 'gerente' && (
                  <AcaoBtn emoji="📊" label="Relatório" cor="#f59e0b"
                    onClick={() => setAbaAtiva('relatorios')} />
                )}
                {(role === 'gerente' || role === 'supervisor') && (
                  <AcaoBtn emoji="🏠" label="Gerenciar Casas" cor="#f59e0b" // Cor laranja, ou outra que preferires
                    onClick={() => navigate('/casas')} /> // Navega para a nova rota /casas
                )}
                {(role === 'gerente' || role === 'supervisor') && (
                  <AcaoBtn emoji="🔍" label="Nova Vistoria" cor="#8b5cf6"
                    onClick={() => navigate('/vistorias/nova')} />
                )}
              </div>
            </div>

            {/* Tarefas recentes */}
            <div style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '16px',
              padding: '20px'
            }}>
              <h3 style={{ margin: '0 0 16px', fontSize: '15px', color: '#d1d5db' }}>
                📋 Tarefas de Hoje
              </h3>
              {loadingTarefas ? (
                <p style={{ color: '#9ca3af', textAlign: 'center' }}>Carregando tarefas...</p>
              ) : erroTarefas ? (
                <p style={{ color: '#ef4444', textAlign: 'center' }}>Erro: {erroTarefas}</p>
              ) : tarefas.length === 0 ? (
                <p style={{ color: '#9ca3af', textAlign: 'center' }}>Nenhuma tarefa para hoje.</p>
              ) : (
                tarefas.map(tarefa => (
                  <TarefaCard
                    key={tarefa.id}
                    tarefa={`${tarefa.titulo} (${tarefa.casa?.nome || 'N/A'})`}
                    status={tarefa.status}
                    tecnico={tarefa.tecnico?.nome || 'Não atribuído'}
                    hora={tarefa.hora_inicio ? tarefa.hora_inicio.substring(0, 5) : 'N/A'}
                    prioridade={tarefa.prioridade}
                  />
                ))
              )}
            </div>
          </div>
        )}

        {/* ── ABA: EQUIPE ── */}
        {abaAtiva === 'equipe' && (
          <div>
            <div style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '16px',
              padding: '20px'
            }}>
              <h3 style={{ margin: '0 0 16px', fontSize: '15px', color: '#d1d5db' }}>
                👥 Equipe de Manutenção
              </h3>
              {/* Aqui vamos buscar os técnicos reais */}
              <TecnicoCard nome="Keny" emoji="🛠️" status="Disponível" tarefas={3} />
              <TecnicoCard nome="Tiago" emoji="🔧" status="Em tarefa" tarefas={5} />
              <TecnicoCard nome="Viviane" emoji="👑" status="Disponível" tarefas={1} />
              <TecnicoCard nome="Admin" emoji="⚙️" status="Offline" tarefas={0} />
            </div>
          </div>
        )}

        {/* ── ABA: TAREFAS ── */}
        {abaAtiva === 'tarefas' && (
          <div>
            {/* Filtros */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
              {['Todas', 'Pendente', 'Em andamento', 'Concluído'].map(f => (
                <button key={f} style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  background: f === 'Todas' ? '#3b82f6' : 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'white',
                  fontSize: '13px',
                  cursor: 'pointer'
                }}>{f}</button>
              ))}
            </div>

            <div style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '16px',
              padding: '20px'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px'
              }}>
                <h3 style={{ margin: 0, fontSize: '15px', color: '#d1d5db' }}>
                  📋 Lista de Tarefas
                </h3>
                <button style={{
                  background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                  border: 'none',
                  borderRadius: '10px',
                  color: 'white',
                  padding: '8px 16px',
                  fontSize: '13px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}>
                  ➕ Nova
                </button>
              </div>

              {loadingTarefas ? (
                <p style={{ color: '#9ca3af', textAlign: 'center' }}>Carregando tarefas...</p>
              ) : erroTarefas ? (
                <p style={{ color: '#ef4444', textAlign: 'center' }}>Erro: {erroTarefas}</p>
              ) : tarefas.length === 0 ? (
                <p style={{ color: '#9ca3af', textAlign: 'center' }}>Nenhuma tarefa encontrada.</p>
              ) : (
                tarefas.map(tarefa => (
                  <TarefaCard
                    key={tarefa.id}
                    tarefa={`${tarefa.titulo} (${tarefa.casa?.nome || 'N/A'})`}
                    status={tarefa.status}
                    tecnico={tarefa.tecnico?.nome || 'Não atribuído'}
                    hora={tarefa.hora_inicio ? tarefa.hora_inicio.substring(0, 5) : 'N/A'}
                    prioridade={tarefa.prioridade}
                  />
                ))
              )}
            </div>
          </div>
        )}

        {/* ── ABA: ESCALAS ── */}
        {abaAtiva === 'escalas' && (
          <div>
            <div style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '16px',
              padding: '20px',
              marginBottom: '16px'
            }}>
              <h3 style={{ margin: '0 0 16px', fontSize: '15px', color: '#d1d5db' }}>
                📅 Escala da Semana
              </h3>

              {['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'].map((dia, i) => (
                <div key={dia} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '12px',
                  borderRadius: '10px',
                  background: i === 1 ? 'rgba(59,130,246,0.1)' : 'transparent',
                  border: i === 1 ? '1px solid rgba(59,130,246,0.3)' : '1px solid transparent',
                  marginBottom: '6px'
                }}>
                  <div style={{
                    width: '70px',
                    color: i === 1 ? '#60a5fa' : '#9ca3af',
                    fontSize: '13px',
                    fontWeight: i === 1 ? '700' : '400'
                  }}>
                    {dia} {i === 1 ? '📍' : ''}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: 'white', fontSize: '13px', fontWeight: '500' }}>
                      {['08:00 - 16:00', '08:00 - 16:00', 'FOLGA', '12:00 - 20:00', '08:00 - 16:00', '08:00 - 12:00'][i]}
                    </div>
                    <div style={{ color: '#9ca3af', fontSize: '11px' }}>
                      {['Turno normal', 'Turno normal', '—', 'Turno tarde', 'Turno normal', 'Meio turno'][i]}
                    </div>
                  </div>
                  <div style={{
                    color: ['#22c55e', '#3b82f6', '#6b7280', '#f59e0b', '#22c55e', '#a78bfa'][i],
                    fontSize: '18px'
                  }}>
                    {['✅', '🔵', '😴', '🌙', '✅', '⭐'][i]}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── ABA: RELATÓRIOS (só gerente) ── */}
        {abaAtiva === 'relatorios' && role === 'gerente' && (
          <div>
            <div style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '16px',
              padding: '20px'
            }}>
              <h3 style={{ margin: '0 0 16px', fontSize: '15px', color: '#d1d5db' }}>
                📊 Relatório Mensal
              </h3>

              {[
                { label: 'Tarefas Concluídas', valor: tarefasConcluidasHoje, total: tarefasHoje, cor: '#22c55e' },
                { label: 'Taxa de Conclusão', valor: tarefasHoje > 0 ? Math.round((tarefasConcluidasHoje / tarefasHoje) * 100) : 0, total: 100, cor: '#3b82f6' },
                { label: 'Urgências Resolvidas', valor: tarefasUrgentesHoje, total: tarefasUrgentesHoje + tarefas.filter(t => t.prioridade === 'urgente' && t.status === 'pendente').length, cor: '#ef4444' },
              ].map(item => (
                <div key={item.label} style={{ marginBottom: '16px' }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '6px'
                  }}>
                    <span style={{ color: '#d1d5db', fontSize: '13px' }}>{item.label}</span>
                    <span style={{ color: item.cor, fontSize: '13px', fontWeight: '700' }}>
                      {item.valor}/{item.total}
                    </span>
                  </div>
                  <div style={{
                    height: '8px',
                    borderRadius: '4px',
                    background: 'rgba(255,255,255,0.08)'
                  }}>
                    <div style={{
                      height: '100%',
                      borderRadius: '4px',
                      background: item.cor,
                      width: `${(item.valor / item.total) * 100}%`,
                      transition: 'width 0.5s ease'
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* ── BOTTOM NAV (mobile + desktop) ── */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'rgba(15,15,26,0.95)',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        backdropFilter: 'blur(10px)',
        padding: '8px 16px 12px',
        display: 'flex',
        justifyContent: 'center',
        gap: '4px',
        zIndex: 100
      }}>
        {minhasAbas.map(aba => (
          <button
            key={aba.id}
            onClick={() => setAbaAtiva(aba.id)}
            style={{
              flex: 1,
              maxWidth: '120px',
              padding: '8px 4px',
              background: abaAtiva === aba.id
                ? 'rgba(59,130,246,0.2)'
                : 'transparent',
              border: abaAtiva === aba.id
                ? '1px solid rgba(59,130,246,0.4)'
                : '1px solid transparent',
              borderRadius: '12px',
              color: abaAtiva === aba.id ? '#60a5fa' : '#6b7280',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              transition: 'all 0.2s'
            }}
          >
            <span style={{ fontSize: '20px' }}>{aba.emoji}</span>
            <span style={{ fontSize: '10px', fontWeight: '600' }}>{aba.label}</span>
          </button>
        ))}
      </div>

    </div>
  )
}