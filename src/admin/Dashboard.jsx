import { useApp } from '../contexts/AppContext'
import { Link } from 'react-router-dom'

export default function Dashboard() {
  const { data } = useApp()
  const today = new Date().toISOString().slice(0, 10)
  const todayAppointments = data.appointments.filter(a => a.date === today)
  const activeAppointments = todayAppointments.filter(a => a.status !== 'cancelled')
  const cancelledToday = todayAppointments.filter(a => a.status === 'cancelled')

  return (
    <div>
      <div className="admin-header">
        <h1>Panel de Administración</h1>
        <span style={{ color: 'var(--gray-600)', fontSize: '0.9rem' }}>{new Date().toLocaleDateString('es-PE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
      </div>

      <div className="stat-cards">
        <div className="stat-card">
          <div className="stat-number">{data.specialties.length}</div>
          <div className="stat-label">Especialidades</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{data.doctors.length}</div>
          <div className="stat-label">Médicos</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{data.schedules.length}</div>
          <div className="stat-label">Horarios</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{data.appointments.length}</div>
          <div className="stat-label">Total Citas</div>
        </div>
        <div className="stat-card">
          <div className="stat-number" style={{ color: 'var(--success)' }}>{activeAppointments.length}</div>
          <div className="stat-label">Citas Hoy</div>
        </div>
        <div className="stat-card">
          <div className="stat-number" style={{ color: 'var(--danger)' }}>{cancelledToday.length}</div>
          <div className="stat-label">Canceladas Hoy</div>
        </div>
      </div>

      <div className="card">
        <h2 className="mb-2">Citas de Hoy ({today})</h2>
        {activeAppointments.length === 0 ? (
          <div className="empty-state">
            <p>No hay citas para hoy.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Paciente</th>
                  <th>Especialidad</th>
                  <th>Médico</th>
                  <th>Hora</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {activeAppointments.sort((a, b) => a.time.localeCompare(b.time)).map(app => {
                  const specialty = data.specialties.find(s => s.id === app.specialtyId)
                  const doctor = data.doctors.find(d => d.id === app.doctorId)
                  return (
                    <tr key={app.id}>
                      <td>#{app.queueNumber}</td>
                      <td>{app.patientName}</td>
                      <td>{specialty?.name}</td>
                      <td>{doctor?.name}</td>
                      <td>{app.time}</td>
                      <td><span className="badge badge-success">Confirmada</span></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
        <Link to="/admin/especialidades" className="btn btn-primary">Gestionar Especialidades</Link>
        <Link to="/admin/horarios" className="btn btn-primary">Gestionar Horarios</Link>
        <Link to="/admin/medicos" className="btn btn-primary">Gestionar Médicos</Link>
        <Link to="/admin/citas" className="btn btn-primary">Ver Todas las Citas</Link>
      </div>
    </div>
  )
}
