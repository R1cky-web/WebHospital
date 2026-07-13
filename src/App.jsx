import { HashRouter, Routes, Route } from 'react-router-dom'
import { AppProvider } from './contexts/AppContext'
import { AuthProvider } from './contexts/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Login from './pages/Login'
import Home from './pages/Home'
import Especialidades from './pages/Especialidades'
import Horarios from './pages/Horarios'
import Reservar from './pages/Reservar'
import Cola from './pages/Cola'
import CanalesAlternativos from './pages/CanalesAlternativos'
import AdminLayout from './admin/AdminLayout'
import Dashboard from './admin/Dashboard'
import EspecialidadesAdmin from './admin/EspecialidadesAdmin'
import HorariosAdmin from './admin/HorariosAdmin'
import MedicosAdmin from './admin/MedicosAdmin'
import CitasAdmin from './admin/CitasAdmin'

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <HashRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/inicio" element={<Home />} />
            <Route path="/especialidades" element={<Especialidades />} />
            <Route path="/horarios" element={<Horarios />} />
            <Route path="/reservar" element={<Reservar />} />
            <Route path="/cola" element={<Cola />} />
            <Route path="/canales-alternativos" element={<CanalesAlternativos />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="especialidades" element={<EspecialidadesAdmin />} />
              <Route path="horarios" element={<HorariosAdmin />} />
              <Route path="medicos" element={<MedicosAdmin />} />
              <Route path="citas" element={<CitasAdmin />} />
            </Route>
          </Routes>
          <Footer />
        </BrowserRouter>
      </AppProvider>
    </AuthProvider>
  )
}
