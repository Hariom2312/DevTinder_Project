const mongoose = require('mongoose');

const ConnectionRequestSchema = new mongoose.Schema({
   fromUserId:{
    type:mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
   },
   toUserId:{
    type:mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
   },
   status:{
    type:String,
    enum:{
        values:['ignored','interested','accepted','rejected'],
        message:`{VALUE} is incorrect status`,
    }
   }
},{timestamps:true});

// compound index
ConnectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

module.exports = mongoose.model('ConnectionRequest',ConnectionRequestSchema);