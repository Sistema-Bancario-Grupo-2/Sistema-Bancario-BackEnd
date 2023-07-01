const { request, response } = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

const validarJWT = async( req = request, res = response, next ) => {
    const token = req.header('x-token');
    if ( !token ) {
        return res.status(401).json({
            msg: 'No hay token en la petición'
        });
    }
    try {
        // Se coloco correo debido a que si se ponia uid no lo reconocia
        // Se descompuso el jwt.verify y tiraba que lo manejaba con correo
        // Por eso de desestructuro y se trajo con correo y no con uid
        const { correo } = jwt.verify( token, process.env.SECURITY_KEY );
        const usuario = await Usuario.findById( correo );

        if ( !usuario ) {
            return res.status(401).json({
                msg: 'Token no válido - Usuario no existe en la base de datos'
            });
        }

        req.usuario = usuario;
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Token no valido, debe de iniciar sesion nuevamente'
        })
    }

}

module.exports = {
    validarJWT
}