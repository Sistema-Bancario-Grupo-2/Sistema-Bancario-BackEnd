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
        egreso: {
            type: Number,
        },
        convenio: {
            type: String,
        },
        fecha:{
            type: Date,
        }, 
        descripcion:{
            type: String,
        }
    }]

})


module.exports = model('Cuenta', CuentaSchema)