'use client'

import { useState, useEffect } from 'react'
import { leerDatosExcel, escribirDatosExcel } from '../../utils/excelUtils'
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Select } from "../../components/ui/select"
import { toast } from 'react-hot-toast'

interface Maquina {
  id: number;
  nombre: string;
  frecuencia: number;
}

interface Actividad {
  id: number;
  nombre: string;
  descripcion: string;
}

interface Registro {
  id: number;
  maquinaNombre: string;
  actividadesNombres: string;
  fechaRealizado: string;
  fechaProximo: string;
  observaciones: string;
}

export default function RegistroMantenimiento() {
  const [maquinas, setMaquinas] = useState<Maquina[]>([])
  const [actividades, setActividades] = useState<Actividad[]>([])
  const [registros, setRegistros] = useState<Registro[]>([])
  const [maquinaSeleccionada, setMaquinaSeleccionada] = useState<number>(0)
  const [actividadesSeleccionadas, setActividadesSeleccionadas] = useState<number[]>([])
  const [fechaRealizado, setFechaRealizado] = useState<string>('')
  const [observaciones, setObservaciones] = useState<string>('')

  useEffect(() => {
    async function cargarDatos() {
      try {
        const maquinasData = await leerDatosExcel('maquinas.xlsx', 'Maquinas')
        const actividadesData = await leerDatosExcel('maquinas.xlsx', 'Actividades')
        const registrosData = await leerDatosExcel('registros_mantenimiento.xlsx', 'Registros')

        setMaquinas(maquinasData.map((fila: any[]) => ({
          id: fila[0],
          nombre: fila[1],
          frecuencia: fila[2]
        })))

        setActividades(actividadesData.map((fila: any[]) => ({
          id: fila[0],
          nombre: fila[1],
          descripcion: fila[2]
        })))

        setRegistros(registrosData.map((fila: any[]) => ({
          id: fila[0],
          maquinaNombre: fila[1],
          actividadesNombres: fila[2],
          fechaRealizado: fila[3],
          fechaProximo: fila[4],
          observaciones: fila[5] || ''
        })))
      } catch (error) {
        console.error('Error al cargar los datos:', error)
        toast.error('Error al cargar los datos. Por favor, recarga la página.')
      }
    }

    cargarDatos()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const maquina = maquinas.find(m => m.id === maquinaSeleccionada)
    if (!maquina) {
      toast.error('Por favor, seleccione una máquina')
      return
    }

    if (actividadesSeleccionadas.length === 0) {
      toast.error('Por favor, seleccione al menos una actividad')
      return
    }

    if (!fechaRealizado) {
      toast.error('Por favor, ingrese la fecha de realización')
      return
    }

    const fechaProximo = new Date(fechaRealizado)
    fechaProximo.setDate(fechaProximo.getDate() + maquina.frecuencia)

    const actividadesNombres = actividadesSeleccionadas.map(id => 
      actividades.find(a => a.id === id)?.nombre || 'Desconocida'
    ).join(', ')

    const nuevoRegistro: Registro = {
      id: registros.length + 1,
      maquinaNombre: maquina.nombre,
      actividadesNombres,
      fechaRealizado,
      fechaProximo: fechaProximo.toISOString().split('T')[0],
      observaciones
    }

    try {
      console.log('Intentando guardar nuevo registro:', nuevoRegistro);
      await escribirDatosExcel('registros_mantenimiento.xlsx', 'Registros', [Object.values(nuevoRegistro)])
      
      setRegistros([...registros, nuevoRegistro])

      // Limpiar el formulario
      setMaquinaSeleccionada(0)
      setActividadesSeleccionadas([])
      setFechaRealizado('')
      setObservaciones('')

      toast.success('Registro guardado correctamente')
    } catch (error) {
      console.error('Error al guardar el registro:', error)
      toast.error('Error al guardar el registro. Por favor, intente de nuevo.')
    }
  }

  const handleActividadChange = (actividadId: number) => {
    setActividadesSeleccionadas(prev => 
      prev.includes(actividadId)
        ? prev.filter(id => id !== actividadId)
        : [...prev, actividadId]
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Registro de Mantenimiento</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          label="Máquina"
          value={maquinaSeleccionada}
          onChange={(e) => setMaquinaSeleccionada(Number(e.target.value))}
        >
          <option value={0}>Seleccione una máquina</option>
          {maquinas.map((maquina) => (
            <option key={maquina.id} value={maquina.id}>{maquina.nombre}</option>
          ))}
        </Select>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Actividades</label>
          {actividades.map((actividad) => (
            <div key={actividad.id} className="flex items-center mb-2">
              <input
                type="checkbox"
                id={`actividad-${actividad.id}`}
                checked={actividadesSeleccionadas.includes(actividad.id)}
                onChange={() => handleActividadChange(actividad.id)}
                className="mr-2"
              />
              <label htmlFor={`actividad-${actividad.id}`}>{actividad.nombre}</label>
            </div>
          ))}
        </div>
        <Input
          type="date"
          label="Fecha Realizado"
          value={fechaRealizado}
          onChange={(e) => setFechaRealizado(e.target.value)}
        />
        <Input
          type="text"
          label="Observaciones"
          value={observaciones}
          onChange={(e) => setObservaciones(e.target.value)}
        />
        <Button type="submit">Registrar Mantenimiento</Button>
      </form>

      <h2 className="text-2xl font-bold mt-8 mb-4">Registros de Mantenimiento</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">Máquina</th>
              <th className="border border-gray-300 px-4 py-2">Actividades</th>
              <th className="border border-gray-300 px-4 py-2">Fecha Realizado</th>
              <th className="border border-gray-300 px-4 py-2">Próximo Mantenimiento</th>
              <th className="border border-gray-300 px-4 py-2">Observaciones</th>
            </tr>
          </thead>
          <tbody>
            {registros.map((registro) => (
              <tr key={registro.id}>
                <td className="border border-gray-300 px-4 py-2">{registro.maquinaNombre}</td>
                <td className="border border-gray-300 px-4 py-2">{registro.actividadesNombres}</td>
                <td className="border border-gray-300 px-4 py-2">{registro.fechaRealizado}</td>
                <td className="border border-gray-300 px-4 py-2">{registro.fechaProximo}</td>
                <td className="border border-gray-300 px-4 py-2">{registro.observaciones}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}