const TipoCuenta = require('../models/tipoCuenta');

const defaultTipoCuentas = async () => {
    try {
        let contador = 0;
        for (let i = 1; i <= 4; i++) {
            let tipoCuenta;
            switch (i) {
                case 1:
                    tipoCuenta = { tipo: 'monetaria'.toUpperCase() };
                    break;
                case 2:
                    tipoCuenta = { tipo: 'ahorro'.toUpperCase() };
                    break;
                case 3:
                    tipoCuenta = { tipo: 'tarjeta de credito'.toUpperCase() };
                    break;
                case 4:
                    tipoCuenta = { tipo: 'prestamos'.toUpperCase() };
                    break;
                default:
                    break;
            }

            const tipoCuentaExistente = await TipoCuenta.exists(tipoCuenta);
            if (tipoCuentaExistente) {
                contador++;
                continue;
            }

            const nuevaTipoCuenta = new TipoCuenta(tipoCuenta);
            await nuevaTipoCuenta.save();
            contador++;
        }

        if (contador >= 4) {
            console.log('Tipos de cuentas agregados correctamente');
        } else {
            console.log('No se agregaron correctamente todos los tipos de cuentas');
        }
    } catch (error) {
        console.log(error);
    }
};



module.exports = {
    defaultTipoCuentas
}