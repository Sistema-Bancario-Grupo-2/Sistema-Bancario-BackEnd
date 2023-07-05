const { Router } = require('express');
const router = Router();
const { postCuenta, getCuentas, putCuenta, deleteCuenta, transferencias } = require('../controllers/cuenta');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const {  existeCuentaPorNumCuenta, tipoCuentaValido, existeCuentaPorId, existeUsuarioPorId, capitalValido } = require('../helpers/db-validators');
const { esAdminRole, esClienteRole } = require('../middlewares/validar-roles');

router.get('/', getCuentas);

router.post('/crear',
    [   
        validarJWT,
        esAdminRole,
        check('usuario','El usuario es obligatorio').not().isEmpty(),
        check('usuario').custom(existeUsuarioPorId),
        check('tipo_cuenta', 'Tipo de cuenta obligatorio').not().isEmpty(),
        check('tipo_cuenta').custom(tipoCuentaValido),
        check('capital', 'Capital es obligatorio').not().isEmpty(),
        validarCampos,
    ],
    postCuenta
);

router.post('/transferencia/', [
    validarJWT,
    esClienteRole,
    check('monto', 'El monto a transferir es requerido').not().isEmpty(),
    check('numCuenta', 'El numero de cuenta es requerido ').not().isEmpty(),
    check('numCuenta').custom(existeCuentaPorNumCuenta),
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
