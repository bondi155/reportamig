const mysql = require('mysql2');
const pool = mysql.createPool(process.env.DATABASE_URL);
const bcrypt = require('bcrypt');
const saltRounds = 10;
//user create
function userCreate__(req, res) {
  const username = req.body.username;
  const role = req.body.role;
  const password = req.body.password;

  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
      console.error('error in brypt.hash inside userCreate function', err);
    }

    const sqlCreateUser =
      'INSERT INTO users (username, role, password ) VALUES (?,?,?)';

    pool.query(sqlCreateUser, [username, role, hash], (error, result) => {
      if (error) {
        console.error(
          'Error in sqlCreateUser query..Check DB connection',
          error.code
        );

        if (error.code === 'ER_DUP_ENTRY') {
          res.status(500).json({
            code: 'USER_DUPLI',
            message: 'This user name already exists',
          });
        }
      } else {
        res.status(200).json('User create!');
      }
    });
  });
}

//delete user
function deleteUser__(req, res) {
  const id = req.params.id;

  const sqlDeleteUser = 'DELETE FROM users WHERE id = ?';

  pool.query(sqlDeleteUser, [id], (error, result) => {
    if (error) {
      console.error('Error in sqlDeleteUser query..Check DB connection', error);
      res
        .status(500)
        .json({ message: 'An error occurred while deleting the user' });
    } else {
      res.status(200).json({ message: 'Usuario borrado' });
    }
  });
}

async function deleteArchivoTxt__(req, res) {
  const id = req.params.id;
  const connection = await pool.promise().getConnection();

  try {
    const sqlDeleteTxt = `DELETE FROM am_proceso WHERE id = ?`;

   await connection.query(sqlDeleteTxt, [id]);
    res.status(200).json({ code :'ARCHIVO_BORRADO_SUCCESS', message: `Archivo borrado relacionado al ${id}`});
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: `Sucedio un Error al eliminar el Archivo TXT ${error}`,
    });
    
  } finally {
    if (connection) {
      connection.release(); 
    }  }
}

//reset password
async function resetPassword__(req, res) {
  const password = req.body.password;
  const username = req.body.username;

  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
      console.error('error en brypt.hash dentro de resetpass function', err);
    }

    const updatePass = `UPDATE users SET password = ? WHERE username = ?`;
    pool.query(updatePass, [hash, username], (error, result) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ message: 'error', error });
      }
      if (result.affectedRows === 0) {
        return res
          .status(400)
          .json({ message: 'No rows updated. Check the ID.' });
      }
      return res.status(200).json({ message: 'Password actualizada' });
    });
  });
}

module.exports = {
  userCreate__,
  resetPassword__,
  deleteUser__,
  deleteArchivoTxt__,
};
