var jwt = require("jsonwebtoken");
var _ = require('underscore');
const config = require("../config");
const llave = config.cfg.llave;

module.exports = {
  encode: async (user) => {
    const token = jwt.sign({
      _id: user._id,
      nombre: user.nombre,
      correo: user.correo,
      celular:user.celular,
      auth: user.auth
    }, llave, {expiresIn: '12h'})
    return token;
  },
  decode: async (req, ctrl) => {
    const bearerHeader = req.headers["authorization"]
    if (typeof bearerHeader === 'undefined') {
      return false
    }
    const bearerToken = bearerHeader.split(' ')[1];
    var a = ["Admin", ctrl];
    var b = [];
    var res = [];
    try {
      const vToken = await jwt.verify(bearerToken, llave)
      // console.log("decode vToken :",vToken)
      bB = vToken.auth;
      b = bB.split(",").map(i => i.trim());      
      res = _.intersection(a, b);
      console.log("res: ",res)
      if (res.length > 0) {
        var a,b,res = [];        
        return true  
      } else {
        var a,b,res = [];        
        return false;  
      }
    } catch (error) {      
      return false;
    }

  }  
}