const mysql = require('mysql2');
const pool = mysql.createPool(process.env.DATABASE_URL);
const fs = require('fs');
const { limpiarCache } = require('./CacheManager');

//proceso para el estatus I , F , E (iniciado,   finalizado, error)
async function gestionarProceso(idProceso, estado, comentario, rutaArchivo) {
  const connection = await pool.promise().getConnection();
  //de esta forma podemos hacer commit y rollback
  try {
    if (estado === 'I') {
      //insert para estado 'I'
      const queryInicio = `
          INSERT INTO am_proceso (estatus, ruta_arch, comentario)
          VALUES (?, ?, ?)`;
      const [result] = await connection.query(queryInicio, [
        estado,
        rutaArchivo,
        comentario,
      ]);
      return result.insertId;
    } else {
      //UPDATE para estado 'F' o 'E'
      const queryActualizacion = `
          UPDATE am_proceso
          SET estatus = ?
          WHERE id = ?`;
      await connection.query(queryActualizacion, [estado, idProceso]);
    }
  } catch (error) {
    console.error('Error en gestionarProceso:', error.message);
    throw error;
  } finally {
    connection.release();
  }
}

//guardar errores en la base de datos
async function registrarError(
  idProceso,
  rutaArchivo,
  codigoError,
  severidadError,
  mensajeErrorOriginal,
  mensajeErrorAplicacion
) {
  const query = `
      INSERT INTO amigdb.am_carga_err
      (id_proceso, ruta_arch, cod_err, sev_err, msg_err_orig, msg_err_apl, f_err)
      VALUES
      (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`;

  const values = [
    idProceso,
    rutaArchivo,
    codigoError,
    severidadError,
    mensajeErrorOriginal,
    mensajeErrorAplicacion,
  ];

  try {
    const connection = await pool.promise().getConnection();
    await connection.query(query, values);
    connection.release();
  } catch (err) {
    console.error('Error al registrar el ERROR en BD', err.message);
  }
}
// Compara el codigo de compañia insertado si existe en la base de datos si no un mensaje de error desde el Front
async function compareCodComp(cod_cia) {
  const sqlGetCodCompany = 'SELECT id_cia FROM am_compania WHERE cod_cia = ?;';
  try {
    const connection = await pool.promise().getConnection();
    const [rows] = await connection.query(sqlGetCodCompany, [cod_cia]);
    connection.release();
    // Devuelve directamente el código si existe, o null si no se encontraron filas.
    return rows.length > 0 ? rows[0].id_cia : null;
  } catch (err) {
    console.error('Error al consultar la compañía:', err.message);
    throw err;
  }
}

// Compara datos entrantes con base para reemplazar o cancelar
async function checkPeriodoYcomp(tipo_comp, cod_cia, mes, anio, entradaValue) {
  let sqlGetCodCompany;
  //const tipo_comp = 'F';
  //const cod_cia = '1';
  //const mes = '12';
  //const anio = '2023';
  //const entradaValue = 'cmbg';

  if (entradaValue === 'cmer') {
    sqlGetCodCompany =
      'SELECT id_proceso, tipo_comp, cod_comp, mes, anio FROM am_cmer WHERE tipo_comp = ? AND cod_comp = ? AND mes = ? AND anio = ?;';
  } else if (entradaValue === 'cmbg') {
    sqlGetCodCompany =
      'SELECT id_proceso, tipo_comp, cod_comp, mes, anio FROM am_cmbg WHERE tipo_comp = ? AND cod_comp = ? AND mes = ? AND anio = ?;';
  }
  const connection = await pool.promise().getConnection();

  try {
    const [rows] = await connection.query(sqlGetCodCompany, [
      tipo_comp,
      cod_cia,
      mes,
      anio,
    ]);
    //console.log(' ESTE ES EL ID DE PROCESO ORIGINAL PARA BORRAR  ,rows[0].id_proceso');

    return rows.length > 0 ? rows : null;
  } catch (err) {
    console.log(err.message);
    throw err;
  } finally {
    connection.release();
  }
}

//checkPeriodoYcomp();

//carga de texto
async function cargaTxt__(req, res) {
  if (!req.file) {
    console.error('No se subió ningún archivo.');
    return;
  }
  try {
    //lee el archivo subido
    const dataTxt = await fs.promises.readFile(req.file.path, 'utf8');

    if (dataTxt.length === 0) {
      console.log('Archivo sin datos , por favor suba uno correcto');
      return res.status(500).json({
        code: 'ERROR_EMPTY',
        message: 'Error en el proceso de lectura del archivo, esta vacio..',
      });
    }
    const fileName = req.body.fileName;

    //extrae el cod de compañía y la fecha
    const codigoCompaniaMatch = fileName.match(/([A-Z])(\d{4})/); // S0802
    const fechaMatch = fileName.match(/(\d{8})\.txt$/); //

    //extraer el tipo_comp y cod_comp
    const tipoCompania = codigoCompaniaMatch ? codigoCompaniaMatch[1] : null; // S
    // Captura solo el último dígito osea el digito 3 y el 2 (ya que el 1 es S y el completo es S0802)
    // const codigoCompania = codigoCompaniaMatch ? codigoCompaniaMatch[2][2][3] : null;
    // Captura solo los ultimos 2 dígitos
    // const codigoCompania = codigoCompaniaMatch
    // ? codigoCompaniaMatch[2][2] + codigoCompaniaMatch[2][3]
    //: null;

    // Captura sin S
    const codigoCompania = codigoCompaniaMatch ? codigoCompaniaMatch[2] : null; // Captura '0802'

    console.log(codigoCompania);

    const fecha = fechaMatch ? fechaMatch[1] : null;

    //extrae año, mes y dia
    const anio = fecha ? fecha.substring(0, 4) : null;
    const mes = fecha ? fecha.substring(4, 6) : null;
    const dia = fecha ? fecha.substring(6, 8) : null;

    const cod_cia_final = await compareCodComp(codigoCompania);

    console.log(cod_cia_final);

    console.log(
      `Tipo de Compañía: ${tipoCompania}, Código de Compañía: ${cod_cia_final}, Año: ${anio}, Mes: ${mes}, Día: ${dia}`
    );

    const lines = dataTxt
      .split(';')
      .map((line) => line.trim())
      .filter((line) => line !== '');
    const parsedData = lines.map((line) =>
      line.split('|').filter((component) => component.trim() !== '')
    );

    console.log(parsedData[0]);
    console.log(fileName);

    return { parsedData, tipoCompania, cod_cia_final, dia, mes, anio };
  } catch (error) {
    console.error(`Ocurrió un error al intentar leer el archivo: ${error}`);

    return res.status(500).json({
      code: 'ERROR_READ_TXT',
      message:
        'Error en el proceso de lectura del archivo, fíjese que el formato sea el correcto',
    });
  }
}

//guardar nombre de archivo y id_proceso en map en cmer
async function saveDBtxtCmbg(
  parsedData,
  usuario,
  res,
  fileName,
  idProceso,
  tipoCompania,
  codigoCompania,
  dia,
  mes,
  anio
) {
  const connection = await pool.promise().getConnection();
  let lineaNum = 0;
  try {
    await connection.beginTransaction();
    const batchValues = parsedData.map((row, index) => {
      lineaNum = index + 1;
      const fechaCarga = new Date();
      return [
        idProceso,
        lineaNum,
        ...row,
        tipoCompania,
        codigoCompania,
        dia,
        mes,
        anio,
        fechaCarga,
        usuario,
      ];
    });

    const query = `
    INSERT INTO amigdb.am_cmbg (
      id_proceso,
      linea_num,
      cuenta_nivel_1,   
      cuenta_nivel_2,
      cuenta_nivel_3,
      cuenta_nivel_4,
      cve_moneda,
      importe,
      tipo_comp,
      cod_comp,
      dia, 
      mes, 
      anio, 
      f_carga,
      usr_carga
    ) VALUES ?`;

    console.log(idProceso);
    await connection.query(query, [batchValues]);
    await connection.commit();
    await gestionarProceso(idProceso, 'F', 'pendiente', fileName);
    console.log(`F FInalizada checar el id aca y en la atabla cmgb.`);
  } catch (error) {
    console.error(`Error al insertar datos en cmbg: ${error}`);
    await connection.rollback();
    //exp regular para extraer solo el num de la lineNum del mensaje de error
    const errorMatch = error.message.match(/at row (\d+)/);
    let lineNumber =
      errorMatch && errorMatch[1] ? errorMatch[1] : 'desconocida';
    let additionalMessage =
      lineNumber === '1'
        ? ' Revise si seleccionó bien la opción de tipo de archivo ya que tiene error en la primera línea.'
        : '';
    let errorMessage = `Error al insertar en CMBG: Error en la línea ${lineNumber}.${additionalMessage}`;
    await gestionarProceso(idProceso, 'E', fileName);
    console.error('E UPDATEADA');
    await registrarError(
      idProceso,
      fileName,
      error.code,
      '5',
      errorMessage,
      errorMessage
    );
    return res.status(500).json({
      code: 'ERROR_INSERT',
      message: errorMessage,
    });
  } finally {
    connection.release();
  }
}

//guardar nombre de archivo y id_proceso en map
async function saveDBtxtCmer(
  parsedData,
  usuario,
  res,
  fileName,
  idProceso,
  tipoCompania,
  codigoCompania,
  dia,
  mes,
  anio
) {
  const connection = await pool.promise().getConnection();
  let lineaNum = 0;
  try {
    await connection.beginTransaction();
    const batchValues = parsedData.map((row, index) => {
      const fechaCarga = new Date();
      lineaNum = index + 1;
      return [
        idProceso,
        lineaNum,
        ...row,
        tipoCompania,
        codigoCompania,
        dia,
        mes,
        anio,
        fechaCarga,
        usuario,
      ];
    });

    const query = `
        INSERT INTO amigdb.am_cmer (
          id_proceso, 
          linea_num, 
          cuenta_nivel_1, 
          cuenta_nivel_2, 
          cuenta_nivel_3, 
          cuenta_nivel_4, 
          cve_moneda, 
          operacion, 
          cve_ramo, 
          cve_subramo, 
          cve_subsubramo, 
          importe,
          tipo_comp,
          cod_comp, 
          dia, 
          mes, 
          anio,  
          f_carga, 
          usr_carga
        ) VALUES ?`;

    await connection.query(query, [batchValues]);
    await connection.commit();
    await gestionarProceso(idProceso, 'F', 'pendiente', fileName);
    console.log(`F FInalizada checar el id aca y en la tabla cmgb.`);
    console.log(`Todas las líneas insertadas en am_cmer.`);
  } catch (error) {
    await connection.rollback();
    console.error(`Error al insertar en am_cmer: ${error.message}`);
    //exp regular para extraer solo el num de la lineNum del mensaje de error
    const errorMatch = error.message.match(/at row (\d+)/);
    let lineNumber =
      errorMatch && errorMatch[1] ? errorMatch[1] : 'desconocida';
    let additionalMessage =
      lineNumber === '1'
        ? ' Revise si seleccionó bien la opción de tipo de archivo ya que tiene error en la primera línea.'
        : '';
    let errorMessage = `Error al insertar en CMER: Error en la línea ${lineNumber}.${additionalMessage}`;
    await gestionarProceso(idProceso, 'E', fileName);
    console.error('E UPDATEADA');
    await registrarError(
      idProceso,
      fileName,
      error.code,
      '5',
      errorMessage,
      errorMessage
    );

    return res.status(500).json({
      code: 'ERROR_INSERT',
      message: errorMessage,
    });
  } finally {
    connection.release();
  }
}

//ejecuta funciones
async function execFuncsTxt(req, res) {
  const entradaValue = req.body.entradaValue;
  const usuario = req.body.usuario;
  const fileName = req.body.fileName;
  let idProceso;
  const invalidLines = [];
  let lineaNum = 0;
  try {
    idProceso = await gestionarProceso(null, 'I', 'pendiente', fileName);
    const { parsedData, tipoCompania, cod_cia_final, dia, mes, anio } =
      await cargaTxt__(req, res);
    let tipoArchivo = fileName.includes('CMBG') ? 'CMBG' : 'CMER';

    // Validar datos antes de intentar insertarlos
    if (parsedData) {
      parsedData.forEach((row, index) => {
        lineaNum = index + 1;
        let errorFound = false;

        // Validar la línea (ejemplo: verificar si hay 6 elementos en la línea o mas de los digitos que corresponde)
        switch (tipoArchivo) {
          case 'CMBG':
            if (
              row.length !== 6 ||
              row[0].length !== 3 ||
              row[1].length !== 2 ||
              row[2].length !== 2 ||
              row[3].length !== 2 ||
              row[4].length !== 2
            ) {
              errorFound = true;
            }
            break;
          case 'CMER':
            if (
              row.length !== 10 ||
              row[0].length !== 3 ||
              row[1].length !== 2 ||
              row[2].length !== 2 ||
              row[3].length !== 2 ||
              row[4].length !== 2 ||
              row[5].length !== 4 ||
              row[6].length !== 3 ||
              row[7].length !== 3 ||
              row[8].length !== 4
            ) {
              errorFound = true;
            }
            break;
          default:
            console.error(`Tipo de archivo desconocido: ${tipoArchivo}`);
            errorFound = true;
            break;
        }

        if (errorFound) {
          invalidLines.push({
            line: lineaNum,
            data: row,
            error: 'Longitud incorrecta de campos o registro',
          });
        }
      });

      let errorMessageComplete;
      if (invalidLines.length > 0) {
        await gestionarProceso(idProceso, 'E', fileName);
        let errorMessage = `Longitud incorrecta de campos o registro en las siguientes líneas:\n`;
        invalidLines.forEach((line) => {
          errorMessageComplete = errorMessage += `${line.line}-`;
        });
        await registrarError(
          idProceso,
          fileName,
          'INVALID_DATA',
          '5',
          errorMessageComplete,
          errorMessageComplete
        );
        return res.status(400).json({
          code: 'INVALID_DATA',
          message: errorMessage,
        });
      }
    }
    if (!parsedData) {
      return res.status(500).json({
        code: 'EMPTY_FILE',
        message:
          'Error al procesar el archivo. Esta vacio o no contiene información',
      });
    }

    if (cod_cia_final === null) {
      console.log('Enviando error: COMPANY_CODE_NOT_FOUND');
      return res.status(404).json({
        code: 'COMPANY_CODE_NOT_FOUND',
        message: 'El código de compañía no existe en la base de datos.',
      });
    }

    const checkFile = await checkPeriodoYcomp(
      tipoCompania,
      cod_cia_final,
      mes,
      anio,
      entradaValue
    );

    if (checkFile !== null) {
      console.log('Enviando error: ALREADY_EXIST');
      return res.status(200).json({
        code: 'ALREADY_EXIST',
        message: `El Archivo del periodo ${mes}/${anio} con codigo ${tipoCompania}${cod_cia_final} ya existe, quiere sobreescribirlo?`,
      });
    } else {
      if (entradaValue === 'cmbg') {
        await saveDBtxtCmbg(
          parsedData,
          usuario,
          res,
          fileName,
          idProceso,
          tipoCompania,
          cod_cia_final,
          dia,
          mes,
          anio
        );
      } else if (entradaValue === 'cmer') {
        await saveDBtxtCmer(
          parsedData,
          usuario,
          res,
          fileName,
          idProceso,
          tipoCompania,
          cod_cia_final,
          dia,
          mes,
          anio
        );
        console.log('Terminaron las líneas del archivo');
      }
      limpiarCache();
      console.log('Cache limpio de procesar el archivo.');
    }
    return res.status(200).json({
      code: 'SUCCESS',
      message: `${fileName} procesado sin errores! con el id ${idProceso}`,
    });
  } catch (error) {
    console.error(`Error en execFuncsTxt: ${error.message}`);
    if (!res.headersSent) {
      res.status(500).json({
        code: 'ERROR_SERVIDOR',
        message: `Error interno del servidor: ${error.message}`,
      });
    }
  }
}

async function BorradoIdproceso(id_proceso) {
  let sqlBorrado;

  //const id_proceso = '61';

  //const entradaValue = 'cmbg';

  sqlBorrado = `DELETE FROM amigdb.am_proceso WHERE id = ?;`;

  const connection = await pool.promise().getConnection();

  try {
    await connection.query(sqlBorrado, [id_proceso]);
    console.log(`proceso terminado , borrado de ${id_proceso}`);
  } catch (err) {
    console.log(err.message);
    throw err;
  } finally {
    connection.release();
  }
}

async function execUpdateTxt(req, res) {
  const entradaValue = req.body.entradaValue;
  const usuario = req.body.usuario;
  const fileName = req.body.fileName;
  let idProceso;
  let lineaNum = 0;
  let invalidLines = [];

  try {
    idProceso = await gestionarProceso(null, 'I', 'pendiente', fileName);
    const { parsedData, tipoCompania, cod_cia_final, dia, mes, anio } =
      await cargaTxt__(req, res);

    let tipoArchivo = fileName.includes('CMBG') ? 'CMBG' : 'CMER';

    // Validar datos antes de intentar insertarlos
    parsedData.forEach((row, index) => {
      lineaNum = index + 1;

      // Validar la línea (ejemplo: verificar si hay 6 elementos en la línea o mas de los digitos que corresponde)
      let errorFound = false;

      switch (tipoArchivo) {
        case 'CMBG':
          if (
            row.length !== 6 ||
            row[0].length !== 3 ||
            row[1].length !== 2 ||
            row[2].length !== 2 ||
            row[3].length !== 2 ||
            row[4].length !== 2
          ) {
            errorFound = true;
          }
          break;
        case 'CMER':
          if (
            row.length !== 10 ||
            row[0].length !== 3 ||
            row[1].length !== 2 ||
            row[2].length !== 2 ||
            row[3].length !== 2 ||
            row[4].length !== 2 ||
            row[5].length !== 4 ||
            row[6].length !== 3 ||
            row[7].length !== 3 ||
            row[8].length !== 4
          ) {
            errorFound = true;
          }
          break;
        default:
          console.error(`Tipo de archivo desconocido: ${tipoArchivo}`);
          errorFound = true;
          break;
      }

      if (errorFound) {
        invalidLines.push({
          line: lineaNum,
          data: row,
          error: 'Longitud incorrecta de campos o registro',
        });
      }
    });

    let errorMessageComplete;
    if (invalidLines.length > 0) {
      await gestionarProceso(idProceso, 'E', fileName);
      let errorMessage = `Longitud incorrecta de campos o registro en las siguientes líneas:\n`;
      invalidLines.forEach((line) => {
        errorMessageComplete = errorMessage += `${line.line}-`;
      });
      await registrarError(
        idProceso,
        fileName,
        'INVALID_DATA',
        '5',
        errorMessageComplete,
        errorMessageComplete
      );
      return res.status(400).json({
        code: 'INVALID_DATA',
        message: errorMessage,
      });
    }

    if (!parsedData) {
      return res.status(500).json({
        code: 'EMPTY_FILE',
        message: 'No hay datos en este archivo',
      });
    }
    console.log('Este es id proceso', idProceso);

    const rows = await checkPeriodoYcomp(
      tipoCompania,
      cod_cia_final,
      mes,
      anio,
      entradaValue
    );

    const idprocesoParaBorrar = rows[0].id_proceso;

    BorradoIdproceso(idprocesoParaBorrar);

    console.log(idprocesoParaBorrar);

    if (entradaValue === 'cmbg') {
      await saveDBtxtCmbg(
        parsedData,
        usuario,
        res,
        fileName,
        idProceso,
        tipoCompania,
        cod_cia_final,
        dia,
        mes,
        anio
      );
    } else if (entradaValue === 'cmer') {
      await saveDBtxtCmer(
        parsedData,
        usuario,
        res,
        fileName,
        idProceso,
        tipoCompania,
        cod_cia_final,
        dia,
        mes,
        anio
      );
      console.log('Terminaron las líneas del archivo');
    }
    limpiarCache();
    console.log('Cache limpio de procesar el archivo.');

    if (!res.headersSent) {
      return res.status(200).json({
        code: 'UPDATE_SUCCESS',
        message: `Se han actualizando las lineas del archivo correspondiente al ${mes}/${anio} ID ${idProceso} con codigo de empresa ${tipoCompania}${cod_cia_final}`,
      });
    }
  } catch (error) {
    console.error(`Error en execFuncsTxt: ${error.message}`);
    if (!res.headersSent) {
      res.status(500).json({
        code: 'ERROR_SERVIDOR',
        message: `Error interno del servidor: ${error.message}`,
      });
    }
  }
}

module.exports = {
  execFuncsTxt,
  execUpdateTxt,
};

//armar periodo mes y año y tipo de reporte , una vez que se elija esto , abajo aparezcan pestañas web como el excel que sean los grids
//con el periodo seleccionado y un boton , que sea un dropdown en la barra superior y que traiga los tabs de ese excel o reporte
// que traiga el anteultimo periodo por defecto pero que se actualice con los combos de periodo de arriba y que abajo tenga un boton
//que exporte todo a un excel (tabs incluidas).
