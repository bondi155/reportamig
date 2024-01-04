const mysql = require('mysql2');
const pool = mysql.createPool(process.env.DATABASE_URL);
const fs = require('fs');

function generateIdProceso() {
  const now = new Date();
  return now.getTime();
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
  try {
    await connection.beginTransaction();

    const batchValues = parsedData.map((row, index) => {
      const idProceso = '25'; // Asegúrate de que este valor sea correcto
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

    await connection.query(query, [batchValues]);
    await connection.commit();
    console.log(`Todas las líneas insertadas en am_cmbg.`);
    return res
      .status(200)
      .json({
        code: 'SUCCESS',
        message: `${fileName} Se proceso sin errores!`,
      });
  } catch (error) {
    await connection.rollback();
     // exp regular para extraer solo el num de la lineNum del mensaje de error
    const errorMatch = error.message.match(/at row (\d+)/);
    let lineNumber = errorMatch && errorMatch[1] ? errorMatch[1] : "desconocida";
    let additionalMessage = lineNumber === "1"
      ? " Revise si seleccionó bien la opción de tipo de archivo ya que tiene error en la primera línea."
      : "";
      let errorMessage = `Error al insertar en CMER: Error en la línea ${lineNumber}.${additionalMessage}`;

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

async function saveDBtxtCmer(parsedData, usuario, res) {
  const connection = await pool.promise().getConnection();
  let lineaNum = 0;
  try {
    await connection.beginTransaction();

    const batchValues = parsedData.map((row, index) => {
      const idProceso = '25';
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
      .json({ code: 'SUCCESS', message: ' Se proceso sin errores!' });
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
  const fileName = req.body.fileName; // Asegúrate de obtener fileName del cuerpo de la solicitud

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
