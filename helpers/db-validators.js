const Usuario = require('../models/usuario');
const Cuenta = require('../models/cuenta');
const Role = require('../models/role');
const Convenio = require('../models/convenio');
const TipoCuenta = require('../models/tipoCuenta');

const convenioValido = async (convenio = '') => {
    const existeConvenio = await Convenio.findOne({ tipo: convenio })
    if (!existeConvenio) {
        throw new Error(`El tipo de convenio que ingreso*(${convenio}) no existe en la DB`)
    }
}

const tipoCuentaValido = async (tipoCuenta = '') => {
    const existeTipoCuenta = await TipoCuenta.findOne({ tipo: tipoCuenta })
    if (!existeTipoCuenta) {
        throw new Error(`No existe ${tipoCuenta} en la db`)
    }
}

const correoExiste = async (correo = '') => {
    const existeEmailDeUsuario = await Usuario.findOne({ correo });
    if (!existeEmailDeUsuario) {
        throw new Error(`El correo ${correo} no existe en la db`);
    }
}

const ifExistCorreo = async (correo = '') => {
    const ifExistCorreoDB = await Usuario.findOne({ correo });
    if (ifExistCorreoDB) {
        throw new Error(`El correo ${correo} ya existe en la db`)
    }
}

const esRoleValido = async (rol = '') => {
    const existeRolDB = await Role.findOne({ rol });
    if (!existeRolDB) {
        throw new Error(`El rol ${rol}, no existe en la DB `);
    }
}

const existeUsuarioPorId = async (id) => {
    const existIdOfUser = await Usuario.findById(id);
    if (!existIdOfUser) {
        throw new Error(`El id: ${id} no existe en la DB`);
    }
}

const existeCuentaPorId = async (id) => {
    const existIdOfAccount = await Cuenta.findById(id);
    if (!existIdOfAccount) {
        throw new Error(`El id: ${id} no existe en la DB`);
    }
}

const buscarCuentaFavoritos = async (favoritos) => {

    if (favoritos) {
        for (const { no_cuenta, preferencia } of favoritos) {
            if (no_cuenta !== '' || no_cuenta !== null) {
                const existIdOfAccount = await Cuenta.findById(no_cuenta);
                if (!existIdOfAccount) {
                    throw new Error(`El NO. Cuenta: ${no_cuenta} no existe en la DB`);
                }
            } 
        }
    }
}

const dpiValido = async (dpi = '') => {
    if (dpi.length < 13 || dpi.length > 13) {
        throw new Error(`El dpi: ${dpi} no es valido`)
    }
}

const ingresoValido = async (ingreso) => {
    if (ingreso < 100) {
        throw new Error(`El ingreso mensual debe ser mayor a 100`)
    }
}

const existeUser = async (user = '') => {
    const existUser = await Usuario.findOne({ user });
    if (existUser) {
        throw new Error(`Este usuario ${user} ya existe en la db`);
    }
}

const existDPI = async (dpi) => {
    const usuarioDB = await Usuario.findOne({dpi});
    if(usuarioDB){
        throw new Error(`El dpi: ${dpi} ya existe en la base de datos.`)
    }
}

module.exports = {
    convenioValido,
    tipoCuentaValido,
    correoExiste,
    ifExistCorreo,
    esRoleValido,
    existeUsuarioPorId,
    existeCuentaPorId,
    dpiValido,
    ingresoValido,
    existeUser,
    buscarCuentaFavoritos,
    existDPI,
}