module.exports = function(app, swig, gestorBD, validator, logger) {

    app.get('/ofertas/agregar', function (req, res) {
        logger.debug("GET/ofertas/agregar");
        let respuesta = swig.renderFile('views/bagregar.html', {
            "usuario" : req.session.usuario
        });
        res.send(respuesta);
    })

    app.post("/oferta", function(req, res) {
        logger.debug("POST/oferta");
        let oferta = {
            titulo : req.body.titulo,
            detalle : req.body.detalle,
            fecha : new Date(Date.now()).toLocaleDateString(),
            precio : req.body.precio,
            usuario : req.session.usuario.email,
            comprada : false
        }


        ///Validar
        validator.validaDatosOferta(oferta, function (errors) {
            if (errors !== null && errors.length > 0) {
                logger.debug("Oferta no válida");
                res.redirect("/ofertas/agregar" +
                    "?mensaje=Datos de la oferta no válidos"+
                    "&tipoMensaje=alert-danger ");
            }
        });

        //Conectarse
        gestorBD.insertarOferta(oferta, function(id) {
            if (id == null) {
                logger.debug("Error al insertar oferta")
                let respuesta = swig.renderFile('views/error.html', {
                    mensaje : "Error al insertar",
                    "usuario" : req.session.usuario
                });
                res.send(respuesta);
            } else {
                logger.debug("Oferta insertada: " + id);
                res.redirect("/ofertas/propias");
            }
        });
    });

    app.get('/ofertas/propias', function (req, res) {
        logger.debug("GET/ofertas/propias");
        let criterio = {"usuario" : req.session.usuario.email};

        gestorBD.obtenerOfertasUsuario(criterio, function (ofertas) {
            if (ofertas == null) {
                logger.debug("Error al listar");
                let respuesta = swig.renderFile('views/error.html', {
                    mensaje : "Error al listar",
                    "usuario" : req.session.usuario
                });
                res.send(respuesta);
            } else {
                gestorBD.obtenerOfertas(criterio, function (ofertas) {
                    logger.debug("Ofertas del usuario obtenidas");
                    let respuesta = swig.renderFile('views/bofertaspropias.html',
                        {
                            ofertas : ofertas,
                            "usuario" : req.session.usuario
                        });
                    res.send(respuesta);
                });
            }
        });
    });

    app.get('/oferta/eliminar/:id', function (req, res) {
        logger.debug("GET/ofertas/eliminar/:id");

        let criterio = {"_id" : gestorBD.mongo.ObjectID(req.params.id) };



        //Obtengo la oferta a borrar
        gestorBD.obtenerOfertas(criterio, function (oferta) {
            if(oferta==null) {
                logger.debug("Error al borrar las ofertas");
                let respuesta = swig.renderFile('views/error.html', {
                    mensaje : "Error al borrar las ofertas",
                    "usuario" : req.session.usuario
                });
                res.send(respuesta);
            } else {

                //El usuario en sesión es el propietario y la oferta no está vendida
                if(oferta[0].usuario==req.session.usuario.email && oferta[0].comprada==false) {

                    gestorBD.eliminarOfertas(criterio, function (ofertas) {
                        if (ofertas == null) {
                            logger.debug("Error al borrar las ofertas");
                            let respuesta = swig.renderFile('views/error.html', {
                                mensaje : "Error al borrar las ofertas",
                                "usuario" : req.session.usuario
                            });
                            res.send(respuesta);
                        } else {
                            logger.debug("Oferta eliminada id: "+oferta[0]._id);
                            res.redirect("/ofertas/propias"  +
                                "?mensaje=Oferta eliminada correctamente"+
                                "&tipoMensaje=alert-success ");
                        }
                    });



                } else {
                    res.redirect("/ofertas/propias" +
                        "?mensaje=No puedes borrar esta oferta"+
                        "&tipoMensaje=alert-danger ");
                }






            }
        });





    });

    app.get('/ofertas/buscar', function (req, res) {
        let criterio = {};
        if (req.query.busqueda != null) {
            criterio = { "nombre" : {$regex : ".*"+req.query.busqueda+".*"}};
        }
        let pg = parseInt(req.query.pg);
        if (req.query.pg == null) {
            pg = 1;
        }
        gestorBD.obtenerOfertasPg(criterio, pg, function (ofertas, total) {
            if (ofertas == null) {
                logger.debug("Error al listar");
                let respuesta = swig.renderFile('views/error.html', {
                    mensaje : "Error al listar",
                    "usuario" : req.session.usuario
                });
                res.send(respuesta);
            } else {
                let ultimaPg = total/4;
                if (total % 4 > 0){
                    ultimaPg = ultimaPg +1;
                }
                let paginas = [];
                for (let i = pg-2 ; i <= pg+2; i++) {
                    if (i > 0 && i <= ultimaPg) {
                        paginas.push(i);
                    }
                }
                let respuesta = swig.renderFile('views/bofertas.html', {
                    ofertas : ofertas,
                    "usuario" : req.session.usuario
                });
                res.send(respuesta);
            }
        });
    });

    app.get('/oferta/comprar/:id', function (req, res) {
        let ofertaId = gestorBD.mongo.ObjectID(req.params.id);
        let usuario = req.session.usuario.email;

        usuarioPuedeComprarOferta(usuario, ofertaId, function (comprar) {
            if (comprar) {
                let compra = {
                    usuario : usuario,
                    ofertaId : ofertaId
                }
                gestorBD.insertarCompra(compra, function (idCompra) {
                    if (idCompra == null) {
                        logger.debug("Error al comprar");
                        let respuesta = swig.renderFile('views/error.html', {
                            mensaje : "Error al comprar canción",
                            "usuario" : req.session.usuario
                        });
                        res.send(respuesta);
                    } else {
                        let criteriooferta = { "_id" : gestorBD.mongo.ObjectID(ofertaId)};
                        usuario = req.session.usuario;
                        let criteriousuario = { "_id" : gestorBD.mongo.ObjectID(usuario.id)};
                        gestorBD.ofertaComprada(criteriooferta, criteriousuario, usuario, function (){});
                        res.redirect("/compras");
                    }
                });
            } else {
                logger.debug("Error al comprar");
                let respuesta = swig.renderFile('views/error.html', {
                    mensaje : "Error al comprar canción",
                    "usuario" : req.session.usuario
                });
                res.send(respuesta);
            }
        });
    });

    function usuarioPuedeComprarOferta(usuario, ofertaId, functionCallback) {
        let criterio_usuario = {$and: [{"_id": ofertaId}, {"usuario": usuario} ]};
        let criterio_compra = {$and: [{"ofertaId": ofertaId}, {"usuario": usuario}]};
        gestorBD.obtenerOfertas(criterio_usuario, function (ofertas) {
            if (ofertas == null || ofertas.length > 0) {
                logger.debug("No hay ofertas disponibles para comprar");
                functionCallback(false);
            } else {
                gestorBD.obtenerCompras(criterio_compra, function (compras) {
                    if (compras == null || compras.length > 0) {
                        logger.debug("No hay compras disponibles");
                        functionCallback(false);
                    } else {
                        logger.debug("Ofertas disponilbes para comprar");
                        functionCallback(true);
                    }
                });
            }
        });
    };

    app.get("/compras", function (req, res) {
        let criterio = {"usuario" : req.session.usuario.email };

        gestorBD.obtenerCompras(criterio, function (compras) {
            if (compras == null) {
                logger.debug("Error al listar");
                let respuesta = swig.renderFile("views/error.html", {
                    mensaje : "Error al listar compras",
                    "usuario" : req.session.usuario
                });
                res.send(respuesta);
            } else {
                let ofertasCompradasIds = [];
                for (i = 0; i < compras.length; i++) {
                    ofertasCompradasIds.push(compras[i].ofertaId);
                }

                let criterio = {"_id" : {$in: ofertasCompradasIds}}
                gestorBD.obtenerOfertas(criterio, function (ofertas) {
                    logger.debug("Ofertas compradas obtenidas");
                    let respuesta = swig.renderFile("views/bcompras.html", {
                        ofertas : ofertas,
                        "usuario" : req.session.usuario
                    });
                    res.send(respuesta);
                });
            }
        });
    });

}