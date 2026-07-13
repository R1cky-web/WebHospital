import { NavLink, Outlet, Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import './Admin.css'

export default function AdminLayout() {
  const { user } = useAuth()

  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <NavLink to="/admin" end>🏥 Admin HRH</NavLink>
        </div>
        <nav className="admin-nav">
          <NavLink to="/admin" end className={({ isActive }) => isActive ? 'admin-nav-link active' : 'admin-nav-link'}>
            📊 Dashboard
          </NavLink>
          <NavLink to="/admin/especialidades" className={({ isActive }) => isActive ? 'admin-nav-link active' : 'admin-nav-link'}>
            🏥 Especialidades
          </NavLink>
          <NavLink to="/admin/horarios" className={({ isActive }) => isActive ? 'admin-nav-link active' : 'admin-nav-link'}>
            📅 Horarios
          </NavLink>
          <NavLink to="/admin/medicos" className={({ isActive }) => isActive ? 'admin-nav-link active' : 'admin-nav-link'}>
            👨‍⚕️ Médicos
          </NavLink>
          <NavLink to="/admin/citas" className={({ isActive }) => isActive ? 'admin-nav-link active' : 'admin-nav-link'}>
            📋 Citas
          </NavLink>
          <NavLink to="/inicio" className="admin-nav-link" style={{ marginTop: 'auto', borderTop: '1px solid var(--gray-700)', paddingTop: '1rem' }}>
            ← Volver al sitio
          </NavLink>
        </nav>
      </aside>
      <main className="admin-main">
        <div className="container">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
