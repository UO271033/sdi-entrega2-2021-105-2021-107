module.exports = {

    validarUsuario: function (usuario, funcionCallback) {
    let errors = new Array();
    if (usuario.email === null || typeof usuario.email === 'undefined' || usuario.email === "")
        errors.push("El email del usuario no puede  estar vacio")
    if (usuario.nombre === null || typeof usuario.nombre === 'undefined' || usuario.nombre === "")
        errors.push("El nombre del usuario no puede  estar vacio")
    if (usuario.apellidos === null || typeof usuario.apellidos === 'undefined' || usuario.apellidos === "")
        errors.push("Los apellidos del usuario no pueden  estar vacios")
    if (usuario.password === null || typeof usuario.password === 'undefined' || usuario.password === "")
        errors.push("La contraseña del usuario no puede  estar vacia")
    if (usuario.dinero === null || typeof usuario.dinero === 'undefined' || usuario.dinero === "" || usuario.dinero < 0)
        errors.push("El dinero del usario no es válido o está vacío")
    if (usuario.perfil === null || typeof usuario.perfil === 'undefined' || usuario.perfil === "" || (usuario.perfil != "Estandar" && usuario.perfil != "Admin"))
        errors.push("El perfil de usuario no es válido o está vacío")
    if (errors.length <= 0)
        funcionCallback(null)
    else
        funcionCallback(errors)
}



}