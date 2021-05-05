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

app.use(express.static('public'));

// Variables
app.set('port', 8081);
app.set('db','mongodb://admin:sdi@wallapop-shard-00-00.msduo.mongodb.net:27017,wallapop-shard-00-01.msduo.mongodb.net:27017,wallapop-shard-00-02.msduo.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-otiliw-shard-0&authSource=admin&retryWrites=true&w=majority');

app.set('clave','abcdefg');
app.set('crypto',crypto);

//Rutas/controladores por lógica
require("./routes/rusuarios.js")(app, swig, gestorBD);
require("./routes/rofertas.js")(app, swig, gestorBD);
require("./routes/rapiofertas.js")(app, gestorBD);
require("./routes/rapiusuarios.js")(app, gestorBD);

// lanzar el servidor
app.listen(app.get('port'), function() {
    console.log("Servidor activo");
})
