import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { useApp } from '../contexts/AppContext'
import './Reservar.css'

const daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
const stepData = [
  { icon: '🏥', title: 'Especialidad', desc: 'Elija especialidad y médico' },
  { icon: '📅', title: 'Fecha y Hora', desc: 'Seleccione horario disponible' },
  { icon: '✏️', title: 'Confirmación', desc: 'Ingrese sus datos y confirme' },
]

function getDayName(dateStr) { return daysOfWeek[new Date(dateStr + 'T12:00:00').getDay()] }

export default function Reservar() {
  const [searchParams] = useSearchParams()
  const { data, getSpecialty, getDoctorsBySpecialty, getSchedulesByDoctor, addAppointment, getNextQueueNumber } = useApp()
  const [step, setStep] = useState(1)
  const [selectedSpecialtyId, setSelectedSpecialtyId] = useState(searchParams.get('especialidad') || '')
  const [selectedDoctorId, setSelectedDoctorId] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
  const [availableSlots, setAvailableSlots] = useState([])
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [form, setForm] = useState({ name: '', phone: '', email: '' })
  const [success, setSuccess] = useState(null)

  const today = new Date()
  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(today); d.setDate(d.getDate() + i); return d.toISOString().slice(0, 10)
  })
  const specialties = data.specialties
  const doctors = selectedSpecialtyId ? getDoctorsBySpecialty(selectedSpecialtyId) : []

  useEffect(() => { setSelectedDoctorId(''); setSelectedDate(''); setAvailableSlots([]); setSelectedSlot(null) }, [selectedSpecialtyId])
  useEffect(() => { setSelectedDate(''); setAvailableSlots([]); setSelectedSlot(null) }, [selectedDoctorId])
  useEffect(() => {
    if (!selectedDoctorId || !selectedDate) { setAvailableSlots([]); return }
    const dayName = getDayName(selectedDate)
    const doctorSchedules = getSchedulesByDoctor(selectedDoctorId).filter(s => s.day === dayName)
    const slots = []
    doctorSchedules.forEach(schedule => {
      const [startH, startM] = schedule.startTime.split(':').map(Number)
      const [endH, endM] = schedule.endTime.split(':').map(Number)
      const startMinutes = startH * 60 + startM
      const endMinutes = endH * 60 + endM
      const existingAppts = data.appointments.filter(a => a.date === selectedDate && a.doctorId === Number(selectedDoctorId) && a.status !== 'cancelled')
      const bookedTimes = existingAppts.map(a => a.time)
      for (let m = startMinutes; m < endMinutes; m += 30) {
        const time = `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`
        if (!bookedTimes.includes(time) && existingAppts.length < schedule.maxPatients) slots.push({ time })
      }
    })
    setAvailableSlots(slots); setSelectedSlot(null)
  }, [selectedDoctorId, selectedDate, data.appointments, getSchedulesByDoctor])

  const goStep = (s) => { setStep(s) }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!selectedSlot) return
    const appointment = {
      patientName: form.name, patientPhone: form.phone, patientEmail: form.email,
      specialtyId: Number(selectedSpecialtyId), doctorId: Number(selectedDoctorId),
      date: selectedDate, day: getDayName(selectedDate), time: selectedSlot.time,
      queueNumber: getNextQueueNumber(selectedDate, selectedSpecialtyId), status: 'confirmed',
    }
    setSuccess(addAppointment(appointment))
    setStep(4)
  }

  if (success) {
    return (
      <div className="reservar-page">
        <div className="container page-content">
          <div className="success-card">
            <div className="success-icon">✅</div>
            <h2>¡Cita Reservada Exitosamente!</h2>
            <div className="success-details">
              <div className="success-row"><span>Número de Cola</span><strong>#{success.queueNumber}</strong></div>
              <div className="success-row"><span>Especialidad</span><strong>{getSpecialty(success.specialtyId)?.name}</strong></div>
              <div className="success-row"><span>Médico</span><strong>{data.doctors.find(d => d.id === success.doctorId)?.name}</strong></div>
              <div className="success-row"><span>Fecha</span><strong>{success.date}</strong></div>
              <div className="success-row"><span>Hora</span><strong>{success.time}</strong></div>
            </div>
            <p className="success-note">Por favor llegue 15 minutos antes de su hora asignada.</p>
            <div className="success-actions">
              <Link to="/inicio" className="btn btn-primary">Ir al Inicio</Link>
              <Link to="/cola" className="btn btn-outline-primary">Ver Cola de Atención</Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="reservar-page">
      <div className="container page-content">
        <div className="reservar-header">
          <h1>📅 Reservar Cita Médica</h1>
          <p>Siga los pasos para agendar su cita. El orden de atención será por llegada el día de su cita.</p>
        </div>

        <div className="reservar-steps">
          {stepData.map((s, i) => (
            <div key={i} className={`step-indicator ${step > i + 1 ? 'completed' : step === i + 1 ? 'active' : ''}`}>
              <div className="step-dot">{step > i + 1 ? '✓' : s.icon}</div>
              <div className="step-info">
                <span className="step-label">{s.title}</span>
                <span className="step-desc">{s.desc}</span>
              </div>
              {i < stepData.length - 1 && <div className={`step-line ${step > i + 1 ? 'completed' : ''}`} />}
            </div>
          ))}
        </div>

        <div className="reservar-card">
          {step === 1 && (
            <div className="reservar-step-content" key="step1">
              <h3>Seleccione Especialidad y Médico</h3>
              <div className="specialty-select-grid">
                {specialties.map(s => {
                  const doctorsCount = getDoctorsBySpecialty(s.id).length
                  return (
                    <button key={s.id} className={`specialty-option ${Number(selectedSpecialtyId) === s.id ? 'active' : ''}`}
                      onClick={() => setSelectedSpecialtyId(String(s.id))}>
                      <span className="specialty-option-icon">{s.icon}</span>
                      <span className="specialty-option-name">{s.name}</span>
                      <span className="specialty-option-count">{doctorsCount} médico(s)</span>
                    </button>
                  )
                })}
              </div>
              {selectedSpecialtyId && (
                <div className="doctor-select-section">
                  <h4>Seleccione un médico</h4>
                  <div className="doctor-select-grid">
                    {doctors.map(d => (
                      <button key={d.id} className={`doctor-option ${Number(selectedDoctorId) === d.id ? 'active' : ''}`}
                        onClick={() => setSelectedDoctorId(String(d.id))}>
                        👨‍⚕️ {d.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div className="step-nav">
                <span></span>
                <button className="btn btn-primary btn-lg" disabled={!selectedDoctorId} onClick={() => goStep(2, 'next')}>
                  Siguiente <span className="arrow">→</span>
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="reservar-step-content" key="step2">
              <h3>Seleccione Fecha y Horario</h3>
              <div className="date-select-grid">
                {days.map(d => {
                  const dayName = getDayName(d)
                  const hasSchedule = data.schedules.some(s => s.doctorId === Number(selectedDoctorId) && s.day === dayName)
                  if (!hasSchedule) return null
                  return (
                    <button key={d} className={`date-option ${selectedDate === d ? 'active' : ''}`}
                      onClick={() => setSelectedDate(d)}>
                      <span className="date-day">{dayName.slice(0, 3)}</span>
                      <span className="date-num">{d.slice(8, 10)}</span>
                      <span className="date-month">{d.slice(5, 7)}</span>
                    </button>
                  )
                })}
              </div>
              {selectedDate && (
                <div className="slots-section">
                  <h4>Horarios disponibles para {selectedDate}</h4>
                  {availableSlots.length === 0 ? (
                    <div className="no-slots">No hay horarios disponibles para esta fecha.</div>
                  ) : (
                    <div className="slots-grid">
                      {availableSlots.map(slot => (
                        <button key={slot.time} className={`slot-btn ${selectedSlot?.time === slot.time ? 'active' : ''}`}
                          onClick={() => setSelectedSlot(slot)}>
                          🕐 {slot.time}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
              <div className="step-nav">
                <button className="btn btn-outline-secondary btn-lg" onClick={() => goStep(1, 'prev')}>
                  <span className="arrow">←</span> Atrás
                </button>
                <button className="btn btn-primary btn-lg" disabled={!selectedSlot} onClick={() => goStep(3, 'next')}>
                  Siguiente <span className="arrow">→</span>
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="reservar-step-content" key="step3">
              <h3>Confirme sus Datos</h3>
              <div className="confirm-summary">
                <div className="confirm-row"><span>🏥 Especialidad</span><strong>{getSpecialty(selectedSpecialtyId)?.name}</strong></div>
                <div className="confirm-row"><span>👨‍⚕️ Médico</span><strong>{data.doctors.find(d => d.id === Number(selectedDoctorId))?.name}</strong></div>
                <div className="confirm-row"><span>📅 Fecha</span><strong>{selectedDate} ({getDayName(selectedDate)})</strong></div>
                <div className="confirm-row"><span>🕐 Hora</span><strong>{selectedSlot?.time}</strong></div>
                <div className="confirm-row"><span>🔢 Cola estimada</span><strong>#{getNextQueueNumber(selectedDate, selectedSpecialtyId)}</strong></div>
              </div>
              <form onSubmit={handleSubmit} className="confirm-form">
                <div className="form-group">
                  <label className="form-label">Nombre Completo *</label>
                  <input className="form-input" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Ingrese su nombre" />
                </div>
                <div className="form-row-2">
                  <div className="form-group">
                    <label className="form-label">Teléfono *</label>
                    <input className="form-input" required value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="999 888 777" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Correo Electrónico</label>
                    <input className="form-input" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="correo@ejemplo.com" />
                  </div>
                </div>
                <div className="step-nav">
                  <button type="button" className="btn btn-outline-secondary btn-lg" onClick={() => goStep(2, 'prev')}>
                    <span className="arrow">←</span> Atrás
                  </button>
                  <button type="submit" className="btn btn-success btn-lg">✅ Confirmar y Reservar</button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
