const OrderModel = require("../model/OrderModel");


exports.fetchOrdersByUser = async (req, res) => {
    const { id } = req.user;
  
    try {
      const orders = await OrderModel.find({ user: id });

      console.log(orders)
      res.status(200).json(orders);
    } catch (err) {
      res.status(400).json(err);
    }
  };

  exports.createOrder = async (req, res) => {
    const order = new OrderModel(req.body);
    try {
      const doc = await order.save();
      res.status(201).json(doc);
    } catch (err) {
      res.status(400).json(err);
    }
  };

  exports.deleteOrder = async (req, res) => {
      const { id } = req.params;
      try {
      const order = await OrderModel.findByIdAndDelete(id);
      res.status(200).json(order);
    } catch (err) {
      res.status(400).json(err);
    }
  };

  exports.updateOrder = async (req, res) => {
    const { id } = req.params;
    try {
      const order = await OrderModel.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      res.status(200).json(order);
    } catch (err) {
      res.status(400).json(err);
    }
  };

  exports.fetchAllOrders=async(req,res)=>{

        let query= OrderModel.find({deleted:{$ne:true}});
       let totalordersquery=OrderModel.find({});
      
        if (req.query.author) {

            query= query.find({author:req.query.author})
            totalordersquery= totalordersquery.find({author:req.query.author})
            
        }
        if (req.query.language) {

            query= query.find({language:req.query.language})
            totalordersquery= totalordersquery.find({language:req.query.language})
            
        }
        if (req.query.category) {

            query=query.find({category:req.query.category})
            totalordersquery=totalordersquery.find({category:req.query.category})
           
        }
        if (req.query._sort && req.query._order) {

            query= query.sort({[req.query._sort]:req.query._order})
            totalordersquery=totalordersquery.find({category:req.query.category})
            
        }

        const totalDocs= await totalordersquery.count().exec();
      
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