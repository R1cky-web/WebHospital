import { useState } from 'react'
import { useApp } from '../contexts/AppContext'
import { useAuth } from '../contexts/AuthContext'
import { Link } from 'react-router-dom'

const icons = ['🏥', '👶', '👩‍⚕️', '❤️', '🦴', '👁️', '🧠', '🫁', '🦷', '🧬', '🩺', '💊']

export default function Especialidades() {
  const { data, getDoctorsBySpecialty, addSpecialty, updateSpecialty, deleteSpecialty } = useApp()
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', description: '', icon: '🏥' })
  const [showForm, setShowForm] = useState(false)

  const resetForm = () => {
    setForm({ name: '', description: '', icon: '🏥' })
    setEditing(null)
    setShowForm(false)
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
    setShowForm(true)
    window.scrollTo(0, 0)
  }

  const handleDelete = (id, name) => {
    if (window.confirm(`¿Eliminar la especialidad "${name}"?`)) {
      deleteSpecialty(id)
    }
  }

  return (
    <div className="container page-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <h1 className="mb-2">Especialidades Médicas</h1>
          <p className="mb-3" style={{ color: 'var(--gray-600)' }}>
            Contamos con {data.specialties.length} especialidades para brindarle la mejor atención.
          </p>
        </div>
        {isAdmin && (
          <button className="btn btn-primary" onClick={() => { resetForm(); setShowForm(!showForm) }}>
            {showForm ? 'Cancelar' : '+ Agregar Especialidad'}
          </button>
        )}
      </div>

      {isAdmin && showForm && (
        <div className="card mb-3">
          <h3 className="mb-2">{editing ? 'Editar Especialidad' : 'Nueva Especialidad'}</h3>
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
                  {icons.map(icon => <option key={icon} value={icon}>{icon}</option>)}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Descripción</label>
              <textarea className="form-textarea" value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            </div>
            <button type="submit" className="btn btn-success">{editing ? 'Actualizar' : 'Agregar'}</button>
          </form>
        </div>
      )}

      <div className="grid grid-3">
        {data.specialties.map(specialty => {
          const doctors = getDoctorsBySpecialty(specialty.id)
          return (
            <div key={specialty.id} className="card" style={{ position: 'relative' }}>
              {isAdmin && (
                <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', display: 'flex', gap: '0.25rem' }}>
                  <button className="btn btn-warning btn-sm" onClick={() => handleEdit(specialty)} title="Editar">✏️</button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(specialty.id, specialty.name)} title="Eliminar">🗑️</button>
                </div>
              )}
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{specialty.icon}</div>
              <h3>{specialty.name}</h3>
              <p style={{ color: 'var(--gray-600)', fontSize: '0.9rem', margin: '0.5rem 0' }}>
                {specialty.description}
              </p>
              <p style={{ fontSize: '0.85rem', color: 'var(--gray-500)', marginBottom: '0.75rem' }}>
                {doctors.length} médico(s) disponible(s)
              </p>
              <Link to={`/reservar?especialidad=${specialty.id}`} className="btn btn-primary btn-sm">
                Reservar Cita
              </Link>
            </div>
          )
        })}
      </div>
    </div>
  )
}
