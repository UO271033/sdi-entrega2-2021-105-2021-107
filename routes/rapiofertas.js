module.exports = function(app, swig, gestorBD, logger) {

    app.post("/api/autenticar/", function (req, res) {
        let seguro = app.get("crypto").createHmac('sha256', app.get('clave'))
            .update(req.body.password).digest('hex');

        let criterio = {
            email: req.body.email,
            password: seguro
        }

        gestorBD.obtenerUsuarios(criterio, function (usuarios) {
            if (usuarios == null || usuarios.length == 0) {
                res.status(401);
                res.json ({
                    autenticado : false
                })
            } else {
                let token = app.get('jwt').sign(
                    {usuario: criterio.email, tiempo: Date.now()/1000},
                    "secreto");
                res.status(200);
                res.json({
                    autenticado: true,
                    token : token
                });
            }
        });
    });

    app.get("/api/ofertas", function (req, res) {
        let criterio = {"usuario" : {$ne: req.session.usuario.email}};

        gestorBD.obtenerOfertas(criterio, function (ofertas) {
            if (ofertas == null) {
                logger.debug("Error al listar");
                res.status(500);
                res.json({
                    error : "Se ha producido un error al listar"
                });
            } else {
                res.status(200);
                res.send(JSON.stringify(ofertas));
            }
        });
    });

    app.post("/api/oferta", function(req, res) {
        let oferta = {
            titulo : req.body.titulo,
            detalle : req.body.detalle,
            fecha : new Date(Date.now()),
            precio : req.body.precio,
            usuario : req.session.usuario
        }
        // Validacion
        validaDatosOferta(oferta, function(errors) {
            if (errors !== null && errors.length > 0) {
                res.status(403);
                res.json({
                    errores : errors
                })
            }
            else {
                gestorBD.insertarOferta(oferta, function(id){
                    if (id == null) {
                        res.status(500);
                        res.json({
                            error : "se ha producido un error"
                        })
                    } else {
                        res.status(201);
                        res.json({
                            mensaje : "oferta insertada",
                            _id : id
                        })
                    }
                });
            }
        })
    });

    function validaDatosOferta(oferta, funcionCallback) {
        let errors = new Array();
        if (oferta.titulo === null || typeof oferta.titulo === 'undefined' || oferta.titulo === "")
            errors.push("El titulo de la oferta no puede  estar vacio")
        if (oferta.detalle === null || typeof oferta.detalle === 'undefined' || oferta.detalle === "")
            errors.push("El detalle de la oferta no puede  estar vacio")
        if (oferta.fecha === null || typeof oferta.fecha ==='undefined' || oferta.fecha.getMilliseconds() > Date.now())
            errors.push("La fecha de la oferta no puede estar vacia o es erronea")
        if (oferta.precio === null || typeof oferta.precio === 'undefined' || oferta.precio < 0 || oferta.precio === "")
            errors.push("El precio de la oferta no puede ser negativo")
        if (errors.length <= 0)
            funcionCallback(null)
        else
            funcionCallback(errors)
    }

}