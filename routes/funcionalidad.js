// requerimientos estandar para todas las rutas
const express = require("express");
const router = express.Router();

// --> se trae el controller
const FuncionalidadController = require('../controllers/FuncionalidadController');

// --> cada uno de los metodos del controller con su respectivo get, post, put, etc
// privado
router.get('/list', FuncionalidadController.list);

// export estandar para todas las rutas
module.exports = router;
