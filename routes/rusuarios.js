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
                res.send("Error")
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
                            res.send('Usuario Insertado ' + id); //TODO: redireccionar a "opciones de usuario registrado"
                        }
                    });
                }
            }
        });



    });
}