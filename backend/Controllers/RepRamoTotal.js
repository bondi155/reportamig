const Excel = require('exceljs');
const mysql = require('mysql2');
const pool = mysql.createPool(process.env.DATABASE_URL);

async function obtenerCompaniasActivas() {
  const sqlCompaniasActivas = `
    SELECT id_cia, posic_cia, nom_cia
    FROM am_compania
    WHERE activa = 1
    ORDER BY posic_cia, nom_cia
  `;

  try {
    const [companias] = await pool.promise().query(sqlCompaniasActivas);
    console.log(companias);
    return companias; // Devuelve la lista de compañías activas
  } catch (error) {
    console.error('Error al obtener compañías activas:', error);
    throw error;
  }
}

//Sacamos el id
async function getId() {
  const sqlGetId = `SELECT id, tab_orig, tab_dest 
  FROM am_mapeo_enc
  WHERE tipo_arc = 'S'`; //de ser necesario agregar separador en el select
  try {
    const [rows] = await pool.promise().query(sqlGetId);
    const resultadoId = rows[0] || {};
    console.log(resultadoId);
    return resultadoId;
  } catch (error) {
    console.error('error', error);
    throw error;
  }
}

//Sacamos la Linea
async function seqLine(resultadoId) {
  const sqlseqLine = `SELECT distinct seq_lin
                      FROM am_mapeo_det
                      WHERE id_map_enc = ?
                      AND tipo_det = 'H'
                      ORDER BY seq_lin`;
  try {
    const [rows] = await pool.promise().query(sqlseqLine, [resultadoId.id]); // Asegúrate de pasar un arreglo
    const resultadoSeqLine = rows || []; // Devuelve todas las filas
    console.log(resultadoSeqLine);
    return resultadoSeqLine; // Devuelve el arreglo completo
  } catch (error) {
    console.error('error', error);
    throw error;
  }
}

//Encabezado
async function obtenerEncabezados(idMapEnc, seqLins) {
  try {
    let encabezados = [];

    for (let i = 0; i < seqLins.length; i++) {
      const seqLin = seqLins[i].seq_lin;
      const sql = `
        SELECT val_fijo
        FROM am_mapeo_det
        WHERE id_map_enc = ?
        AND tipo_det = 'H'
        AND seq_lin = ?
        ORDER BY seq_lin, seq_dest, seq_orig`;

      const [rows] = await pool.promise().query(sql, [idMapEnc, seqLin]);

      const resultadoEnc = [rows] || [];
      console.log(resultadoEnc);
    }

    console.log(encabezados);
    return encabezados;
  } catch (error) {
    console.error('error', error);
    throw error;
  }
}

//Detalle

async function obtenerDetallesD(idMapEnc) {
  const sqlDetallesD = `
    SELECT campo_orig, id_tipo_dato_orig, presic_orig_1, presic_orig_2, val_def, tabla_orig, where_cond
    FROM am_mapeo_det
    WHERE id_map_enc = ?
    AND tipo_det = 'D'
    AND seq_lin = 1
    ORDER BY seq_dest, seq_orig
  `;

  try {
    const [detalles] = await pool.promise().query(sqlDetallesD, [idMapEnc]);
    return detalles;
  } catch (error) {
    console.error('Error al obtener detalles D:', error);
    throw error;
  }
}

const ZZZ_ANIO = '2023';
const ZZZ_MES = '06';
const ZZZ_ANIO_ANT = '2022';

async function ejecutarConsultasDinamicas(detalles) {
  const resultados = [];

  for (let detalle of detalles) {
    let sqlDinamica = detalle.campo_orig
      .replace(/\{ZZZ_ANIO\}/g, ZZZ_ANIO)
      .replace(/\{ZZZ_MES\}/g, ZZZ_MES)
      .replace(/\{ZZZ_ANIO_ANT\}/g, ZZZ_ANIO_ANT);
    let tablaOrig = detalle.tabla_orig;
    let whereCond = detalle.where_cond
      .replace(/\{\$ZZZ_ANIO\}/g, ZZZ_ANIO)
      .replace(/\{\$ZZZ_MES\}/g, ZZZ_MES)
      .replace(/\{ZZZ_ANIO_ANT\}/g, ZZZ_ANIO_ANT);

    let consultaFinal = `SELECT ${sqlDinamica} FROM ${tablaOrig} WHERE ${whereCond}`;

    try {
      const [resultadoConsulta] = await pool.promise().query(consultaFinal);
      resultados.push(resultadoConsulta);
    } catch (error) {
      console.error('Error al ejecutar consulta dinámica:', error);
    }
  }

  return resultados;
}

//Ejecuta todas las funciones
async function ejecutarFunciones() {
  try {
    const resultadoId = await getId();

    console.log('Resultado de getId:', resultadoId);

    const resultadoSeqLine = await seqLine(resultadoId);
    console.log('Resultado de seqLine:', resultadoSeqLine);

    const encabezados = await obtenerEncabezados(
      resultadoId.id,
      resultadoSeqLine
    );
    console.log('Resultado de encabezados:', encabezados);

    const companiasActivas = await obtenerCompaniasActivas();
    console.log('Compañías activas:', companiasActivas);

    const detallesD = await obtenerDetallesD(resultadoId.id);
    console.log('Detalles para el Select:', detallesD);

    const resultados = await ejecutarConsultasDinamicas(detallesD);
    console.log(
      'Resultados para el Select de las consultas dinamicas:',
      resultados
    );
  } catch (error) {
    console.error('Error al ejecutar funciones:', error);
  }
}

ejecutarFunciones();

//bueno fijarse lo q preguntaste en whatsapp y despues fijarte las funciones para armar el select

async function cargarYModificarExcel(rutaArchivo) {
  // Cargar el libro de Excel existente
  const workbook = new Excel.Workbook();
  const pdfPath = '../ramo_administrativas.xlsx';
  await workbook.xlsx.readFile(pdfPath);

  // Obtener la hoja de cálculo por su nombre
  const sheet = workbook.getWorksheet('PD');

  // Aquí puedes modificar la hoja como lo necesites, por ejemplo, añadir encabezados
  // Suponiendo que ya tienes un array 'encabezados' con los valores a insertar
  const encabezados = ['Posición', 'Compañía', 'Otras reservas']; // etc.

  // Asumiendo que quieres empezar a escribir en la segunda fila
  const filaInicio = 2;
  encabezados.forEach((encabezado, index) => {
    // Asumiendo que quieres añadir encabezados a partir de la columna B
    const colInicio = 'B';
    const cellRef = `${colInicio}${filaInicio + index}`;
    sheet.getCell(cellRef).value = encabezado;
  });

  // Guardar los cambios en el archivo
  await workbook.xlsx.writeFile(rutaArchivo);
  console.log('Archivo modificado con éxito.');
}

// Usar la función y pasar la ruta de tu archivo Excel
cargarYModificarExcel('ruta/a/ramo_administrativas.xlsx').catch(console.error);

module.exports = { getId, seqLine, ejecutarFunciones };
