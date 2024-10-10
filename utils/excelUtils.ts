import ExcelJS from 'exceljs';

export async function leerDatosExcel(archivo: string, hoja: string) {
  try {
    console.log('Intentando leer archivo:', archivo);
    const response = await fetch(`/${archivo}`);
    
    if (!response.ok) {
      console.error('Error en la respuesta:', response.status, response.statusText);
      const text = await response.text();
      console.error('Contenido de la respuesta:', text);
      throw new Error(`No se pudo obtener el archivo ${archivo}. Status: ${response.status}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    console.log('Archivo obtenido, tamaño:', arrayBuffer.byteLength, 'bytes');

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(arrayBuffer);
    console.log('Archivo Excel cargado correctamente');

    console.log('Hojas disponibles:', workbook.worksheets.map(ws => ws.name));

    const worksheet = workbook.getWorksheet(hoja);
    if (!worksheet) {
      throw new Error(`La hoja "${hoja}" no se encontró en el archivo "${archivo}". Hojas disponibles: ${workbook.worksheets.map(ws => ws.name).join(', ')}`);
    }
    console.log('Hoja encontrada:', hoja);

    const datos = [];
    worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
      if (rowNumber !== 1) { // Ignorar la fila de encabezados
        datos.push(row.values.slice(1));
      }
    });
    
    console.log('Datos leídos:', datos.length, 'filas');
    console.log('Muestra de datos:', datos.slice(0, 3));
    return datos;
  } catch (error) {
    console.error(`Error al leer el archivo Excel ${archivo}:`, error);
    throw error;
  }
}

export async function escribirDatosExcel(archivo: string, hoja: string, datos: any[]) {
  try {
    console.log('Intentando escribir en el archivo:', archivo);
    console.log('Datos a escribir:', datos);

    const res = await fetch('/api/guardar-excel', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contenido: datos[0] // Enviamos solo la nueva fila
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Error en la respuesta del servidor:', res.status, res.statusText, errorText);
      throw new Error(`Error al guardar el archivo: ${res.statusText}`);
    }

    const responseData = await res.json();
    console.log('Respuesta del servidor:', responseData);

    console.log('Archivo guardado correctamente');
  } catch (error) {
    console.error(`Error al escribir el archivo Excel ${archivo}:`, error);
    throw error;
  }
}