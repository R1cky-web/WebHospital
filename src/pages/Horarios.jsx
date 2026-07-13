import { useState } from 'react'
import { useApp } from '../contexts/AppContext'
import { useAuth } from '../contexts/AuthContext'
import './Horarios.css'

const daysOrder = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
const days = daysOrder
const dayColors = {
  Lunes: { bg: '#e3f2fd', color: '#1565c0', border: '#90caf9' },
  Martes: { bg: '#e8f5e9', color: '#2e7d32', border: '#a5d6a7' },
  Miércoles: { bg: '#fff3e0', color: '#e65100', border: '#ffcc80' },
  Jueves: { bg: '#f3e5f5', color: '#6a1b9a', border: '#ce93d8' },
  Viernes: { bg: '#e0f7fa', color: '#00695c', border: '#80deea' },
  Sábado: { bg: '#fce4ec', color: '#c62828', border: '#ef9a9a' },
}

export default function Horarios() {
  const { data, getSpecialty, getDoctor, addSchedule, updateSchedule, deleteSchedule, addDoctor, deleteDoctor } = useApp()
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'
  const [editing, setEditing] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ specialtyId: '', doctorId: '', day: 'Lunes', startTime: '08:00', endTime: '14:00', maxPatients: 20 })
  const [showDoctorForm, setShowDoctorForm] = useState(false)
  const [doctorForm, setDoctorForm] = useState({ name: '', specialtyId: '' })
  const [activeDay, setActiveDay] = useState(daysOrder[0])

  const resetForm = () => {
    setForm({ specialtyId: '', doctorId: '', day: 'Lunes', startTime: '08:00', endTime: '14:00', maxPatients: 20 })
    setEditing(null); setShowForm(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.specialtyId || !form.doctorId) return
    if (editing) updateSchedule(editing, { ...form, specialtyId: Number(form.specialtyId), doctorId: Number(form.doctorId), maxPatients: Number(form.maxPatients) })
    else addSchedule({ ...form, specialtyId: Number(form.specialtyId), doctorId: Number(form.doctorId), maxPatients: Number(form.maxPatients) })
    resetForm()
  }

  const handleEdit = (s) => {
    setEditing(s.id); setForm({ specialtyId: String(s.specialtyId), doctorId: String(s.doctorId), day: s.day, startTime: s.startTime, endTime: s.endTime, maxPatients: s.maxPatients })
    setShowForm(true); window.scrollTo(0, 0)
  }
  const handleDelete = (id) => { if (window.confirm('¿Eliminar este horario?')) deleteSchedule(id) }
  const handleDoctorSubmit = (e) => {
    e.preventDefault()
    if (!doctorForm.name.trim() || !doctorForm.specialtyId) return
    addDoctor({ name: doctorForm.name, specialtyId: Number(doctorForm.specialtyId) })
    setDoctorForm({ name: '', specialtyId: '' }); setShowDoctorForm(false)
  }
  const handleDeleteDoctor = (id, name) => { if (window.confirm(`¿Eliminar al médico "${name}"?`)) deleteDoctor(id) }

  const filteredDoctors = form.specialtyId ? data.doctors.filter(d => d.specialtyId === Number(form.specialtyId)) : []
  const groupedSchedules = [...data.schedules].sort((a, b) => daysOrder.indexOf(a.day) - daysOrder.indexOf(b.day))
  const schedulesByDay = daysOrder.reduce((acc, d) => {
    acc[d] = groupedSchedules.filter(s => s.day === d)
    return acc
  }, {})

  return (
    <div className="horarios-page">
      <div className="container page-content">
        <div className="horarios-header">
          <div>
            <h1>📅 Horarios de Atención</h1>
            <p>Consulte los horarios disponibles por especialidad y médico.</p>
          </div>
          {isAdmin && (
            <div className="horarios-actions">
              <button className="btn btn-outline-primary" onClick={() => { setDoctorForm({ name: '', specialtyId: '' }); setShowDoctorForm(!showDoctorForm) }}>
                {showDoctorForm ? '✕ Cancelar' : '👨‍⚕️ + Médico'}
              </button>
              <button className="btn btn-primary" onClick={() => { resetForm(); setShowForm(!showForm) }}>
                {showForm ? '✕ Cancelar' : '📅 + Horario'}
              </button>
            </div>
          )}
        </div>

        {isAdmin && showDoctorForm && (
          <div className="horarios-form-card">
            <h3>👨‍⚕️ Agregar Médico</h3>
            <form onSubmit={handleDoctorSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Nombre del Médico</label>
                  <input className="form-input" required value={doctorForm.name} onChange={e => setDoctorForm(f => ({ ...f, name: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Especialidad</label>
                  <select className="form-select" required value={doctorForm.specialtyId} onChange={e => setDoctorForm(f => ({ ...f, specialtyId: e.target.value }))}>
                    <option value="">-- Seleccione --</option>
                    {data.specialties.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
              </div>
              <button type="submit" className="btn btn-success">Agregar Médico</button>
            </form>
          </div>
        )}

        {isAdmin && showForm && (
          <div className="horarios-form-card">
            <h3>{editing ? '✏️ Editar Horario' : '📅 Nuevo Horario'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Especialidad</label>
                  <select className="form-select" value={form.specialtyId} onChange={e => setForm(f => ({ ...f, specialtyId: e.target.value, doctorId: '' }))} required>
                    <option value="">-- Seleccione --</option>
                    {data.specialties.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Médico</label>
                  <select className="form-select" value={form.doctorId} onChange={e => setForm(f => ({ ...f, doctorId: e.target.value }))} required>
                    <option value="">-- Seleccione --</option>
                    {filteredDoctors.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Día</label>
                  <select className="form-select" value={form.day} onChange={e => setForm(f => ({ ...f, day: e.target.value }))}>
                    {days.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Pacientes por día</label>
                  <input className="form-input" type="number" min={1} value={form.maxPatients} onChange={e => setForm(f => ({ ...f, maxPatients: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Hora Inicio</label>
                  <input className="form-input" type="time" value={form.startTime} onChange={e => setForm(f => ({ ...f, startTime: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Hora Fin</label>
                  <input className="form-input" type="time" value={form.endTime} onChange={e => setForm(f => ({ ...f, endTime: e.target.value }))} />
                </div>
              </div>
              <button type="submit" className="btn btn-success">{editing ? 'Actualizar' : 'Agregar'}</button>
            </form>
          </div>
        )}

        {isAdmin && data.doctors.length > 0 && (
          <div className="horarios-doctors-section">
            <h3>👨‍⚕️ Médicos Registrados</h3>
            <div className="doctors-grid">
              {data.doctors.map(d => {
                const specialty = getSpecialty(d.specialtyId)
                return (
                  <div key={d.id} className="doctor-chip">
                    <span>{d.name}</span>
                    <span className="doctor-chip-spec">{specialty?.icon} {specialty?.name}</span>
                    <button className="doctor-chip-del" onClick={() => handleDeleteDoctor(d.id, d.name)} title="Eliminar">✕</button>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        <div className="day-tabs">
          {daysOrder.map(d => {
            const count = schedulesByDay[d]?.length || 0
            const colors = dayColors[d]
            return (
              <button key={d} className={`day-tab ${activeDay === d ? 'active' : ''}`}
                style={activeDay === d ? { background: colors.bg, color: colors.color, borderColor: colors.border } : {}}
                onClick={() => setActiveDay(d)}>
                <span>{d.slice(0, 3)}</span>
                <span className="day-tab-count">{count}</span>
              </button>
            )
          })}
        </div>

        {groupedSchedules.length === 0 ? (
          <div className="horarios-empty">
            <div className="empty-icon">📅</div>
            <h3>No hay horarios disponibles</h3>
            <p>Consulte más tarde o contacte al hospital.</p>
          </div>
        ) : (
          <div className="schedule-cards">
            {schedulesByDay[activeDay]?.length > 0 ? schedulesByDay[activeDay].map(schedule => {
              const specialty = getSpecialty(schedule.specialtyId)
              const doctor = getDoctor(schedule.doctorId)
              const colors = dayColors[schedule.day]
              return (
                <div key={schedule.id} className="schedule-card" style={{ borderLeftColor: colors.color }}>
                  <div className="schedule-card-top">
                    <span className="schedule-spec">{specialty?.icon} {specialty?.name}</span>
                    <span className="schedule-doctor">👨‍⚕️ {doctor?.name}</span>
                  </div>
                  <div className="schedule-card-bottom">
                    <span className="schedule-time">🕐 {schedule.startTime} - {schedule.endTime}</span>
                    <span className="schedule-patients">👥 {schedule.maxPatients} pacientes</span>
                  </div>
                  {isAdmin && (
                    <div className="schedule-card-actions">
                      <button className="btn btn-warning btn-sm" onClick={() => handleEdit(schedule)}>✏️ Editar</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(schedule.id)}>🗑️ Eliminar</button>
                    </div>
                  )}
                </div>
              )
            }) : (
              <div className="horarios-empty">
                <div className="empty-icon">📭</div>
                <h3>Sin horarios este día</h3>
                <p>No hay horarios registrados para {activeDay}.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
