const models = require("../models");
const token = require("../services/token")
const Products = require('../models/productos');

module.exports = {    

    add: async(req, res) => {
        // // acceso y autorización (enviar el nombre del controller) 
        // const vToken = await token.decode(req, "usuario")
        // // si el token no es valido
        // if (!vToken) return res.sendStatus(403)
        // // operativa del controller
        // //--------------------------------------------------------------
        const body = req.body;
        try {
            const productDB = await Products.create(body);
            res.status(200).json(productDB);

        } catch (error) {

            return res.status(500).json({
                mensaje: "Ocurrio un error",
                error
            });

        }   
      },
    
    listOne: async (req, res) => {
        // // acceso y autorización (enviar el nombre del controller) 
        // const vToken = await token.decode(req, "usuario")
        // // si el token no es valido
        // if (!vToken) return res.sendStatus(403)
        // // operativa del controller
        // //--------------------------------------------------------------

        const _id = req.params.id;
        try {
    
            const productDB = await Products.findOne({ _id });
            res.json(productDB);
    
        } catch (error) {
            return res.status(400).json({
                mensaje: "Ocurrio un error",
                error
            });
        }
    },

    listAll: async (req, res) => {
        // // acceso y autorización (enviar el nombre del controller) 
        // const vToken = await token.decode(req, "usuario")
        // // si el token no es valido
        // if (!vToken) return res.sendStatus(403)
        // // operativa del controller
        // //--------------------------------------------------------------

        try {
            const productDB = await Products.find(); 
            res.json(productDB);
        } catch (error) {
            return res.status(400).json({
                mensaje: 'Ocurrio un error', 
                error
            })
        }
    },

    delete: async (req, res) => {
        // // acceso y autorización (enviar el nombre del controller) 
        // const vToken = await token.decode(req, "usuario")
        // // si el token no es valido
        // if (!vToken) return res.sendStatus(403)
        // // operativa del controller
        // //--------------------------------------------------------------

        const _id = req.params.id;
        try {
            const productDB = await Products.findByIdAndDelete({ _id });
             if (!productDB) {
                return res.status(400).json({
                    mensaje: 'No se encontró el id indicado', 
                    error
                })
            }
            res.json(productDB);
        } catch (error) {
            return res.status(400).json({
                mensaje: 'Ocurrio un error', 
                error
            })
        }
    },

    update: async(req, res) => { 
        // // acceso y autorización (enviar el nombre del controller) 
        // const vToken = await token.decode(req, "usuario")
        // // si el token no es valido
        // if (!vToken) return res.sendStatus(403)
        // // operativa del controller
        // //--------------------------------------------------------------

        const _id = req.params.id;
        const body = req.body; 
        try {
            const productDB = await Products.findByIdAndUpdate(_id,body,{new: true}); 
            res.json(productDB);
        }catch (error) {
            return res.status(400).json({ 
                mensaje: 'Ocurrio un error', 
                error
            })
        } 
    },

}

