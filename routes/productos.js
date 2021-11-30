const express = require("express");
const productosController = require('../controllers/productosController');
const router = express.Router();

// cada uno de los metodos del controller con su respectivo get, post, put, etc
// privado
router.post('/new-product', productosController.add);
router.get('/list-one/:id', productosController.listOne);
router.get('/list', productosController.listAll);
router.delete('/delete/:id', productosController.delete);
router.put('/update/:id', productosController.update);

// Exportamos la configuración de express app
module.exports = router;