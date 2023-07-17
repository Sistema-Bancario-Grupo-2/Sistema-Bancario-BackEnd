const { response, request } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');
const Cuenta = require('../models/cuenta')

const defaultAdmin = async () => {
    try {
        let user = new Usuario();
        user.user = "ADMINB"
        user.correo = "ADMINB@gmail.com"
        user.password = "ADMINB"
        user.rol = "ADMIN_ROLE"
        user.dpi = 1234567891234
        user.ingresos_mensuales = 1
        user.celular = 12121212
        user.direccion = "En el banco"
        const userEncontrado = await Usuario.findOne({ correo: user.correo });
        if (userEncontrado !== null) return console.log("El administrador está listo");
        user.password = bcryptjs.hashSync(user.password, bcryptjs.genSaltSync());
        user = await user.save();
        if (!user) return console.log("El administrador no está listo!");
        return console.log("El administrador está listo!");
    } catch (error) {
        throw new Error(error);
    }
}

const getUsuarios = async (req = request, res = response) => {
    const query = {};

    const listaUsuarios = await Usuario.find(

    )

    // const listaUsuarios = await Promise.all([
    //     Usuario.countDocuments(query),
    //     Usuario.find(query)
    // ]);

    res.json({
        msg: 'GET API de usuarios',
        listaUsuarios
    });
}

const getUsuarioById = async(req = request, res = response) => {
    const {id} = req.params;

    const usuarioById = await Usuario.findById(id)

    res.json({
        msg:'Usuario by Id',
        usuarioById
    })

}

const postUsuario = async (req = request, res = response) => {

    const usuario = req.usuario;

    console.log(usuario);

    const { dpi, user, nombre, correo, password, direccion, celular, ingresos_mensuales, rol } = req.body;
    const usuarioDB = new Usuario({ dpi, user, nombre, correo, password, direccion, celular, ingresos_mensuales, rol });

    //Encriptar password
    const salt = bcryptjs.genSaltSync();
    usuarioDB.password = bcryptjs.hashSync(password, salt);

    //Guardar en Base de datos
    await usuarioDB.save();

    res.status(201).json({
        msg: 'POST API de usuario',
        usuarioDB
    });
}

const putUsuario = async (req = request, res = response) => {
    const { id } = req.params;
    const user = req.usuario;


    const usuarioExistente = await Usuario.findById(id);
    if (!usuarioExistente) {
        return res.status(404).json({
            message: 'Usuario no encontrado'
        });
    }

    if (user._id != id) {
        return res.status(404).json({
            msg: 'No se puede editar a otro usuario'
        })
    }
    if (user.rol === 'CLIENTE_ROLE') {
        const { _id, dpi, rol, direccion, celular, ingresos_mensuales, favoritos, no_cuenta, ...resto } = req.body;

        // Actualizar y guardar el usuario
        const usuarioEditado = await Usuario.findByIdAndUpdate(
            id,
            resto,
        );

        res.json({
            msg: 'PUT API de usuario',
            usuarioEditado
        });
    } else if (user.rol === 'ADMIN_ROLE') {
        const data = req.body;

        const favoritosActualizados = [...usuarioExistente.favoritos];

        if (favoritos && favoritos.length > 0) {
            favoritos.forEach((nuevoFavorito) => {
                const existenteIndex = favoritosActualizados.findIndex((favorito) => favorito.no_cuenta.toString() === nuevoFavorito.no_cuenta.toString());
                if (existenteIndex !== -1) {
                    favoritosActualizados[existenteIndex].preferencia = nuevoFavorito.preferencia;
                } else {
                    favoritosActualizados.push(nuevoFavorito);
                }
            });
        }

        const usuarioEditado = await Usuario.findByIdAndUpdate(
            id,
            { $set: data, favoritos: favoritosActualizados },
            { new: true }
        );

        res.json({
            msg: 'PUT API de usuario',
            usuarioEditado
        });
    }
}

const deleteUsuario = async (req = request, res = response) => {
    const { id } = req.params;

    const buscarUsuario = await Usuario.findById(id);

    const buscarCuentas = await Cuenta.find({ usuario: buscarUsuario._id })

    if (buscarCuentas) {
        buscarCuentas.map(async ({ _id }) => {
            cuentasEliminadas = await Cuenta.findByIdAndDelete(_id);
        })
    }

    const usuarioEliminado = await Usuario.findByIdAndDelete(buscarUsuario._id);

    res.json({
        msg: 'Usuario eliminado existosamente',
        usuarioEliminado
    })

}

const addFavoritos = async (req = request, res = response) => {
    const usuarioId = req.params;
    const { id } = req.usuario;

    console.log(id);

    try {

        const usuarioFavoritos = await Usuario.findById(id);

        for (const userId of usuarioFavoritos.favoritos) {
            console.log(userId);
            if (userId.usuarioId.toString() === usuarioId.id) {
                return res.json({
                    msg: 'Ya esta el usuario en favoritos'
                })
            }
        }

        const nuevoFavorito = {
            usuarioId: usuarioId.id,
            preferencia: true
        }

        usuarioFavoritos.favoritos[usuarioFavoritos.favoritos.length] = nuevoFavorito;

        await usuarioFavoritos.save();

        res.json({
            msg: 'Nuevo favorito agregado!!',
            usuarioFavoritos
        })

    } catch (error) {
        console.log(error);
    }
}

const eliminarFavorito = async (req = request, res = response) => {
    const usuarioId = req.params;
    const { id } = req.usuario;

    try {
        const usuarioFavoritos = await Usuario.findById(id);

        for (let i = 0; i < usuarioFavoritos.favoritos.length; i++) {
            if (usuarioFavoritos.favoritos[i].usuarioId.toString() === usuarioId.id) {
                // Eliminar el favorito utilizando splice()
                usuarioFavoritos.favoritos.splice(i, 1);

                console.log(usuarioFavoritos.favoritos);

                await usuarioFavoritos.save();


                return res.json({
                    msg: 'Eliminado con éxito!!',
                    usuarioFavoritos
                });
            }
        }

        res.json({
            msg: 'El usuario no se encuentra en favoritos'
        });
    } catch (error) {
        console.log(error);
    }
};

module.exports = {
    defaultAdmin,
    getUsuarios,
    postUsuario,
    putUsuario,
    deleteUsuario,
    addFavoritos,
    eliminarFavorito, 
    getUsuarioById,
}