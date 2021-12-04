const models = require("../models");
const token = require("../services/token")

module.exports = {    
  list: async(req, res, next) => {
    // acceso y autorización (enviar el nombre del controller) 
    const vToken = await token.decode(req, "usuario")
    // si el token no es valido
    if (!vToken) return res.sendStatus(403)
    // operativa del controller
    //--------------------------------------------------------------
    try {      
      const reg = await models.Funcionalidad.find().sort({modifiedAt:-1});      
      res.status(200).json(reg)  
    }catch (err) {
      res.status(500).json({errores: err});
      next();
    }    
  }
}