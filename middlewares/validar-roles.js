const { request, response  } = require('express');

const esAdminRole = ( req = request, res = response, next ) => {
    if ( !req.usuario ) {
        return res.status(500).json({
            msg: 'Se quiere verficar el role sin validar el token primero'
        });
    }
    const { rol, user } = req.usuario
    if ( rol !== 'ADMIN_ROLE') {
        return res.status(401).json({
            msg: `${ user } no es administrador, no puede hacer esto`
        });
    }
    next();
}

const esClienteRole = ( req = request, res = response, next ) => {
    if ( !req.usuario ) {
        return res.status(500).json({
            msg: 'Se quiere verficar el role sin validar el token primero'
        });
    }
    const { rol, user } = req.usuario
    if ( rol !== 'CLIENTE_ROLE') {
        return res.status(401).json({
            msg: `${ user } no es un Cliente, no puede hacer esto`
        });
    }
    next();
}
module.exports = {
    esAdminRole,
    esClienteRole
}