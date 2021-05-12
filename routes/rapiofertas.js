module.exports = function(app, gestorBD, validator, logger) {

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
        logger.debug(res.usuario);
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

    app.get("/api/chat/mensajes", function (req, res) {
        logger.debug("GET/api/chat/mensajes");
        console.log(req.query.ofertaId);
        let criterio = {
            ofertaId : gestorBD.mongo.ObjectID(req.query.ofertaId),
            autor : req.usuario
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
                    res.send(JSON.stringify(mensajes));
                }
            });
    });

    app.get("/api/chat/:id", function (req, res) {
        logger.debug("GET/api/chat");
        let criterio = {
            ofertaId : gestorBD.mongo.ObjectID(req.query.ofertaId),
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

    app.post("/api/chat", function (req, res) {
        logger.debug("POST/api/chat");
        let chat = {
            ofertaId: gestorBD.mongo.ObjectID(req.body.ofertaId),
            comprador: res.usuario,
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
                logger.debug("Mensaje insertado");
                res.status(201);
                res.json({
                    mensaje : "chat insertado",
                    _id : id
                });
            }
        });
    });

    app.post("/api/chat/mensajes", function (req, res) {
        logger.debug("POST/api/chat/mensajes");
        logger.debug(req.session.usuario);
        let mensaje = {
            autor: res.usuario,
            oferta: req.params.ofertaId,
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
        logger.debug("POST/api/oferta");
        let oferta = {
            titulo : req.body.titulo,
            detalle : req.body.detalle,
            fecha : new Date(Date.now()),
            precio : req.body.precio,
            usuario : req.session.usuario
        }
        // Validacion
        validator.validaDatosOferta(oferta, function(errors) {
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
                        logger.debug("Oferta insertada: "+id);
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
}