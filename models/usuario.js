// ------ constantes para todos los modelos
const mongoose = require('mongoose');
const { Schema } = mongoose;
// ------ FIN constantes para todos los modelos

const { isEmail } = require("validator");
const usuarioSchema = new Schema({
  nombre : {
    type: String,
    required :[true, "Nombre de usuario es obligatorio"],
    minlength: [3, "Nombre de usuario con mínimo 3 caracteres"],
    maxlength: [150, "Nombre de usuario con máximo 150 caracteres"]
  },
  pwd : {
    type: String,
    required :[true, "Password de usuario es obligatorio"],
    minlength: [6, "El password de usuario requiere mínimo 6 caracteres"],
    maxlength: [100, "El password de usuario requiere máximo 100 caracteres"]
  },
  correo : {
    type: String,
    trim: true,
    required :[true, "Correo de usuario es obligatorio"],
    validate: [ isEmail, "Por favor ingresa un correo de usuario valido"],
    minlength: [6, "Usuario correo con mínimo 6 caracteres"],
    maxlength: [150, "Usuario correo con máximo 150 caracteres"],
    unique: [true, "Ya existe este correo de usuario en la base de datos"],
    lowercase: true    
  },  
  celular : {
    type: String,
    required :[true, "Número de celular es obligatorio"],
    unique: [true, "Ya existe este celular de usuario en la base de datos"],
    minlength: [10, "Usuario celular mínimo 10 caracteres"],
    maxlength: [10, "Usuario celular máximo 10 caracteres"],
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
  auth: {
    type: String,
  },
  codigo: {
    type: String,
    minlength: [6, "Código mínimo 6 caracteres"],
    maxlength: [6, "Código máximo 6 caracteres"],
    default: "000000"
  },
  try: {
    type: Number,
    enum: [0, 1, 2, 3],
    default:0
  },
  exp: {
    type: Number,
    default:0
  }
  
})

const Usuario = mongoose.model('usuario', usuarioSchema);
module.exports = Usuario;