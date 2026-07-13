import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useRef } from 'react'
import './Navbar.css'

const navLinks = [
  { to: '/inicio', label: 'Inicio' },
  { to: '/especialidades', label: 'Especialidades' },
  { to: '/horarios', label: 'Horarios' },
  { to: '/reservar', label: 'Reservar Cita' },
  { to: '/cola', label: 'Cola de Atención' },
  { to: '/canales-alternativos', label: 'Canales Alternativos' },
]

export default function Navbar() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const navRef = useRef(null)

  if (pathname === '/' || pathname.startsWith('/admin')) return null

  const closeMenu = () => {
    navRef.current?.classList.remove('navbar-open')
  }

  const handleLogout = () => {
    logout()
    closeMenu()
    navigate('/')
  }

  return (
    <nav className="navbar" ref={navRef}>
      <div className="container navbar-inner">
        <Link to="/inicio" className="navbar-brand" onClick={closeMenu}>
          <span className="navbar-icon">🏥</span>
          Hospital Regional Huacho
        </Link>
        <button className="navbar-toggler" onClick={() => {
          navRef.current?.classList.toggle('navbar-open')
        }}>
          <span></span><span></span><span></span>
        </button>
        <div className="navbar-menu">
          <div className="navbar-menu-header">
            <span className="navbar-menu-title">Menú</span>
            <button className="navbar-close" onClick={closeMenu}>✕</button>
          </div>
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`navbar-link ${pathname === link.to ? 'active' : ''}`}
              onClick={closeMenu}
            >
              {link.label}
            </Link>
          ))}
          {user && (
            <div className="navbar-user">
              <span className="navbar-user-name">
                {user.role === 'admin' ? '👑' : '👤'} {user.name}
              </span>
              <div className="navbar-user-actions">
                {user.role === 'admin' && (
                  <Link to="/admin" className="btn btn-outline-primary btn-sm" onClick={closeMenu}>Admin</Link>
                )}
                <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>Salir</button>
              </div>
            </div>
          )}
        </div>
        <div className="navbar-overlay" onClick={closeMenu}></div>
      </div>
    </nav>
  )
}
