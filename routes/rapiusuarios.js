module.exports = function (app, gestorBD) {

    app.post("/api/registrarse", function(req, res) {
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
        // Validacion
        validaDatosUsuario(usuario, function (errors) {
            if (errors !== null && erros.length > 0) {
                res.status(403);
                res.json({
                    errores : errors
                })
            }
            else {
                gestorBD.insertarUsuario(usuario, function(id) {
                    if (id == null) {
                        res.status(500);
                        res.json({
                            error : "se ha producido un error"
                        })
                    } else {
                        res.status(201);
                        res.json({
                            mensaje : "usuario insertado",
                            _id : id
                        })
                    }
                })
            }
        })

    });

    function validaDatosUsuario(usuario, funcionCallback) {
        let errors = new Array();
        if (usuario.email === null || typeof usuario.email === 'undefined' || usuario.email === "")
            errors.push("El email del usuario no puede  estar vacio")
        if (usuario.nombre === null || typeof usuario.nombre === 'undefined' || usuario.nombre === "")
            errors.push("El género de la canción no puede  estar vacio")
        if (usuario.apellidos === null || typeof usuario.apellidos === 'undefined' || usuario.apellidos === "")
            errors.push("Los apellidos del usuario no puede estar vacios")
        if (usuario.password === null || typeof usuario.password === 'undefined' || usuario.password === "")
            errors.push("La contraseña del usuario no puede  estar vacia")
        if (usuario.dinero === null || typeof usuario.dinero === 'undefined' || usuario.dinero < 0 || usuario.dinero === "")
            errors.push("El dinero del usuario no puede  ser negativo")
        if (usuario.perfil === null || typeof usuario.perfil === 'undefined' || usuario.perfil === "")
            errors.push("El tipo de perfil del usuario no puede  estar vacio")
        if (errors.length <= 0)
            funcionCallback(null)
        else
            funcionCallback(errors)
    }

}