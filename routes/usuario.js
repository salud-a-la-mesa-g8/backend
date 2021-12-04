// requerimientos estandar para todas las rutas
const express = require("express");
const router = express.Router();

// se trae el controller
const UsuarioController = require('../controllers/UsuarioController');

// cada uno de los metodos del controller con su respectivo get, post, put, etc
// privado
router.post('/add', UsuarioController.add);
router.get('/list', UsuarioController.list);
router.put('/estado', UsuarioController.estado);
router.put('/update', UsuarioController.update);
// publico
router.post('/login', UsuarioController.login);
router.post('/recuperap1', UsuarioController.recuperaP1);
router.post('/recuperap2', UsuarioController.recuperaP2);

// export estandar para todas las rutas
module.exports = router;