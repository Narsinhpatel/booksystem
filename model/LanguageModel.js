const mongoose=require('mongoose');


const languageSchema=mongoose.Schema({
  
 value:{
    type:String,
    unique:true,
    required:true,
 },
 label:{
    type:String,
    required:true,
    unique:true,
 },
 
 

}
)
languageSchema.virtual('id').get(function(){
   return this._id.toHexString();
});

// Ensure virtual fields are serialised.
languageSchema.set('toJSON', {
   virtuals: true,
   versionKey:false,
   transform:function(doc,ret){delete ret._id}
});
module.exports=mongoose.model("Language",languageSchema)