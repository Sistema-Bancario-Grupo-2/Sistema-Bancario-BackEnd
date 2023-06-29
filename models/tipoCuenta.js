const { Schema, model } = require('mongoose');

const TipoCuentaSchema = Schema({
    tipo: {
        type: String,
        required: true,
        unique: true,
    }
});

module.exports = model('TipoCuenta', TipoCuentaSchema)