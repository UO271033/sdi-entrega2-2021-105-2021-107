module.exports = function(app, swig, gestorBD) {

    app.get('/ofertas/agregar', function (req, res) {
        let respuesta = swig.renderFile('views/bagregar.html', {});
        res.send(respuesta);
    })

    app.post("/oferta", function(req, res) {
        if ( req.session.usuario == null){
            res.send("No hay nadie identificado");
        }
        let oferta = {
            titulo : req.body.titulo,
            detalle : req.body.detalle,
            fecha : new Date(Date.now()),
            precio : req.body.precio,
            usuario : req.session.usuario
        }
        //Conectarse
        gestorBD.insertarOferta(oferta, function(id) {
            if (id == null) {
                res.send("Error al insertar oferta");
            } else {
                res.send("Oferta insertada: " + id);
            }
        })
    });

}