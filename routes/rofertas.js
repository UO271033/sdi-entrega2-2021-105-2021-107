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

        if(req.body.destacada==null || req.body.destacada=="" || req.body.destacada=="undefined") {
           oferta.destacada = false;
        } else {
            //Se ha marcado

            if(req.session.usuario.dinero<20) {
                //No tiene dinero:
                res.redirect("/ofertas/agregar" +
                    "?mensaje=No dispones de dinero suficiente para destacar tu oferta"+
                    "&tipoMensaje=alert-danger ");
                return;

            } else {
                //Tiene dinero
                oferta.destacada=true;

                let dineroFinal = (req.session.usuario.dinero-20).toFixed(2);


                let criterioUser = {email:req.session.usuario.email}
                let userMod = {dinero:dineroFinal}

                gestorBD.modificarUsuario(criterioUser, userMod, function (result) {
                    if(result==null) {
                        logger.debug("Error al actualizar el dinero del usuario")
                        let respuesta = swig.renderFile('views/error.html', {
                            mensaje : "Error al insertar oferta",
                            "usuario" : req.session.usuario
                        });
                        res.send(respuesta);
                        return;
                    } else {
                        //El dinero se actualiza en la bd
                        req.session.usuario.dinero=dineroFinal;
                    }
                });

            }

        }




        ///Validar
        validator.validaDatosOferta(oferta, function (errors) {
            if (errors !== null && errors.length > 0) {
                logger.debug("Oferta no válida");
                res.redirect("/ofertas/agregar" +
                    "?mensaje=Datos de la oferta no válidos"+
                    "&tipoMensaje=alert-danger ");
            } else {

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
        logger.debug("GET/ofertas/eliminar/"+req.params.id);

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
                            logger.debug("Oferta eliminada: "+oferta[0]._id);
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
        logger.debug("GET/ofertas/buscar");

        //Criterio de búsqueda
        let criterio = {
            comprada:false
        };
        if (req.query.busqueda != null && req.query.busqueda != "" && req.query.busqueda != "undefined" ) {
            let expr = new RegExp(req.query.busqueda, 'i');
            criterio.titulo = expr;
            logger.debug("Criterio de búsqueda: "+expr);
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
                logger.debug("Se muestran las ofertas buscadas");

                let ofertasDestacadas = [];
                let ofertasNoDestacadas = [];

                ofertas.forEach(function (oferta) {
                    if(oferta.destacada) {
                        ofertasDestacadas.push(oferta);
                    } else {
                        ofertasNoDestacadas.push(oferta);
                    }
                } );


                let respuesta = swig.renderFile('views/bofertas.html', {
                    ofertasDestacadas : ofertasDestacadas,
                    ofertasNoDestacadas: ofertasNoDestacadas,
                    paginas: paginas,
                    actual: pg,
                    "usuario" : req.session.usuario
                });
                res.send(respuesta);
            }
        });
    });




    app.get('/oferta/comprar/:id', function (req, res) {
        logger.debug("GET/oferta/comprar/" + req.params.id);

        let criterio = {
            _id: gestorBD.mongo.ObjectID(req.params.id)
        }

        //Obtenemos la oferta
        gestorBD.obtenerOfertas(criterio, function (oferta) {
            if (oferta == null) {
                logger.debug("Error al acceder a la oferta");
                let respuesta = swig.renderFile('views/error.html', {
                    mensaje: "Error al realizar la compra",
                    "usuario": req.session.usuario
                });
                res.send(respuesta);
            } else {

                if (oferta[0].comprada == true) {
                    //Si el usuario no tiene dinero suficiente
                    res.redirect("/ofertas/buscar" +
                        "?mensaje=Esta oferta ya ha sido comprada" +
                        "&tipoMensaje=alert-danger ");
                } else {
                    if (oferta[0].usuario == req.session.usuario.email) {
                        //Un usuario no puede comprar su oferta
                        //Si el usuario no tiene dinero suficiente
                        res.redirect("/ofertas/buscar" +
                            "?mensaje=No puedes comprar tu propia oferta" +
                            "&tipoMensaje=alert-danger ");
                    } else {

                        let dineroUsuarioActualizado = (req.session.usuario.dinero - oferta[0].precio).toFixed(2);

                        if (dineroUsuarioActualizado < 0) {
                            //Si el usuario no tiene dinero suficiente
                            res.redirect("/ofertas/buscar" +
                                "?mensaje=No tiene dinero suficiente para realizar la compra" +
                                "&tipoMensaje=alert-danger ");

                        } else {
                            //Se puede comprar:

                            //Restamos el dinero al usuario:
                            let criterioUser = {email: req.session.usuario.email}

                            let usuarioMod = {dinero: dineroUsuarioActualizado}

                            gestorBD.modificarUsuario(criterioUser, usuarioMod, function (result) {
                                if (result == null) {
                                    logger.debug("Error al modificar los datos del usuario");
                                    let respuesta = swig.renderFile('views/error.html', {
                                        mensaje: "Error al realizar la compra",
                                        "usuario": req.session.usuario
                                    });
                                    res.send(respuesta);
                                } else {
                                    req.session.usuario.dinero = dineroUsuarioActualizado;
                                    logger.debug("Dinero del usuario " + req.session.usuario.email + " actualizado: " + dineroUsuarioActualizado + "€");
                                    //Modificamos la oferta:

                                    let ofertaMod = {
                                        comprada: true,
                                        comprador: req.session.usuario.email
                                    }

                                    gestorBD.modificarOferta(criterio, ofertaMod, function (result) {
                                        if (result == null) {
                                            logger.debug("Error al modificar los datos de la oferta");
                                            let respuesta = swig.renderFile('views/error.html', {
                                                mensaje: "Error al realizar la compra",
                                                "usuario": req.session.usuario
                                            });
                                            res.send(respuesta);
                                        } else {
                                            //Compra realizada
                                            logger.debug("El usuario " + req.session.usuario.email + " ha comprado la oferta: " + req.params.id + "€");
                                            res.redirect("/ofertas/buscar" +
                                                "?mensaje=Compra realizada con éxito" +
                                                "&tipoMensaje=alert-success ");

                                        }
                                    });
                                }
                            });
                        }
                    }
                }
            }
        });
    });




    app.get("/compras", function (req, res) {
        logger.debug("GET/compras");

        let criterio = {comprador : req.session.usuario.email };

        gestorBD.obtenerOfertas(criterio, function (ofertas) {
            if (ofertas == null) {
                logger.debug("Error al obtener las compras del usuario");
                let respuesta = swig.renderFile("views/error.html", {
                    mensaje : "Error al listar compras",
                    "usuario" : req.session.usuario
                });
                res.send(respuesta);
            } else {
                logger.debug("Ofertas compradas mostradas");
                let respuesta = swig.renderFile("views/bcompras.html", {
                        ofertas : ofertas,
                        "usuario" : req.session.usuario
                });
                res.send(respuesta);
            }
        });
    });


    app.get('/oferta/destacar/:id', function (req, res) {
        logger.debug("GET/ofertas/destacar/"+req.params.id);

        let criterio = {"_id" : gestorBD.mongo.ObjectID(req.params.id) };

        //Obtengo la oferta a destacar
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


                    if(req.session.usuario.dinero<20) {
                        //No tiene dinero:
                        res.redirect("/ofertas/propias" +
                            "?mensaje=No dispones de dinero suficiente para destacar tu oferta"+
                            "&tipoMensaje=alert-danger ");
                        return;

                    } else {
                        //Tiene dinero
                        let ofertaMod = {destacada:true}

                        let dineroFinal = (req.session.usuario.dinero-20).toFixed(2);


                        let criterioUser = {email:req.session.usuario.email}
                        let userMod = {dinero:dineroFinal}

                        gestorBD.modificarUsuario(criterioUser, userMod, function (result) {
                            if(result==null) {
                                logger.debug("Error al actualizar el dinero del usuario")
                                let respuesta = swig.renderFile('views/error.html', {
                                    mensaje : "Error al insertar oferta",
                                    "usuario" : req.session.usuario
                                });
                                res.send(respuesta);
                            } else {
                                //El dinero se actualiza en la bd
                                req.session.usuario.dinero=dineroFinal;

                                gestorBD.modificarOferta(criterio, ofertaMod, function (ofertas) {
                                    if (ofertas == null) {
                                        logger.debug("Error al modificar la oferta");
                                        let respuesta = swig.renderFile('views/error.html', {
                                            mensaje : "Error al modificar la oferta",
                                            "usuario" : req.session.usuario
                                        });
                                        res.send(respuesta);
                                    } else {
                                        logger.debug("Oferta destacada: "+req.params.id);
                                        res.redirect("/ofertas/propias"  +
                                            "?mensaje=Oferta destacada correctamente"+
                                            "&tipoMensaje=alert-success ");
                                    }
                                });




                            }
                        });

                    }

                } else {
                    res.redirect("/ofertas/propias" +
                        "?mensaje=No puedes destacar esta oferta"+
                        "&tipoMensaje=alert-danger ");
                }
            }
        });
    });

}