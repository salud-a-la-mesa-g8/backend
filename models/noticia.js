const mongoose = require('mongoose');
const { Schema } = mongoose;
// ------ FIN constantes para todos los modelos

const noticiaSchema = new Schema({
    titulo: {
        type: String,
        required :[true, "Titulo es obligatorio"],
        minlength: [1, "Titulo con mínimo 1 caracter"],
        maxlength: [100, "Titulo con máximo 50 caracteres"]
      },
    autor: {
        type: String,
        required : [true, "Autor es obligatorio"],
        minlength: [1, "Autor con mínimo 1 caracter"],
        maxlength: [100, "Autor con máximo 50 caracteres"]
    },  
    texto_corto: {
        type: String,
        required :[true, "Texto corto es obligatorio"],
        minlength: [1, "Texto corto con mínimo 1 caracter"],
        maxlength: [250, "Texto corto con máximo 250 caracteres"]
    },
    texto_largo: {
        type: String,
        required :[true, "Texto largo es obligatorio"],
        minlength: [1, "Texto largo con mínimo 1 caracter"],
        maxlength: [2000, "Texto largo con máximo 2000 caracteres"]
    },
    imagen: {
        type: String ,
        required : [true, "Imagen es obligatoria"]
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

const Noticia = mongoose.model('noticia', noticiaSchema);

module.exports = Noticia;