const { Schema, model } = require('mongoose');

const UsuarioSchema = Schema({
    dpi: {
        type: Number,
        unique: true,
        required: true,
    },
    user: {
        type: String,
        unique: true,
        required: true,
    },
    correo: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    direccion: {
        type: String,
        required: true
    },
    celular: {
        type: Number,
        required: true,
    },
    ingresos_mensuales: {
        type: Number,
        required: true,
    },
    no_cuenta: [{
        type: Schema.Types.ObjectId,
        ref: 'Cuenta',
    }],
    favoritos: [{
        no_cuenta: {
            type: Schema.Types.ObjectId,
            ref: 'Cuenta',
        },
        preferencia: {
            type: Boolean,
        }
    }],
    rol: {
        type: String,
        required: true,
        default: 'CLIENTE_ROLE'
    },
});


module.exports = model('Usuario', UsuarioSchema)