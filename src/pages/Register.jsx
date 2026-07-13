import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }
    if (form.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }
    const result = register(form.name, form.email, form.password)
    if (result.success) {
      navigate('/')
    } else {
      setError(result.error)
    }
  }

  return (
    <div className="container page-content">
      <div className="card" style={{ maxWidth: 420, margin: '0 auto' }}>
        <h2 className="mb-2 text-center">Crear Cuenta</h2>
        <p className="text-center mb-3" style={{ color: 'var(--gray-600)' }}>
          Regístrese para gestionar sus citas médicas
        </p>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Nombre Completo</label>
            <input className="form-input" required value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Correo Electrónico</label>
            <input className="form-input" type="email" required value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Contraseña</label>
            <input className="form-input" type="password" required value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Confirmar Contraseña</label>
            <input className="form-input" type="password" required value={form.confirmPassword}
              onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))} />
          </div>
          <button type="submit" className="btn btn-success btn-block">Crear Cuenta</button>
        </form>
        <p className="text-center mt-2">
          ¿Ya tiene cuenta? <Link to="/login">Inicie sesión</Link>
        </p>
      </div>
    </div>
  )
}
