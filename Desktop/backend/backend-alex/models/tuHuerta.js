const mongoose = require('mongoose');
const { Schema } = mongoose;

const tuHuertaSchema = new Schema({
    
    imagen:{
      type: String,
      required :[true, "Por favor ingresa la ruta de la imagen"],
      maxlength: [150, "imagen: máximo 150 caracteres"],
      minlength: [3, "imagen: mínimo 3 caracteres"]
      },
    titulo:{
        type: String,
        required :[true, "Por favor ingresa un nombre un titulo"],
        maxlength: [150, "titulo: máximo 150 caracteres"],
        minlength: [3, "titulo: mínimo 3 caracteres"]
      },
      subtitulo:{
        type: String,
        required :[true, "Por favor ingresa un subtitulo"],
        maxlength: [150, "subtitulo-nombre: máximo 150 caracteres"],
        minlength: [3, "subtitulo: mínimo 3 caracteres"]
      },
      descripcion:{
        type: String,
        required :[true, "Por favor ingresa un nombre una descripción principal"],
        maxlength: [1000, "descripción principal: máximo 150 caracteres"],
        minlength: [3, "descipcion principal: mínimo 3 caracteres"]
      },
      descripcion2:{
        type: String,
        required :[false, "Por favor ingresa una segunda descripción si es necesario"],
        maxlength: [1000, "descripción secundaria: máximo 150 caracteres"],
        minlength: [0, "descripción secundaria: mínimo 3 caracteres"]  
      },

      tipo:{
        type: Number,
        enum: [1, 2],
        default:1
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
      },
 
})

const TuHuerta = mongoose.model('tuHuerta', tuHuertaSchema);

module.exports = TuHuerta;