const { request, response } = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/generarjwt');

const login = async (req = request, res = response) => {
    const { correo, password } = req.body;

    try {

        //Verficiar si el email existe
        const usuario = await Usuario.findOne({ correo });
        // if (!usuario) {
        //     return res.status(400).json({
        //         msg: 'Usuario / Password no son correctos - (El correo no existe jaja)'
        //     });
        // }

        //Verificar la password
        const validarPassword = bcrypt.compareSync(password, usuario.password);
        if (!validarPassword) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - (password incorrecta)'
            });
        }

        //Generar JWT
        // const token = await generarJWT(usuario.id, usuario.nombre, usuario.cart);

        const token = 123456;

        res.json({
            msg: 'Login PATH',
            correo, password,
            token
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Hable con el administrador (BackEnd)'
        });
    }
}

module.exports = {
    login
}