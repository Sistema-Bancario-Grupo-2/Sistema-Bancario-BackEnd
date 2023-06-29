const { Router } = require('express');
const router = Router()
const {getUsuarios, postUsuarioCliente, putUsuarioCliente, deleteUsuarioCliente} = require('../controllers/usuario')

router.get('/', getUsuarios);
router.post('/crear', postUsuarioCliente);
router.put('/editar/:id', putUsuarioCliente);
router.delete('/eliminar/:id', deleteUsuarioCliente);

module.exports = router
