const {response,request}=require('express');
const { validationResult, header } = require('express-validator');
const Usuario=require('../models/Usuario');
const bcrypt=require('bcryptjs');
const generarJsonWebToken = require('../helpers/jwt');

 const crearUsuario=async(req,res=response)=>{


    const{email,name,password}=req.body;

    try{
       
        //Verificar el email que no exista
        console.log("Proceso: "+email);
        
        let usuariop=await Usuario.findOne({email});    

        if(usuariop){
            return res.status(400).json({
                ok:false,
                msg:'El usuario ya existe'
            });
        }
    //Crear usuario con el modelo
        const dbUser=new Usuario(req.body);
    
        //Encriptar contraseña
        const salt=bcrypt.genSaltSync();
        dbUser.password=bcrypt.hashSync(password,salt);


    //Generar el jsonWebToken
        const token=await generarJsonWebToken(dbUser.id,name)

        //Crear usuario de bd
        await dbUser.save();

    //Generar respuesta exitosa
        return res.status(201).json({
            ok:true,
            uid:dbUser.id,
            name:dbUser.name,
            email:dbUser.email,
            token
        });

    }catch(err){
        return res.status(500).json({
            ok:false,
            msg:err
        });
    }


    
    

}

const loginUsuario= async(req,res=response)=>{
    
    const errors=validationResult(req);
     
    const {email,password}=req.body;

    try{
        console.log("Aquí");
        const userDB=await Usuario.findOne({email});
      
        if(!userDB){
            return res.status(400).json({
                ok:false,
                msg:'El correo no existe'
            });
        }

        //Confirmar si el password hace match
     
        const validPass=bcrypt.compareSync(password,userDB.password);

        if(!validPass){
            return res.status(400).json({
                ok:false,
                msg:'El password no existe'
            });
        }

        //Generar el JWT
        const token=await generarJsonWebToken(userDB.id,userDB.name);
    
        //Respuesta

        return res.json({
            ok:true,
            uid:userDB.id,
            name:userDB.name,
            email:userDB.email,
            token
        });


    }catch(err){
        console.log(err);
        return res.status(500).json({
            ok:false,
            msg:'Hable con el administrador'
        });
    }


}
const renovarToken= async(req,res=response)=>{
    
    const {uid}=req;

    //Leer la BD para obtener el email
    const dbUser=await Usuario.findById(uid);

    const token=await generarJsonWebToken(uid,dbUser.name);
   

    return res.json({
        ok:true,
        uid,
        name:dbUser.name,
        email:dbUser.email,
        token
    });
}


module.exports={
    crearUsuario,
    loginUsuario,
    renovarToken
}