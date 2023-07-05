const { request, response } = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/generarjwt');

const login = async (req = request, res = response) => {
    const { correo, password } = req.body;

    try {
        const usuario = await Usuario.findOne({ correo })

        const validarPassword = bcrypt.compareSync(password, usuario.password);
        if (!validarPassword) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - (password incorrecta)'
            });
        }

        const token = await generarJWT(usuario.id, usuario.nombre);

        res.json({
            msg: 'Login PATH',
            user: usuario.user,
            rol: usuario.rol,
            correo, password,
            token
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Error de login, asegurese de que este todo correcto'
        });
    }
}

module.exports = {
    login
}