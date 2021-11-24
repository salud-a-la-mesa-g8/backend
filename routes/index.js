// requerimientos estandar
const express = require("express");
const router = express.Router();

// --> requerir los archivos de rutas
const usuarioRouter = require("./usuario")
const funcionalidadRouter = require("./funcionalidad")

// -> publicar las rutas
router.use('/usuario', usuarioRouter);
router.use('/funcionalidad', funcionalidadRouter);

// export estandar
module.exports = router;