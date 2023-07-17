const { Router } = require('express');
const router = Router()
const { getUsuarios, postUsuario, putUsuario, deleteUsuario, addFavoritos, eliminarFavorito, getUsuarioById } = require('../controllers/usuario');
const { check } = require('express-validator');
const { dpiValido, ifExistCorreo, ingresoValido, existeUser, buscarCuentaFavoritos, existeUsuarioPorId, existDPI, ascenDescenNumber } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { esAdminRole, esClienteRole } = require('../middlewares/validar-roles');

router.get('/', getUsuarios);

router.get('/:id', [

    check('id', 'El id ingresado no es un id').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos
], getUsuarioById);

router.post('/crear',
    [
        validarJWT,
        esAdminRole,
        check('dpi', 'El dpi es obligatorio').not().isEmpty(),
        check('dpi', 'El dpi no es valido').custom(dpiValido),
        check('dpi', 'El dpi ya existe en la db').custom(existDPI),
        check('user', 'User es obligatorio').not().isEmpty(),
        check('user', 'Este user ya existe').custom(existeUser),
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('correo', 'El correo es obligatorio').not().isEmpty(),
        check('correo', 'El correo ya existe').custom(ifExistCorreo),
        check('password', 'Password obligatorio').not().isEmpty(),
        check('direccion', 'La direccion es obligatoria').not().isEmpty(),
        check('celular', 'El numero telefonico es obligatorio').not().isEmpty(),
        check('ingresos_mensuales', 'Los ingresos son obligatorios').not().isEmpty(),
        check('ingresos_mensuales', 'Ingresos mensuales mayores a 100').custom(ingresoValido),
        validarCampos,
    ],
    postUsuario
);

router.put('/add/favoritos/:id',
    [
        validarJWT,
        check('id', 'Se requiere un id valido').not().isEmpty(),
        check('id', 'El id ingresado no es un id').isMongoId(),
        check('id').custom(existeUsuarioPorId),
        esClienteRole,
        validarCampos
    ],
    addFavoritos
);

router.put('/delete/favoritos/:id',
    [
        validarJWT,
        check('id', 'Se requiere un id valido').not().isEmpty(),
        check('id', 'El id ingresado no es un id').isMongoId(),
        check('id').custom(existeUsuarioPorId),
        esClienteRole,
        validarCampos
    ],
    eliminarFavorito
),

    router.put('/editar/:id', [
        validarJWT,
        check('id', 'No es un id valido').isMongoId(),
        check('id', 'No existe este usuario').custom(existeUsuarioPorId),
        check('dpi', 'El dpi ya existe en la db').custom(existDPI),
        check('favoritos', 'La cuenta no existe').custom(buscarCuentaFavoritos).not().isMongoId(),
        check('ingresos_mensuales', 'Ingresos mensuales mayores a 100').custom(ingresoValido),
        validarCampos
    ], putUsuario);

router.delete('/eliminar/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id valido').isMongoId(),
    check('id', 'No existe en la base de datos').custom(existeUsuarioPorId),
    validarCampos
], deleteUsuario);


module.exports = router
