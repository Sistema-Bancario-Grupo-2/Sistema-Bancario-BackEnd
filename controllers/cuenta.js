const { response, request } = require('express');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const Cuenta = require('../models/cuenta');
const Usuario = require('../models/usuario');

const getCuentas = async (req = request, res = response) => {
    try {
        // Buscar todas las cuentas

        const listaCuentas = await Cuenta.find(

        );

        // const listaCuentas = await Promise.all([
        //     Cuenta.find()
        // ])

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

const getCuentaById = async (req = req, res = response) => {
    const { id } = req.params;

    const cuentaEncontrada = Cuenta.findById(id)

    res.json({
        msg: 'Cuenta encontrada',
        cuentaEncontrada
    })

}

const getTransacciones = async (req = request, res = response) => {

    const { numCuenta } = req.body
    const { id } = req.usuario;

    const cuentaTransacciones = await Cuenta.findOne({ numCuenta });

    console.log(cuentaTransacciones.usuario.toString());
    console.log(id);

    if (id != cuentaTransacciones.usuario.toString()) {
        return res.status(404).json({
            msg: 'Esta cuenta no esta en la lista del usuario'
        })
    }

    if (!cuentaTransacciones) {
        return res.status(404).json({
            msg: 'No existe esta cuenta'
        })
    }

    const registros = cuentaTransacciones.registro;

    res.json({
        msg: 'Transacciones de la cuenta',
        registros
    })
}

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

        if (data.capital < 0) {
            return res.status(404).json({
                msg: 'No se puede crear esta cuenta con capital negativo'
            })
        }

        // crear la cuenta bancaria
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

    if (resto.capital < 0) {
        return res.status(404).json({
            msg: 'No se puede actualizar esta cuenta con saldo negativo'
        })
    }

    // Buscar la cuenta por su ID
    const cuenta = await Cuenta.findByIdAndUpdate(id);

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
        msg: 'Modificado con éxito',
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
    const
        {
            monto, // Monto es la cantidad de dinero que se le va a transferir a la otra cuenta
            numCuenta, // numCuenta es el numero de cuenta a la cual se va a hacer la transferencia
            seleccionCuenta,
            /*
            seleccionCuenta va a ser el numero de cuenta que va a escoger el 
            usuario que va a hacer la transferencia. si el usuario quiere hacer la transferencia 
            desde la primer cuenta de su lista de cuentas va a colocar el numero de cuenta por asi decirlo, 
            si quiere la segunda cuenta de su listado de cuentas va a escoger la opción de su numero de cuenta, etc...
            */
        } = req.body;

    const { no_cuenta } = req.usuario;

    const fechaActual = new Date(); // Fecha actual en la que fue hecha la transferencia.

    const cuentaTransferencia = await Cuenta.findOne({ numCuenta: seleccionCuenta });

    const registro1 = cuentaTransferencia.registro.length;

    let buscarCuentas = no_cuenta.find(cuenta => {
        return cuenta.toString() === cuentaTransferencia._id.toString()
    })

    if (!buscarCuentas) {
        return res.status(404).json({
            msg: 'No se puede hacer la transferencia por que la cuenta seleccionada no es tuya'
        })
    }

    if (cuentaTransferencia.numCuenta == numCuenta) {
        return res.status(404).json({
            msg: 'No se puede realizar una transferencia a si mismo'
        })
    }

    if (monto <= 0) {
        return res.status(404).json({
            msg: 'No se puede esta transferencia vacía'
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


    const cuentaTransferir = await Cuenta.findOne({ numCuenta });

    const registro2 = cuentaTransferir.registro.length;

    cuentaTransferir.capital = cuentaTransferir.capital + monto;

    const registroTransferencia = {
        numeroTransaccion: cuentaTransferencia.registro.length,
        monto,
        fecha: fechaActual,
        convenio: 'transferencia',
        descripcion: 'Egreso',
        numCuenta,
    }

    cuentaTransferencia.registro[registro1] = registroTransferencia;

    const registroCuentaTransferir = {
        monto,
        fecha: fechaActual,
        convenio: 'transferencia',
        descripcion: 'Ingreso',
        numCuenta: seleccionCuenta
    }

    cuentaTransferir.registro[registro2] = registroCuentaTransferir;
    cuentaTransferencia.numeroTransaccion = cuentaTransferencia.registro.length;
    cuentaTransferir.numeroTransaccion = cuentaTransferir.registro.length;

    await cuentaTransferencia.save();

    await cuentaTransferir.save();

    res.json({
        msg: 'Se ha hecho la transferencia con éxito!'

    })
}

const getCuentasConMasMovimientos = async (req = request, res = response) => {
    const { orden } = req.body;

    try {
        // Obtener todas las cuentas con sus registros
        const cuentasRegistros = await Cuenta.find();

        // Ordenar el array de cuentas en función del número de transacciones
        if (orden === 'Ascendente') {
            cuentasRegistros.sort((a, b) => a.numeroTransaccion - b.numeroTransaccion);
        } else if (orden === 'Descendente') {
            cuentasRegistros.sort((a, b) => b.numeroTransaccion - a.numeroTransaccion);
        } else {
            return res.status(400).json({ msg: 'Orden inválida. Use "Ascendente" o "Descendente".' });
        }

        // Crear una lista con los usuarios y el número de transacciones de cada cuenta
        const usuariosConTransacciones = cuentasRegistros.map(cuenta => ({
            usuario: cuenta.usuario,
            cuenta: cuenta,
        }));

        // Obtener las cuentas con más transacciones
        const cuentasConMasTransacciones = usuariosConTransacciones.filter(({ cuenta }) => cuenta.numeroTransaccion >= 0);

        // Obtener los usuarios con más transacciones y sus registros
        const usuariosConMasTransacciones = await Promise.all(
            cuentasConMasTransacciones.map(async ({ cuenta }) => {
                const usuarioData = await Usuario.findById(cuenta.usuario);
                return {
                    nombre: usuarioData.user,
                    numeroTransacciones: cuenta.numeroTransaccion,
                    registros: cuenta.registro // Aquí asumimos que el modelo Cuenta tiene el campo 'registro'
                };
            })
        );

        res.json({
            msg: 'Usuarios con más transacciones',
            usuariosConMasTransacciones
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Error al obtener usuarios con más transacciones'
        });
    }
};

// const getCuentasConMasMovimientos = async (req = request, res = response) => {
//     const { orden } = req.body;

//     const cuentasRegistros = await Cuenta.find();

//     for (let i = 0; i < cuentasRegistros.length; i++) {
//         console.log(cuentasRegistros[i].numeroTransaccion);
//     }

//     if (orden === 'Ascendente') {

//     } else if (orden === 'Descendente') {

//     }

//     res.json({
//         msg: 'Registro de cuentas',

//     })
// }

module.exports = {
    getCuentas,
    postCuenta,
    putCuenta,
    deleteCuenta,
    transferencias,
    getCuentasConMasMovimientos,
    getTransacciones,
    getCuentaById
}