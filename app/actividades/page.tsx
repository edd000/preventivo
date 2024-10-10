'use client'

import { useState, useEffect } from 'react'
import { leerDatosExcel } from '../../utils/excelUtils'

interface Actividad {
  id: number;
  nombre: string;
  descripcion: string;
}

const actividadesPorDefecto: Actividad[] = [
  { id: 1, nombre: "Actividad 1", descripcion: "Descripción 1" },
  { id: 2, nombre: "Actividad 2", descripcion: "Descripción 2" },
  { id: 3, nombre: "Actividad 3", descripcion: "Descripción 3" },
];

export default function ListadoActividades() {
  const [actividades, setActividades] = useState<Actividad[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function cargarActividades() {
      try {
        console.log('Iniciando carga de actividades...');
        const datos = await leerDatosExcel('maquinas.xlsx', 'Actividades');
        console.log('Datos obtenidos:', datos);
        const actividadesCargadas = datos.map((fila: any[]) => ({
          id: fila[0] as number,
          nombre: fila[1] as string,
          descripcion: fila[2] as string
        }));
        console.log('Actividades cargadas:', actividadesCargadas);
        setActividades(actividadesCargadas);
        setError(null);
      } catch (error) {
        console.error('Error al cargar las actividades:', error);
        setError(`No se pudieron cargar las actividades. Error: ${error.message}`);
        setActividades(actividadesPorDefecto);
      } finally {
        setLoading(false);
      }
    }
    cargarActividades();
  }, [])

  if (loading) {
    return <div>Cargando actividades...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Listado de Actividades</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <table className="w-full mt-4 border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 border border-gray-300">ID</th>
            <th className="px-4 py-2 border border-gray-300">Nombre</th>
            <th className="px-4 py-2 border border-gray-300">Descripción</th>
          </tr>
        </thead>
        <tbody>
          {actividades.map((actividad) => (
            <tr key={actividad.id} className="hover:bg-gray-50">
              <td className="border border-gray-300 px-4 py-2">{actividad.id}</td>
              <td className="border border-gray-300 px-4 py-2">{actividad.nombre}</td>
              <td className="border border-gray-300 px-4 py-2">{actividad.descripcion}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}