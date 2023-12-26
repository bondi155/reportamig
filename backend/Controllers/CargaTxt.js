const mysql = require('mysql2');
const pool = mysql.createPool(process.env.DATABASE_URL);
const fs = require('fs');

async function cargaTxt__ (req) {
    // Asegúrate de que haya un archivo subido
    if (!req.file) {
        console.error("No se subió ningún archivo.");
        return;
    }

    try {
        // Leer el archivo subido
        const dataTxt = await fs.promises.readFile(req.file.path, 'utf8');
        console.log(dataTxt);
        console.log(JSON.stringify(dataTxt));
    } catch (error) {
        console.error(`Ocurrió un error al intentar leer el archivo: ${error.message}`);
    }
}

function saveDBtxt (dataTxt) {




}


module.exports = {
    cargaTxt__,
}