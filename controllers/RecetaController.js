const models = require("../models");
const token = require("../services/token")

const handleErrors = (err) => {
    // console.log(err.message, err.code);
    let errors = {
      imagen: "",
      titulo_Ingredientes:"",
      ingredientes: "",
      titulo_ppal: "",
      pasos: "",
      modifiedBy: ""
    }
   // validación de errores
   if (err.message.includes('receta validation failed')) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }
  return errors;
}

module.exports = {

    add: async (req, res, next) => {
        //acceso y autorización (enviar el nombre del controller) 
        // const vToken = await token.decode(req,"receta")
        // //si el token no es valido
        // if (!vToken) return res.json({"msg":"error: La firma de la solicitud no es confiable. Salga del sistema y vuelva a ingresar."})
        //operativa del controller
        
        try {
          
          const reg = await models.Receta.create(req.body)
          res.json({"msg":"ok:","obj":reg})
          
        } catch (err) {
          
          const errores = handleErrors(err);
          res.json({"msg":"error: "+err });
          next();
        }
    
      },

    list: async (req, res, next) => {
      
      
      try {
        // si viene o no algun query param
        // ojo: no incluir campos númericos o hacerles un cast antes
          // const vToken = await token.decode(req, "noticia")
          // if (!vToken) return res.json({"msg":"error: La firma de la solicitud no es confiable. Salga del sistema y vuelva a ingresar."})

          const reg = await models.Receta.find();
          res.status(200).json(reg)
        
      } catch (err) {
        res.json({"msg":"error: "+err });
        next();
      }
      
      },

      list_one: async (req,res,next) => {
       
        try {
          const reg = await models.Receta.find({ estado: 1 });
          res.status(200).json(reg)
        }catch (err) {
          res.json({ "msg":"error: "+err });
          next();
        }
      },


    estado: async (req, res, next) => {
        // // acceso y autorización (enviar el nombre del controller) 
        // const vToken = await token.decode(req,"receta")
        // // si el token no es valido
        // if (!vToken) return res.json({"msg":"error: La firma de la solicitud no es confiable. Salga del sistema y vuelva a ingresar."})
        // // operativa del controller
        // //--------------------------------------------------------------
        try {
          const regAux1 = await models.Receta.findOne({ _id: req.body._id })
          let estadoAux = regAux1.estado === 1 ? 0 : 1;
          const regAux2 = await models.Receta.updateOne(
            { _id: req.body._id },
            { estado: estadoAux }
          );
          const reg = await models.Receta.findOne({ _id: req.body._id })
          res.status(200).json(reg)
        } catch (err) {
          res.json({ "msg":"error: "+err });
          next();
        }
        
      },

    update: async (req, res, next) => {
        // // acceso y autorización (enviar el nombre del controller) 
        // const vToken = await token.decode(req, "receta")
        // // si el token no es valido
        // if (!vToken) return res.json({"msg":"error: La firma de la solicitud no es confiable. Salga del sistema y vuelva a ingresar."})
        // // operativa del controller
        // //--------------------------------------------------------------
        try {
          const regBD = await models.Receta.findOne({ _id: req.body._id })
          
          if (!regBD){
            res.json({"msg":"error: La receta no existe"})
          }
          await models.Receta.updateOne({ _id: req.body._id },
            {
              imagen: req.body.imagen,
              titulo_Ingredientes: req.body.titulo_Ingredientes,
              ingredientes: req.body.ingredientes,
              titulo_ppal:req.body.titulo_ppal,
              pasos: req.body.pasos,
            }
          )
          const reg = await models.Receta.findOne({ _id: req.body._id })
          res.json({ "msg":"", "obj":reg})
        } catch (err) {
          res.json({ "msg":"error:"+err });
          next();
        }
      }  
    }