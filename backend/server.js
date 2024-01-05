require('dotenv').config();
const helmet = require('helmet');
const multer = require('multer');
const express = require('express');
const rateLimit = require('express-rate-limit');
const app = express();
app.set('trust proxy', 1);
const port = process.env.PORT || 5015;
const bodyParser = require('body-parser');
const cors = require('cors');
const getDataController = require('./Controllers/GetFuncData');
const PostDataController = require('./Controllers/PostFuncData');
//const mysql = require('mysql2');
const txtController = require('./Controllers/CargaTxt');
//multer
const upload = multer({ dest: 'uploads/' });
const jwt = require('jsonwebtoken');
const secretkey = process.env.JWT_SECRET;
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//validacion del token como encabezado en todas las llamadas de api
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (req.path === '/loginUsers') {
    // Si es la ruta de generación del token, continuar sin verificar el token
    next();
  } else {
    // Verificar el token en todas las demás rutas
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, secretkey, (err, user) => {
      if (err) return res.status(403).send();
      req.user = user;
      next();
    });
  }
}
//limitador de tasa contra ddos
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // limita cada ip a 100 request
});

//limitador de tasa a todas las rutas
app.use(limiter);

app.use(cors());
app.use(express.json());


app.get('/getCompanies', authenticateToken, getDataController.getAllCompanies__);//all companies for admin
app.post('/loginUsers', authenticateToken, getDataController.loginUsers__);//login
app.get('/companyEval', authenticateToken, getDataController.EvalCompany__);//get evaluation by company
app.get('/getUserList', authenticateToken, getDataController.listUsers__);//get user for list
app.put('/resetPass', authenticateToken, PostDataController.resetPassword__,);//reseteo password

//post y put functions
app.post('/createUser', authenticateToken, PostDataController.userCreate__); //creation of users

app.delete(
  '/deleteUser/:id',
  authenticateToken,
  PostDataController.deleteUser__
); //delete user by id

app.post('/uploadfile', upload.single('file'), txtController.execFuncsTxt);


//ruta descargar report card
app.get('/download/:filename', authenticateToken, getDataController.download__); //download file cancell

app.listen(port, () => {
  console.log('servidor funcionando en el puerto ' + port);
});
