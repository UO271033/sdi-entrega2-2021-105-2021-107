module.exports = function(app, gestorBD) {

    app.post("/api/cancion", function(req, res) {
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