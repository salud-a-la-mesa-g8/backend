const itemCtr = {}
const Item = require("../models/tuHuerta");
const models = require("../models");
const token = require("../services/token")
const msg = require("../services/msg");

itemCtr.crear = async (req, res) =>{
    // acceso y autorización (enviar el nombre del controller) 
    const vToken = await token.decode(req, "tuhuerta")
    // si el token no es valido
    if (!vToken) return res.json({"msg":"error: La firma de la solicitud no es confiable. Salga del sistema y vuelva a ingresar."})
    
    try {
        const{imagen, titulo, subtitulo , descripcion, descripcion2, modifiedBy} = req.body
        const NuevoItem = new Item({
            imagen, titulo, subtitulo , descripcion, descripcion2, modifiedBy
        })
        const tituloItem = await Item.findOne({titulo: req.body.titulo})
        if(!tituloItem){
            
            await NuevoItem.save()
            res.json({
                mensaje: `Nuevo item Creado`,
                imagen: NuevoItem.imagen,
                titulo: NuevoItem.titulo,
                subtitulo: NuevoItem.subtitulo,
                descripcion: NuevoItem.descripcion,
                descripcion2 : NuevoItem.descripcion2,
                modifiedBy : NuevoItem.modifiedBy
            })
            
        }else{

            res.json({
                mensaje: `El item   ya existe`
            })
        }
        
    } catch (error) {
        res.json({
            mensage:error
        })  
    }
    
}

itemCtr.listar = async (req, res) =>{
    const vToken = await token.decode(req, "tuhuerta")
    //si el token no es valido
    if (!vToken) return res.json({"msg":"error: La firma de la solicitud no es confiable. Salga del sistema y vuelva a ingresar."})
    
    try {
        const respuesta = await Item.find()
        res.json(respuesta)
        
    } catch (error) {
        res.json({
            mensage:error
        })
    }
    
}

itemCtr.eliminar = async (req,res) =>{

    // acceso y autorización (enviar el nombre del controller) 
    const vToken = await token.decode(req, "tuhuerta")
    // si el token no es valido
    if (!vToken) return res.json({"msg":"error: La firma de la solicitud no es confiable. Salga del sistema y vuelva a ingresar."})

    try {
        const id = req.params.id
        if(!id){
            res.json({
                mensaje: "El item no existe"
            })
        }
        await Item.findByIdAndRemove({_id:id})
        res.json({
            mensaje: "Item eliminado"
        })
        
    } catch (error) {
        res.json({
            mensage: "El item no existe."
        })
    }   
}

itemCtr.actualizar = async (req,res) =>{

    // acceso y autorización (enviar el nombre del controller) 
    const vToken = await token.decode(req, "tuhuerta")
    // si el token no es valido
    if (!vToken) return res.json({"msg":"error: La firma de la solicitud no es confiable. Salga del sistema y vuelva a ingresar."})
 
    try {  
      const id = req.params.id
      if(id){

        await Item.findByIdAndUpdate({_id:id},req.body)
        res.json({
            mensaje: "Item actualizado"
        })
        
      }
      
        res.json({
            mensaje: "Item no existe"
        })
      
     
    } catch (error) {
        res.json({
            mensaje: "Item no existe."
        })
    }
}

itemCtr.estado =  async (req, res) => {
    // acceso y autorización (enviar el nombre del controller) 
    const vToken = await token.decode(req, "tuhuerta")
    // si el token no es valido
    if (!vToken) return res.json({"msg":"error: La firma de la solicitud no es confiable. Salga del sistema y vuelva a ingresar."})
    // operativa del controller
    //--------------------------------------------------------------
    console.log("requerimiento ",req.body);
    try {
      const regAux1 = await Item.findOne({ _id: req.body._id })
      let estadoAux = regAux1.estado === 1 ? 0 : 1;
      const regAux2 = await Item.updateOne(
        { _id: req.body._id },
        { estado: estadoAux }
      );
      const reg = await Item.findOne({ _id: req.body._id })
      res.status(200).json(reg)
    } catch (err) {
      res.json({ "msg":"error: "+err });
      next();
    }
  }

  itemCtr.listarEstado =  async (req,res) => {
      
      try {
        const reg = await Item.find({ estado: 1 });
        res.status(200).json(reg)
      }catch (err) {
        res.json({ "msg":"error: "+err });
        next();
      }
    }

  

module.exports = itemCtr

