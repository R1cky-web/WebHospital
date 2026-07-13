import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const AppContext = createContext()

const STORAGE_KEY = 'hospital_huacho_data'

const defaultData = {
  specialties: [
    { id: 1, name: 'Medicina General', description: 'Atención médica primaria para pacientes de todas las edades.', icon: '🏥' },
    { id: 2, name: 'Pediatría', description: 'Atención especializada para niños y adolescentes.', icon: '👶' },
    { id: 3, name: 'Ginecología', description: 'Salud femenina y atención prenatal.', icon: '👩‍⚕️' },
    { id: 4, name: 'Cardiología', description: 'Diagnóstico y tratamiento de enfermedades del corazón.', icon: '❤️' },
    { id: 5, name: 'Traumatología', description: 'Atención de lesiones del sistema musculoesquelético.', icon: '🦴' },
    { id: 6, name: 'Oftalmología', description: 'Cuidado de la salud visual.', icon: '👁️' },
  ],
  doctors: [
    { id: 1, name: 'Dr. Carlos Mendoza', specialtyId: 1 },
    { id: 2, name: 'Dra. Ana Torres', specialtyId: 2 },
    { id: 3, name: 'Dra. María López', specialtyId: 3 },
    { id: 4, name: 'Dr. Juan Pérez', specialtyId: 4 },
    { id: 5, name: 'Dr. Pedro Sánchez', specialtyId: 5 },
    { id: 6, name: 'Dra. Rosa García', specialtyId: 6 },
    { id: 7, name: 'Dr. Luis Ramírez', specialtyId: 1 },
    { id: 8, name: 'Dra. Carmen Díaz', specialtyId: 3 },
  ],
  schedules: [
    { id: 1, specialtyId: 1, doctorId: 1, day: 'Lunes', startTime: '08:00', endTime: '14:00', maxPatients: 20 },
    { id: 2, specialtyId: 1, doctorId: 7, day: 'Martes', startTime: '08:00', endTime: '14:00', maxPatients: 15 },
    { id: 3, specialtyId: 2, doctorId: 2, day: 'Lunes', startTime: '09:00', endTime: '15:00', maxPatients: 18 },
    { id: 4, specialtyId: 3, doctorId: 3, day: 'Miércoles', startTime: '08:00', endTime: '16:00', maxPatients: 25 },
    { id: 5, specialtyId: 4, doctorId: 4, day: 'Jueves', startTime: '09:00', endTime: '13:00', maxPatients: 12 },
    { id: 6, specialtyId: 5, doctorId: 5, day: 'Viernes', startTime: '08:00', endTime: '14:00', maxPatients: 20 },
    { id: 7, specialtyId: 6, doctorId: 6, day: 'Martes', startTime: '10:00', endTime: '16:00', maxPatients: 15 },
    { id: 8, specialtyId: 3, doctorId: 8, day: 'Viernes', startTime: '08:00', endTime: '12:00', maxPatients: 10 },
    { id: 9, specialtyId: 1, doctorId: 1, day: 'Miércoles', startTime: '14:00', endTime: '18:00', maxPatients: 15 },
    { id: 10, specialtyId: 4, doctorId: 4, day: 'Lunes', startTime: '08:00', endTime: '12:00', maxPatients: 10 },
  ],
  appointments: [],
  nextAppointmentId: 1,
  nextSpecialtyId: 7,
  nextDoctorId: 9,
  nextScheduleId: 11,
}

function loadData() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return JSON.parse(stored)
  } catch (e) { /* ignore */ }
  return JSON.parse(JSON.stringify(defaultData))
}

export function AppProvider({ children }) {
  const [data, setData] = useState(loadData)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }, [data])

  const getSpecialty = useCallback((id) => data.specialties.find(s => s.id === Number(id)), [data.specialties])
  const getDoctor = useCallback((id) => data.doctors.find(d => d.id === Number(id)), [data.doctors])
  const getDoctorsBySpecialty = useCallback((specialtyId) => data.doctors.filter(d => d.specialtyId === Number(specialtyId)), [data.doctors])
  const getSchedulesBySpecialty = useCallback((specialtyId) => data.schedules.filter(s => s.specialtyId === Number(specialtyId)), [data.schedules])
  const getSchedulesByDoctor = useCallback((doctorId) => data.schedules.filter(s => s.doctorId === Number(doctorId)), [data.schedules])

  const getAppointmentsByDate = useCallback((date) => data.appointments.filter(a => a.date === date), [data.appointments])

  const getQueueByDateAndSpecialty = useCallback((date, specialtyId) => {
    return data.appointments
      .filter(a => a.date === date && a.specialtyId === Number(specialtyId))
      .sort((a, b) => a.queueNumber - b.queueNumber)
  }, [data.appointments])

  const getNextQueueNumber = useCallback((date, specialtyId) => {
    const today = data.appointments.filter(a => a.date === date && a.specialtyId === Number(specialtyId))
    return today.length + 1
  }, [data.appointments])

  const addAppointment = useCallback((appointment) => {
    const appointmentWithId = { ...appointment, id: data.nextAppointmentId, createdAt: new Date().toISOString() }
    setData(prev => ({
      ...prev,
      appointments: [...prev.appointments, appointmentWithId],
      nextAppointmentId: prev.nextAppointmentId + 1,
    }))
    return appointmentWithId
  }, [data.nextAppointmentId])

  const cancelAppointment = useCallback((id) => {
    setData(prev => ({
      ...prev,
      appointments: prev.appointments.map(a =>
        a.id === Number(id) ? { ...a, status: 'cancelled' } : a
      ),
    }))
  }, [])

  const updateAppointmentStatus = useCallback((id, status) => {
    setData(prev => ({
      ...prev,
      appointments: prev.appointments.map(a =>
        a.id === Number(id) ? { ...a, status } : a
      ),
    }))
  }, [])

  const addSpecialty = useCallback((specialty) => {
    setData(prev => ({
      ...prev,
      specialties: [...prev.specialties, { ...specialty, id: prev.nextSpecialtyId }],
      nextSpecialtyId: prev.nextSpecialtyId + 1,
    }))
  }, [])

  const updateSpecialty = useCallback((id, updates) => {
    setData(prev => ({
      ...prev,
      specialties: prev.specialties.map(s => s.id === Number(id) ? { ...s, ...updates } : s),
    }))
  }, [])

  const deleteSpecialty = useCallback((id) => {
    setData(prev => ({
      ...prev,
      specialties: prev.specialties.filter(s => s.id !== Number(id)),
    }))
  }, [])

  const addSchedule = useCallback((schedule) => {
    setData(prev => ({
      ...prev,
      schedules: [...prev.schedules, { ...schedule, id: prev.nextScheduleId }],
      nextScheduleId: prev.nextScheduleId + 1,
    }))
  }, [])

  const updateSchedule = useCallback((id, updates) => {
    setData(prev => ({
      ...prev,
      schedules: prev.schedules.map(s => s.id === Number(id) ? { ...s, ...updates } : s),
    }))
  }, [])

  const deleteSchedule = useCallback((id) => {
    setData(prev => ({
      ...prev,
      schedules: prev.schedules.filter(s => s.id !== Number(id)),
    }))
  }, [])

  const addDoctor = useCallback((doctor) => {
    setData(prev => ({
      ...prev,
      doctors: [...prev.doctors, { ...doctor, id: prev.nextDoctorId }],
      nextDoctorId: prev.nextDoctorId + 1,
    }))
  }, [])

  const deleteDoctor = useCallback((id) => {
    setData(prev => ({
      ...prev,
      doctors: prev.doctors.filter(d => d.id !== Number(id)),
    }))
  }, [])

  const resetData = useCallback(() => {
    setData(JSON.parse(JSON.stringify(defaultData)))
  }, [])

  return (
    <AppContext.Provider value={{
      data,
      getSpecialty,
      getDoctor,
      getDoctorsBySpecialty,
      getSchedulesBySpecialty,
      getSchedulesByDoctor,
      getAppointmentsByDate,
      getQueueByDateAndSpecialty,
      getNextQueueNumber,
      addAppointment,
      cancelAppointment,
      updateAppointmentStatus,
      addSpecialty,
      updateSpecialty,
      deleteSpecialty,
      addSchedule,
      updateSchedule,
      deleteSchedule,
      addDoctor,
      deleteDoctor,
      resetData,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
