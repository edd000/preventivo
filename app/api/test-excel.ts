import type { NextApiRequest, NextApiResponse } from 'next'
import { leerDatosExcel } from '../../utils/excelUtils'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const maquinas = await leerDatosExcel('maquinas.xlsx', 'Maquinas')
    const actividades = await leerDatosExcel('maquinas.xlsx', 'Actividades')
    const registros = await leerDatosExcel('registros_mantenimiento.xlsx', 'Registros')

    res.status(200).json({
      maquinas: maquinas.slice(0, 5),
      actividades: actividades.slice(0, 5),
      registros: registros.slice(0, 5)
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}