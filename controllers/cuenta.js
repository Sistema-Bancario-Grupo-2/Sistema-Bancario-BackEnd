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

        if (listaCuentas) {
            return res.json({
                message: 'No hay cuentas bancarias',
            })
        }
        res.json({
            message: 'Cuentas bancarias activas',
            cuentas: listaCuentas
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error al obtener las cuentas bancarias activas'
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

        // Buscar la cuenta por su ID
        const cuenta = await Cuenta.findById(id);

        if (!cuenta) {
            return res.status(404).json({
                message: 'No se encontró la cuenta bancaria'
            });
        }
}

const deleteCuenta = async (req, res) => {
    try {
        const { id } = req.params;

        // Buscar la cuenta por su ID
        const cuenta = await Cuenta.findById(id);

        if (!cuenta) {
            return res.status(404).json({
                message: 'No se encontró la cuenta bancaria'
            });
        }

        // Establecer el estado de la cuenta en falso
        // cuenta.estado = false;

        // Guardar los cambios en la base de datos

        const usuarioCuenta = await Usuario.findOne({ no_cuenta: cuenta._id })

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

module.exports = {
    getCuentas,
    postCuenta,
    putCuenta,
    deleteCuenta,
}