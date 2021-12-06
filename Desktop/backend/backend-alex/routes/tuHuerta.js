const express = require("express");
const router = express.Router();
const ItemCtr = require('../controllers/TuHuertaController')


router.post('/crear', ItemCtr.crear)

router.get('/listar', ItemCtr.listar)

router.get('/listarPasos', ItemCtr.listarPasos)

router.get('/listarMantenimiento', ItemCtr.listarMantenimiento)

router.put('/actualizar/:id', ItemCtr.actualizar)

router.put('/estado', ItemCtr.estado)

router.delete('/eliminar/:id', ItemCtr.eliminar)

router.get('/listarEstado', ItemCtr.listarEstado)
module.exports = router;
