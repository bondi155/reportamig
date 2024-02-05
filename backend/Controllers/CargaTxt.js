const mysql = require('mysql2');
const pool = mysql.createPool(process.env.DATABASE_URL);
const fs = require('fs');

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

async function cargaTxt__(req, res) {
  if (!req.file) {
    console.error('No se subió ningún archivo.');
    return;
  }

  try {
    //lee el archivo subido
    const dataTxt = await fs.promises.readFile(req.file.path, 'utf8');
    const fileName = req.body.fileName;

    //extrae el cod de compañía y la fecha
    const codigoCompaniaMatch = fileName.match(/([A-Z])(\d{4})/);
    const fechaMatch = fileName.match(/(\d{8})\.txt$/);

    //extraer el tipo_comp y cod_comp
    const tipoCompania = codigoCompaniaMatch ? codigoCompaniaMatch[1] : null;
    const codigoCompania = codigoCompaniaMatch ? codigoCompaniaMatch[2] : null;
    const fecha = fechaMatch ? fechaMatch[1] : null;

    //extrae año, mes y dia
    const anio = fecha ? fecha.substring(0, 4) : null;
    const mes = fecha ? fecha.substring(4, 6) : null;
    const dia = fecha ? fecha.substring(6, 8) : null;

    console.log(
      `Tipo de Compañía: ${tipoCompania}, Código de Compañía: ${codigoCompania}, Año: ${anio}, Mes: ${mes}, Día: ${dia}`
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

    return { parsedData, tipoCompania, codigoCompania, dia, mes, anio };
  } catch (error) {
    console.error(`Ocurrió un error al intentar leer el archivo: ${error}`);
    return res.status(500).json({
      code: 'ERROR_READ_TXT',
      message:
        'Error en el proceso de lectura del archivo, fíjese que el formato sea el correcto',
    });
  }
}

//ahora lo que tengo que hacer es meter en la base de datos esto que estoy haciendo y validar , tienen q entrar bien en los campos
//si da error de eso ya parar el proceso , entonces primer paso es insert y error
//acordarse de hacer un select en el front para decir que archivo es y asi usar un query o el otro para el insert ya que tienen difer nº de camp
//Agregar el año y el mes en las tablas de cmbg y cmer y el codigo de la empresa
//Estos datos sacarlos del archivo osea del titulo del txt
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
      moneda,
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

    console.log(`Todas las líneas insertadas en am_cmbg.`);
    return res.status(200).json({
      code: 'SUCCESS',
      message: `${fileName} procesado sin errores! con el id ${idProceso}`,
    });
  } catch (error) {
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
          moneda, 
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
    return res.status(200).json({
      code: 'SUCCESS',
      message: `${fileName} procesado sin errores! con el id ${idProceso}`,
    });
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

async function execFuncsTxt(req, res) {
  const entradaValue = req.body.entradaValue;
  const usuario = req.body.usuario;
  const fileName = req.body.fileName;
  let idProceso;
  try {
    idProceso = await gestionarProceso(null, 'I', 'pendiente', fileName);
    const { parsedData, tipoCompania, codigoCompania, dia, mes, anio } =
      await cargaTxt__(req, res);
    if (!parsedData) {
      return res.status(500).json({
        code: 'EMPTY_PATH',
        message: 'Error al procesar el archivo, seleccione uno por favor',
      });
    }
    if (entradaValue === 'cmbg') {
      await saveDBtxtCmbg(
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
      );
    } else if (entradaValue === 'cmer') {
      await saveDBtxtCmer(
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
      );
      console.log('Terminaron las líneas del archivo');
    }
  } catch (error) {
    console.error(`Error en execFuncsTxt: ${error.message}`);
    res.status(500).json({
      code: 'ERROR_SERVIDOR',
      message: `Error interno del servidor: ${error.message}`,
    });
  }
}

module.exports = {
  execFuncsTxt,
};


//armar periodo mes y año y tipo de reporte , una vez que se elija esto , abajo aparezcan pestañas web como el excel que sean los grids
//con el periodo seleccionado y un boton , que sea un dropdown en la barra superior y que traiga los tabs de ese excel o reporte
// que traiga el anteultimo periodo por defecto pero que se actualice con los combos de periodo de arriba y que abajo tenga un boton
//que exporte todo a un excel (tabs incluidas).