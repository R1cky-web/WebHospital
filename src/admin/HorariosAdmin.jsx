import { useState } from 'react'
import { useApp } from '../contexts/AppContext'

const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']

export default function HorariosAdmin() {
  const { data, addSchedule, updateSchedule, deleteSchedule, getSpecialty, getDoctor } = useApp()
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({
    specialtyId: '', doctorId: '', day: 'Lunes',
    startTime: '08:00', endTime: '14:00', maxPatients: 20,
  })

  const resetForm = () => {
    setForm({ specialtyId: '', doctorId: '', day: 'Lunes', startTime: '08:00', endTime: '14:00', maxPatients: 20 })
    setEditing(null)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.specialtyId || !form.doctorId) return
    if (editing) {
      updateSchedule(editing, { ...form, specialtyId: Number(form.specialtyId), doctorId: Number(form.doctorId), maxPatients: Number(form.maxPatients) })
    } else {
      addSchedule({ ...form, specialtyId: Number(form.specialtyId), doctorId: Number(form.doctorId), maxPatients: Number(form.maxPatients) })
    }
    resetForm()
  }

  const handleEdit = (schedule) => {
    setEditing(schedule.id)
    setForm({
      specialtyId: String(schedule.specialtyId),
      doctorId: String(schedule.doctorId),
      day: schedule.day,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      maxPatients: schedule.maxPatients,
    })
    window.scrollTo(0, 0)
  }

  const handleDelete = (id) => {
    if (window.confirm('¿Eliminar este horario?')) {
      deleteSchedule(id)
    }
  }

  const filteredDoctors = form.specialtyId
    ? data.doctors.filter(d => d.specialtyId === Number(form.specialtyId))
    : []

  return (
    <div>
      <div className="admin-header">
        <h1>Gestionar Horarios</h1>
        <span style={{ color: 'var(--gray-600)' }}>{data.schedules.length} horarios</span>
      </div>

      <div className="card mb-3">
        <h3 className="mb-2">{editing ? 'Editar Horario' : 'Agregar Horario'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-2">
            <div className="form-group">
              <label className="form-label">Especialidad</label>
              <select className="form-select" value={form.specialtyId}
                onChange={e => {
                  setForm(f => ({ ...f, specialtyId: e.target.value, doctorId: '' }))
                }} required>
                <option value="">-- Seleccione --</option>
                {data.specialties.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Médico</label>
              <select className="form-select" value={form.doctorId}
                onChange={e => setForm(f => ({ ...f, doctorId: e.target.value }))} required>
                <option value="">-- Seleccione --</option>
                {filteredDoctors.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Día</label>
              <select className="form-select" value={form.day}
                onChange={e => setForm(f => ({ ...f, day: e.target.value }))}>
                {days.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Pacientes por día</label>
              <input className="form-input" type="number" min={1} value={form.maxPatients}
                onChange={e => setForm(f => ({ ...f, maxPatients: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Hora Inicio</label>
              <input className="form-input" type="time" value={form.startTime}
                onChange={e => setForm(f => ({ ...f, startTime: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Hora Fin</label>
              <input className="form-input" type="time" value={form.endTime}
                onChange={e => setForm(f => ({ ...f, endTime: e.target.value }))} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="submit" className="btn btn-success">{editing ? 'Actualizar' : 'Agregar'}</button>
            {editing && <button type="button" className="btn btn-secondary" onClick={resetForm}>Cancelar</button>}
          </div>
        </form>
      </div>

      <div className="card">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Especialidad</th>
                <th>Médico</th>
                <th>Día</th>
                <th>Horario</th>
                <th>Máx. Pacientes</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {data.schedules.map(s => {
                const specialty = getSpecialty(s.specialtyId)
                const doctor = getDoctor(s.doctorId)
                return (
                  <tr key={s.id}>
                    <td>{specialty?.icon} {specialty?.name}</td>
                    <td>{doctor?.name}</td>
                    <td><span className="badge badge-primary">{s.day}</span></td>
                    <td>{s.startTime} - {s.endTime}</td>
                    <td>{s.maxPatients}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.35rem' }}>
                        <button className="btn btn-warning btn-sm" onClick={() => handleEdit(s)}>Editar</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(s.id)}>Eliminar</button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
