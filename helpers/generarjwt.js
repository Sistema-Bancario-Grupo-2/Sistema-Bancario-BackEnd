const jwt = require('jsonwebtoken');

// jwt trabaja en base a callbacks y en base a promesas
const generarJWT = ( correo = '', password= '' ) => {

    return new Promise( (resolve, reject) => {

        const payload = { correo, password }

        jwt.sign( payload, process.env.SECURITY_KEY, {
            expiresIn: '4h'
        }, ( err, token ) => {

            if ( err ) {
                console.log(err);
                reject('No se pudo generar el token');
            } else {
                resolve( token );
            }

        } )

    } );

}


module.exports = {
    generarJWT
}
