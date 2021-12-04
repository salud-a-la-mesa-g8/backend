const models = require("../models");
const token = require("../services/token")

// privado

// publico
const handleErrors = (err) => {
    // console.log(err.message, err.code);
    let errors = {
      titulo: "",
      autor:"",
      texto_corto: "",
      texto_largo: "",
      imagen: "",
      modifiedBy: ""
    }
   // validación de errores
   if (err.message.includes('notice validation failed')) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }
  return errors;
}

module.exports = {
    add: async (req, res, next) => {
      //acceso y autorización (enviar el nombre del controller) 
      const vToken = await token.decode(req,"noticia")
      //si el token no es valido
      if (!vToken) return res.json({"msg":"error: La firma de la solicitud no es confiable. Salga del sistema y vuelva a ingresar."})
      //operativa del controller
      
      try {
        
        const reg = await models.Noticia.create(req.body)
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

          const reg = await models.Noticia.find();
          res.status(200).json(reg)
        
      } catch (err) {
        res.json({"msg":"error: "+err });
        next();
      }
      
    },

    list_one: async (req,res,next) => {
      
      try {
        const reg = await models.Noticia.find({ estado: 1 });
        res.status(200).json(reg)
      }catch (err) {
        res.json({ "msg":"error: "+err });
        next();
      }
    },

    estado: async (req, res, next) => {
      // // acceso y autorización (enviar el nombre del controller) 
      // const vToken = await token.decode(req,"noticia")
      // // si el token no es valido
      // if (!vToken) return res.json({"msg":"error: La firma de la solicitud no es confiable. Salga del sistema y vuelva a ingresar."})
      // // operativa del controller
      // //--------------------------------------------------------------
      try {
        const regAux1 = await models.Noticia.findOne({ _id: req.body._id })
        let estadoAux = regAux1.estado === 1 ? 0 : 1;
        const regAux2 = await models.Noticia.updateOne(
          { _id: req.body._id },
          { estado: estadoAux }
        );
        const reg = await models.Noticia.findOne({ _id: req.body._id })
        res.status(200).json(reg)
      } catch (err) {
        res.json({ "msg":"error: "+err });
        next();
      }
      
    },

    update: async (req, res, next) => {
      // // acceso y autorización (enviar el nombre del controller) 
      // const vToken = await token.decode(req, "noticia")
      // // si el token no es valido
      // if (!vToken) return res.json({"msg":"error: La firma de la solicitud no es confiable. Salga del sistema y vuelva a ingresar."})
      // // operativa del controller
      // //--------------------------------------------------------------
      try {
        const regBD = await models.Noticia.findOne({ _id: req.body._id })
        
        if (!regBD){
          res.json({"msg":"error: La noticia no existe"})
        }
        await models.Noticia.updateOne({ _id: req.body._id },
          {
            titulo: req.body.titulo,
            autor: req.body.autor,
            texto_corto: req.body.texto_corto,
            texto_largo:req.body.texto_largo,
          }
        )
        const reg = await models.Noticia.findOne({ _id: req.body._id })
        res.json({ "msg":"", "obj":reg})
      } catch (err) {
        res.json({ "msg":"error:"+err });
        next();
      }
    }  
}