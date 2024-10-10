'use client'

import { useState, useEffect } from 'react'
import { leerDatosExcel } from '../../utils/excelUtils'

interface Maquina {
  id: number;
  nombre: string;
  frecuencia: number;
}

const maquinasPorDefecto: Maquina[] = [
  { id: 1, nombre: "Máquina 1", frecuencia: 30 },
  { id: 2, nombre: "Máquina 2", frecuencia: 60 },
  { id: 3, nombre: "Máquina 3", frecuencia: 90 },
];

export default function ListadoMaquinas() {
  const [maquinas, setMaquinas] = useState<Maquina[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function cargarMaquinas() {
      try {
        console.log('Iniciando carga de máquinas...');
        const datos = await leerDatosExcel('maquinas.xlsx', 'Maquinas');
        console.log('Datos obtenidos:', datos);
        if (datos.length === 0) {
          throw new Error('No se encontraron datos en el archivo Excel');
        }
        const maquinasCargadas = datos.map((fila: any[]) => ({
          id: fila[0] as number,
          nombre: fila[1] as string,
          frecuencia: fila[2] as number
        }));
        console.log('Máquinas cargadas:', maquinasCargadas);
        setMaquinas(maquinasCargadas);
        setError(null);
      } catch (error) {
        console.error('Error al cargar las máquinas:', error);
        setError(`No se pudieron cargar las máquinas. Error: ${error.message}`);
        setMaquinas(maquinasPorDefecto);
      } finally {
        setLoading(false);
      }
    }
    cargarMaquinas();
  }, [])

  if (loading) {
    return <div>Cargando máquinas...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Listado de Máquinas</h1>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      <table className="w-full mt-4 border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 border border-gray-300">ID</th>
            <th className="px-4 py-2 border border-gray-300">Nombre</th>
            <th className="px-4 py-2 border border-gray-300">Frecuencia de Mantenimiento (días)</th>
          </tr>
        </thead>
        <tbody>
          {maquinas.map((maquina) => (
            <tr key={maquina.id} className="hover:bg-gray-50">
              <td className="border border-gray-300 px-4 py-2">{maquina.id}</td>
              <td className="border border-gray-300 px-4 py-2">{maquina.nombre}</td>
              <td className="border border-gray-300 px-4 py-2">{maquina.frecuencia}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}