const mongoose=require('mongoose');


const productSchema=mongoose.Schema({
  
 title:{
    type:String,
    unique:true,
    required:true,
 },
 description:{
    type:String,
    required:true,
 },
 price:{
    type:Number,
    min:[0,'wrong min price'],
    required:true,
 },
 rating:{
    type:Number,
    default:0,
    
    required:true,
 },
 ISBN:{
    type:Number,
    unique:true,
    min:[0,'wrong MIN ISBN'],
    required:true,
 },
 stock:{
    type:Number,
    min:[0,'wrong min stock'],
    default:0,
    required:true,
 },
 category:{
    type:String,
    required:true,
 },
 language:{
    type:String,
    required:true,
 },
 author:{
    type:String,
    required:true,
 },
 imageLink:{
    type:String,
    required:true,
 },
 deleted:{
    type:Boolean,
   
    default:false,
 },
 

}
)
productSchema.virtual('id').get(function(){
   return this._id.toHexString();
});

// Ensure virtual fields are serialised.
productSchema.set('toJSON', {
   virtuals: true,
   versionKey:false,
   transform:function(doc,ret){delete ret._id}
});
module.exports=mongoose.model("Product",productSchema)