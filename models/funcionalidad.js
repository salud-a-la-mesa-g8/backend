// constantes para todos los modelos
const mongoose = require('mongoose');
const { Schema } = mongoose;
// FIN constantes para todos los modelos

const funcionalidadSchema = new Schema({  
  controller:{
    type: String,
    required :[true, "Por favor ingresa un nombre de controller"],
    maxlength: [150, "controller-nombre: máximo 150 caracteres"],
    minlength: [3, "controller-nombre: mínimo 3 caracteres"],
  },
  nombreMostrar:{
    type: String,
    required :[true, "Por favor ingresa un nombre de funcionalidad"],
    maxlength: [150, "funcionalidad-nombre: máximo 150 caracteres"],
    minlength: [3, "funcionalidad-nombre: mínimo 3 caracteres"]    
  },
  estado:{
    type: Number,
    enum: [1, 0],
    default:1
  },  
  modifiedAt: {
    type: Date,
    default: Date.now
  },
  modifiedBy: {
    type: String, // email del usuario que modifica / crea el dato
    maxlength: 100,
    required :[true, "Por favor ingresa el usuario que realiza la modificación / creación"]
  }  
})

const Funcionalidad = mongoose.model('funcionalidad', funcionalidadSchema);

module.exports = Funcionalidad;
