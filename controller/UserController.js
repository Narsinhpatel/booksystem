

const { response } = require("express");
const userModel=require('../model/UserModel');




exports.fetchUserById=async(req,res)=>{

  const {id}=req.user;


        try {
          
            const user=await userModel.findById(id).exec();
           
            res.status(200).json({id:user.id,addresses:user.addresses,role:user.role,email:user.email,orders:user.orders}); 
        } catch (error) {
            
           res.status(404).json(error) 
        }
    
 
  
}
exports.updateUser=async(req,res)=>{

    const{ id}=req.params;

    const user=await userModel.findByIdAndUpdate(id,req.body,{new:true});
 


    try {
        const doc=await user.save(); 
        res.status(200).json(doc); 
    } catch (error) {
        
       res.status(404).json(error) 
    }
   
}
