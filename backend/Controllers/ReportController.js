const Excel = require('exceljs');
const mysql = require('mysql2');
const pool = mysql.createPool(process.env.DATABASE_URL);
const path = require('path');
const Mexp = require('math-expression-evaluator');


async function obtenerCompaniasActivas() {
  const sqlCompaniasActivas = `
    SELECT id_cia, posic_cia, nombre_cia
    FROM am_compania
    WHERE activa = 1
    ORDER BY posic_cia, nombre_cia
  `;

  try {
    const [companias] = await pool.promise().query(sqlCompaniasActivas);
    //console.log(companias);
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
    const mapeoEnc = rows[0] || {};
    return mapeoEnc;
  } catch (error) {
    console.error('error', error);
    throw error;
  }
}

//Sacamos la Linea
async function seqLine(idEncabezado, numTab) {
  const sqlseqLine = `SELECT distinct seq_lin
                      FROM am_mapeo_det
                      WHERE id_map_enc = ?
					  AND tab_num = ?
                      AND tipo_det = 'H'
                      ORDER BY seq_lin`;
  try {
    const [rows] = await pool
      .promise()
      .query(sqlseqLine, [idEncabezado.id, numTab]); //const [rows] me limpia el metadato que trae el array
    const resultadoSeqLine = rows || []; //si es rows si es vacio array vacio
    return resultadoSeqLine;
  } catch (error) {
    console.error('error', error);
    throw error;
  }
}

//Encabezado
async function obtenerEncabezados(idMapeo, numTab, seqLins) {
  try {
    let encabezados = [];

    for (let i = 0; i < seqLins.length; i++) {
      const seqLin = seqLins[i].seq_lin;
      const sqlEnc = `
        SELECT val_fijo, val_def
        FROM am_mapeo_det
        WHERE id_map_enc = ?
	    	AND tab_num = ?
        AND tipo_det = 'H'
        AND seq_lin = ?
        ORDER BY seq_lin, seq_dest, seq_orig`;

      //console.log('QUERY ENCABEZADO', sqlEnc, idMapeo, numTab, seqLin);

      const [rows] = await pool
        .promise()
        .query(sqlEnc, [idMapeo, numTab, seqLin]);

      encabezados = [rows] || [];
    }
//console.log('ESTO SON LOS ENCABEZADOS!!!!!!!11',encabezados);
    return encabezados;
  } catch (error) {
    console.error('error', error);
    throw error;
  }
}

//Nombre tab y numero
async function nombreTab(idEncabezado) {
  try {
    const sqlGetTab = `SELECT DISTINCT tab_num, tab_nombre
  FROM amigdb.am_mapeo_det
  WHERE id_map_enc = ? AND tipo_det = 'D'
  ORDER BY 1`;

  //  console.log(sqlGetTab);
    const [rows] = await pool.promise().query(sqlGetTab, [idEncabezado]);
    const resultadoTab = rows || {};
    return resultadoTab;
  } catch (error) {
    console.error('error', error);
    throw error;
  }
}

//Detalle
async function obtenerDetallesD(idEncabezado, numTab) {
  //poner idTab despues

  const sqlDetallesD = `
    SELECT campo_orig, id_tipo_dato_orig, presic_orig_1, presic_orig_2, val_def, val_fijo, tabla_orig, where_cond
    FROM am_mapeo_det
    WHERE id_map_enc = ?
    AND tab_num = ?
    AND tipo_det = 'D'
    AND seq_lin = 1
    ORDER BY seq_dest, seq_orig    
  `;

  try {
    const [detalles] = await pool
      .promise()
      .query(sqlDetallesD, [idEncabezado, numTab]);
    return detalles;
  } catch (error) {
    console.error('Error al obtener detalles D:', error);
    throw error;
  }
}

async function obtenerDetalleTab(idEncabezado, tabs) {
  let detallesConTabs = [];

  for (const key in tabs) {
    const detallesPorTab = await obtenerDetallesD(idEncabezado, key.tab_num);

    detallesConTabs.push({
      tab_nombre: key.tab_nombre,
      detalles: detallesPorTab,
    });
  }
  return detallesConTabs;
}


function transformarResultados(resultados) {
  let contadorColumna = 1;

  return resultados.map((resultado, index) => {
    if (typeof resultado === 'object' && !Array.isArray(resultado) && resultado !== null) {
      const [clave, valor] = Object.entries(resultado)[0];
      let tipo;
      if (index === 0) {
        tipo = 'posic_cia';
      } else if (index === 1) {
        tipo = 'nombre_cia';
      } else {
        tipo = `Columna ${contadorColumna++}`; 
      }
      return { tipo, valor };
    } else if (Array.isArray(resultado) && resultado[0]) {
      const [clave, valor] = Object.entries(resultado[0])[0];
      let tipo = `Columna ${contadorColumna++}`; 
      return { tipo, valor };
    } else {
      return { tipo: `Columna ${contadorColumna++}`, valor: resultado };
    }
  });
}


const ZZZ_ANIO = '2023';
const ZZZ_MES = '6';
const ZZZ_ANIO_ANT = '2022';

async function consultaDinamica(idCia, detalles) {
  const resultados = [];
  let ZZZ_COMP = idCia;
  let valorParaZZZ_4 = '0';
  let valorParaZZZ_3 = '0';
  let valorParaZZZ_6 = '0';
  let valorParaZZZ_7 = '0';
  let valorParaZZZ_9 = '0';
  let valorParaZZZ_10 = '0';
  let valorParaZZZ_12 = '0';
  let valorParaZZZ_13 = '0';
  let valorParaZZZ_16 = '0';
  let valorParaZZZ_15 = '0';
  let valorParaZZZ_19 = '0';

  for (let i = 0; i < detalles.length; i++) {
    let detalle = detalles[i];

    if (detalle.val_fijo !== null) {
      let valorDinamico;
      if (detalle.val_fijo.startsWith('=')) {
        const expression = detalle.val_fijo.slice(1); 
         const parsedExpression = expression
         .replace(/\{ZZZ_7\}/g, valorParaZZZ_7)
         .replace(/\{ZZZ_3\}/g, valorParaZZZ_3)
         .replace(/\{ZZZ_4\}/g, valorParaZZZ_4)
         .replace(/\{ZZZ_6\}/g, valorParaZZZ_6)
         .replace(/\{ZZZ_9\}/g, valorParaZZZ_9)
         .replace(/\{ZZZ_10\}/g, valorParaZZZ_10)
         .replace(/\{ZZZ_12\}/g, valorParaZZZ_12)
         .replace(/\{ZZZ_13\}/g, valorParaZZZ_13)
         .replace(/\{ZZZ_15\}/g, valorParaZZZ_15)
         .replace(/\{ZZZ_16\}/g, valorParaZZZ_16)
         .replace(/\{ZZZ_19\}/g, valorParaZZZ_19);

     const mexp = new Mexp();
     valorDinamico = mexp.eval(parsedExpression);
      } else {
        valorDinamico = detalle.val_fijo !== '' ? detalle.val_fijo : detalle.val_def;
      }
      resultados.push({['Columna ' + i]: valorDinamico });
    } else {
      let sqlDinamica = detalle.campo_orig
        .replace(/\{ZZZ_ANIO\}/g, ZZZ_ANIO)
        .replace(/\{ZZZ_MES\}/g, ZZZ_MES)
        .replace(/\{ZZZ_ANIO_ANT\}/g, ZZZ_ANIO_ANT)
        .replace(/\{ZZZ_4\}/g, valorParaZZZ_4)
        .replace(/\{ZZZ_3\}/g, valorParaZZZ_3)
        .replace(/\{ZZZ_6\}/g, valorParaZZZ_6)
        .replace(/\{ZZZ_7\}/g, valorParaZZZ_7)
        .replace(/\{ZZZ_9\}/g, valorParaZZZ_9)
        .replace(/\{ZZZ_10\}/g, valorParaZZZ_10)
        .replace(/\{ZZZ_12\}/g, valorParaZZZ_12)
        .replace(/\{ZZZ_19\}/g, valorParaZZZ_19)
        .replace(/\{ZZZ_13\}/g, valorParaZZZ_13)
        .replace(/\{ZZZ_15\}/g, valorParaZZZ_15)
        .replace(/\{ZZZ_16\}/g, valorParaZZZ_16);
//console.log('ESTA ES LA CONSULTA DINAMICA ',sqlDinamica);

      let tablaOrig = detalle.tabla_orig;
      let whereCond = detalle.where_cond
        .replace(/\{ZZZ_ANIO\}/g, ZZZ_ANIO)
        .replace(/\{ZZZ_MES\}/g, ZZZ_MES)
        .replace(/\{ZZZ_ID_CIA\}/g, ZZZ_COMP)
        .replace(/\{ZZZ_ANIO_ANT\}/g, ZZZ_ANIO_ANT);

      let consultaFinal = `SELECT ${sqlDinamica} FROM ${tablaOrig} WHERE ${whereCond}`;
    //  console.log('Consulta Final: ',consultaFinal);
      try {
        const [resultadoConsulta] = await pool.promise().query(consultaFinal);

        if (
          i === 3 &&
          resultadoConsulta &&
          resultadoConsulta.length > 0 &&
          resultadoConsulta[0].importe
        ) {
          valorParaZZZ_4 = resultadoConsulta[0].importe.toString();
        }
        if (
          i === 2 &&
          resultadoConsulta &&
          resultadoConsulta.length > 0 &&
          resultadoConsulta[0].importe
        ) {
          valorParaZZZ_3 = resultadoConsulta[0].importe.toString();
        }
        if (
          i === 6 &&
          resultadoConsulta &&
          resultadoConsulta.length > 0 &&
          resultadoConsulta[0].importe
        ) {
          valorParaZZZ_7 = resultadoConsulta[0].importe.toString();
        }
        if (
          i === 8 &&
          resultadoConsulta &&
          resultadoConsulta.length > 0 &&
          resultadoConsulta[0].importe
        ) {
          valorParaZZZ_9 = resultadoConsulta[0].importe.toString();
        }
        if (
          i === 9 &&
          resultadoConsulta &&
          resultadoConsulta.length > 0 &&
          resultadoConsulta[0].importe
        ) {
          valorParaZZZ_10 = resultadoConsulta[0].importe.toString();
        }
        if (
          i === 5 &&
          resultadoConsulta &&
          resultadoConsulta.length > 0 &&
          resultadoConsulta[0].importe
        ) {
          valorParaZZZ_6 = resultadoConsulta[0].importe.toString();
        }
        if (
          i === 12 &&
          resultadoConsulta &&
          resultadoConsulta.length > 0 &&
          resultadoConsulta[0].importe
        ) {
          valorParaZZZ_13 = resultadoConsulta[0].importe.toString();
        }
        if (
          i === 15 &&
          resultadoConsulta &&
          resultadoConsulta.length > 0 &&
          resultadoConsulta[0].importe
        ) {
          valorParaZZZ_16 = resultadoConsulta[0].importe.toString();
        }
        if (
          i === 18 &&
          resultadoConsulta &&
          resultadoConsulta.length > 0 &&
          resultadoConsulta[0].importe
        ) {
          valorParaZZZ_19 = resultadoConsulta[0].importe.toString();
        }
        if (
          i === 14 &&
          resultadoConsulta &&
          resultadoConsulta.length > 0 &&
          resultadoConsulta[0].importe
        ) {
          valorParaZZZ_15 = resultadoConsulta[0].importe.toString();
        }
        if (
          i === 11 &&
          resultadoConsulta &&
          resultadoConsulta.length > 0 &&
          resultadoConsulta[0].importe
        ) {
          valorParaZZZ_12 = resultadoConsulta[0].importe.toString();
        }
      
        resultados.push(resultadoConsulta);
      } catch (error) {
        console.error('Error al ejecutar consulta dinámica:', error);
      }
    }
  }
const resultadosTransformadosDetalle = transformarResultados(resultados);
  
return resultadosTransformadosDetalle;
}

async function reporteMapExcel(resultados) {
  const rutaEntrada = path.join(
    __dirname,
    '..',
    'Reportes',
    'ramo_administrativas.xlsx'
  );
  const rutaSalida = path.join(
    __dirname,
    '..',
    'Resultados',
    'ramo_administrativas_resultado.xlsx'
  );

  const workbook = new Excel.Workbook();
  await workbook.xlsx.readFile(rutaEntrada);

  const sheet = workbook.getWorksheet('PD');

  let filaActual = 15;

  if (resultados[0] && resultados[0].length > 0) {
    sheet.getCell(`A${filaActual}`).value = resultados[0][0].posic_cia;
  }

  if (resultados[1] && resultados[1].length > 0) {
    sheet.getCell(`B${filaActual}`).value = resultados[1][0].nombre_cia;
  }

  await workbook.xlsx.writeFile(rutaSalida);
  console.log('Archivo modificado con éxito en:', rutaSalida);
}

/*
async function ejecutarGrid(resultadosConsultaDinamica) {
  try {
    const datosGrid = resultadosConsultaDinamica.map((resultado) => {
      return {
        posicion: resultado.posic_cia,
        compania: resultado.nombre_cia,
      };
    });

    return datosGrid;
  } catch (error) {
    console.error('Error al ejecutar Grid:', error);
    throw error;
  }
}
*/
//Ejecuta todas las funciones
/*exports.ejecutarFunciones2 = async (req, res) => {
  try {
    const resultadoId = await getId();

    console.log('Resultado de getId:', resultadoId);

    const resultadoSeqLine = await seqLine(resultadoId);
    //  console.log('Resultado de seqLine:', resultadoSeqLine);

    const encabezados = await obtenerEncabezados(
      resultadoId.id,
      resultadoSeqLine
    );
    //    console.log('Resultado de encabezados:', encabezados);

    const companiasActivas = await obtenerCompaniasActivas();
    //  console.log('Compañías activas:', companiasActivas);

    const resultadoTab = await nombreTab(resultadoId.id);
         console.log('RESULTADO DE TAB', resultadoTab, resultadoId.id);


    const detallesD = await obtenerDetallesD(resultadoId.id);
   // console.log('Detalles para el Select:', detallesD);

//const detallesConTabs = await obtenerDetalleTab(resultadoId, resultadoTab);
//console.log("DETALLES CON TABS",detallesConTabs)
    const resultados = await consultaDinamica(detallesD);
    console.log(
      'Resultados para el Select de las consultas dinamicas:',
      resultados
    );

    // const datosParaGrid = await ejecutarGrid(resultados);
    //console.log('Datos para el Grid:', datosParaGrid);

    const rutaSalida = await reporteMapExcel(resultados);
    // Enviar el archivo Excel como respuesta
    res.download(rutaSalida, 'excel_resultado.xlsx');
  } catch (error) {
    console.error('Error al ejecutar funciones:', error);
  }
};
*/



//ejecutar OK 
exports.ejecutarFunciones = async (req, res) => {
  try {
    const mapeoEnc = await getId();
    // console.log('Resultado de getId:', resultadoId);

    const resultadoTab = await nombreTab(mapeoEnc.id);
    //console.log('RESULTADO DE TAB', resultadoTab, resultadoId.id); obtenerDetalleTab ?

    let datosTotal = [];

    for (let tabElem of resultadoTab) {
      const resultadoSeqLine = await seqLine(mapeoEnc.id, tabElem.tab_num);
      let datosTab = {
        tab_nombre: tabElem.tab_nombre,
        encabezados: [],
        detalles: [],
      };
    
      for (let lineaEnc of resultadoSeqLine) {
        const encabezado = await obtenerEncabezados(
          mapeoEnc.id,
          tabElem.tab_num,
          lineaEnc.seq_lin
        );
        datosTab.encabezados.push(...encabezado);
      }
    
      const companias = await obtenerCompaniasActivas();
      const detallesD = await obtenerDetallesD(mapeoEnc.id, tabElem.tab_num);
    
      for (let compania of companias) {
        console.log(`Procesando compañía: ${compania.nombre_cia}`);
        const resultados = await consultaDinamica(compania.id_cia, detallesD);
        console.log(`Resultados para la compañía ${compania.nombre_cia}:`, resultados);
     
        datosTab.detalles.push(...resultados);
      }
    
      datosTotal.push(datosTab);
    }

    //genera el reporte Excel
    const rutaSalida = await reporteMapExcel(datosTotal);
    res.download(rutaSalida, 'excel_resultado.xlsx');
  } catch (error) {
    console.error('Error al ejecutar funciones:', error);
    res.status(500).send('Ocurrió un error al generar el reporte');
  }
};
//ejecutarFunciones();

/*
exports.ejecutarFunciones = async (req, res) => {
  try {
    const mapeoEnc = await getId();

    console.log('Resultado de getId:', mapeoEnc);

    const reporteTabs = await nombreTab(mapeoEnc.id);
    console.log('RESULTADO DE TAB', reporteTabs, mapeoEnc.id);

    let datosTotal = [];

    for (let tabElem of reporteTabs) {
      const lineasEnc = await seqLine(mapeoEnc.id, tabElem.tab_num);

      for (let lineaEnc of lineasEnc) {
        const encabezados = await obtenerEncabezados(mapeoEnc.id, reporteTabs.tab_num, lineaEnc);

        const companias = await obtenerCompaniasActivas();

        const detallesD = await obtenerDetallesD(mapeoEnc.id, reporteTabs.tab_num);

        for (let compania of companias) {
          const resultadosTransformadosDetalle = await consultaDinamica(compania.id_cia, detallesD);
          console.log('Resultados para el Select de las consultas dinamicas:', resultadosTransformadosDetalle);
          datosTotal = datosTotal.concat(resultadosTransformadosDetalle);
        }
      }
    }

   // const rutaSalida = await reporteMapExcel(datosTotal);
    //res.download(rutaSalida, 'excel_resultado.xlsx');
  } catch (error) {
    console.error('Error al ejecutar funciones:', error);
  }
};
*/
