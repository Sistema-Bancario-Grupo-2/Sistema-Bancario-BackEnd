const Usuario = require('../models/usuario');
const Cuenta = require('../models/cuenta');
const Role = require('../models/role');
const Convenio = require('../models/convenio');
const TipoCuenta = require('../models/tipoCuenta');

const convenioValido = async ( convenio = '' ) => {
    const existeConvenio = await Convenio.findOne( { tipo: convenio } )
    if(!existeConvenio){
        throw new Error(`El tipo de convenio que ingreso*(${convenio}) no existe en la DB`)
    }
}

const tipoCuentaValido = async ( tipoCuenta = '' ) => {
    const existeTipoCuenta = await TipoCuenta.findOne( { tipo: tipoCuenta } )
    if( !existeTipoCuenta ){
        throw new Error(`No existe ${tipoCuenta} en la db`)
    }
}

const correoExiste = async( correo = '' ) => {
    const existeEmailDeUsuario = await Usuario.findOne( { correo } );
    if ( !existeEmailDeUsuario) {
        throw new Error(`El correo ${ correo } no existe en la db`);
    }
}

const esRoleValido = async( rol = '') => {
    const existeRolDB = await Role.findOne( { rol } );
    if ( !existeRolDB ) {
        throw new Error(`El rol ${ rol }, no existe en la DB `);
    }
}

const existeUsuarioPorId = async( id ) => {
    const existIdOfUser = await Usuario.findById( id );
    if ( !existIdOfUser ) {
        throw new Error(`El id: ${id} no existe en la DB`);
    }
}

const existeCuentaPorId = async( id ) => {
    const existIdOfCategory = await Cuenta.findById( id );
    if ( !existIdOfCategory ) {
        throw new Error(`El id: ${id} no existe en la DB`);
    }
}

module.exports = {
    convenioValido,
    tipoCuentaValido,
    correoExiste,
    esRoleValido,
    existeUsuarioPorId,
    existeCuentaPorId,
}