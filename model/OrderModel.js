const mongoose=require('mongoose');


const orderSchema=mongoose.Schema({
  
    items: { type: [mongoose.Schema.Types.Mixed], required: true },
  totalAmount: { type: Number },
  totalItems: { type: Number },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  //TODO:  we can add enum types
  selectedPayment: { type: String, required: true },
  status: { type: String, default: 'pending' },
  selectedAddress: { type: mongoose.Schema.Types.Mixed, required: true },

}
)
orderSchema.virtual('id').get(function(){
   return this._id.toHexString();
});

// Ensure virtual fields are serialised.
orderSchema.set('toJSON', {
   virtuals: true,
   versionKey:false,
   transform:function(doc,ret){delete ret._id}
});
module.exports=mongoose.model("Order",orderSchema)