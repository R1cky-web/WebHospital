import { useState } from 'react'
import { useApp } from '../contexts/AppContext'
import { useAuth } from '../contexts/AuthContext'
import './Cola.css'

export default function Cola() {
  const { data, getSpecialty, getDoctor, getQueueByDateAndSpecialty, updateAppointmentStatus } = useApp()
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'
  const [filterDate, setFilterDate] = useState(new Date().toISOString().slice(0, 10))
  const [filterSpecialty, setFilterSpecialty] = useState('')

  const filteredQueue = filterSpecialty
    ? getQueueByDateAndSpecialty(filterDate, filterSpecialty)
    : data.appointments.filter(a => a.date === filterDate).sort((a, b) => a.queueNumber - b.queueNumber)

  const now = new Date()
  const currentTimeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`

  const activeCount = filteredQueue.filter(a => a.status === 'confirmed' || a.status === 'pending').length
  const attendedCount = filteredQueue.filter(a => a.status === 'attended').length
  const cancelledCount = filteredQueue.filter(a => a.status === 'cancelled').length

  return (
    <div className="cola-page">
      <div className="container page-content">
        <div className="cola-header">
          <div>
            <h1>📋 Cola de Atención</h1>
            <p>Consulte el orden de atención. El que llega primero, elige su especialidad.</p>
          </div>
        </div>

        <div className="cola-stats-row">
          <div className="cola-stat" style={{ background: 'linear-gradient(135deg, #e3f2fd, #bbdefb)' }}>
            <span className="cola-stat-num" style={{ color: '#1565c0' }}>{activeCount}</span>
            <span className="cola-stat-label">En Espera</span>
          </div>
          <div className="cola-stat" style={{ background: 'linear-gradient(135deg, #e8f5e9, #c8e6c9)' }}>
            <span className="cola-stat-num" style={{ color: '#2e7d32' }}>{attendedCount}</span>
            <span className="cola-stat-label">Atendidos</span>
          </div>
          <div className="cola-stat" style={{ background: 'linear-gradient(135deg, #fce4ec, #f8bbd0)' }}>
            <span className="cola-stat-num" style={{ color: '#c62828' }}>{cancelledCount}</span>
            <span className="cola-stat-label">Cancelados</span>
          </div>
        </div>

        <div className="cola-filters">
          <div className="cola-filter-group">
            <label>📅 Fecha</label>
            <input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)} />
          </div>
          <div className="cola-filter-group">
            <label>🏥 Especialidad</label>
            <select value={filterSpecialty} onChange={e => setFilterSpecialty(e.target.value)}>
              <option value="">Todas</option>
              {data.specialties.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
        </div>

        {filteredQueue.length === 0 ? (
          <div className="cola-empty">
            <div className="cola-empty-icon">📭</div>
            <h3>No hay citas para esta fecha</h3>
            <p>No se encontraron citas agendadas para los filtros seleccionados.</p>
          </div>
        ) : (
          <div className="cola-list">
            {filteredQueue.map((app, idx) => {
              const specialty = getSpecialty(app.specialtyId)
              const doctor = getDoctor(app.doctorId)
              const isPast = app.time < currentTimeStr && app.date === new Date().toISOString().slice(0, 10)
              const isNext = idx < 3 && app.status === 'confirmed' && !isPast
              return (
                <div key={app.id} className={`cola-item ${app.status === 'attended' ? 'attended' : app.status === 'cancelled' ? 'cancelled' : isNext ? 'next' : ''}`}>
                  <div className="cola-item-pos">
                    <span className="cola-pos-num">#{app.queueNumber}</span>
                    {isNext && <span className="cola-pos-badge">SIGUIENTE</span>}
                  </div>
                  <div className="cola-item-info">
                    <div className="cola-item-name">{app.patientName}</div>
                    <div className="cola-item-meta">
                      <span>{specialty?.icon} {specialty?.name}</span>
                      <span>👨‍⚕️ {doctor?.name}</span>
                    </div>
                  </div>
                  <div className="cola-item-time">{app.time}</div>
                  <div className="cola-item-status">
                    {app.status === 'cancelled' ? <span className="status-badge cancelled">Cancelada</span>
                    : app.status === 'attended' ? <span className="status-badge attended">Atendido</span>
                    : isPast ? <span className="status-badge pending">Pendiente</span>
                    : <span className="status-badge waiting">En espera</span>}
                  </div>
                  {isAdmin && (
                    <div className="cola-item-actions">
                      {app.status !== 'attended' && app.status !== 'cancelled' && (
                        <button className="btn-action attend" onClick={() => updateAppointmentStatus(app.id, 'attended')} title="Atendido">✅</button>
                      )}
                      {app.status !== 'cancelled' && (
                        <button className="btn-action cancel" onClick={() => { if (window.confirm(`¿Cancelar cita de ${app.patientName}?`)) updateAppointmentStatus(app.id, 'cancelled') }} title="Cancelar">❌</button>
                      )}
                      {app.status === 'cancelled' && (
                        <button className="btn-action reactivate" onClick={() => updateAppointmentStatus(app.id, 'confirmed')} title="Reactivar">🔄</button>
                      )}
                      {app.status === 'attended' && (
                        <button className="btn-action revert" onClick={() => updateAppointmentStatus(app.id, 'confirmed')} title="Revertir">↩️</button>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        <div className="cola-info">
          <h3>¿Cómo funciona la cola?</h3>
          <p>El sistema de colas funciona bajo el principio de <strong>"el que llega primero, elige su cita o especialidad según el día"</strong>. Al reservar su cita, se le asigna un número de cola. El día de su cita, la atención se realiza en orden numérico ascendente. Llegue puntualmente para no perder su turno.</p>
        </div>
      </div>
    </div>
  )
}
