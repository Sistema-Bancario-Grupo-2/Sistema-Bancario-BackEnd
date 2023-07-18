const Usuario = require('../models/usuario');
const Cuenta = require('../models/cuenta');
const Role = require('../models/role');
const TipoCuenta = require('../models/tipoCuenta');

const tipoCuentaValido = async (tipoCuenta = '') => {
    const existeTipoCuenta = await TipoCuenta.findOne({ tipo: tipoCuenta.toUpperCase() })
    if (!existeTipoCuenta) {
        throw new Error(`No existe este tipo de cuenta en la base de datos: ${tipoCuenta}`)
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
        throw new Error(`El usuario con el id: ${id} no existe en la DB`);
    }
}
const existeUser = async (user = '') => {
    const existUser = await Usuario.findOne({ user });
    if (existUser) {
        throw new Error(`Este usuario ${user} ya existe en la db`);
    }
}

const existeCuentaPorId = async (id) => {
    const existIdOfAccount = await Cuenta.findById(id);
    if (!existIdOfAccount) {
        throw new Error(`La cuenta con el id: ${id} no existe en la DB`);
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

const existDPI = async (dpi) => {
    const usuarioDB = await Usuario.findOne({ dpi });
    if (usuarioDB) {
        throw new Error(`El dpi: ${dpi} ya existe en la base de datos.`)
    }
}

const ingresoValido = async (ingreso) => {
    if (ingreso < 100) {
        throw new Error(`El ingreso mensual debe ser mayor a 100`)
    }
}


const existeCuentaPorNumCuenta = async (numCuenta) => {
    const existCuenta = await Cuenta.findOne({ numCuenta });
    if (!existCuenta) {
        throw new Error(`El numero de cuenta ${numCuenta} no existe en la base de datos.`);
    }
}

module.exports = {
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
    existeCuentaPorNumCuenta,
}