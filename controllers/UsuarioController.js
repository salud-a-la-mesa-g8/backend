const models = require("../models");
const bcrypt = require("bcryptjs");
const token = require("../services/token")
const msg = require("../services/msg");
// privado


// publico
const handleErrors = (err) => {
  // console.log(err.message, err.code);
  let errors = {
    nombre: "",
    pwd: "",
    correo: "",
    celular: "",
    estado: "",
    auth: "",
    codigo: "",
    modifiedBy: ""
  }

  // validación de errores
  if (err.message.includes('usuario validation failed')) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }
  return errors;
}

module.exports = {
  add: async (req, res, next) => {
    // console.log("req.body: ",req.body)
    // console.log("req.headers: ",req.headers["authorization"])
    // acceso y autorización (enviar el nombre del controller) 
    const vToken = await token.decode(req, "usuario")
    // si el token no es valido
    if (!vToken) return res.json({"msg":"error: La firma de la solicitud no es confiable. Salga del sistema y vuelva a ingresar."})
    // console.log("vtoken: ",vToken)
    // operativa del controller
    //--------------------------------------------------------------
    try {
      // 1- revisar si el email o el celular existen      
      checkUser = await models.Usuario.findOne({ celular: req.body.celular }).exec();      
      if (!checkUser) {
        checkUser = await models.Usuario.findOne({ correo: req.body.correo }).exec();        
        if (checkUser) {
          return res.json({ "msg":"error: Este correo ya existe en la plataforma." })
        }
      }else{
        return res.json({ "msg":"error: Este celular ya existe en la plataforma." })
      }
      // se cre el usr nuevo
      await models.Usuario.create(req.body)
      const reg = await models.Usuario.findOne({ celular: req.body.celular })
      res.json({"msg":"ok:", "obj":reg})      
    } catch (err) {
      // console.log("err: ",err)
      res.json({"msg":"error: "+err});
      next();
    }

  },
  login: async (req, res, next) => {
    console.log("req.body: ",req.body)
    try {
      checkUser = await models.Usuario.findOne({ celular: req.body.usuario, estado :1 }).exec();
      // console.log("checkUser: ", checkUser)
      if (!checkUser) {
        checkUser = await models.Usuario.findOne({ correo: req.body.usuario, estado :1 }).exec();
        if (!checkUser) {
          return res.json({ "msg":"error: Usuario no existe o está inactivo. Intenta de nuevo" })
        }        
      }      
      // 1- revisamos pwd
      let match = await bcrypt.compare(req.body.pwd, checkUser.pwd)
      if (match) {
        // 2 - generamos token        
        let tokenReturn = await token.encode(checkUser);
        // 3 - respondemos
        res.json({ "msg":"ok", "obj":tokenReturn })
      } else {
        res.json({ "msg":"error: Password incorrecto. Intenta de nuevo." })
      }
      
    } catch (err) {
      res.json({"msg":"error: "+err });
      next()
    }
  },
  list: async (req, res, next) => {
    // acceso y autorización (enviar el nombre del controller) 
    const vToken = await token.decode(req, "usuario")
    // si el token no es valido
    if (!vToken) return res.json({"msg":"error: La firma de la solicitud no es confiable. Vuelve a ingresar."})
    // operativa del controller
    //--------------------------------------------------------------
    try {
      // si viene o no algun query param
      // ojo: no incluir campos númericos o hacerles un cast antes
      let valorBusqueda = req.query.valor;
      const reg = await models.Usuario.find({
        $or:
          [
            { nombre: new RegExp(valorBusqueda, 'i') },
            { correo: new RegExp(valorBusqueda, 'i') },
            { auth: new RegExp(valorBusqueda, 'i') }
          ]
      }, '_id nombre correo celular estado modifiedBy modifiedAt auth').sort({ modifiedAt: -1 });

      res.status(200).json({"msg":"ok", "obj":reg})
    } catch (err) {
      res.json({"msg":"error: "+err });
      next();
    }
    
  },
  estado: async (req, res, next) => {
    // acceso y autorización (enviar el nombre del controller) 
    const vToken = await token.decode(req, "usuario")
    // si el token no es valido
    if (!vToken) return res.json({"msg":"error: La firma de la solicitud no es confiable. Salga del sistema y vuelva a ingresar."})
    // operativa del controller
    //--------------------------------------------------------------
    try {
      const regAux1 = await models.Usuario.findOne({ _id: req.body._id })
      let estadoAux = regAux1.estado === 1 ? 0 : 1;
      const regAux2 = await models.Usuario.updateOne(
        { _id: req.body._id },
        { estado: estadoAux }
      );
      const reg = await models.Usuario.findOne({ _id: req.body._id })
      res.status(200).json({"msg":"ok","obj":reg})
    } catch (err) {
      res.json({ "msg":"error: "+err });
      next();
    }
    
  },
  update: async (req, res, next) => {
    // acceso y autorización (enviar el nombre del controller) 
    const vToken = await token.decode(req, "usuario")
    // si el token no es valido
    if (!vToken) return res.json({"msg":"error: La firma de la solicitud no es confiable. Salga del sistema y vuelva a ingresar."})
    // operativa del controller
    //--------------------------------------------------------------
    try {
      console.log("req.body._id: ",req.body._id)
      const regBD = await models.Usuario.findOne({ _id: req.body._id })
      // revisar si hay cambio de email o de celular y si existen
      if (regBD.correo !== req.body.correo) {
        checkUser = await models.Usuario.findOne({ correo: req.body.correo }).exec();        
        if (checkUser) {
          return res.json({ "msg":"error: Este correo ya existe en la plataforma." })
        }
      }
      if (regBD.celular !== req.body.celular) {
        checkUser = await models.Usuario.findOne({ celular: req.body.celular }).exec();  
        if (checkUser) {
          return res.json({ "msg":"error: Este celular ya existe en la plataforma." })
        }
      }
      // si hay cambio contraseña
      // if (req.body.pwd !== regBD.pwd) {
      //   req.body.pwd = await bcrypt.hash(req.body.pwd, 10)
      // }
      await models.Usuario.updateOne({ _id: req.body._id },
        {
          nombre: req.body.nombre,
          correo: req.body.correo,
          celular: req.body.celular,          
          auth: req.body.auth,
          estado: req.body.estado,
          modifiedBy: req.body.modifiedBy
        }
      )
      const reg = await models.Usuario.findOne({ _id: req.body._id })
      res.json({ "msg":"ok", "obj":reg})
    } catch (err) {
      res.json({ "msg":"error:"+err });
      next();
    }
  },
  recuperaP1: async (req, res, next) => {
    try {      
      checkUser = await models.Usuario.findOne({ celular: req.body.usuario, estado :1 }).exec();            
      if (!checkUser) {
        checkUser = await models.Usuario.findOne({ correo: req.body.usuario, estado :1 }).exec();
        if (!checkUser) {
          return res.json({ "msg":"error: Este correo o celular no existen. Intenta de nuevo." })
        }
      }      
      const celular = checkUser.celular;
      const correo = checkUser.correo;
      const nombre = checkUser.nombre;
      const cod = new Date().getTime() // hora actual en milisegundos
      const exp =  cod + 1200000 // + 20 minutos
      const codigo = String(cod).slice(-6); // los 6 útimos caracteres de la hora actual 
      var respuesta = '';
      
      // actualizamos la tabla con los datos de recuperación del usuario
      await models.Usuario.updateOne(
        { _id: checkUser._id },
        { codigo: codigo, 
          try: 0, 
          exp: exp
        }
      );            

      if(!msg.emailRecuperar(correo, nombre, codigo)){
        respueta = respuesta + "error: No pudimos enviarte un email. Intenta de nuevo en unos segundos. ";
        next();
      }
      
      if(!msg.sms(celular, codigo)){
        respuesta = respuesta + "error: No pudimos enviarte un SMS. Intenta de nuevo en unos segundos. ";
        next();
      }
      
      respuesta += "-Verifica tu celular/email en unos segundos";

      res.json({"msg":respuesta})
    } catch (err) {
      res.json({"msg":"error: "+err});
      next();
    }
  },
  recuperaP2: async (req, res, next) => {    
    try {
      checkUser = await models.Usuario.findOne({ celular: req.body.usuario, estado :1 }).exec();            
      if (!checkUser) {
        checkUser = await models.Usuario.findOne({ correo: req.body.usuario, estado :1 }).exec();
        if (!checkUser) {
          return res.json({"msg":"error: No existe este correo/celular. Intenta de nuevo"})
        }
      }
      // 1- verificamos intentos, igualdad y expiración
      let intentos = 0      
      if (checkUser.try < 3) { // intentos
        if (req.body.codigo === checkUser.codigo) { // código
          const exp = new Date().getTime()
          if (exp > checkUser.exp) { // expiración
            return res.json({"msg":"error: Código ya expiró (20 min). Por favor solicita uno nuevo."})
          }
        }else{
          intentos = checkUser.try + 1
          const regAux2 = await models.Usuario.updateOne(
            { _id: checkUser._id },
            { try: intentos }
          );        
          return res.json({"msg":"error: Código invalido. Llevas "+intentos+" intento(s) de 3. Intenta de nuevo."})
        }
      }else{        
        return res.json({"msg":"error: Código expiró (3 intentos). Solicita uno nuevo."})
      }

      // recuperamos id
      var id = checkUser._id
      // 2- encryptado del pwd
      req.body.pwd = await bcrypt.hash(req.body.pwd, 10)      
      // 3- actualizamos en la tabla de usuarios el nuevo pwd
      await models.Usuario.updateOne(
        { _id: checkUser._id },
        {          
          pwd: req.body.pwd, 
          codigo: '000000',
          try: 0,
          exp: 0          
        },        
      );
      // 4 - consultamos los nuevos datos del usuario
      checkUser = await models.Usuario.findOne({
        _id: id
      })
      // 5 - generamos el token
      let tokenReturn = await token.encode(checkUser);
      // 6 - contestamos
      res.json({ "msg":"ok", "obj":tokenReturn });
    } catch (err) {
      res.json({"msg":"error: "+err});
      next();
    }
  },
}