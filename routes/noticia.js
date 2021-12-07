// requerimientos estandar para todas las rutas
const express = require("express");
const router = express.Router();

// --> se trae el controller
const NoticiaController = require('../controllers/NoticiaController');

// --> cada uno de los metodos del controller con su respectivo get, post, put, etc
// privado
router.get('/list', NoticiaController.list);
router.get('/list_one', NoticiaController.list_one)
router.post('/add', NoticiaController.add);
router.put('/estado', NoticiaController.estado);
router.put('/update', NoticiaController.update);


// export estandar para todas las rutas
module.exports = router;