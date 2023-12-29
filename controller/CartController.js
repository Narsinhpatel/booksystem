const { response } = require("express");
const cartModel =require('../model/CartModel');


exports.addToCart=async(req,res)=>{


  const {id}=req.user

    const cart=new cartModel({...req.body,user:id});


    try {
        const doc=await cart.save(); 

        const result=await doc.populate('product')
        res.status(200).json(result); 
    } catch (error) {
        
       res.status(404).json(error) 
    }
   
}


exports.fetchCartByUser=async(req,res)=>{

 
const {id}=req.user;

        try {
          
            const cartItems =await cartModel.find({user:id}).populate('product').populate('user');
            res.status(200).json(cartItems); 
        } catch (error) {
            
           res.status(404).json(error) 
        }
    

  
}
exports.updateCart=async(req,res)=>{

    const { id } = req.params;
    try {
      const cart = await cartModel.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      const result=await cart.populate('product')
    
      res.status(200).json(result);
    } catch (err) {
      res.status(400).json(err);
    } 
}
exports.deleteFromCart=async(req,res)=>{

  const {id}=req.params


    try {
       const doc=await cartModel.findByIdAndDelete(id)
        res.status(200).json(doc); 
    } catch (error) {
        
       res.status(404).json(error) 
    }
   
}
