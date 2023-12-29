const { response } = require("express");
const languageModel =require('../model/LanguageModel');

exports.createLanguage=async(req,res)=>{

    const language=new languageModel(req.body);


    try {
        const doc=await language.save(); 
        res.status(200).json(doc); 
    } catch (error) {
        
       res.status(404).json(error) 
    }
   
}



exports.fetchLanguage=async(req,res)=>{

 


        try {
          
            const languages=await languageModel.find({}).exec();
            res.status(200).json(languages); 
        } catch (error) {
            
           res.status(404).json(error) 
        }
    

  
}