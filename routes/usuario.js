const { Router } = require('express');
const router = Router()
const {getUsuarios, postUsuarioCliente, putUsuarioCliente} = require('../controllers/usuario')

router.get('/', getUsuarios);
router.post('/crear', postUsuarioCliente);
router.put('/editar/:id', putUsuarioCliente);

module.exports = router
