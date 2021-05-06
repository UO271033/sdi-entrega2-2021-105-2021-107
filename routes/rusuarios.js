module.exports = function(app, swig, gestorBD) {
    app.get("/usuarios", function(req, res) {
        res.send("ver usuarios");
    });

    app.get("/registrarse" , function (req, res) {
        let respuesta = swig.renderFile('views/bregistro.html', {});
        res.send(respuesta);
    });

    app.post('/usuario', function(req, res) {

        //Las contraseñas no son iguales
        if(req.body.password!=req.body.password2) {
            res.redirect("/registrarse" +
                "?mensaje=Las contraseñas no coinciden"+
                "&tipoMensaje=alert-danger ");
            return;
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

        let criterio = {
            email : usuario.email
        }
        gestorBD.obtenerUsuarios(criterio , function (usuarios) {
            if (usuarios == null) {
                let respuesta = swig.renderFile('views/error.html', {
                    mensaje : "Error al obtener usuarios"
                });
                res.send(respuesta);
            }
            else {
                if(usuarios.length>0) {
                    res.redirect("/registrarse" +
                        "?mensaje=Email ya registrado" +
                        "&tipoMensaje=alert-danger ");
                } else {
                    gestorBD.insertarUsuario(usuario, function(id) {
                        if (id == null){
                            res.send("Error al insertar el usuario");
                        } else {
                            res.send('Usuario Insertado ' + id);
                            req.session.usuario = usuario.email;
                            //TODO: redireccionar a "opciones de usuario registrado"
                        }
                    });
                }
            }
        });
    });



    app.get("/identificarse", function (req,res) {
        let respuesta = swig.renderFile('views/bidentificacion.html', {});
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
                    mensaje : "Error al obtener usuarios"
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
                            res.send("Error en la bd")
                        } else {
                            if(usuarios.length==0) {
                                req.session.usuario = null;
                                res.redirect("/identificarse" +
                                    "?mensaje=Contraseña incorrecta" +
                                    "&tipoMensaje=alert-danger ");
                            } else {
                                req.session.usuario = usuarios[0].email;
                                //TODO: redireccionar
                                //TODO: mirar si es usuario admin
                                res.redirect("/ofertas/propias");
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



}