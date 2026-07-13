import { useState } from 'react'
import { useApp } from '../contexts/AppContext'

export default function EspecialidadesAdmin() {
  const { data, addSpecialty, updateSpecialty, deleteSpecialty } = useApp()
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', description: '', icon: '🏥' })

  const icons = ['🏥', '👶', '👩‍⚕️', '❤️', '🦴', '👁️', '🧠', '🫁', '🦷', '🧬', '🩺', '💊']

  const resetForm = () => {
    setForm({ name: '', description: '', icon: '🏥' })
    setEditing(null)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name.trim()) return
    if (editing) {
      updateSpecialty(editing, form)
    } else {
      addSpecialty(form)
    }
    resetForm()
  }

  const handleEdit = (specialty) => {
    setEditing(specialty.id)
    setForm({ name: specialty.name, description: specialty.description, icon: specialty.icon })
    window.scrollTo(0, 0)
  }

  const handleDelete = (id, name) => {
    if (window.confirm(`¿Eliminar la especialidad "${name}"?`)) {
      deleteSpecialty(id)
    }
  }

  return (
    <div>
      <div className="admin-header">
        <h1>Gestionar Especialidades</h1>
        <span style={{ color: 'var(--gray-600)' }}>{data.specialties.length} especialidades</span>
      </div>

      <div className="card mb-3">
        <h3 className="mb-2">{editing ? 'Editar Especialidad' : 'Agregar Especialidad'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-2">
            <div className="form-group">
              <label className="form-label">Nombre</label>
              <input className="form-input" required value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Icono</label>
              <select className="form-select" value={form.icon}
                onChange={e => setForm(f => ({ ...f, icon: e.target.value }))}>
                {icons.map(icon => (
                  <option key={icon} value={icon}>{icon}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Descripción</label>
            <textarea className="form-textarea" value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="submit" className="btn btn-success">
              {editing ? 'Actualizar' : 'Agregar'}
            </button>
            {editing && (
              <button type="button" className="btn btn-secondary" onClick={resetForm}>Cancelar</button>
            )}
          </div>
        </form>
      </div>

      <div className="card">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Icono</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {data.specialties.map(s => (
                <tr key={s.id}>
                  <td style={{ fontSize: '1.5rem' }}>{s.icon}</td>
                  <td><strong>{s.name}</strong></td>
                  <td style={{ color: 'var(--gray-600)', fontSize: '0.9rem' }}>{s.description}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.35rem' }}>
                      <button className="btn btn-warning btn-sm" onClick={() => handleEdit(s)}>Editar</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(s.id, s.name)}>Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
