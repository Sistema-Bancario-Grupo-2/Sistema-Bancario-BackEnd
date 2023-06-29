const { Schema, model } = require('mongoose');

const ConvenioSchema = Schema({
    tipo: {
        type: String,
        required: [true, 'El tipo de convenio es necesario']
    }
})


module.exports = model('Convenio', ConvenioSchema)