const { response } = require("express");
const categoryModel =require('../model/CategoryModel');


exports.createCategory=async(req,res)=>{

    const category=new categoryModel(req.body);


    try {
        const doc=await category.save(); 
        res.status(200).json(doc); 
    } catch (error) {
        
       res.status(404).json(error) 
    }
   
}


exports.fetchCategory=async(req,res)=>{

 


        try {
          
            const categories=await categoryModel.find({}).exec();
            res.status(200).json(categories); 
        } catch (error) {
            
           res.status(404).json(error) 
        }
    

  
}