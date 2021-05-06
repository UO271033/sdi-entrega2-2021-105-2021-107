// Módulos
let express = require('express');
let app = express();


let expressSession = require('express-session');
app.use(expressSession({
    secret: 'abcdefg',
    resave: true,
    saveUninitialized: true
}));


let crypto = require('crypto');

let mongo = require('mongodb');
let swig = require('swig');
let bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let gestorBD = require("./modules/gestorBD.js");
gestorBD.init(app,mongo);

let validator = require("./modules/validator.js");


// routerUsuarioSession
var routerUsuarioSession = express.Router();
routerUsuarioSession.use(function(req, res, next) {
    console.log("routerUsuarioSession");
    if ( req.session.usuario ) {
        next();
    } else {
        console.log("va a : "+req.session.destino)
        res.redirect("/identificarse");
    }
});

//Aplicar routerUsuarioSession
app.use("/ofertas/agregar",routerUsuarioSession);
app.use("/ofertas/propias",routerUsuarioSession);
app.use("/oferta",routerUsuarioSession);


// routerAdmin
var routerAdmin = express.Router();
routerAdmin.use(function(req, res, next) {
    console.log("routerAdmin");
    if ( !req.session.usuario ) { //Compruebo que esté identificado
        console.log("va a : "+req.session.destino);
        res.redirect("/identificarse");
    } else {
        if(req.session.usuario.perfil=="Estandar") { //Compruebo que sea admin
            console.log("va a : "+req.session.destino);
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
require("./routes/rusuarios.js")(app, swig, gestorBD, validator);
require("./routes/rofertas.js")(app, swig, gestorBD);
require("./routes/rapiofertas.js")(app, gestorBD);
require("./routes/rapiusuarios.js")(app, gestorBD);

// lanzar el servidor
app.listen(app.get('port'), function() {
    console.log("Servidor activo");
})
