'use client'

import { useState, useEffect } from 'react'
import { leerDatosExcel } from '../../utils/excelUtils'

interface Alerta {
  maquina: string;
  actividades: string;
  fechaProgramada: string;
  diasAtraso: number;
}

export default function AlertasMantenimiento() {
  const [alertas, setAlertas] = useState<Alerta[]>([])

  useEffect(() => {
    async function cargarAlertas() {
      try {
        const registrosData = await leerDatosExcel('registros_mantenimiento.xlsx', 'Registros')

        const registros = registrosData.map((fila: any[]) => ({
          maquinaNombre: fila[1],
          actividadesNombres: fila[2],
          fechaRealizado: new Date(fila[3]),
          fechaProximo: new Date(fila[4])
        }))

        const hoy = new Date()
        const alertasGeneradas: Alerta[] = []

        // Agrupar registros por máquina
        const registrosPorMaquina = registros.reduce((acc, registro) => {
          if (!acc[registro.maquinaNombre]) {
            acc[registro.maquinaNombre] = []
          }
          acc[registro.maquinaNombre].push(registro)
          return acc
        }, {} as Record<string, typeof registros>)

        // Generar alertas solo para el mantenimiento más reciente de cada máquina
        Object.entries(registrosPorMaquina).forEach(([maquina, registrosMaquina]) => {
          const ultimoMantenimiento = registrosMaquina.reduce((ultimo, actual) => 
            actual.fechaRealizado > ultimo.fechaRealizado ? actual : ultimo
          )

          if (ultimoMantenimiento.fechaProximo < hoy) {
            alertasGeneradas.push({
              maquina: ultimoMantenimiento.maquinaNombre,
              actividades: ultimoMantenimiento.actividadesNombres,
              fechaProgramada: ultimoMantenimiento.fechaProximo.toISOString().split('T')[0],
              diasAtraso: Math.floor((hoy.getTime() - ultimoMantenimiento.fechaProximo.getTime()) / (1000 * 3600 * 24))
            })
          }
        })

        setAlertas(alertasGeneradas)
      } catch (error) {
        console.error('Error al cargar las alertas:', error)
      }
    }

    cargarAlertas()
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Alertas de Mantenimiento</h1>
      {alertas.length === 0 ? (
        <p>No hay mantenimientos atrasados.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">Máquina</th>
              <th className="border border-gray-300 px-4 py-2">Actividades</th>
              <th className="border border-gray-300 px-4 py-2">Fecha Programada</th>
              <th className="border border-gray-300 px-4 py-2">Días de Atraso</th>
            </tr>
          </thead>
          <tbody>
            {alertas.map((alerta, index) => (
              <tr key={index} className="bg-red-100">
                <td className="border border-gray-300 px-4 py-2">{alerta.maquina}</td>
                <td className="border border-gray-300 px-4 py-2">{alerta.actividades}</td>
                <td className="border border-gray-300 px-4 py-2">{alerta.fechaProgramada}</td>
                <td className="border border-gray-300 px-4 py-2">{alerta.diasAtraso}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}