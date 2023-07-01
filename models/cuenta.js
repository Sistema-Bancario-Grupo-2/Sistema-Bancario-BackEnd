const { Schema, model } = require('mongoose');

const CuentaSchema = Schema({
    numCuenta:{
        type: String,
        required: true,
        unique: true,
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true,
    },
    tipo_cuenta:{
        type: String,
        required: true,
    },
    capital: {
        type: Number,
        required: true,
    },
    registro: [{
        gasto_o_ganancia: {
            type: Number,
        },
        convenio: {
            type: String,
        },
        fecha:{
            type: Date,
        }
    }]

})


module.exports = model('Cuenta', CuentaSchema)