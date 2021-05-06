module.exports = function(app, swig, gestorBD, validator) {

    app.get("/registrarse" , function (req, res) {
        let respuesta = swig.renderFile('views/bregistro.html', {"usuario" : req.session.usuario});
        res.send(respuesta);
    });

    app.post('/usuario', function(req, res) {

        //Las contraseñas no son iguales
        if(req.body.password!=req.body.password2) {
            res.redirect("/registrarse" +
                "?mensaje=Las contraseñas no coinciden"+
                "&tipoMensaje=alert-danger ");
        }


        let seguro = app.get("crypto").createHmac('sha256', app.get('clave'))
            .update(req.body.password).digest('hex');
        let usuario = {
            email : req.body.email,
            nombre : req.body.nombre,
            apellidos : req.body.apellidos,
            password : seguro,
            dinero : 100.0,
            perfil : "Estandar"
        }

        validator.validarUsuario(usuario, function (errors) {
            if (errors !== null && errors.length > 0) {
                res.redirect("/registrarse" +
                    "?mensaje=Datos del usuario no válidos"+
                    "&tipoMensaje=alert-danger ");
            }
        });

        let criterio = {
            email : usuario.email
        }
        gestorBD.obtenerUsuarios(criterio , function (usuarios) {
            if (usuarios == null) {
                let respuesta = swig.renderFile('views/error.html', {
                    mensaje : "Error al obtener usuarios",
                    "usuario" : req.session.usuario
                });
                res.send(respuesta);
            }
            else {
                if(usuarios.length>0) {
                    res.redirect("/registrarse" +
                        "?mensaje=Email ya registrado" +
                        "&tipoMensaje=alert-danger ");
                } else {
                    gestorBD.insertarUsuario(usuario, function(userAdded) {
                        if (userAdded == null){
                            let respuesta = swig.renderFile('views/error.html', {
                                mensaje : "Error al insertar usuario",
                                "usuario" : req.session.usuario
                            });
                            res.send(respuesta);
                        } else {
                            req.session.usuario = userAdded;
                            res.redirect("/ofertas/propias");
                        }
                    });
                }
            }
        });
    });



    app.get("/identificarse", function (req,res) {
        let respuesta = swig.renderFile('views/bidentificacion.html', {"usuario" : req.session.usuario});
        res.send(respuesta);
    });

    /**
     * Obtiene los datos del formulario para intentar identificar al usuario
     * Si el usuario insertó un email que no figura en la base de datos se le notifica
     * Si el email existe pero la contraseña no corresponde se le informa
     * Si los datos coinciden con un usuario, inicia sesión y es redirigido
     */
    app.post("/identificarse", function (req,res) {

        let seguro = app.get("crypto").createHmac('sha256', app.get('clave'))
            .update(req.body.password).digest('hex');


        let criterio1 = {
            email : req.body.email
        }

        let criterio2 = {
            email : req.body.email,
            password: seguro
        }

        gestorBD.obtenerUsuarios(criterio1,function (usuarios) {
            if(usuarios==null) {
                let respuesta = swig.renderFile('views/error.html', {
                    mensaje : "Error al obtener usuarios",
                    "usuario" : req.session.usuario
                });
                res.send(respuesta);
            } else {
                if(usuarios.length==0) {
                    req.session.usuario = null;
                    res.redirect("/identificarse" +
                        "?mensaje=Email no registrado" +
                        "&tipoMensaje=alert-danger ");
                } else {
                    gestorBD.obtenerUsuarios(criterio2,function (usuarios) {
                        if(usuarios==null) {
                            req.session.usuario = null;
                            let respuesta = swig.renderFile('views/error.html', {
                                "mensaje" : "Error al obtener usuarios",
                                "usuario" : req.session.usuario
                            });
                            res.send(respuesta);
                        } else {
                            if(usuarios.length==0) {
                                req.session.usuario = null;
                                res.redirect("/identificarse" +
                                    "?mensaje=Contraseña incorrecta" +
                                    "&tipoMensaje=alert-danger ");
                            } else {
                                req.session.usuario = usuarios[0];
                                if(usuarios[0].perfil=="Estandar") {
                                    res.redirect("/ofertas/propias");
                                } else {
                                    res.redirect("/usuarios");
                                }
                            }
                        }
                    });
                }
            }
        });
    });


    app.get("/deslogear", function (req,res) {
        req.session.usuario = null;
        res.redirect("/identificarse");
    });


    app.get("/usuarios", function(req, res) {
        let criterio = {
            perfil : "Estandar"
        }
        gestorBD.obtenerUsuarios(criterio, function(usuarios) {
            if (usuarios == null) {
                let respuesta = swig.renderFile('views/error.html', {
                    mensaje : "Error al listar",
                    "usuario" : req.session.usuario
                });
                res.send(respuesta);
            } else {
                let respuesta = swig.renderFile('views/busuarios.html',
                    {
                        "usuarios" : usuarios,
                        "usuario" : req.session.usuario
                    });
                res.send(respuesta);
            }
        });
    });


    app.post("/usuarios" ,function (req,res) {

        if(req.body.emails==null) {
            res.redirect("/usuarios" +
                "?mensaje=No se ha seleccionado ningún usuario" +
                "&tipoMensaje=alert-danger ");
        } else {

            let emails = [];

            if(!Array.isArray(req.body.emails)) {
                emails.push(req.body.emails);
            } else {
                emails=req.body.emails;
            }


            let criterioOferta = {
                "usuario" : { $in : emails }
            }

            let criterioUsuario = {
                "email" : { $in : emails }
            }

            gestorBD.eliminarOfertas(criterioOferta, function (ofertas) {
                if(ofertas==null) {
                    let respuesta = swig.renderFile('views/error.html', {
                        mensaje : "Error al eliminar las ofertas del usuario",
                        "usuario" : req.session.usuario
                    });
                    res.send(respuesta);
                } else {
                    gestorBD.eliminarUsuarios(criterioUsuario,function (usuarios) {
                        if(usuarios==null) {
                            let respuesta = swig.renderFile('views/error.html', {
                                mensaje : "Error al eliminar usuario",
                                "usuario" : req.session.usuario
                            });
                            res.send(respuesta);
                        } else {
                            res.redirect("/usuarios" +
                                "?mensaje=Eliminado correctamente" +
                                "&tipoMensaje=alert-success ");
                        }
                    });
                }
            });
        }
    });



}