const mongoose = require('mongoose');
const { Schema } = mongoose;
// ------ FIN constantes para todos los modelos
const recetaSchema = new Schema({
    imagen: {
        type: String,
        required :[true, "Imagen es obligatorio"],
      },
    titulo_Ingredientes: {
        type: String,
        required : [true, "Titulo Ingredientes es obligatorio"],
        minlength: [1, "Titulo Ingredientes con mínimo 1 caracter"],
        maxlength: [30, "Titulo Ingredientes con máximo 30 caracteres"]
    },  
    ingredientes: {
        type: String,
        required :[true, "Ingredientes es obligatorio"],
        minlength: [1, "Ingredientes con mínimo 1 caracter"],
        maxlength: [500, "Ingredientes con máximo 500 caracteres"]
    },
    titulo_ppal: {
        type: String,
        required :[true, "Titulo principal es obligatorio"],
        minlength: [1, "Titulo principal con mínimo 1 caracter"],
        maxlength: [50, "Titulo principal con máximo 50 caracteres"]
    },
    pasos: {
        type: String,
        required : [true, "Pasos son obligatorios"],
        minlength: [1, "Pasos con mínimo 1 caracter" ]
    },
    estado:{
        type: Number,
        enum: [1, 0],
        default:1
      },
    modifiedBy: {
        type: String, // email del usuario que modifica / crea el dato
        required :[true, "Email de quien modifica o crea este registro es obligatorio"],
      },
    modifiedAt: {
        type: Date,
        default: Date.now
      }
    })

const Receta = mongoose.model('receta', recetaSchema);

module.exports = Receta;