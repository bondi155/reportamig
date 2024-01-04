const mysql = require('mysql2');
const pool = mysql.createPool(process.env.DATABASE_URL);
const fs = require('fs');

let counter = 10;

function generateIdProceso() {
  const now = new Date();
  const datePart = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
  const id = `${datePart}${counter}`;
  counter += 10; 
  return id;
}

async function registrarError(idProceso, rutaArchivo, codigoError, severidadError, mensajeErrorOriginal, mensajeErrorAplicacion) {
    const query = `
      INSERT INTO amigdb.am_carga_err
      (id_proceso, ruta_arch, cod_err, sev_err, msg_err_orig, msg_err_apl, f_err)
      VALUES
      (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`;
  
    const values = [idProceso, rutaArchivo, codigoError, severidadError, mensajeErrorOriginal, mensajeErrorAplicacion];
  
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
  }
  try {
    // Leer el archivo subido
    const dataTxt = await fs.promises.readFile(req.file.path, 'utf8');
    //console.log(dataTxt);
    const fileName = req.body.fileName;
    const lines = dataTxt
      .split(';')
      .map((line) => line.trim())
      .filter((line) => line !== '');
    // Dividir cada línea en sus componentes
    const parsedData = lines.map((line) =>
      line.split('|').filter((component) => component.trim() !== '')
    );

    console.log(parsedData[0]);
    console.log(fileName);
    return parsedData;
    //console.log(JSON.stringify(dataTxt));
  } catch (error) {
    console.error(`Ocurrió un error al intentar leer el archivo: ${error}`);
    return res.status(500).json({
      code: 'ERROR_READ_TXT',
      message:
        'Error en el proceso de lectura del archivo, fijese que el formato sea el correcto',
    });
  }
}

//ahora lo que tengo que hacer es meter en la base de datos esto que estoy haciendo y validar , tienen q entrar bien en los campos
//si da error de eso ya parar el proceso , entonces primer paso es insert y error
//acordarse de hacer un select en el front para decir que archivo es y asi usar un query o el otro para el insert ya que tienen difer nº de camp
async function saveDBtxtCmbg(parsedData, usuario, res, fileName) {
  const connection = await pool.promise().getConnection();
  let lineaNum = 0;
  let idProceso;
  try {
    await connection.beginTransaction();
    idProceso = generateIdProceso();
    const batchValues = parsedData.map((row, index) => {
      lineaNum = index + 1;
      const fechaCarga = new Date();
      return [idProceso, lineaNum, ...row, fechaCarga, usuario];
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
          f_carga,  // Incluir f_carga en la consulta
          usr_carga
        ) VALUES ?`;

        console.log(idProceso);
    await connection.query(query, [batchValues]);
    await connection.commit();
    console.log(`Todas las líneas insertadas en am_cmbg.`);
    return res
      .status(200)
      .json({
        code: 'SUCCESS',
        message: `${fileName} procesado sin errores! con el id ${idProceso}`,
      });
  } catch (error) {
    await connection.rollback();
     // exp regular para extraer solo el num de la lineNum del mensaje de error
    const errorMatch = error.message.match(/at row (\d+)/);
    let lineNumber = errorMatch && errorMatch[1] ? errorMatch[1] : "desconocida";
    let additionalMessage = lineNumber === "1"
      ? " Revise si seleccionó bien la opción de tipo de archivo ya que tiene error en la primera línea."
      : "";
      let errorMessage = `Error al insertar en CMBG: Error en la línea ${lineNumber}.${additionalMessage}`;

      await registrarError(idProceso , fileName, error.code, '5', errorMessage, errorMessage);

    return res.status(500).json({
      code: 'ERROR_INSERT',
      message: errorMessage
    });
  } finally {
    connection.release();
  }
}

//guardar el error , nombre de archivo y id_proceso en la tabla error
//guardar nombre de archivo y id_proceso en map

async function saveDBtxtCmer(parsedData, usuario, res, fileName) {
  const connection = await pool.promise().getConnection();
  let lineaNum = 0;
  let idProceso;
  try {
    await connection.beginTransaction();
    idProceso = generateIdProceso();
    const batchValues = parsedData.map((row, index) => {
      const fechaCarga = new Date();
      lineaNum = index + 1;
      return [idProceso, lineaNum, ...row, fechaCarga, usuario];
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
          f_carga, 
          usr_carga
        ) VALUES ?`;

    await connection.query(query, [batchValues]);
    await connection.commit();
    console.log(`Todas las líneas insertadas en am_cmer.`);
    return res
      .status(200)
      .json({ code: 'SUCCESS', message: `${fileName} procesado sin errores! con el id ${idProceso}`});
  } catch (error) {
    await connection.rollback();
    console.error(`Error al insertar en am_cmer: ${error.message}`);
     // exp regular para extraer solo el num de la lineNum del mensaje de error
     const errorMatch = error.message.match(/at row (\d+)/);
     let lineNumber = errorMatch && errorMatch[1] ? errorMatch[1] : "desconocida";
     let additionalMessage = lineNumber === "1"
       ? " Revise si seleccionó bien la opción de tipo de archivo ya que tiene error en la primera línea."
       : "";
       let errorMessage = `Error al insertar en CMER: Error en la línea ${lineNumber}.${additionalMessage}`;
   
       await registrarError(idProceso , fileName, error.code, '5', errorMessage, errorMessage);

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
  try {
    const parsedData = await cargaTxt__(req, res);
    if (!parsedData) {
      // Si parsedData es undefined, envía una respuesta de error.
      return res.status(500).json({
        code: 'EMPTY_PATH',
        message: 'Error al procesar el archivo , seleccione uno por favor',
      });
    }
    if (entradaValue === 'cmbg') {
      await saveDBtxtCmbg(parsedData, usuario, res, fileName);
    } else if (entradaValue === 'cmer') {
      await saveDBtxtCmer(parsedData, usuario, res, fileName);
      console.log('terminaron las lineas del archivo');
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
