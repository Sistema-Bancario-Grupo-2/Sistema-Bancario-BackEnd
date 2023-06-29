const { Router } = require('express');
const router = Router();
const { crearCuentaBancaria, mostrarCuentasActivas, eliminarCuenta } = require('../controllers/cuenta')

router.get('/', mostrarCuentasActivas);

router.post('/crear',
    [],
    crearCuentaBancaria
);

router.put('/editar:id');

router.delete('/eliminar:id', [], eliminarCuenta);

module.exports = router;
