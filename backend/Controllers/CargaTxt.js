const mysql = require('mysql2');
const pool = mysql.createPool(process.env.DATABASE_URL);
const fs = require('fs');

function generateIdProceso() {
  const now = new Date();
  return now.getTime();
}
async function cargaTxt__(req) {
  if (!req.file) {
    console.error('No se subió ningún archivo.');
    return;
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
    console.error(
      `Ocurrió un error al intentar leer el archivo: ${error.message}`
    );
  }
}

//ahora lo que tengo que hacer es meter en la base de datos esto que estoy haciendo y validar , tienen q entrar bien en los campos
//si da error de eso ya parar el proceso , entonces primer paso es insert y error
//acordarse de hacer un select en el front para decir que archivo es y asi usar un query o el otro para el insert ya que tienen difer nº de camp
async function saveDBtxtCmbg(parsedData, usuario) {
    const connection = await pool.promise().getConnection();
  
    try {
      await connection.beginTransaction();
  
      const batchValues = parsedData.map((row, index) => {
        const idProceso = '25'; // Asegúrate de que este valor sea correcto
        const lineaNum = index + 1;
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
          operacion,
          importe,
          f_carga,  // Incluir f_carga en la consulta
          usr_carga
        ) VALUES ?`;
  
      await connection.query(query, [batchValues]);
      await connection.commit();
      console.log(`Todas las líneas insertadas en am_cmbg.`);
    } catch (error) {
      await connection.rollback();
      console.error(`Error al insertar en am_cmbg: ${error.message}`);
      throw error;
    } finally {
      connection.release();
    }
  }
  
  async function saveDBtxtCmer(parsedData, usuario) {
    const connection = await pool.promise().getConnection();
  
    try {
      await connection.beginTransaction();
  
      const batchValues = parsedData.map((row, index) => {
        const idProceso = '25'; 
        const fechaCarga = new Date();
        const lineaNum = index + 1;
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
    } catch (error) {
      await connection.rollback();
      console.error(`Error al insertar en am_cmer: ${error.message}`);
      throw error;
    } finally {
      connection.release();
    }
  }
  
  
async function execFuncsTxt(req) {
  const entradaValue = req.body.entradaValue;
  const usuario = req.body.usuario;

  try {
    const parsedData = await cargaTxt__(req);

    if (entradaValue === 'cmbg') {
      await saveDBtxtCmbg(parsedData, usuario);
    } else if (entradaValue === 'cmer') {
      await saveDBtxtCmer(parsedData, usuario);
      console.log(`terminaron las lineas `);
    }
  } catch (error) {
    console.error(`Error en execFuncsTxt: ${error.message}`);
    // Manejar el error adecuadamente
  }
}

module.exports = {
  execFuncsTxt,
};
