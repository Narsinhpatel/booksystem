const mongoose=require('mongoose');


const cartSchema=mongoose.Schema({
  
    quantity:{
        type:Number,
        required:true
    },
 product:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Product",
    required:true
 },
 user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
 },
 

}
)
cartSchema.virtual('id').get(function(){
   return this._id.toHexString();
});

// Ensure virtual fields are serialised.
cartSchema.set('toJSON', {
   virtuals: true,
   versionKey:false,
   transform:function(doc,ret){delete ret._id}
});
module.exports=mongoose.model("Cart",cartSchema)