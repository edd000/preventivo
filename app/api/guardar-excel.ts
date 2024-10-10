import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import ExcelJS from 'exceljs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const { contenido } = req.body;

  if (!contenido) {
    return res.status(400).json({ message: 'Faltan datos requeridos' });
  }

  try {
    // Definir el nombre fijo del archivo
    const filePath = path.join(process.cwd(), 'public', 'registros_mantenimiento.xlsx');
    const workbook = new ExcelJS.Workbook();

    // Verificar si el archivo existe
    if (fs.existsSync(filePath)) {
      console.log('El archivo existe, cargándolo...');
      await workbook.xlsx.readFile(filePath);
    } else {
      console.log('El archivo no existe, creando uno nuevo...');
    }

    // Obtener la hoja 'Registros' o crearla si no existe
    let worksheet = workbook.getWorksheet('Registros');
    if (!worksheet) {
      console.log('Creando nueva hoja "Registros"');
      worksheet = workbook.addWorksheet('Registros');
      
      // Añadir encabezados si es un archivo nuevo
      worksheet.addRow(['ID', 'Máquina ID', 'Actividades IDs', 'Fecha Realizado', 'Fecha Próximo', 'Observaciones']);
    }

    // Añadir el nuevo registro
    worksheet.addRow(contenido);

    // Guardar el archivo
    await workbook.xlsx.writeFile(filePath);
    console.log('Archivo guardado correctamente en:', filePath);

    res.status(200).json({ message: 'Archivo guardado correctamente' });
  } catch (error) {
    console.error('Error al guardar el archivo:', error);
    res.status(500).json({ message: 'Error al guardar el archivo', error: error.message });
  }
}