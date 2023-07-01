const { Router } = require('express');
const router = Router();
const { postCuenta, getCuentas, putCuenta, deleteCuenta } = require('../controllers/cuenta');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

router.get('/', getCuentas);

router.post('/crear',
    [   
        validarJWT,
        
        validarCampos,
    ],
    postCuenta
);

router.put('/editar:id', putCuenta);

router.delete('/eliminar:id', [], deleteCuenta);

module.exports = router;
