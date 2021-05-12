module.exports = function(app, gestorBD, logger) {

    app.post("/api/autenticar/", function (req, res) {
        logger.debug("POST/api/autenticar");
        let seguro = app.get("crypto").createHmac('sha256', app.get('clave'))
            .update(req.body.password).digest('hex');

        let criterio = {
            email: req.body.email,
            password: seguro
        }

        gestorBD.obtenerUsuarios(criterio, function (usuarios) {
            if (usuarios == null || usuarios.length == 0) {
                logger.debug("Error al autenticar");
                res.status(401);
                res.json ({
                    autenticado : false
                })
            } else {
                logger.debug("Autenticado con éxito");
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
        logger.debug("GET/api/ofertas");
        let criterio = {usuario : {$ne: res.usuario}};

        gestorBD.obtenerOfertas(criterio, function (ofertas) {
            if (ofertas == null) {
                logger.debug("Error al listar");
                res.status(500);
                res.json({
                    error : "Se ha producido un error al listar"
                });
            } else {
                logger.debug("Lista de ofertas")
                res.status(200);
                res.send(JSON.stringify(ofertas));
            }
        });
    });

    app.get("/api/chat/:id", function (req, res) {
        logger.debug("GET/api/chat");
        let criterio = {
            ofertaId : gestorBD.mongo.ObjectID(req.params.id),
            comprador : res.usuario.email
        }
            gestorBD.obtenerMensajes(criterio, function (mensajes) {
                if (mensajes == null || mensajes.length == 0) {
                    logger.debug("Error al obtener los mensajes");
                        res.status(500);
                        res.json({
                            error : "Se ha producido un error al obtener los mensajes"
                        });
                } else {
                    logger.debug("Chat obtenido");
                    res.status(200);
                    res.send(JSON.stringify(chats[0]));
                }
            });
    });

    app.get("/api/chat/mensajes/:id", function (req, res) {
        logger.debug("GET/api/chat/mensajes");
        let criterio = {
            ofertaId : gestorBD.mongo.ObjectID(req.params.id),
            comprador : res.usuario
        };

        gestorBD.obtenerChats(criterio, function (chats) {
            if (chats == null) {
                logger.debug("Error al obtener chats");
                res.status(500);
                res.json({
                    error : "Se ha producido un error al obtener los chats"
                });
            } else {
                let criterioMensajes = {"chatId" : chats[0]._id}
                gestorBD.obtenerMensajes(criterioMensajes, function (mensajes) {
                    if (mensajes == null || mensajes.length == 0) {
                        logger.debug("Error al obtener los mensajes");
                        res.status(500);
                        res.json({
                            error : "Se ha producido un error al obtener los mensajes"
                        });
                    } else {
                        logger.debug("Chat obtenido");
                        res.status(200);
                        res.send(JSON.stringify(chats[0]));
                    }
                });
            }
        });
    });

    app.post("api/chat", function (req, res) {
        logger.debug("POST/api/chat");
        let chat = {
            ofertaId: gestorBD.mongo.ObjectID(req.body.ofertaId),
            comprador: res.usuario.email,
            vendedor: req.body.oferta.usuario.email,
        }

        gestorBD.insertarChat(chat, function (id) {
            if (id == null) {
                logger.debug("Error al insertar chat");
                res.status(500);
                res.json({
                    error : "Se ha producido un error al insertar el chat"
                })
            } else {
                res.status(201);
                res.json({
                    mensaje : "chat insertado",
                    _id : id
                });
            }
        });
    });

    app.post("api/chat/mensajes", function (req, res) {
        logger.debug("POST/api/chat/mensajes");
        let mensaje = {
            autor: res.usuario,
            mensaje: req.body.mensaje,
            fecha: new Date().toUTCString(),
            leido: false
        }

        gestorBD.insertarMensaje(mensaje, function (id) {
            if (id == null) {
                logger.debug("Error al insertar mensaje");
                res.status(500);
                res.json({
                    error : "Se ha producido un error al insertar el mensaje"
                })
            } else {
                res.status(201);
                res.json({
                    mensaje : "mensaje insertado",
                    _id : id
                });
            }
        });
    });

    app.get("/api/chats", function (req, res) {
        logger.debug("GET/api/chats");
        let email = res.usuario.email;
        let criterio = {
            $or:[
                {comprador: email},
                {vendedor: email}
            ]
        }
        gestorBD.obtenerChats(criterio, function (chats) {
            if (chats == null || chats.length == 0) {
                logger.debug("Error al obtener chats");
                res.status(500);
                res.json({
                    error : "Se ha producido un error al obtener chats"
                });
            } else {
                logger.debug("Chats obtenidos");
                res.status(200);
                res.send(JSON.stringify(chats));
            }
        })
    })

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