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
    // acceso y autorización (enviar el nombre del controller) 
    const vToken = await token.decode(req, "usuario")
    // si el token no es valido
    if (!vToken) return res.json({"msg":"error: La firma de la solicitud no es confiable. Salga del sistema y vuelva a ingresar."})
    // operativa del controller
    //--------------------------------------------------------------
    try {
      // 1- revisar si el email o el celular existen
      checkEmail = await models.Usuario.findOne({$or:{
        correo: req.body.correo,
        celular: req.body.celular}
      })
      if (!checkEmail) {
        // 2- guardamos la info en la bd (pwd: 123456)
        req.body.pwd = await bcrypt.hash(req.body.pwd, 10)
        const reg = await models.Usuario.create(req.body)
        res.json({"msg":"ok:","obj":reg})
      } else {
        res.json({"msg":"error: El correo o el celular ya existen en la base de datos"})
      }
    } catch (err) {
      const errores = handleErrors(err);
      res.json({"msg":"error: "+errores });
      next();
    }

  },
  login: async (req, res, next) => {
    try {
      checkUser = await models.Usuario.findOne({ celular: req.body.usuario, estado :1 }).exec();            
      if (!checkUser) {
        checkUser = await models.Usuario.findOne({ correo: req.body.usuario, estado :1 }).exec();
        if (!checkUser) {
          return res.json({ "msg":"error: Usuario no existe o está inactivo" })
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
        res.json({ "msg":"error: Usuario no autorizado" })
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
    if (!vToken) return res.json({"msg":"error: La firma de la solicitud no es confiable. Salga del sistema y vuelva a ingresar."})
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

      res.status(200).json(reg)
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
      res.status(200).json(reg)
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
      const regBD = await models.Usuario.findOne({ correo: req.body.correo })
      // si hay cambio contraseña
      if (req.body.pwd !== regBD.pwd) {
        req.body.pwd = await bcrypt.hash(req.body.pwd, 10)
      }
      await models.Usuario.updateOne({ correo: req.body.correo, celular: req.body.celular },
        {
          nombre: req.body.nombre,
          pwd: req.body.pwd,
          auth: req.body.auth,
          estado: req.body.estado,
          modifiedBy: req.body.modifiedBy
        }
      )
      const reg = await models.Usuario.findOne({ correo: req.body.correo })
      res.json({ "msg":"", "obj":reg})
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
          return res.json({ "msg":"error: En la plataforma no se encuentra el correo o el celular que ingresaste" })
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
      const regAux2 = await models.Usuario.updateOne(
        { _id: checkUser._id },
        { codigo: codigo, 
          try: 0, 
          exp: exp
        }
      );            

      if(!msg.emailRecuperar(correo, nombre, codigo)){
        respueta = respuesta + "error: No te pudimos enviar mensaje de correo electrónico con el código. Intenta en unos segundos. ";
        next();
      }
      
      if(!msg.sms(celular, codigo)){
        respuesta = respuesta + "error: No te pudimos enviar mensaje SMS a tu celular con el código. Intenta en unos segundos. ";
        next();
      }
      
      respuesta += " Por favor verifica tu celular y/o tu email en unos minutos porque recibirás el código solicitado";

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
          return res.json({"msg":"error: En la plataforma no se encuentra el correo o el celular que ingresaste"})
        }
      }
      // 1- verificamos intentos, igualdad y expiración
      let intentos = 0      
      if (checkUser.try < 3) {
        if (req.body.codigo === checkUser.codigo) {
          const exp = new Date().getTime()
          if (exp > checkUser.exp) {
            return res.json({"msg":"error: Tu código ya expiro (20 min). Solicita un nuevo código."})
          }
        }else{
          intentos = checkUser.try + 1
          const regAux2 = await models.Usuario.updateOne(
            { _id: checkUser._id },
            { try: intentos }
          );        
          return res.json({"msg":"error: El código no corresponde al generado por la plataforma. llevas "+intentos+" intento(s) de 3. Vuelve a intentarlo."})
        }
      }else{        
        return res.json({"msg":"error: Código expiró. Ya hiciste 3 intentos con este código. Solicita un nuevo código."})
      }

      // recuperamos id
      var id = checkUser._id
      // 2- encryptado del pwd
      req.body.pwd = await bcrypt.hash(req.body.pwd, 10)      
      // 3- actualizamos en la tabla de usuarios el nuevo pwd
      const regAux2 = await models.Usuario.updateOne(
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