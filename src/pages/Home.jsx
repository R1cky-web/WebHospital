import { Link } from 'react-router-dom'
import { useApp } from '../contexts/AppContext'
import './Home.css'

export default function Home() {
  const { data } = useApp()
  const today = new Date().toISOString().slice(0, 10)
  const todayActive = data.appointments.filter(a => a.date === today && a.status !== 'cancelled')
  const todayAttended = data.appointments.filter(a => a.date === today && a.status === 'attended')
  const todayCancelled = data.appointments.filter(a => a.date === today && a.status === 'cancelled')
  const totalAppointments = data.appointments.length

  return (
    <div>
      <section className="hero">
        <div className="hero-bg-shapes">
          <div className="hero-shape hero-shape-1"></div>
          <div className="hero-shape hero-shape-2"></div>
          <div className="hero-shape hero-shape-3"></div>
        </div>
        <div className="container hero-content">
          <div className="hero-badge">Bienvenido al Sistema de Citas</div>
          <h1>Hospital Regional <span className="hero-highlight">Huacho</span></h1>
          <p>Brindando atención médica de calidad con calidez humana. Reserve su cita de manera rápida, segura y sin filas.</p>
          <div className="hero-stats">
            <div className="hero-stat">
              <span className="hero-stat-num">{data.specialties.length}</span>
              <span className="hero-stat-label">Especialidades</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-num">{data.doctors.length}</span>
              <span className="hero-stat-label">Médicos</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-num">{totalAppointments}</span>
              <span className="hero-stat-label">Citas Realizadas</span>
            </div>
          </div>
          <div className="hero-buttons">
            <Link to="/reservar" className="btn btn-hero-primary">
              <span>📅</span> Reservar Cita
            </Link>
            <Link to="/especialidades" className="btn btn-hero-secondary">
              <span>🏥</span> Ver Especialidades
            </Link>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Nuestros Servicios</h2>
          <p className="section-subtitle">Todo lo que necesitas para cuidar tu salud en un solo lugar</p>
          <div className="features-grid">
            <div className="feature-card-modern">
              <div className="feature-card-icon" style={{ background: '#e3f2fd', color: '#1565c0' }}>📅</div>
              <h3>Reserva de Citas</h3>
              <p>Agende su cita médica en línea de forma rápida y sencilla, sin necesidad de hacer largas colas.</p>
              <Link to="/reservar" className="feature-card-link">Reservar Ahora →</Link>
            </div>
            <div className="feature-card-modern">
              <div className="feature-card-icon" style={{ background: '#e8f5e9', color: '#2e7d32' }}>👨‍⚕️</div>
              <h3>{data.specialties.length} Especialidades</h3>
              <p>Contamos con diversas especialidades médicas para atender todas sus necesidades de salud.</p>
              <Link to="/especialidades" className="feature-card-link">Ver Especialidades →</Link>
            </div>
            <div className="feature-card-modern">
              <div className="feature-card-icon" style={{ background: '#fff3e0', color: '#e65100' }}>📋</div>
              <h3>Cola de Atención</h3>
              <p>Consulte el estado de su cita y la cola de atención en tiempo real para su especialidad.</p>
              <Link to="/cola" className="feature-card-link">Ver Cola →</Link>
            </div>
            <div className="feature-card-modern">
              <div className="feature-card-icon" style={{ background: '#f3e5f5', color: '#6a1b9a' }}>💬</div>
              <h3>Canales Alternativos</h3>
              <p>Reserve por WhatsApp, teléfono, correo o ventanilla. Múltiples opciones para su comodidad.</p>
              <Link to="/canales-alternativos" className="feature-card-link">Ver Canales →</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="steps-section">
        <div className="container">
          <h2 className="section-title">¿Cómo funciona?</h2>
          <p className="section-subtitle">Reserve su cita en 4 simples pasos</p>
          <div className="steps-timeline">
            <div className="step-card">
              <div className="step-card-number">01</div>
              <div className="step-card-content">
                <div className="step-card-icon">🏥</div>
                <h4>Elija su especialidad</h4>
                <p>Seleccione la especialidad médica que necesita entre nuestras opciones disponibles.</p>
              </div>
            </div>
            <div className="step-connector">
              <div className="step-connector-dot"></div>
              <div className="step-connector-line"></div>
              <div className="step-connector-dot"></div>
            </div>
            <div className="step-card step-card-right">
              <div className="step-card-number">02</div>
              <div className="step-card-content">
                <div className="step-card-icon">📅</div>
                <h4>Seleccione fecha y horario</h4>
                <p>Elija el día y horario disponible que mejor se ajuste a su agenda.</p>
              </div>
            </div>
            <div className="step-connector">
              <div className="step-connector-dot"></div>
              <div className="step-connector-line"></div>
              <div className="step-connector-dot"></div>
            </div>
            <div className="step-card">
              <div className="step-card-number">03</div>
              <div className="step-card-content">
                <div className="step-card-icon">✏️</div>
                <h4>Confirme sus datos</h4>
                <p>Ingrese sus datos personales y confirme la reserva de su cita médica.</p>
              </div>
            </div>
            <div className="step-connector">
              <div className="step-connector-dot"></div>
              <div className="step-connector-line"></div>
              <div className="step-connector-dot"></div>
            </div>
            <div className="step-card step-card-right">
              <div className="step-card-number">04</div>
              <div className="step-card-content">
                <div className="step-card-icon">🔢</div>
                <h4>Reciba su número de cola</h4>
                <p>Obtendrá un número de cola para el día de su cita. Llegue puntualmente.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="today-section">
        <div className="container">
          <h2 className="section-title">Atención del Día de Hoy</h2>
          <p className="section-subtitle">{new Date().toLocaleDateString('es-PE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          <div className="today-stats">
            <div className="today-stat-card today-stat-pending">
              <div className="today-stat-icon">⏳</div>
              <div className="today-stat-info">
                <span className="today-stat-num">{todayActive.length}</span>
                <span className="today-stat-label">En Espera</span>
              </div>
            </div>
            <div className="today-stat-card today-stat-attended">
              <div className="today-stat-icon">✅</div>
              <div className="today-stat-info">
                <span className="today-stat-num">{todayAttended.length}</span>
                <span className="today-stat-label">Atendidos</span>
              </div>
            </div>
            <div className="today-stat-card today-stat-cancelled">
              <div className="today-stat-icon">❌</div>
              <div className="today-stat-info">
                <span className="today-stat-num">{todayCancelled.length}</span>
                <span className="today-stat-label">Cancelados</span>
              </div>
            </div>
            <div className="today-stat-card today-stat-total">
              <div className="today-stat-icon">📊</div>
              <div className="today-stat-info">
                <span className="today-stat-num">{todayActive.length + todayAttended.length + todayCancelled.length}</span>
                <span className="today-stat-label">Total Hoy</span>
              </div>
            </div>
          </div>
          {todayActive.length > 0 && (
            <div className="today-action">
              <Link to="/cola" className="btn btn-hero-primary">
                <span>👁️</span> Ver Cola de Atención
              </Link>
            </div>
          )}
          {todayActive.length === 0 && todayAttended.length === 0 && todayCancelled.length === 0 && (
            <div className="today-empty">
              <p>Aún no hay citas registradas para hoy. <Link to="/reservar">Reserve la suya</Link></p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
