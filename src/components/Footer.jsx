import { Link, useLocation } from 'react-router-dom'
import './Footer.css'

export default function Footer() {
  const { pathname } = useLocation()
  if (pathname === '/' || pathname.startsWith('/admin')) return null

  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-section">
          <h4>🏥 Hospital Regional Huacho</h4>
          <p>Comprometidos con tu salud y bienestar.</p>
        </div>
        <div className="footer-section">
          <h4>Enlaces</h4>
          <Link to="/especialidades">Especialidades</Link>
          <Link to="/horarios">Horarios</Link>
          <Link to="/reservar">Reservar Cita</Link>
        </div>
        <div className="footer-section">
          <h4>Contacto</h4>
          <p>Av. Arnaldo Arámbulo Cora 2 221, Huacho</p>
          <p>Tel: (01) 232-3232</p>
          <p>Email: contacto@hospitalhuacho.gob.pe</p>
        </div>
        <div className="footer-section">
          <h4>Horario de Atención</h4>
          <p>Lunes a Viernes: 8:00 am - 6:00 pm</p>
          <p>Sábados: 8:00 am - 12:00 pm</p>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} Hospital Regional Huacho. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
