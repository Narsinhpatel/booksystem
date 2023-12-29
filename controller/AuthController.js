
const { response } = require("express");
const userModel=require('../model/UserModel');
const crypto=require('crypto');
const jwt = require('jsonwebtoken');
const { sanitizeUser } = require("../services/common");
const SECRET_KEY='SECRET_KEY'

exports.createUser=async(req,res)=>{

    


    try {

        var salt = crypto.randomBytes(16);
  crypto.pbkdf2(req.body.password, salt, 310000, 32, 'sha256',async function(err, hashedPassword) {
   
    const user=new userModel({...req.body,password:hashedPassword,salt});
        const doc=await user.save(); 

        req.login(sanitizeUser(doc),(err)=>{
            if (err) {
                res.status(404).json(err)  
            }
            const token = jwt.sign(sanitizeUser(doc),process.env.SECRET_KEY);
            res.cookie('jwt',token, { expires: new Date(Date.now() + 3600000), httpOnly: true })

            res.status(201).json(token);
        })
      }); 
    } catch (error) {
        
       res.status(404).json(error) 
    }
   
}
exports.loginUser=async(req,res)=>{
    res.cookie('jwt',req.user.token, { expires: new Date(Date.now() + 3600000), httpOnly: true }).status(201)
.json(req.user.token);
}
exports.checkAuth=async(req,res)=>{

    if (req.user) {
        res.json(req.user);
    }else{
        res.sendStatus(401)
    }
    
    }