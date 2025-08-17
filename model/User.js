const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name:{
        type:String,
    },
    email:{
        type:String,
        required: true,
        unique: true,
    },
    password:{
        type:String,
        required: true,
    },
    phone:{
        type:String,
    }
},
 {timestamps: true}
);

const User = mongoose.model("User", UserSchema);
module.exports = User;