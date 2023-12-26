//const db = require('../Config/dbConfig'); local para pruebas
require('dotenv').config();
const mysql = require('mysql2');
const pool = mysql.createPool(process.env.DATABASE_URL);
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secretkey = process.env.JWT_SECRET;
const path = require('path');

//evaluation data select
function consultaEntrada__(req, res) {
  const sqlGetEvalData = 'SELECT * FROM ctamcer_entrada ORDER BY id_proceso DESC;';

  pool.query(sqlGetEvalData, (err, result) => {
    if (err) {
      console.error(
        'Error executing query sqlGetEvalData..Check DB connection',
        err
      );
      return res.status(500).send('Error to get Evaluation data');
    }
    res.send(result);
  });
}

//get list users.
function listUsers__(req, res) {
  const sqlGetusuarios = 'SELECT * FROM users ';
  pool.query(sqlGetusuarios, (error, result) => {
    if (error) {
      console.error('Error in query listUsers...Check DB connection', error);
    } else {
      const userList = result.map((row) => ({
        id: row.id,
        user: row.username,
        role: row.role,
      }));
      res.send(userList);
    }
  });
}

//func para validar usuarios , executamos eso esto en terminal para generar el key = node -e "console.log(require('crypto').randomBytes(256).toString('base64'))
function loginUsers__(req, res) {
  const username = req.body.username;
  const password = req.body.password;

  const selectLogin = 'SELECT * FROM users WHERE username = ?';

  pool.query(selectLogin, [username], (err, result) => {
    if (err) {
      console.error('Error in connection to DB to check bcrypt password', err);
      res
        .status(500)
        .send('Error al realizar la conexion bd para bcrypt password');
    }
    if (result.length > 0) {
      bcrypt.compare(password, result[0].password, (err, response) => {
        if (err) {
          console.error(err);
          res.status(500).send('Error to compare encrypt password');
        } else if (response) {
          const token = jwt.sign({ id: result[0].id }, secretkey, {
            expiresIn: '1h',
          });
          res.send({
            token,
            id: result[0].id,
            username: result[0].username,
            role: result[0].role,
          });
          console.log('Loggin user...', username);
        } else {
          res.send({ code: 'USR_INCOR' });
        }
      });
    } else {
      res.send({ code: 'USR_NOT_EXIST' });
    }
  });
}

//descarga de archivo
function download__(req, res) {
  try {
    const filename = req.params.filename;
    const filepath = path.join(__dirname, 'reports', filename);
    res.download(filepath);
  } catch (error) {
    console.error('Error downloading report...', error);
  }
}

//get para aerolineas segun usuario
function EvalCompany__(req, res) {
  const username = req.query.domainName ?? '';

  const sqlGetEvalCompany = `SELECT e.*, COALESCE(c.cuenta, 1) as 'evaluaciones'
  FROM evaluation_data e
  LEFT JOIN (
      SELECT LOWER(full_name) as lower_full_name, COUNT(*) as cuenta
      FROM evaluation_data
      WHERE LOWER(company) = LOWER(?)
      AND first_exam LIKE '%23'
      GROUP BY lower_full_name
  ) c ON LOWER(e.full_name) = c.lower_full_name
  WHERE LOWER(e.company) = LOWER(?)
  AND e.first_exam LIKE '%23'
  ORDER BY e.id DESC;
  `;

  pool.query(sqlGetEvalCompany, [username, username], (err, result) => {
    if (err) {
      console.error(
        'Error executing query sqlGetEvalData..Check DB connection',
        err
      );
      return res.status(500).send('Error to get Evaluation data');
    }
    res.send(result);
  });
}

//get para dashboard home graficos
function getExamData__(req, res) {
  const company = req.query.domainName ?? '';
  const sqlGetTotalCalif = `SELECT COUNT(*) AS total_calif FROM evaluation_data WHERE (first_exam LIKE '%23' OR first_exam LIKE '%24' OR  first_exam LIKE '%25') AND LOWER(company) = LOWER(?)`;
  const sqlGetGroupCalif = `SELECT exam_calif, COUNT(*) AS count FROM evaluation_data WHERE LOWER(company) = LOWER(?) AND (first_exam LIKE '%23' OR first_exam LIKE '%24' OR first_exam LIKE '%25') GROUP BY exam_calif`;
  // Obtener el total de exam_calif
  pool.query(sqlGetTotalCalif, company, (err, totalCalifResult) => {
    if (err) {
      console.error('Error fetching total exam data:', err);
      return res
        .status(500)
        .send('Internal Server Error when fetching total exam data.');
    }

    const totalCalif = totalCalifResult[0].total_calif;

    // Obtener el desglose de calificaciones de usuarios company
    pool.query(sqlGetGroupCalif, company, (err, breakdownResult) => {
      if (err) {
        console.error('Error fetching breakdown exam data:', err);
        return res
          .status(500)
          .send('Internal Server Error when fetching breakdown exam data.');
      }

      // Construir un objeto para el desglose
      let breakdown = {};
      breakdownResult.forEach((row) => {
        breakdown[row.exam_calif] = row.count;
      });

      // Devolver la data
      res.json({
        total: totalCalif,
        breakdown: breakdown,
      });
    });
  });
}

function getAllCompanies__(req, res) {
  const sqlGetAllCompanies =
    'SELECT company, COUNT(id) as total_ids FROM evaluation_data GROUP BY company';
  pool.query(sqlGetAllCompanies, (err, companies) => {
    if (err) {
      console.error('Error fetching all companies:', err);
      return res
        .status(500)
        .send('Internal Server Error when fetching companies.');
    }

    res.json(companies);

    //console.log(companies);
  });
}

function listLastEvals__(req, res) {
  const username = req.query.domainName ?? '';

  const sqlGetLastEvals = `SELECT * 
    FROM evaluation_data 
    WHERE LOWER(company) = LOWER(?) 
    ORDER BY id DESC LIMIT 10
    `;
  pool.query(sqlGetLastEvals, username, (err, result) => {
    if (err) {
      console.error(
        'Error executing query sqlGetEvalData..Check DB connection',
        err
      );
      return res.status(500).send('Error to get Evaluation data');
    }
    res.send(result);
  });
}

function getDateEval__(req, res) {
  const company = req.query.domainName ?? '';

  const sqlGetDate = `SELECT first_exam, full_name from evaluation_data WHERE LOWER(company) = LOWER(?) ORDER BY id DESC LIMIT 1`;
  pool.query(sqlGetDate, company, (err, result) => {
    if (err) {
      console.error(
        'Error executing query sqlGetDate..Check DB connection',
        err
      );
      return res.status(500).send('Error to get Date of Exams');
    }
    res.send(result);
  });
}

module.exports = {
  consultaEntrada__,
  getDateEval__,
  loginUsers__,
  listUsers__,
  download__,
  EvalCompany__,
  getExamData__,
  getAllCompanies__,
  listLastEvals__,
};
