const { response, request } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');

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

const getUsuarios = async () => {
    const query = { estado: true };

    const listaUsuarios = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
    ]);

    res.json({
        msg: 'GET API de usuarios',
        listaUsuarios
    });
}

const postUsuarioCliente = async (req = request, res = response) => {
    const { dpi, user, nombre, correo, password, direccion, celular, ingresos_mensuales } = req.body;
    const usuarioDB = new Usuario({ dpi, user, nombre, correo, password, direccion, celular, ingresos_mensuales });

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

const putUsuarioCliente = async ( req = request, res = response ) => {
    const { id } = req.params;

    //Ignoramos el _id, rol, estado y google al momento de editar y mandar la petición en el req.body
    const { _id, dpi, password, ...resto } = req.body;

    //editar y guardar
    const usuarioEditado = await Usuario.findByIdAndUpdate(id, resto);

    res.json({
        msg: 'PUT API de usuario',
        usuarioEditado
    });
}

const deleteUsuarioCliente = async (req = request, res = response) => {
    const { id } = req.params;

    const usuarioEliminado = await Usuario.findByIdAndDelete(id);

    res.json({
        msg: 'Usuario eliminado existosamente',
        usuarioEliminado
    })

}

module.exports = {
    defaultAdmin,
    getUsuarios,
    postUsuarioCliente,
    putUsuarioCliente, 
    deleteUsuarioCliente
}