import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import './Login.css'

export default function Login() {
  const { login, register } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const [animClass, setAnimClass] = useState('')

  useEffect(() => { setAnimClass('fade-in') }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    if (mode === 'login') {
      const result = login(form.email, form.password)
      if (result.success) navigate('/inicio')
      else setError(result.error)
    } else {
      if (form.password !== form.confirmPassword) { setError('Las contraseñas no coinciden'); return }
      if (form.password.length < 6) { setError('La contraseña debe tener al menos 6 caracteres'); return }
      const result = register(form.name, form.email, form.password)
      if (result.success) navigate('/inicio')
      else setError(result.error)
    }
  }

  const switchMode = (m) => {
    setAnimClass('fade-out')
    setTimeout(() => { setMode(m); setError(''); setAnimClass('fade-in') }, 200)
  }

  return (
    <div className="login-page">
      <div className="login-bg">
        <div className="login-bg-circle c1"></div>
        <div className="login-bg-circle c2"></div>
        <div className="login-bg-circle c3"></div>
      </div>
      <div className={`login-container ${animClass}`}>
        <div className="login-header">
          <div className="login-logo">🏥</div>
          <h1>Hospital Regional Huacho</h1>
          <p>Sistema de Reserva de Citas Médicas</p>
        </div>
        <div className="login-tabs">
          <button className={`login-tab ${mode === 'login' ? 'active' : ''}`} onClick={() => switchMode('login')}>
            <span>🔑</span> Iniciar Sesión
          </button>
          <button className={`login-tab ${mode === 'register' ? 'active' : ''}`} onClick={() => switchMode('register')}>
            <span>📝</span> Registrarse
          </button>
        </div>
        {error && <div className="login-error">{error}</div>}
        <form onSubmit={handleSubmit} className="login-form">
          {mode === 'register' && (
            <div className="login-field">
              <label>Nombre Completo</label>
              <input type="text" required value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Ingrese su nombre" />
              <span className="field-focus"></span>
            </div>
          )}
          <div className="login-field">
            <label>Correo Electrónico</label>
            <input type="email" required value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="correo@ejemplo.com" />
            <span className="field-focus"></span>
          </div>
          <div className="login-field">
            <label>Contraseña</label>
            <input type="password" required value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="••••••••" />
            <span className="field-focus"></span>
          </div>
          {mode === 'register' && (
            <div className="login-field">
              <label>Confirmar Contraseña</label>
              <input type="password" required value={form.confirmPassword}
                onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))} placeholder="••••••••" />
              <span className="field-focus"></span>
            </div>
          )}
          <button type="submit" className="login-submit">
            {mode === 'login' ? 'Ingresar al Sistema' : 'Crear Cuenta'}
          </button>
        </form>
        {mode === 'login' && (
          <div className="login-demo">
            <strong>Demo Admin:</strong> admin@hospital.com / admin123
          </div>
        )}
      </div>
    </div>
  )
}
