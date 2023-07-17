const { Router } = require('express');
const router = Router();
const { postCuenta, getCuentas, putCuenta, deleteCuenta, transferencias, getCuentasConMasMovimientos, getTransacciones,  } = require('../controllers/cuenta');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { existeCuentaPorNumCuenta, tipoCuentaValido, existeCuentaPorId, existeUsuarioPorId } = require('../helpers/db-validators');
const { esAdminRole, esClienteRole } = require('../middlewares/validar-roles');

router.get('/', getCuentas);

router.get('/registros/',
    [
        validarJWT,
        esAdminRole,
        check('orden', 'Orden es requerido').not().isEmpty(),
        check('orden', 'No es valido, tiene que ser un numero entre 1 (ascendente) o -1 (descendente)').isIn([1, -1]),
        validarCampos
    ],
    getCuentasConMasMovimientos
);

router.get('/transacciones',
    [
        validarJWT,
        check('numCuenta', 'Numero de cuenta requerido').not().isEmpty(),
        check('numCuenta').custom(existeCuentaPorNumCuenta),
        validarCampos
    ],
    getTransacciones
);

router.post('/crear',
    [   
        validarJWT,
        esAdminRole,
        check('usuario','El usuario es obligatorio').not().isEmpty(),
        check('usuario').custom(existeUsuarioPorId),
        check('tipo_cuenta', 'Tipo de cuenta obligatorio').not().isEmpty(),
        check('tipo_cuenta').custom(tipoCuentaValido),
        check('capital', 'Capital es obligatorio').not().isEmpty(),
        check('capital').custom(),
        validarCampos,
    ],
    postCuenta
);

router.post('/transferencia/', [
    validarJWT,
    esClienteRole,
    check('monto', 'El monto a transferir es requerido').not().isEmpty(),
    check('numCuenta', 'El numero de cuenta es requerido').not().isEmpty(),
    check('numCuenta').custom(existeCuentaPorNumCuenta),
    check('seleccionCuenta').not().isEmpty(),
    check('seleccionCuenta').custom(existeCuentaPorNumCuenta),
    validarCampos,
],transferencias),

router.put('/editar/:id', [
    validarJWT,
    esAdminRole,
    check('id').custom(existeCuentaPorId),
    check('usuario').custom(existeUsuarioPorId),
    check('tipo_cuenta').custom(tipoCuentaValido),
    validarCampos,
],putCuenta);

router.delete('/eliminar/:id', [
    validarJWT,
    esAdminRole,
    check('id').custom(existeCuentaPorId),
    validarCampos,
], deleteCuenta);


module.exports = router;
