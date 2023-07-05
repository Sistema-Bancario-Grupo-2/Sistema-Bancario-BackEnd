const { response, request } = require('express');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const Cuenta = require('../models/cuenta');
const Usuario = require('../models/usuario');

const getCuentas = async (req = request, res = response) => {
    try {
        // Buscar todas las cuentas con estado activo
        const listaCuentas = await Promise.all([
            Cuenta.find()
        ])

        console.log(listaCuentas);

        if (!listaCuentas) {
            return res.json({
                message: 'No hay cuentas bancarias',
            })
        }
        res.json({
            message: 'Cuentas bancarias',
            cuentas: listaCuentas
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error al obtener las cuentas bancarias'
        });
    }
};

const postCuenta = async (req = request, res = response) => {
    const data = req.body;
    try {
        // Generar número de cuenta aleatorio
        const numCuenta = uuidv4();

        if (!numCuenta) {
            throw new Error('No se pudo generar el número de cuenta');
        }

        // Verificar si el propietario existe
        const propietarioExistente = await Usuario.findById(data.usuario);
        if (!propietarioExistente) {
            return res.status(404).json({
                message: 'El propietario de la cuenta no existe'
            });
        }

        // Verificar si la cuenta de origen ya existe
        const cuentaExistente = await Cuenta.findOne({ numCuenta });
        if (cuentaExistente) {
            return res.status(400).json({
                message: 'La cuenta de origen ya existe'
            });
        }

        // Crear la cuenta bancaria
        const nuevaCuenta = new Cuenta({
            usuario: data.usuario,
            numCuenta,
            capital: data.capital,
            tipo_cuenta: data.tipo_cuenta
        });

        // Guardar la cuenta en la base de datos
        await nuevaCuenta.save();

        // Agregar el id de la cuenta al nuevo propietario
        propietarioExistente.no_cuenta.push(nuevaCuenta._id);
        console.log(propietarioExistente.no_cuenta);
        await propietarioExistente.save();

        res.json({
            message: 'Cuenta bancaria creada exitosamente',
            cuenta: nuevaCuenta
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error al crear la cuenta bancaria'
        });
    }
};

const putCuenta = async (req = request, res = response) => {
    const { id } = req.params;
    const { usuario, ...resto } = req.body;

    // Buscar la cuenta por su ID
    const cuenta = await Cuenta.findByIdAndUpdate(id, resto);

    if (cuenta.usuario.toString() !== usuario) {
        const usuarioCuenta = await Usuario.findById(cuenta.usuario);
        const usuarioNuevaCuenta = await Usuario.findById(usuario);
        cuenta.usuario = usuario;

        if (usuarioCuenta.no_cuenta.length > 0 && cuenta.usuario !== usuario) {
            const indexCuentaAnterior = usuarioCuenta.no_cuenta.indexOf(id);
            if (indexCuentaAnterior !== -1) {
                usuarioCuenta.no_cuenta.splice(indexCuentaAnterior, 1);
                await usuarioCuenta.save();
            }
        }

        if (!usuarioNuevaCuenta.no_cuenta.includes(id)) {
            usuarioNuevaCuenta.no_cuenta.push(id);
            await usuarioNuevaCuenta.save();
        }
    }
    await cuenta.save();


    res.json({
        msg: 'Modificado con exito',
    })

};

const deleteCuenta = async (req, res) => {
    try {
        const { id } = req.params;

        const usuarioCuenta = await Usuario.findOne({ no_cuenta: id })

        let indiceCuentaUsuario;

        for (let i = 0; i < usuarioCuenta.no_cuenta.length; i++) {
            if (usuarioCuenta.no_cuenta[i].toString() === id) {
                indiceCuentaUsuario = i;
            }

        }
        console.log(indiceCuentaUsuario);

        usuarioCuenta.no_cuenta.splice(indiceCuentaUsuario, 1);

        await usuarioCuenta.save();

        const cuentaEliminada = await Cuenta.findByIdAndDelete(id);

        res.json({
            message: 'Cuenta bancaria eliminada exitosamente',
            cuentaEliminada
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error al eliminar la cuenta bancaria'
        });
    }
};

const transferencias = async (req = request, res = response) => {
    const { monto, numCuenta } = req.body;
    const { no_cuenta } = req.usuario;
    const fechaActual = new Date();

    const cuentaTransferencia = await Cuenta.findById(no_cuenta);

    const registro1 = cuentaTransferencia.registro.length;

    if (no_cuenta == numCuenta) {
        return res.status(404).json({
            msg: 'No se puede realizar una transferencia a si mismo'
        })
    }

    if (monto >= 10000) {
        return res.status(404).json({
            msg: 'No se puede hacer una transferencia de mas de Q10,000.00'
        })
    }

    if (cuentaTransferencia.capital - monto < 0) {
        return res.status(406).json({
            msg: 'No se puede realizar esta transferencia, por falta de fondos!!'
        })
    }
    cuentaTransferencia.capital = cuentaTransferencia.capital - monto;

    const registroTransferencia = {
        egreso: monto,
        fecha: fechaActual,
        convenio: 'transferencia'
    }

    cuentaTransferencia.registro[registro1] = registroTransferencia;

    await cuentaTransferencia.save();

    const cuentaTransferir = await Cuenta.findOne({ numCuenta });

    const registro2 = cuentaTransferir.registro.length;

    cuentaTransferir.capital = cuentaTransferir.capital + monto;

    const registroCuentaTransferir = {
        egreso: monto,
        fecha: fechaActual,
        convenio: 'transferencia'
    }

    cuentaTransferir.registro[registro2] = registroCuentaTransferir;

    await cuentaTransferir.save();

    res.json({
        msg: 'Se ha hecho la transferencia con exito!'

    })
}

module.exports = {
    getCuentas,
    postCuenta,
    putCuenta,
    deleteCuenta,
    transferencias
}