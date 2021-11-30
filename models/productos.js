const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productoSchema = new Schema({

    nombre:{type:String, required:[true, 'Nombre obligatorio'],},
    descripcion:String,
    precio:Number,
    imagen:String,
    estado:{type:Boolean, default:true}

    },
    { collection : 'productos' }

);

//convertir el Schema a modelo
const Productos = mongoose.model('Products',productoSchema);
module.exports = Productos;