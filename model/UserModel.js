const mongoose=require('mongoose');


const userSchema=mongoose.Schema({
  
email:{
    type:String,
    required:true,
},
password:{
    type:Buffer,
    required:true,
},
role:{
    type:String,
    required:true,
    default:"user"
},
addresses:{ 
    type:[mongoose.Schema.Types.Mixed]
    
},
name:{
    type:String,
    
},
orders: { type: [mongoose.Schema.Types.Mixed] },
salt:Buffer


}
)
userSchema.virtual('id').get(function(){
   return this._id.toHexString();
});

// Ensure virtual fields are serialised.
userSchema.set('toJSON', {
   virtuals: true,
   versionKey:false,
   transform:function(doc,ret){delete ret._id}
});
module.exports=mongoose.model("User",userSchema)