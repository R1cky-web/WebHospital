import { useState } from 'react'
import { useApp } from '../contexts/AppContext'

export default function MedicosAdmin() {
  const { data, addDoctor } = useApp()
  const [form, setForm] = useState({ name: '', specialtyId: '' })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.specialtyId) return
    addDoctor({ name: form.name, specialtyId: Number(form.specialtyId) })
    setForm({ name: '', specialtyId: '' })
  }

  return (
    <div>
      <div className="admin-header">
        <h1>Gestionar Médicos</h1>
        <span style={{ color: 'var(--gray-600)' }}>{data.doctors.length} médicos</span>
      </div>

      <div className="card mb-3">
        <h3 className="mb-2">Agregar Médico</h3>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-2">
            <div className="form-group">
              <label className="form-label">Nombre del Médico</label>
              <input className="form-input" required value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Especialidad</label>
              <select className="form-select" required value={form.specialtyId}
                onChange={e => setForm(f => ({ ...f, specialtyId: e.target.value }))}>
                <option value="">-- Seleccione --</option>
                {data.specialties.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
          </div>
          <button type="submit" className="btn btn-success">Agregar Médico</button>
        </form>
      </div>

      <div className="card">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Especialidad</th>
              </tr>
            </thead>
            <tbody>
              {data.doctors.map(d => {
                const specialty = data.specialties.find(s => s.id === d.specialtyId)
                return (
                  <tr key={d.id}>
                    <td><strong>{d.name}</strong></td>
                    <td>{specialty?.icon} {specialty?.name}</td>
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
