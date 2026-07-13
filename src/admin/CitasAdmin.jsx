import { useState } from 'react'
import { useApp } from '../contexts/AppContext'

export default function CitasAdmin() {
  const { data, cancelAppointment, getSpecialty, getDoctor } = useApp()
  const [filterStatus, setFilterStatus] = useState('all')

  const filtered = filterStatus === 'all'
    ? data.appointments
    : filterStatus === 'cancelled'
      ? data.appointments.filter(a => a.status === 'cancelled')
      : data.appointments.filter(a => a.status !== 'cancelled')

  const sorted = [...filtered].sort((a, b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date)
    return a.time.localeCompare(b.time)
  })

  return (
    <div>
      <div className="admin-header">
        <h1>Gestionar Citas</h1>
        <span style={{ color: 'var(--gray-600)' }}>{data.appointments.length} citas totales</span>
      </div>

      <div className="card mb-3">
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <span className="form-label" style={{ margin: 0 }}>Filtrar:</span>
          <button className={`btn btn-sm ${filterStatus === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setFilterStatus('all')}>Todas</button>
          <button className={`btn btn-sm ${filterStatus === 'active' ? 'btn-success' : 'btn-outline-success'}`}
            onClick={() => setFilterStatus('active')}>Activas</button>
          <button className={`btn btn-sm ${filterStatus === 'cancelled' ? 'btn-danger' : 'btn-outline-danger'}`}
            onClick={() => setFilterStatus('cancelled')}>Canceladas</button>
        </div>
      </div>

      {sorted.length === 0 ? (
        <div className="card empty-state">
          <h3>No hay citas</h3>
          <p>No se encontraron citas con los filtros seleccionados.</p>
        </div>
      ) : (
        <div className="card">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Paciente</th>
                  <th>Especialidad</th>
                  <th>Médico</th>
                  <th>Fecha</th>
                  <th>Hora</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map(app => {
                  const specialty = getSpecialty(app.specialtyId)
                  const doctor = getDoctor(app.doctorId)
                  return (
                    <tr key={app.id}>
                      <td>#{app.queueNumber}</td>
                      <td>
                        <strong>{app.patientName}</strong>
                        <br /><small style={{ color: 'var(--gray-500)' }}>DNI: {app.patientDni || '—'} | {app.patientPhone}</small>
                      </td>
                      <td>{specialty?.name}</td>
                      <td>{doctor?.name}</td>
                      <td>{app.date}</td>
                      <td>{app.time}</td>
                      <td>
                        {app.status === 'cancelled' ? (
                          <span className="badge badge-danger">Cancelada</span>
                        ) : (
                          <span className="badge badge-success">Confirmada</span>
                        )}
                      </td>
                      <td>
                        {app.status !== 'cancelled' && (
                          <button className="btn btn-danger btn-sm"
                            onClick={() => {
                              if (window.confirm(`¿Cancelar la cita de ${app.patientName}?`)) {
                                cancelAppointment(app.id)
                              }
                            }}>
                            Cancelar
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
