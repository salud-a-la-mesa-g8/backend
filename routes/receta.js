const express = require("express");
const router = express.Router();

// --> se trae el controller
const RecetaController = require('../controllers/RecetaController');

// --> cada uno de los metodos del controller con su respectivo get, post, put, etc
// privado
router.get('/list', RecetaController.list);
router.get('/list_one',RecetaController.list_one )
router.post('/add', RecetaController.add);
router.put('/estado', RecetaController.estado);
router.put('/update', RecetaController.update);


// export estandar para todas las rutas
module.exports = router;