// Módulos
let express = require('express');
let app = express();



app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "POST, GET, DELETE, UPDATE, PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, token");
    // Debemos especificar todas las headers que se aceptan. Content-Type , token
    next();
});



let jwt = require('jsonwebtoken');
app.set('jwt',jwt);


let expressSession = require('express-session');
app.use(expressSession({
    secret: 'abcdefg',
    resave: true,
    saveUninitialized: true
}));


let log4js = require('log4js');
let logger = log4js.getLogger("log");
logger.level = "debug";
logger.debug("App iniciando");



let crypto = require('crypto');

let mongo = require('mongodb');
let swig = require('swig');
let bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let gestorBD = require("./modules/gestorBD.js");
gestorBD.init(app,mongo);

let validator = require("./modules/validator.js");

// routerUsuarioToken
let routerUsuarioToken = express.Router();
routerUsuarioToken.use(function(req, res, next) {
    // obtener el token, vía headers (opcionalmente GET y/o POST).
    let token = req.headers['token'] || req.body.token || req.query.token;
    if (token != null) {
        // verificar el token
        jwt.verify(token, 'secreto', function(err, infoToken) {
            if (err || (Date.now()/1000 - infoToken.tiempo) > 240 ){
                res.status(403); // Forbidden
                res.json({
                    acceso : false,
                    error: 'Token invalido o caducado'
                });
                // También podríamos comprobar que intoToken.usuario existe
                return;

            } else {
                // dejamos correr la petición
                res.usuario = infoToken.usuario;
                next();
            }
        });

    } else {
        res.status(403); // Forbidden
        res.json({
            acceso : false,
            mensaje: 'No hay Token'
        });
    }
});

// routerUsuarioSession
var routerUsuarioSession = express.Router();
routerUsuarioSession.use(function(req, res, next) {
    logger.debug("Router UsuarioSession");
    if ( req.session.usuario ) {
        next();
    } else {
        res.redirect("/identificarse");
    }
});

//Aplicar routerUsuarioSession
app.use("/deslogear",routerUsuarioSession);
app.use("/ofertas/agregar",routerUsuarioSession);
app.use("/ofertas/propias",routerUsuarioSession);
app.use("/oferta",routerUsuarioSession);


// routerAdmin
var routerAdmin = express.Router();
routerAdmin.use(function(req, res, next) {
    logger.debug("Router Admin");
    if ( !req.session.usuario ) { //Compruebo que esté identificado
        res.redirect("/identificarse");
    } else {
        if(req.session.usuario.perfil=="Estandar") { //Compruebo que sea admin
            res.redirect("/ofertas/propias");
        } else {
            next();
        }
    }
});

//Aplicar routerAdmin
app.use("/usuarios",routerAdmin);









app.use(express.static('public'));

// Variables
app.set('port', 8081);
app.set('db','mongodb://admin:sdi@wallapop-shard-00-00.msduo.mongodb.net:27017,wallapop-shard-00-01.msduo.mongodb.net:27017,wallapop-shard-00-02.msduo.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-otiliw-shard-0&authSource=admin&retryWrites=true&w=majority');

app.set('clave','abcdefg');
app.set('crypto',crypto);

//Rutas/controladores por lógica
require("./routes/rusuarios.js")(app, swig, gestorBD, validator, logger);
require("./routes/rofertas.js")(app, swig, gestorBD, logger);
require("./routes/rapiofertas.js")(app, gestorBD);
require("./routes/rapiusuarios.js")(app, gestorBD);




app.get('/', function (req, res) {
    res.redirect('/ofertas/propias');
});

// lanzar el servidor
app.listen(app.get('port'), function() {
    logger.debug("Servidor activo");
});
