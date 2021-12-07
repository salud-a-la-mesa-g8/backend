// requerimientos estandar
const express = require("express");
const router = express.Router();

// --> requerir los archivos de rutas
const usuarioRouter = require("./usuario")
const funcionalidadRouter = require("./funcionalidad")
const tuHuertaRouter = require("./tuHuerta")
const noticiaRouter = require("./noticia")
const recetaRouter = require("./receta")

// -> publicar las rutas
router.use('/usuario', usuarioRouter);
router.use('/funcionalidad', funcionalidadRouter);
router.use('/tuHuerta', tuHuertaRouter);
router.use('/noticia', noticiaRouter);
router.use('/receta', recetaRouter);

// export estandar
module.exports = router;