'use client'

import { useState, useEffect } from 'react'
import { leerDatosExcel } from '../../utils/excelUtils'
import { Calendar, momentLocalizer, Views } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'

moment.locale('es')
const localizer = momentLocalizer(moment)

interface Evento {
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
  resource?: string;
}

// Componente para renderizar eventos con título personalizado
function CustomEvent({ event }: { event: Evento }) {
  return (
    <div className="rbc-event-content" style={{ fontSize: '0.7em', lineHeight: '1.2', overflow: 'hidden', textOverflow: 'ellipsis' }}>
      {event.title}
      {event.resource && <div style={{ fontSize: '0.9em', fontStyle: 'italic' }}>{event.resource}</div>}
    </div>
  )
}

// Componente para renderizar la celda del día
function CustomDayCell({ events, value }: { events: Evento[], value: Date }) {
  const sortedEvents = events && events.length > 0 
    ? [...events].sort((a, b) => a.title.localeCompare(b.title))
    : [];

  return (
    <div className="rbc-day-bg">
      {sortedEvents.map((event, index) => (
        <div key={index} className="rbc-event" style={{ margin: '1px 0', padding: '2px', fontSize: '0.7em', lineHeight: '1.2', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {event.title}
        </div>
      ))}
    </div>
  )
}

export default function CalendarioMantenimiento() {
  const [eventos, setEventos] = useState<Evento[]>([])
  const [fechaActual, setFechaActual] = useState(new Date())

  useEffect(() => {
    async function cargarEventos() {
      try {
        const registrosData = await leerDatosExcel('registros_mantenimiento.xlsx', 'Registros')

        const eventosGenerados = registrosData.map((fila: any[]) => ({
          title: `${fila[1]}`, // Nombre de la máquina
          start: new Date(fila[4]),
          end: new Date(fila[4]),
          allDay: true         
        }))

        setEventos(eventosGenerados)
      } catch (error) {
        console.error('Error al cargar los eventos:', error)
      }
    }

    cargarEventos()
  }, [])

  const handleNavigate = (date: Date) => {
    setFechaActual(date)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Calendario de Mantenimiento</h1>
      <div style={{ height: '700px' }}>
        <Calendar
          localizer={localizer}
          events={eventos}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
          date={fechaActual}
          onNavigate={handleNavigate}
          views={['month', 'week', 'day']}
          defaultView={Views.MONTH}
          components={{
            event: CustomEvent,
            dateCellWrapper: CustomDayCell
          }}
          eventPropGetter={(event) => ({
            style: {
              backgroundColor: '#3174ad',
              color: 'white',
              border: 'none',
              borderRadius: '0'
            }
          })}
          dayPropGetter={(date) => ({
            style: {
              backgroundColor: date.getDay() === 0 || date.getDay() === 6 ? '#f0f0f0' : 'white'
            }
          })}
        />
      </div>
    </div>
  )
}