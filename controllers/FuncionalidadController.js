const models = require("../models");
const token = require("../services/token")

module.exports = {    
  list: async(req, res, next) => {
    // acceso y autorización (enviar el nombre del controller) 
    const vToken = await token.decode(req, "usuario")
    // si el token no es valido
    if (!vToken) return res.token({"msg":"error: La firma para el ingreso no es válida. vuelve a ingresar por favor."})
    // operativa del controller
    //--------------------------------------------------------------
    try {      
      const reg = await models.Funcionalidad.find().sort({modifiedAt:-1});      
      res.status(200).json(reg)  
    }catch (err) {
      res.json({"error":"error: "+err});
      next();
    }    
  }
}