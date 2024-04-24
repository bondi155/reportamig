const Excel = require('exceljs');
const mysql = require('mysql2');
const pool = mysql.createPool(process.env.DATABASE_URL);
const path = require('path');
const Mexp = require('math-expression-evaluator');
const { Console } = require('console');
let nombreArchivo;
const { getCache, updateCache } = require('./CacheManager');

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
async function getEnc(id) {
  const sqlGetEnc = `SELECT id, tab_orig, tab_dest, tipo_proc 
  FROM am_mapeo_enc
  WHERE tipo_arc = 'S' AND id = ?`; //de ser necesario agregar separador en el select
  try {
    const [rows] = await pool.promise().query(sqlGetEnc, id);
    const mapeoEnc = rows[0] || [];
    //console.log(mapeoEnc);
    return mapeoEnc;
  } catch (error) {
    console.error('error', error);
    throw error;
  }
}

//Sacamos la Linea
async function seqLine(idEncabezado, numTab, tipoDet = 'H') {
  const sqlseqLine = `SELECT distinct seq_lin num_linea
                      FROM am_mapeo_det
                      WHERE id_map_enc = ?
					            AND tab_num = ?
                      AND tipo_det = ?
                      AND activo = 1
                      ORDER BY seq_lin`;
  try {
    const [rows] = await pool
      .promise()
      .query(sqlseqLine, [idEncabezado, numTab, tipoDet]); //const [rows] me limpia el metadato que trae el array
    const resultadoSeqLine = rows || []; //si es rows si es vacio array vacio
    return resultadoSeqLine;
  } catch (error) {
    console.error('error', error);
    throw error;
  }
}

//Encabezado
async function obtenerEncabezados(idMapeo, numTab, lineaEnc) {
  try {
    let encabezado = [];

    //for (let i = 0; i < seqLins.length; i++) {
    //  const seqLin = seqLins[i].seq_lin;
    const sqlEnc = `
        SELECT val_fijo
        FROM am_mapeo_det
        WHERE id_map_enc = ?
	    	AND tab_num = ?
        AND tipo_det = 'H'
        AND seq_lin = ?
        AND activo = 1
        ORDER BY seq_lin, seq_dest, seq_orig`;

    const [rows] = await pool
      .promise()
      .query(sqlEnc, [idMapeo, numTab, lineaEnc]);

    encabezado = rows || [];

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
  WHERE id_map_enc = ? AND tipo_det = 'D' AND activo = 1
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
async function obtenerDetallesD(idEncabezado, numTab, seqLin = 1) {
  //poner idTab despues

  const sqlDetallesD = `
    SELECT campo_orig, id_tipo_dato_orig, presic_orig_1, presic_orig_2, val_def, val_fijo, tabla_orig, where_cond
    FROM am_mapeo_det
    WHERE id_map_enc = ?
    AND tab_num = ?
    AND tipo_det = 'D'
    AND seq_lin = ?
    AND activo = 1
    ORDER BY seq_dest, seq_orig    
  `;

  try {
    const [detalles] = await pool
      .promise()
      .query(sqlDetallesD, [idEncabezado, numTab, seqLin]);
    return detalles;
  } catch (error) {
    console.error('Error al obtener detalles D:', error);
    throw error;
  }
}

function reempParam(pTexto, pCia, pAnio, pMes, pAnioAnt, pArrVal) {
  let valDev;
  try {
    valDev = pTexto
      .replace(/\{ZZZ_ANIO\}/g, pAnio)
      .replace(/\{ZZZ_MES\}/g, pMes)
      .replace(/\{ZZZ_ID_CIA\}/g, pCia)
      .replace(/\{ZZZ_ANIO_ANT\}/g, pAnioAnt)
      .replace(/\{ZZZ_3\}/g, pArrVal[2])
      .replace(/\{ZZZ_4\}/g, pArrVal[3])
      .replace(/\{ZZZ_5\}/g, pArrVal[4])
      .replace(/\{ZZZ_6\}/g, pArrVal[5])
      .replace(/\{ZZZ_7\}/g, pArrVal[6])
      .replace(/\{ZZZ_8\}/g, pArrVal[7])
      .replace(/\{ZZZ_9\}/g, pArrVal[8])
      .replace(/\{ZZZ_10\}/g, pArrVal[9])
      .replace(/\{ZZZ_11\}/g, pArrVal[10])
      .replace(/\{ZZZ_12\}/g, pArrVal[11])
      .replace(/\{ZZZ_13\}/g, pArrVal[12])
      .replace(/\{ZZZ_14\}/g, pArrVal[13])
      .replace(/\{ZZZ_15\}/g, pArrVal[14])
      .replace(/\{ZZZ_16\}/g, pArrVal[15])
      .replace(/\{ZZZ_17\}/g, pArrVal[16])
      .replace(/\{ZZZ_18\}/g, pArrVal[17])
      .replace(/\{ZZZ_19\}/g, pArrVal[18]);
  } catch (e) {
    console.error('Error reemplazando parámetros:', e);
    valDev = pTexto
      .replace(/\{ZZZ_ANIO\}/g, pAnio)
      .replace(/\{ZZZ_MES\}/g, pMes)
      .replace(/\{ZZZ_ID_CIA\}/g, pCia)
      .replace(/\{ZZZ_ANIO_ANT\}/g, pAnioAnt);
  }
  return valDev;
}

async function consultaDinamica(idCia, anio, mes, anioAnt, detalles) {
  const resultados = [];
  let valParam = [];

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
        const parsedExpression = reempParam(
          expression,
          idCia,
          anio,
          mes,
          anioAnt,
          valParam
        );

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
      let sqlDinamica = reempParam(
        detalle.campo_orig,
        idCia,
        anio,
        mes,
        anioAnt,
        valParam
      );
      let tablaOrig = detalle.tabla_orig; // AGREGAR SI TABLA_ORIG ES NULL AL QUERY QUE ARMO SOLO SELECT SIN FROM NI WHERE ELSE LO DE SIEMPRE

      if (tablaOrig === null) {
        consultaFinal = `SELECT ${sqlDinamica} AS ${alias}`; //
      } else {
        let whereCond = reempParam(
          detalle.where_cond,
          idCia,
          anio,
          mes,
          anioAnt,
          valParam
        );
        consultaFinal = `SELECT ${sqlDinamica} AS ${alias} FROM ${tablaOrig} WHERE ${whereCond}`; //
      }
      //console.log(sqlDinamica);
      //  console.log('Consulta Final: ',consultaFinal);
      try {
        const [resultadoConsulta] = await pool.promise().query(consultaFinal);

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
            valIns[alias] = parseFloat(valIns[alias]).toFixed(
              detalle.presic_orig_2
            );
          }
          //Math.round((num + Number.EPSILON) * 100) / 10
        }
      }
    }
    valAComp = valIns[alias];
    valParam[i] = valAComp;
    resultados.push(valIns);
  }
  //const resultadosTransformadosDetalle = transformarResultados(resultados);

  return resultados;
}

async function armaResultVert(
  pAnio,
  pMes,
  pAnioAnt,
  pArrCia,
  pArrEnc,
  pDetalles,
  pProcEnc = 1
) {
  const resultados = [];
  let valParam = [];
  let detalle;
  let lineaSal;
  let idxEncab;
  let idxDet;
  let idCia;

  let valIns;
  let valAComp;
  let alias;

  let sqlDinamica, tablaOrig, whereCond, consultaFinal;

  for (let i = 0; i < pDetalles.length; i++) {
    idxDet = 1;
    lineaSal = [];
    if (idxDet == 1 && pProcEnc == 1) {
      idxEncab = 0;
      pArrEnc.forEach((lineaEnc) => {
        if (lineaEnc.length > 0) {
          alias = 'col' + idxDet;
          lineaSal.push({ [alias]: Object.values(lineaEnc[i])[0] });
          idxDet++;
        }
        idxEncab++;
      });
    }

    detalle = pDetalles[i];

    for (let idxCia = 0; idxCia < pArrCia.length; idxCia++) {
      alias = 'col' + idxDet;
      valIns = { [alias]: null };
      valAComp = null;

      idCia = pArrCia[idxCia].id_cia;
      if (detalle.val_fijo !== null) {
        let valorDinamico;
        if (detalle.val_fijo.startsWith('=')) {
          const expression = detalle.val_fijo.slice(1);
          const parsedExpression = reempParam(
            expression,
            idCia,
            pAnio,
            pMes,
            pAnioAnt,
            valParam
          );

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
        sqlDinamica = reempParam(
          detalle.campo_orig,
          idCia,
          pAnio,
          pMes,
          pAnioAnt,
          valParam
        );

        tablaOrig = detalle.tabla_orig; // AGREGAR SI TABLA_ORIG ES NULL AL QUERY QUE ARMO SOLO SELECT SIN FROM NI WHERE ELSE LO DE SIEMPRE

        if (tablaOrig === null) {
          consultaFinal = `SELECT ${sqlDinamica} AS ${alias}`; //
        } else {
          whereCond = reempParam(
            detalle.where_cond,
            idCia,
            pAnio,
            pMes,
            pAnioAnt,
            valParam
          );
          consultaFinal = `SELECT ${sqlDinamica} AS ${alias} FROM ${tablaOrig} WHERE ${whereCond}`; //
        }
        try {
          const [resultadoConsulta] = await pool.promise().query(consultaFinal);

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
              valIns[alias] = parseFloat(valIns[alias]).toFixed(
                detalle.presic_orig_2
              );
            }
          }
        }
      }
      valAComp = valIns[alias];
      valParam[i] = valAComp;
      lineaSal.push(valIns);
      idxDet++;
    }
    //pArrCia.forEach(async (compania) => {
    //});
    resultados.push(lineaSal);
  }
  return resultados;
}

async function armaResultVert2(
  pAnio,
  pMes,
  pAnioAnt,
  pArrCia,
  pProcCia,
  pDetalles
) {
  let resultados = [];
  let valParam = [];
  let detalle;
  let lineaSal;
  let idxDet;
  let idCia;

  let valIns;
  let alias;
  let cantCiclos;

  let sqlDinamica, tablaOrig, whereCond, consultaFinal;

  if (pProcCia == 1) {
    cantCiclos = pArrCia.length;
  } else {
    cantCiclos = 1;
  }

  for (let idxCia = 0; idxCia < cantCiclos; idxCia++) {
    lineaSal = [];
    for (let i = 0; i < pDetalles.length; i++) {
      idxDet = 1;

      detalle = pDetalles[i];

      alias = 'valor';
      valIns = null;
      // valAComp = null;

      idCia = pArrCia[idxCia].id_cia;
      if (detalle.val_fijo !== null) {
        let valorDinamico;
        if (detalle.val_fijo.startsWith('=')) {
          const expression = detalle.val_fijo.slice(1);
          const parsedExpression = reempParam(
            expression,
            idCia,
            pAnio,
            pMes,
            pAnioAnt,
            valParam
          );

          const mexp = new Mexp();
          try {
            valorDinamico = mexp.eval(parsedExpression);
          } catch (e) {
            valorDinamico = null;
          }
        } else {
          valorDinamico =
            detalle.val_fijo !== ''
              ? reempParam(
                  detalle.val_fijo,
                  idCia,
                  pAnio,
                  pMes,
                  pAnioAnt,
                  valParam
                )
              : detalle.val_def; //
        }
        //resultados.push({ [alias]: valorDinamico });
        valIns = valorDinamico;
      } else {
        sqlDinamica = reempParam(
          detalle.campo_orig,
          idCia,
          pAnio,
          pMes,
          pAnioAnt,
          valParam
        );

        tablaOrig = detalle.tabla_orig; // AGREGAR SI TABLA_ORIG ES NULL AL QUERY QUE ARMO SOLO SELECT SIN FROM NI WHERE ELSE LO DE SIEMPRE

        if (tablaOrig === null) {
          consultaFinal = `SELECT ${sqlDinamica} AS ${alias}`; //
        } else {
          whereCond = reempParam(
            detalle.where_cond,
            idCia,
            pAnio,
            pMes,
            pAnioAnt,
            valParam
          );
          consultaFinal = `SELECT ${sqlDinamica} AS ${alias} FROM ${tablaOrig} WHERE ${whereCond}`; //
        }
        try {
          const [resultadoConsulta] = await pool.promise().query(consultaFinal);

          //resultados.push(resultadoConsulta[0]);
          if (resultadoConsulta[0]) {
            valIns = resultadoConsulta[0][alias];
          }
        } catch (error) {
          console.error('Error al ejecutar consulta dinámica:', error);
        }
      }
      if (valIns == null && detalle.val_def != null) {
        valIns = detalle.val_def;
      } else {
        if (
          detalle.id_tipo_dato_orig == 1 &&
          (isNaN(valIns) || !isFinite(valIns))
        ) {
          valIns = '0';
        } else {
          if (detalle.id_tipo_dato_orig == 1 && detalle.presic_orig_2 != null) {
            if (detalle.presic_dato_orig_2 == 0) {
              valIns = Math.round(valIns);
            } else {
              valIns = parseFloat(valIns).toFixed(detalle.presic_orig_2);
            }
          }
        }
      }
      valParam[i] = valIns;
      lineaSal.push(valIns);
      idxDet++;
    }
    //pArrCia.forEach(async (compania) => {
    //});
    resultados.push(lineaSal);
  }
  return resultados;
}

async function procesaReporte(pIdArch, pAnio, pMes, pAnioAnt) {
  let datosTotal = [];
  let lineaSal = [];
  let resultSal = [];
  let companias;
  let detallesD;
  let encabezadoCompleto;
  let aliasCol;

  try {
    const resultadoEnc = await getEnc(pIdArch);
    const resultadoTab = await nombreTab(resultadoEnc.id);

    nombreArchivo = resultadoEnc.tab_dest;

    if (resultadoEnc.tipo_proc == 'V') {
      for (let tabElem of resultadoTab) {
        let datosTab = {
          tab_num: tabElem.tab_num,
          tab_nombre: tabElem.tab_nombre,
          encabezado: [],
          detalle: [],
        };
        const resultadoSeqLine = await seqLine(
          resultadoEnc.id,
          tabElem.tab_num
        );
        encabezadoCompleto = [];

        for (let lineaEnc of resultadoSeqLine) {
          const encabezado = await obtenerEncabezados(
            resultadoEnc.id,
            tabElem.tab_num,
            lineaEnc.num_linea
          );
          let colEncNum = 1;
          let encabezadoLin = [];
          for (let encabezadoVal of encabezado) {
            aliasCol = '' + colEncNum;
            encabezadoLin.push({
              [aliasCol]: reempParam(
                encabezadoVal.val_fijo,
                0,
                pAnio,
                pMes,
                pAnioAnt,
                []
              ),
            });
            colEncNum++;
          }
          encabezadoCompleto.push(encabezadoLin);
        }

        datosTab.encabezado = encabezadoCompleto;

        companias = await obtenerCompaniasActivas();
        detallesD = await obtenerDetallesD(resultadoEnc.id, tabElem.tab_num);

        //const resultadosDetalles = await Promise.all(consultas);
        companias.unshift({ id_cia: 0, posic_cia: 0, nombre_cia: '' });

        const consultas = await armaResultVert(
          pAnio,
          pMes,
          pAnioAnt,
          companias,
          encabezadoCompleto,
          detallesD
        );

        let resultSal = await Promise.all(consultas);

        datosTab.detalle = resultSal;
        //datosTab.detalle.push(...resultadosDetalles);

        datosTotal.push(datosTab);
      }
    } else {
      if (resultadoEnc.tipo_proc == 'W') {
        companias = await obtenerCompaniasActivas();
        for (let tabElem of resultadoTab) {
          let datosTab = {
            tab_num: tabElem.tab_num,
            tab_nombre: tabElem.tab_nombre,
            encabezado: [],
            detalle: [],
          };
          const resultadoSeqLine = await seqLine(
            resultadoEnc.id,
            tabElem.tab_num,
            'D'
          );

          let lineaSal = [];
          let detalleSal = [];
          let primerCol = true;
          const idxProcCia = 5;

          let idxResultCol = 1;

          for (let colDefDet of resultadoSeqLine) {
            detallesD = await obtenerDetallesD(
              resultadoEnc.id,
              tabElem.tab_num,
              colDefDet.num_linea
            );

            const consultas = await armaResultVert2(
              pAnio,
              pMes,
              pAnioAnt,
              companias,
              colDefDet.num_linea == idxProcCia ? 1 : 0, //Es el ID de seqLin que procesa varias veces la columna, por cada compañia
              detallesD
            );

            let resultCol = await Promise.all(consultas);

            for (let resultColLin of resultCol) {
              let numCol = 1;
              for (let columnaVal of resultColLin) {
                if (primerCol) {
                  lineaSal[numCol] = [];
                }
                lineaSal[numCol].push({ ['col' + idxResultCol]: columnaVal });
                numCol++;
              }
              primerCol = false;
              idxResultCol++;
            }
          }
          lineaSal.shift();
          detalleSal.push(lineaSal);
          datosTab.detalle.push(...detalleSal.flat());
          datosTotal.push(datosTab);
        }
      } else {
        let colEncNum;
        for (let tabElem of resultadoTab) {
          let datosTab = {
            tab_num: tabElem.tab_num,
            tab_nombre: tabElem.tab_nombre,
            encabezado: [],
            detalle: [],
          };
          const resultadoSeqLine = await seqLine(
            resultadoEnc.id,
            tabElem.tab_num
          );
          encabezadoCompleto = [];
          for (let lineaEnc of resultadoSeqLine) {
            const encabezado = await obtenerEncabezados(
              resultadoEnc.id,
              tabElem.tab_num,
              lineaEnc.num_linea
            );
            let colEncNum = 1;
            let encabezadoLin = [];
            for (let encabezadoVal of encabezado) {
              aliasCol = 'col' + colEncNum;
              encabezadoLin.push({
                [aliasCol]: reempParam(
                  encabezadoVal.val_fijo,
                  0,
                  pAnio,
                  pMes,
                  pAnioAnt,
                  []
                ),
              });
              colEncNum++;
            }
            encabezadoCompleto.push(encabezadoLin);
          }
          //datosTab.encabezado.push(encabezadoCompleto);
          datosTab.encabezado = encabezadoCompleto;

          companias = await obtenerCompaniasActivas();
          detallesD = await obtenerDetallesD(resultadoEnc.id, tabElem.tab_num);

          const consultas = companias.map((compania) =>
            consultaDinamica(compania.id_cia, pAnio, pMes, pAnioAnt, detallesD)
          );

          const resultadosDetalles = await Promise.all(consultas);

          datosTab.detalle.push(...resultadosDetalles);

          datosTotal.push(datosTab);
        }
      }
    }
  } catch (error) {
    console.error('Error al procesar los datos:', error);
  }
  console.log('Termina procesamiento.');
  return datosTotal;
}

// Armado de excel
async function reporteMapExcel(
  datosTotal,
  anio,
  mes,
  nombreArchivo,
  tipoArchivo
) {
  const rutaEntrada = path.join(__dirname, '..', 'Reportes', nombreArchivo);
  const rutaBase = path.join(__dirname, '..', 'Resultados');
  const nombreArchivoDinamico = nombreArchivo
    .replace('{ZZZ_ANIO}', anio)
    .replace('{ZZZ_MES}', mes)
    .replace('.xls', '.xlsx');
  const rutaSalida = path.join(rutaBase, nombreArchivoDinamico);
  const workbook = new Excel.Workbook();
  await workbook.xlsx.readFile(rutaEntrada);
  //console.log('TIPO DE ARCHIVO!!!!!!', tipoArchivo);

  if (tipoArchivo === 'H') {
    datosTotal.forEach((pestaña) => {
      const sheet = workbook.getWorksheet(pestaña.tab_nombre);
      let filaActual = 15;

      pestaña.detalle.forEach((detalleComp) => {
        detalleComp.forEach((valorColumna, index) => {
          if (valorColumna) {
            // Convertir índice a letra de columna, manejando correctamente más allá de 'Z'
            let numColumna = index + 1; // Asume que 'A' es 1
            let colLetter = '';
            while (numColumna > 0) {
              let remainder = (numColumna - 1) % 26;
              colLetter =
                String.fromCharCode('A'.charCodeAt(0) + remainder) + colLetter;
              numColumna = parseInt((numColumna - remainder) / 26, 10);
            }

            const cellRef = colLetter + filaActual;
            const valor = Object.values(valorColumna)[0];
            // Comprobar si el valor es numérico y convertirlo
            if (valor !== null) {
              if (
                !isNaN(valor) &&
                !isNaN(parseFloat(valor)) &&
                !/^[a-zA-Z]/.test(valor)
              ) {
                sheet.getCell(cellRef).value = parseFloat(valor);
              } else {
                // Dejarlo como string
                sheet.getCell(cellRef).value = valor;
              }
          //    console.log(
            //    `Accediendo a la celda: ${cellRef} con valor: ${valor}`
              //);
            }
          }
        });
        filaActual++;
      });
      const anioNumero = +anio; // Convertir 'anio' a número
      const cellAnio = 'B35';
      sheet.getCell(cellAnio).value = anioNumero; // Asignar año al archivo
    });
  } else if (tipoArchivo === 'V') {
    const pestaña = datosTotal[0];
    const sheet = workbook.getWorksheet(pestaña.tab_nombre);

    let currentRow = 8; // Datos desde la fila 8

    // Iterar sobre cada fila de datos en la pestaña
    pestaña.detalle.forEach((detalleRow, rowIndex) => {
      let currentColumnCode = 'C'.charCodeAt(0); // Desde columna C

      // Iterar sobre cada columna en la fila de datos
      detalleRow.forEach((data, columnIndex) => {
        const cellRef = String.fromCharCode(currentColumnCode) + currentRow;
        const valor = Object.values(data)[0]; // Obtener el valor

        if (valor !== null) {
          // Si el valor es num (y no empieza con letra) convierte a num
          if (
            !isNaN(valor) &&
            !isNaN(parseFloat(valor)) &&
            !/^[a-zA-Z]/.test(valor)
          ) {
            sheet.getCell(cellRef).value = parseFloat(valor);
          } else {
            // Dejarlo como string
            sheet.getCell(cellRef).value = valor;
          }
        }

        currentColumnCode++; // Moverse a la siguiente columna para
      });

      currentRow++; // Moverse a la siguiente fila después terminar un array
    });
  } else if (tipoArchivo === 'W') {
    datosTotal.forEach((pestaña) => {
      const sheet = workbook.getWorksheet(pestaña.tab_nombre);
      let filaInicial = 11; // Iniciar en la fila 11

      // Omitir el primer elemento usando slice y luego iterar sobre los detalles restantes
      pestaña.detalle.slice(1).forEach((filaDetalle) => {
        filaDetalle.forEach((valorColumna, index) => {
          // Calcula la letra de la columna correctamente, incluso después de la 'Z'
          let numColumna = index + 3; // Inicia en la columna 'C' (3 en 0-index)
          let colLetter = '';
          while (numColumna > 0) {
            let remainder = (numColumna - 1) % 26;
            colLetter =
              String.fromCharCode('A'.charCodeAt(0) + remainder) + colLetter;
            numColumna = parseInt((numColumna - remainder) / 26, 10);
          }

          const cellRef = colLetter + filaInicial;
          const valor = valorColumna ? Object.values(valorColumna)[0] : null;

          console.log(`Accediendo a la celda: ${cellRef} con valor: ${valor}`);

          if (valor !== null) {
            // Si el valor es numérico y no empieza con letra, convertir a número
            if (
              !isNaN(valor) &&
              !isNaN(parseFloat(valor)) &&
              !/^[a-zA-Z]/.test(valor)
            ) {
              sheet.getCell(cellRef).value = parseFloat(valor);
            } else {
              // De lo contrario, asignar el valor como string
              sheet.getCell(cellRef).value = valor;
            }
          }
        });
        filaInicial++; // Moverse a la siguiente fila después de terminar con una fila de detalle
      });
    });
  }
  await workbook.xlsx.writeFile(rutaSalida);
  console.log('Archivo modificado con éxito en:', rutaSalida);

  return rutaSalida;
}

// Pasamos las variables de las funciones y ejecutamos la funcion del excel reportMapExcel
exports.generarYDescargarExcel = async (req, res) => {
  try {
    const id = req.query.id_arch;
    const anio = req.query.anio;
    const mes = req.query.mes;
    const anioAnt = anio - 1;

    const mapeoEnc = await getEnc(id);
    nombreArchivo = mapeoEnc.tab_dest;

    const datosEnCache = getCache(); // Obtiene todo el objeto de caché
    let datosTotal;

    if (datosEnCache[id]) {
      console.log('Datos obtenidos de la caché');
      datosTotal = datosEnCache[id]; // Usa los datos de la caché si están disponibles
    } else {
      // Si no hay datos en la caché, genera los datos
      datosTotal = await procesaReporte(id, anio, mes, anioAnt);
      updateCache(id, datosTotal); // Actualiza la caché con los nuevos datos
    }

    console.log('ESTE ES NOMBRE DE ARCHIVO ', nombreArchivo);

    if (datosTotal) {
      const rutaSalida = await reporteMapExcel(
        datosTotal,
        anio,
        mes,
        nombreArchivo,
        mapeoEnc.tipo_proc
      );

      const nombreArchivoDesCarga = path.basename(rutaSalida);

      if (rutaSalida) {
        console.log('Enviando archivo:', nombreArchivoDesCarga);
        res.sendFile(rutaSalida, nombreArchivoDesCarga);
      } else {
        throw new Error('No se pudo generar el archivo Excel.');
      }
    } else {
      console.error('No se generaron datos de salida.');
      res.status(500).send('Ocurrió un error al generar los datos para el reporte en Excel.');
    }
  } catch (error) {
    console.error('Error al generar y descargar Excel:', error);
    res.status(500).send('Ocurrió un error al generar el reporte en Excel.');
  }
};

// Funcion de ejecutar para respuesta  a consultas de detalle por fecha
exports.ejecutarFunciones = async (req, res) => {
  try {
    const id = req.query.id_arch;
    const anio = req.query.anio;
    const mes = req.query.mes;
    const anioAnt = anio - 1;
    
    // Obtiene todo el objeto de caché con cache
    const datosEnCache = getCache(); 
    if (datosEnCache[id]) {
      console.log('Datos obtenidos de la caché');
      return res.status(200).json(datosEnCache[id]);
    }
    //termina cache

    let datosGen = [];

    datosGen = await procesaReporte(id, anio, mes, anioAnt);

    // hace update del id en el cache 
    updateCache(id, datosGen); 
//termina update de caché

    if (datosGen) {
      res.status(200).json(datosGen);
    } else {
      console.error('No se generaron datos de salida.');
      res
        .status(500)
        .send('Ocurrió un error al generar los datos para el reporte.');
    }
  } catch (error) {
    console.error('Error al generar los datos de salida:', error);
    res
      .status(500)
      .send('Ocurrió un error al generar los datos para el reporte.');
  }
};

//ejecutarFunciones();
