require('dotenv').config();
const helmet = require('helmet');
const multer = require('multer');
const express = require('express');
const rateLimit = require('express-rate-limit');
const app = express();
app.set('trust proxy', 1);
const port = process.env.PORT || 5008;
const bodyParser = require('body-parser');
const cors = require('cors');
const getDataController = require('./Controllers/GetFuncData');
const PostDataController = require('./Controllers/PostFuncData');
const ReportController = require ('./Controllers/ReportController') ;
//const mysql = require('mysql2');
const txtController = require('./Controllers/CargaTxt');
//const { ejecutarFunciones } = require('./Controllers/ReportController'); //siempre hay que exportar las funciones para ejecutarlas en cada pantalla aunque no se usen todavia
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

app.use(cors({
  exposedHeaders: ['Archivo-Nombre'], // Exponer 'Archivo-Nombre' además de los encabezados por defecto permitidos por CORS
}));

// Tu middleware personalizado para exponer headers adicionales (alternativa si no usas el paquete CORS)
app.use((req, res, next) => {
  res.header('Access-Control-Expose-Headers', 'Archivo-Nombre');
  next();
});

//limitador de tasa contra ddos
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // limita cada ip a 100 request
});

//limitador de tasa a todas las rutas
app.use(limiter);

app.use(cors());
app.use(express.json());

app.post('/loginUsers', authenticateToken, getDataController.loginUsers__); //login
app.get('/getUserList', authenticateToken, getDataController.listUsers__); //lista de ususarios
app.put('/resetPass', authenticateToken, PostDataController.resetPassword__); //reseteo password
app.get('/getReport', authenticateToken, ReportController.ejecutarFunciones); //ejecutar funcion general que hace el response del json
app.post('/descargarExcel', authenticateToken, ReportController.generarYDescargarExcel); //descarga excel con datosTotal



//post y put functions
app.post('/createUser', authenticateToken, PostDataController.userCreate__); //creacion de usuarios

app.delete(
  '/deleteUser/:id',
  authenticateToken,
  PostDataController.deleteUser__
); //delete usuarios por id
app.post('/uploadfile', upload.single('file'), txtController.execFuncsTxt);

app.listen(port, () => {
  console.log('servidor funcionando en el puerto ' + port);
});
