const Excel = require('exceljs');
const mysql = require('mysql2');
const pool = mysql.createPool(process.env.DATABASE_URL);
const path = require('path');

async function obtenerCompaniasActivas() {
  const sqlCompaniasActivas = `
    SELECT id_cia, posic_cia, nombre_cia
    FROM am_compania
    WHERE activa = 1
    ORDER BY posic_cia, nombre_cia
  `;

  try {
    const [companias] = await pool.promise().query(sqlCompaniasActivas);
    console.log(companias);
    return companias;
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
    const [rows] = await pool.promise().query(sqlseqLine, [resultadoId.id]); //const [rows] me limpia el metadato que trae el array 
    const resultadoSeqLine = rows || [];
    return resultadoSeqLine;
  } catch (error) {
    console.error('error', error);
    throw error;
  }
}

//Encabezado
async function obtenerEncabezados(idMapEnc, seqLins) {
  try {
    let encabezados = [];
// si tengo val fijo devuelvo fal fijo
    //si tiene val fijo que use el valfijo y no ejecute query , si val_fijo es null , ejecute el query y si el query no trae nada , que ponga lo que esta en val_def 

    for (let i = 0; i < seqLins.length; i++) {
      const seqLin = seqLins[i].seq_lin;
      const sqlEnc = `
        SELECT val_fijo, val_def
        FROM am_mapeo_det
        WHERE id_map_enc = ?
        AND tipo_det = 'H'
        AND seq_lin = ?
        ORDER BY seq_lin, seq_dest, seq_orig`;

      const [rows] = await pool.promise().query(sqlEnc, [idMapEnc, seqLin]);

      encabezados = [rows] || [];
    }

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
const ZZZ_COMP = '01';


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
      .replace(/\{ZZZ_ID_CIA\}/g, ZZZ_COMP)
      .replace(/\{\$ZZZ_ANIO_ANT\}/g, ZZZ_ANIO_ANT);

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

async function cargarYModificarExcel(resultados) {
  const rutaArchivoEntrada = path.join(__dirname, '..', 'Reportes', 'ramo_administrativas.xlsx');
  const rutaArchivoSalida = path.join(__dirname, '..', 'Resultados', 'ramo_administrativas_resultado.xlsx');

  const workbook = new Excel.Workbook();
  await workbook.xlsx.readFile(rutaArchivoEntrada);

  const sheet = workbook.getWorksheet('PD'); 

  
  let filaActual = 15;

  if (resultados[0] && resultados[0].length > 0) {
    sheet.getCell(`A${filaActual}`).value = resultados[0][0].posic_cia;
  }
  if (resultados[1] && resultados[1].length > 0) {
    sheet.getCell(`B${filaActual}`).value = resultados[1][0].nombre_cia;
  }

  await workbook.xlsx.writeFile(rutaArchivoSalida);
  console.log('Archivo modificado con éxito en:', rutaArchivoSalida);
}

//Ejecuta todas las funciones
async function ejecutarFunciones() {
  try {
    const resultadoId = await getId();

    console.log('Resultado de getId:', resultadoId);

    const resultadoSeqLine = await seqLine(resultadoId);
   // console.log('Resultado de seqLine:', resultadoSeqLine);

    const encabezados = await obtenerEncabezados(
      resultadoId.id,
      resultadoSeqLine
    );
 //   console.log('Resultado de encabezados:', encabezados);

    const companiasActivas = await obtenerCompaniasActivas();
    //console.log('Compañías activas:', companiasActivas);

    const detallesD = await obtenerDetallesD(resultadoId.id);
  //  console.log('Detalles para el Select:', detallesD);

    const resultados = await ejecutarConsultasDinamicas(detallesD);
    console.log(
      'Resultados para el Select de las consultas dinamicas:',
      resultados
    );

  await cargarYModificarExcel(resultados);    
  } catch (error) {
    console.error('Error al ejecutar funciones:', error);
  }
}





ejecutarFunciones();

//bueno fijarse lo q preguntaste en whatsapp y despues fijarte las funciones para armar el select

module.exports = { getId, seqLine, ejecutarFunciones };
