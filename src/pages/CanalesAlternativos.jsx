import './CanalesAlternativos.css'

const channels = [
  { icon: '💻', title: 'Portal Web', desc: 'Reserve su cita desde cualquier dispositivo con acceso a internet, las 24 horas del día.',
    details: ['Acceso desde cualquier navegador web', 'Disponible 24/7', 'Sin necesidad de descargar aplicaciones', 'Proceso guiado paso a paso'],
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  { icon: '📱', title: 'Aplicación Móvil', desc: 'Descargue nuestra app oficial para reservar citas desde su smartphone de forma rápida.',
    details: ['Disponible para Android y iOS', 'Notificaciones de recordatorio', 'Consulte su cola en tiempo real', 'Gestión de múltiples miembros de familia'],
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
  { icon: '📞', title: 'Central Telefónica', desc: 'Llame a nuestra central telefónica y uno de nuestros operadores le ayudará a agendar su cita.',
    details: ['Lunes a Viernes: 7:00 am - 8:00 pm', 'Sábados: 8:00 am - 2:00 pm', 'Teléfono: (01) 232-3232', 'Atención personalizada'],
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
  { icon: '💬', title: 'WhatsApp', desc: 'Escribanos a nuestro WhatsApp oficial para reservar citas y consultar información.',
    details: ['WhatsApp: +51 999 888 777', 'Respuesta en menos de 5 minutos', 'Puede enviar documentos y recetas', 'Horario de atención: 7:00 am - 8:00 pm'],
    gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' },
  { icon: '📧', title: 'Correo Electrónico', desc: 'Envíenos un correo con sus datos y le agendaremos una cita a la brevedad.',
    details: ['Email: citas@hospitalhuacho.gob.pe', 'Respuesta en 24 horas hábiles', 'Indique su nombre, DNI y especialidad', 'Recibirá confirmación por correo'],
    gradient: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)' },
  { icon: '🏢', title: 'Ventanilla Presencial', desc: 'Acérquese a nuestras instalaciones y reserve su cita en la ventanilla de admisión.',
    details: ['Av. Arnaldo Arámbulo Cora 2 221, Huacho', 'Lunes a Viernes: 7:00 am - 6:00 pm', 'Sábados: 8:00 am - 12:00 pm', 'Traer DNI y número de historia clínica'],
    gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)' },
]

export default function CanalesAlternativos() {
  return (
    <div className="canales-page">
      <div className="container page-content">
        <div className="canales-header">
          <h1>📬 Canales Alternativos</h1>
          <p>Ponemos a su disposición múltiples canales para que pueda reservar su cita médica de la manera que prefiera.</p>
        </div>

        <div className="canales-grid">
          {channels.map(ch => (
            <div key={ch.title} className="canal-card">
              <div className="canal-card-top" style={{ background: ch.gradient }}>
                <div className="canal-icon">{ch.icon}</div>
                <h3>{ch.title}</h3>
                <p>{ch.desc}</p>
              </div>
              <div className="canal-card-bottom">
                <ul className="canal-details">
                  {ch.details.map((d, i) => <li key={i}>{d}</li>)}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="canales-recommendations">
          <h3>📌 Recomendaciones</h3>
          <div className="rec-grid">
            <div className="rec-item">
              <span className="rec-icon">📅</span>
              <span>Reserve con anticipación para asegurar su horario preferido.</span>
            </div>
            <div className="rec-item">
              <span className="rec-icon">⏰</span>
              <span>Llegue 15 minutos antes de su cita.</span>
            </div>
            <div className="rec-item">
              <span className="rec-icon">📞</span>
              <span>Si no puede asistir, cancele su cita con al menos 24 horas de anticipación.</span>
            </div>
            <div className="rec-item">
              <span className="rec-icon">🚨</span>
              <span>Para emergencias, acuda directamente a Emergencia - no requiere cita previa.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
