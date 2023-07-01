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

// const defaultTipoCuentas = async () => {

//     try {
//         let tipoCuentas;
//         let contador = 1;
//         for (let i = 0; i < 5; i++) {
//             switch (i) {
//                 case 1:
//                     let tipoCuenta1 = new TipoCuenta();
//                     tipoCuenta1.tipo = 'monetaria'.toUpperCase();
//                     tipoCuentas = await TipoCuenta.findOne({ tipo: tipoCuenta1.tipo })
//                     if (tipoCuentas !== null) {
//                         contador++;
//                         break;
//                     }
//                     tipoCuenta1.save()
//                     if (!tipoCuenta1) {
//                         contador--;
//                         break;
//                     }
//                     break;
//                 case 2:
//                     let tipoCuenta2 = new TipoCuenta();
//                     tipoCuenta2.tipo = 'ahorro'.toUpperCase();
//                     tipoCuentas = await TipoCuenta.findOne({ tipo: tipoCuenta2.tipo })
//                     if (tipoCuentas !== null) {
//                         contador++;
//                         break;
//                     }
//                     tipoCuenta2.save();
//                     if (!tipoCuenta2) {
//                         contador--;
//                     }
//                     break;
//                 case 3:
//                     let tipoCuenta3 = new TipoCuenta();
//                     tipoCuenta3.tipo = 'tarjeta de credito'.toUpperCase();
//                     tipoCuentas = await TipoCuenta.findOne({ tipo: tipoCuenta3.tipo })
//                     if (tipoCuentas !== null) {
//                         contador++;
//                         break;
//                     }
//                     tipoCuenta3.save();
//                     if (!tipoCuenta3) {
//                         contador--;
//                         break;
//                     }
//                     break;
//                 case 4:
//                     let tipoCuenta4 = new TipoCuenta();
//                     tipoCuenta4.tipo = 'prestamos'.toUpperCase();
//                     tipoCuentas = await TipoCuenta.findOne({ tipo: tipoCuenta4.tipo })
//                     if (tipoCuentas !== null) {
//                         contador++;
//                         break;
//                     }
//                     tipoCuenta4.save();
//                     if (!tipoCuenta4) {
//                         contador--;
//                         break;
//                     }
//                     break;
//                 default:
//                     break;
//             }
//         }

//         if (contador >= 4) {
//             return console.log('Tipo de cuentas agregado correctamente');
//         } else {
//             if(contador == 1){
//                 return console.log('Tipo de cuentas agregado correctamente')
//             }else {
//                 return console.log('No se agregaron correctamente');
//             }
//         }


//     } catch (error) {
//         console.log(error);
//     }

// }

module.exports = {
    defaultTipoCuentas
}