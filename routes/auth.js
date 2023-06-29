const { Router, response } = require('express');
const router = Router();
const { login } = require('../controllers/auth');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { correoExiste } = require('../helpers/db-validators');

router.post('/login',
    [
        check('correo', 'El correo que ingreso no es valido').isEmail(),
        check('correo', 'El correo no existe en la db').custom(correoExiste),
        check('password', 'La password es obligatoria').not().isEmpty(),
        validarCampos
    ],
    login
);

module.exports = router;
