const mongoose = require('mongoose');

const dbConnection = async () => {
    try {
        // Expected output: a number from 0 to <1
        mongoose.set("strictQuery", false);
        await mongoose.connect(process.env.CNN_MONGODB);

        console.log('Base de datos conectada');
    } catch (error) {
        console.log(error);
        throw new Error('Error al momento de conectar a la base de datos')
    }
}

module.exports = {
    dbConnection
};