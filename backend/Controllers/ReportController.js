const Excel = require('exceljs');
const mysql = require('mysql2');
const pool = mysql.createPool(process.env.DATABASE_URL);
const path = require('path');
const Mexp = require('math-expression-evaluator');
const { Console } = require('console');

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


//falta el valor de S como parametro 
//Sacamos el id el tipo de archivo va a venir depende que reporte elijamos en el nav
async function getId() {
  const sqlGetId = `SELECT id, tab_orig, tab_dest 
  FROM am_mapeo_enc
  WHERE tipo_arc = 'S'`; //de ser necesario agregar separador en el select
  try {
    const [rows] = await pool.promise().query(sqlGetId);
    const mapeoEnc = rows[0] || {};
    console.log(mapeoEnc);
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
    let encabezado = [];

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

      encabezado = [rows] || [];
    }
    //console.log('ESTO SON LOS ENCABEZADOS!!!!!!!11',encabezados);
    return encabezado;
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

async function obtenerDetalleTab(idEncabezado, tabs) {
  let detallesConTabs = [];

  for (const tab of tabs) {
    const detallesPorTab = await nombreTab(idEncabezado, tab.tab_num);

    detallesConTabs.push({
      tab_numero: tab.tab_num, //tab.tab_num
      tab_nombre: detallesPorTab,
    });
  }

  return detallesConTabs;
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

/*
function transformarResultados(resultados) {
  let contadorColumna = 1;

  return resultados.map((resultado, index) => {
    if (
      typeof resultado === 'object' &&
      !Array.isArray(resultado) &&
      resultado !== null
    ) {
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
*/
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
  let valorParaZZZ_8 = '0';
  let valorParaZZZ_9 = '0';
  let valorParaZZZ_10 = '0';
  let valorParaZZZ_12 = '0';
  let valorParaZZZ_13 = '0';
  let valorParaZZZ_14 = '0';
  let valorParaZZZ_16 = '0';
  let valorParaZZZ_15 = '0';
  let valorParaZZZ_19 = '0';

  let valIns;
  let valAComp;
  let consultaFinal;

  for (let i = 0; i < detalles.length; i++) {
    let detalle = detalles[i];

    let alias = 'col' + (i + 1);

    valIns = { [alias]: null };
    valAComp = null;

    if (detalle.val_fijo !== null) {
      let valorDinamico;
      if (detalle.val_fijo.startsWith('=')) {
        const expression = detalle.val_fijo.slice(1);
        const parsedExpression = expression
          .replace(/\{ZZZ_3\}/g, valorParaZZZ_3)
          .replace(/\{ZZZ_4\}/g, valorParaZZZ_4)
          .replace(/\{ZZZ_6\}/g, valorParaZZZ_6)
          .replace(/\{ZZZ_7\}/g, valorParaZZZ_7)
          .replace(/\{ZZZ_8\}/g, valorParaZZZ_8)
          .replace(/\{ZZZ_9\}/g, valorParaZZZ_9)
          .replace(/\{ZZZ_10\}/g, valorParaZZZ_10)
          .replace(/\{ZZZ_12\}/g, valorParaZZZ_12)
          .replace(/\{ZZZ_13\}/g, valorParaZZZ_13)
          .replace(/\{ZZZ_15\}/g, valorParaZZZ_15)
          .replace(/\{ZZZ_16\}/g, valorParaZZZ_16)
          .replace(/\{ZZZ_19\}/g, valorParaZZZ_19);


        const mexp = new Mexp();
        try {
          valorDinamico = mexp.eval(parsedExpression);
        } catch (e) {
          valorDinamico = null;
        }
      } else {
        valorDinamico =
          detalle.val_fijo !== '' ? detalle.val_fijo : detalle.val_def; //
      }
      //resultados.push({ [alias]: valorDinamico });
      valIns = { [alias]: valorDinamico };
    } else {

      let sqlDinamica = detalle.campo_orig
        .replace(/\{ZZZ_ANIO\}/g, ZZZ_ANIO)
        .replace(/\{ZZZ_MES\}/g, ZZZ_MES)
        .replace(/\{ZZZ_ID_CIA\}/g, ZZZ_COMP)
        .replace(/\{ZZZ_ANIO_ANT\}/g, ZZZ_ANIO_ANT)
        .replace(/\{ZZZ_4\}/g, valorParaZZZ_4)
        .replace(/\{ZZZ_3\}/g, valorParaZZZ_3)
        .replace(/\{ZZZ_6\}/g, valorParaZZZ_6)
        .replace(/\{ZZZ_7\}/g, valorParaZZZ_7)
        .replace(/\{ZZZ_8\}/g, valorParaZZZ_8)
        .replace(/\{ZZZ_9\}/g, valorParaZZZ_9)
        .replace(/\{ZZZ_10\}/g, valorParaZZZ_10)
        .replace(/\{ZZZ_12\}/g, valorParaZZZ_12)
        .replace(/\{ZZZ_19\}/g, valorParaZZZ_19)
        .replace(/\{ZZZ_13\}/g, valorParaZZZ_13)
        .replace(/\{ZZZ_14\}/g, valorParaZZZ_14)
        .replace(/\{ZZZ_15\}/g, valorParaZZZ_15)
        .replace(/\{ZZZ_16\}/g, valorParaZZZ_16);
      //console.log('ESTA ES LA CONSULTA DINAMICA ',sqlDinamica);

      let tablaOrig = detalle.tabla_orig; // AGREGAR SI TABLA_ORIG ES NULL AL QUERY QUE ARMO SOLO SELECT SIN FROM NI WHERE ELSE LO DE SIEMPRE

      if (tablaOrig === null) {
        consultaFinal = `SELECT ${sqlDinamica} AS ${alias}`; //
      } else {

        let whereCond = detalle.where_cond
          .replace(/\{ZZZ_ANIO\}/g, ZZZ_ANIO)
          .replace(/\{ZZZ_MES\}/g, ZZZ_MES)
          .replace(/\{ZZZ_ID_CIA\}/g, ZZZ_COMP)
          .replace(/\{ZZZ_ANIO_ANT\}/g, ZZZ_ANIO_ANT);

        consultaFinal = `SELECT ${sqlDinamica} AS ${alias} FROM ${tablaOrig} WHERE ${whereCond}`; //
      }
      //console.log(sqlDinamica);
      //  console.log('Consulta Final: ',consultaFinal);
      try {
        const [resultadoConsulta] = await pool.promise().query(consultaFinal);

        if (resultadoConsulta[0] && resultadoConsulta[0][alias] != null) {
          valAComp = resultadoConsulta[0][alias].toString();
        }
        if (i === 3) {
          valorParaZZZ_4 = valAComp;
        }
        if (i === 2) {
          valorParaZZZ_3 = valAComp;
        }
        if (i === 6) {
          valorParaZZZ_7 = valAComp;
        }
        if (i === 7) {
          valorParaZZZ_8 = valAComp;
        }
        if (i === 8) {
          valorParaZZZ_9 = valAComp;
        }
        if (i === 9) {
          valorParaZZZ_10 = valAComp;
        }
        if (i === 5) {
          valorParaZZZ_6 = valAComp;
        }
        if (i === 12) {
          valorParaZZZ_13 = valAComp;
        }
        if (i === 13) {
          valorParaZZZ_14 = valAComp;
        }
        if (i === 15) {
          valorParaZZZ_16 = valAComp;
        }
        if (i === 18) {
          valorParaZZZ_19 = valAComp;
        }
        if (i === 14) {
          valorParaZZZ_15 = valAComp;
        }
        if (i === 11) {
          valorParaZZZ_12 = valAComp;
        }
        //resultados.push(resultadoConsulta[0]);
        if (resultadoConsulta[0]) {
          valIns = resultadoConsulta[0];
        }
      } catch (error) {
        console.error('Error al ejecutar consulta dinámica:', error);
      }
    }
    if (valIns[alias] == null && detalle.val_def != null) {
      valIns = { [alias]: detalle.val_def };
    } else {
      if (
        detalle.id_tipo_dato_orig == 1 &&
        (isNaN(valIns[alias]) || !isFinite(valIns[alias]))
      ) {
        valIns[alias] = '0';
      } else {
        if (detalle.id_tipo_dato_orig == 1 && detalle.presic_orig_2 != null) {
          if (detalle.presic_dato_orig_2 == 0) {
            valIns[alias] = Math.round(valIns[alias]);
          } else {
            valIns[alias] = parseFloat(valIns[alias]).toFixed(detalle.presic_orig_2);
          }
          //Math.round((num + Number.EPSILON) * 100) / 10
        }
      }
    }
    resultados.push(valIns);
  }
  //const resultadosTransformadosDetalle = transformarResultados(resultados);

  return resultados;
}

async function reporteMapExcel(datosTotal, nombreArchivo) {
  const rutaEntrada = path.join(
    __dirname,
    '..',
    'Reportes',
    'ramo_administrativas.xlsx'
  );

  const rutaBase = path.join(__dirname, '..', 'Resultados');
  const nombreArchivoDinamico = nombreArchivo
    .replace('{ZZZ_ANIO}', ZZZ_ANIO)
    .replace('{ZZZ_MES}', ZZZ_MES)
    .replace('.xls', '.xlsx');

  const rutaSalida = path.join(rutaBase, nombreArchivoDinamico);


  const workbook = new Excel.Workbook();
  await workbook.xlsx.readFile(rutaEntrada);

  datosTotal.forEach((pestaña) => {
    const sheet = workbook.getWorksheet(pestaña.tab_nombre);
    let filaActual = 15;

    pestaña.detalle.forEach((detalleComp) => {
      detalleComp.forEach((valorColumna, index) => {
        //valorColumna no sea null antes de llamar a Object.values
        if (valorColumna) {
          const colLetter = String.fromCharCode('A'.charCodeAt(0) + index); //Convertir índ a letra de la columna
          const cellRef = colLetter + filaActual;

          const valores = Object.values(valorColumna);
          if (valores.length > 0 && valores[0] !== null) {
            //verificar que el primer valor no sea null
            sheet.getCell(cellRef).value = valores[0];
          }
        }
      });
      filaActual++;
    });
  });

  await workbook.xlsx.writeFile(rutaSalida);
  console.log('Archivo modificado con éxito en:', rutaSalida);

  return rutaSalida;
}

exports.generarYDescargarExcel = async (req, res) => {
  try {
    const resultadoId = await getId();
    const resultadoTab = await nombreTab(resultadoId.id);
    let datosTotal = [];

    for (let tabElem of resultadoTab) {
      let datosTab = {
        tab_num: tabElem.tab_num,
        tab_nombre: tabElem.tab_nombre,
        encabezado: [],
        detalle: [],
      };
      const resultadoSeqLine = await seqLine(resultadoId.id, tabElem.tab_num);
      let encabezadoCompleto = [];

      for (let lineaEnc of resultadoSeqLine) {
        const encabezado = await obtenerEncabezados(
          resultadoId.id,
          tabElem.tab_num,
          lineaEnc.seq_lin
        );
        encabezadoCompleto.push(...encabezado);
      }
      datosTab.encabezado.push(...encabezadoCompleto);

      const companias = await obtenerCompaniasActivas();
      const detallesD = await obtenerDetallesD(resultadoId.id, tabElem.tab_num);

      const consultas = companias.map((compania) =>
        consultaDinamica(compania.id_cia, detallesD)
      );

      const resultadosDetalles = await Promise.all(consultas);

      datosTab.detalle.push(...resultadosDetalles);
      datosTotal.push(datosTab);
    }

    const rutaSalida = await reporteMapExcel(datosTotal, resultadoId.tab_dest);
    if (rutaSalida) {
      res.download(rutaSalida, path.basename(rutaSalida));
    } else {
      throw new Error('No se pudo generar el archivo Excel.');
    }
  } catch (error) {
    console.error('Error al generar y descargar Excel:', error);
    res.status(500).send('Ocurrió un error al generar el reporte');
  }
};

//ejecutar OK
exports.ejecutarFunciones = async (req, res) => {
  try {
    const resultadoId = await getId();
    const resultadoTab = await nombreTab(resultadoId.id);
    let datosTotal = [];

    for (let tabElem of resultadoTab) {
      let datosTab = {
        tab_num: tabElem.tab_num,
        tab_nombre: tabElem.tab_nombre,
        encabezado: [],
        detalle: [],
      };
      const resultadoSeqLine = await seqLine(resultadoId.id, tabElem.tab_num);
      let encabezadoCompleto = [];

      for (let lineaEnc of resultadoSeqLine) {
        const encabezado = await obtenerEncabezados(
          resultadoId.id,
          tabElem.tab_num,
          lineaEnc.seq_lin
        );
        encabezadoCompleto.push(...encabezado);
      }
      datosTab.encabezado.push(...encabezadoCompleto);

      const companias = await obtenerCompaniasActivas();
      const detallesD = await obtenerDetallesD(resultadoId.id, tabElem.tab_num);

      const consultas = companias.map((compania) =>
        consultaDinamica(compania.id_cia, detallesD)
      );

      const resultadosDetalles = await Promise.all(consultas);

      datosTab.detalle.push(...resultadosDetalles);

      datosTotal.push(datosTab);
    }
    // console.log(datosTotal)

    console.log('termina');
    res.status(200).json(datosTotal);
  } catch (error) {
    console.error('Error al ejecutar funciones:', error);
    res.status(500).send('Ocurrió un error al generar el reporte');
  }
};

//ejecutarFunciones();
