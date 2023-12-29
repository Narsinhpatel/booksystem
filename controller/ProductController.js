const { response } = require("express");
const productModel=require("../model/ProductModel");


exports.createProduct=async(req,res)=>{

    const product=new productModel(req.body);


    try {
        const doc=await product.save(); 
        res.status(200).json(doc); 
    } catch (error) {
        
       res.status(404).json(error) 
    }
   
}

exports.updateProduct=async(req,res)=>{

    const{ id}=req.params;

    const product=await productModel.findByIdAndUpdate(id,req.body,{new:true});
 


    try {
        const doc=await product.save(); 
        res.status(200).json(doc); 
    } catch (error) {
        
       res.status(404).json(error) 
    }
   
}

exports.fetchProductById=async(req,res)=>{

   const{ id}=req.params;

   const product=await productModel.findById(id);


    try {
        const doc=await product.save(); 
        res.status(200).json(doc); 
    } catch (error) {
        
       res.status(404).json(error) 
    }
   
}

exports.fetchAllProduct=async(req,res)=>{

    //Filter={"author":"abc"}
//sort={_sort:"price",order:"desc"}
        //pagination={_page:1,_limit=10}
        let condition={}
        if (!req.query.admin) {
            
        condition.deleted={$ne:true}
        }
        let query= productModel.find(condition);
       let totalproductquery=productModel.find(condition);
      
        if (req.query.author) {

            query= query.find({author:req.query.author})
            totalproductquery= totalproductquery.find({author:req.query.author})
            
        }
        if (req.query.language) {

            query= query.find({language:req.query.language})
            totalproductquery= totalproductquery.find({language:req.query.language})
            
        }
        if (req.query.category) {

            query=query.find({category:req.query.category})
            totalproductquery=totalproductquery.find({category:req.query.category})
           
        }
        if (req.query._sort && req.query._order) {

            query= query.sort({[req.query._sort]:req.query._order})
            totalproductquery=totalproductquery.find({category:req.query.category})
            
        }

        const totalDocs= await totalproductquery.count().exec();
      
        if (req.query._page && req.query._limit) {

            const pageSize=req.query._limit;
            const page=req.query._page

            query= query.skip(pageSize*(page-1)).limit(pageSize)
            
        }
     



        try {
            const doc=await query.exec();
            res.set('X-Total-Count',totalDocs)
            res.status(200).json(doc); 
        } catch (error) {
            
           res.status(404).json(error) 
        }
    

  
}