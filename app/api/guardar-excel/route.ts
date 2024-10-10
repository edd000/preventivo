import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import ExcelJS from 'exceljs';

export async function POST(request: Request) {
  try {
    const { contenido } = await request.json();

    if (!contenido) {
      return NextResponse.json({ error: 'Faltan datos requeridos' }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), 'public', 'registros_mantenimiento.xlsx');
    const workbook = new ExcelJS.Workbook();

    if (fs.existsSync(filePath)) {
      console.log('El archivo existe, cargándolo...');
      await workbook.xlsx.readFile(filePath);
    } else {
      console.log('El archivo no existe, creando uno nuevo...');
    }

    let worksheet = workbook.getWorksheet('Registros');
    if (!worksheet) {
      console.log('Creando nueva hoja "Registros"');
      worksheet = workbook.addWorksheet('Registros');
      worksheet.addRow(['ID', 'Máquina ID', 'Actividades IDs', 'Fecha Realizado', 'Fecha Próximo', 'Observaciones']);
    }

    worksheet.addRow(contenido);

    await workbook.xlsx.writeFile(filePath);
    console.log('Archivo guardado correctamente en:', filePath);

    return NextResponse.json({ message: 'Archivo guardado correctamente' });
  } catch (error) {
    console.error('Error al guardar el archivo:', error);
    return NextResponse.json({ error: 'Error al guardar el archivo' }, { status: 500 });
  }
}