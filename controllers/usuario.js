const { response, request } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');
const Cuenta = require('../models/cuenta')

const defaultAdmin = async () => {
    try {
        let user = new Usuario();
        user.user = "ADMINISTRADOR"
        user.correo = "admin@gmail.com"
        user.password = "123456"
        user.rol = "ADMIN_ROLE"
        user.dpi = 0
        user.ingresos_mensuales = 0
        user.celular = 0
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

    const listaUsuarios = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
    ]);

    res.json({
        msg: 'GET API de usuarios',
        listaUsuarios
    });
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

    if (user._id != id) {
        return res.status(404).json({
            msg: 'No se puede editar a otro usuario'
        })
    }

    const { _id, dpi, password, correo, rol, favoritos, no_cuenta, ...resto } = req.body;
    const usuarioExistente = await Usuario.findById(id);

    if (!usuarioExistente) {
        return res.status(404).json({
            message: 'Usuario no encontrado'
        });
    }

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

    // Actualizar y guardar el usuario
    const usuarioEditado = await Usuario.findByIdAndUpdate(
        id,
        { $set: resto, favoritos: favoritosActualizados },
        { new: true }
    );

    res.json({
        msg: 'PUT API de usuario',
        usuarioEditado
    });
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
    const { _id } = req.usuario;

    try {

        const usuarioFavoritos = await Usuario.findById(_id);

        for (const userId of usuarioFavoritos.favoritos) {
            console.log(userId);
            if( userId.usuarioId === usuarioId.id){
                return res.json({
                    msg:'Ya esta el usuario en favoritos'
                })
            }
        }

        const nuevoFavorito = {
            usuarioId: usuarioId.id,
            preferencia: true
        }

        usuarioFavoritos.favoritos[usuarioFavoritos.favoritos.length] = nuevoFavorito;

        // await usuarioFavoritos.save();

        res.json({
            msg:'Nuevo favorito agregado!!',
            usuarioFavoritos
        })

    } catch (error) {
        console.log(error);
    }





}

module.exports = {
    defaultAdmin,
    getUsuarios,
    postUsuario,
    putUsuario,
    deleteUsuario,
    addFavoritos
}