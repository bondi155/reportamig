const Excel = require('exceljs');

async function getValueImport () {


}



async function createReportWithFormulas(data) {
  const workbook = new Excel.Workbook();
  await workbook.xlsx.readFile('ramo_administrativas.xlsx');
  const worksheet = workbook.getWorksheet('Sheet1');
  worksheet.getCell('A1').value = data.importe1; // Importe inicial 1
  worksheet.getCell('A2').value = data.importe2; // Importe inicial 2
  worksheet.getCell('A3').value = data.importe3; // Importe inicial 3

  worksheet.getCell('B1').value = { formula: 'A1/2', result: undefined };
  worksheet.getCell('B2').value = { formula: 'A2/4', result: undefined };
  worksheet.getCell('B3').value = { formula: 'A3/8', result: undefined };

  // Esta celda tiene una fórmula que suma los resultados de las fórmulas anteriores.
  worksheet.getCell('C1').value = { formula: 'B1+B2+B3', result: undefined };

  // Guardar el archivo Excel con las fórmulas.
  await workbook.xlsx.writeFile('path/to/newReport.xlsx');
}

// Datos iniciales para el reporte.
createReportWithFormulas({
  importe1: 1000,
  importe2: 2000,
  importe3: 3000
});
