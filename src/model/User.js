const mongoose = require('mongoose');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const UserSchema = new mongoose.Schema({
    firstName:{
        type:String,
        trim:true,
        required:true,
        minLength:2,
        maxLength:20
    },
    lastName:{
        type:String,
        trim:true,
        minLength:2,
        maxLength:20,
    },
    email:{
        type:String,
        required: true,
        lowercase:true,
        unique: true,
        trim:true,
        validator(value){
          if(!validator.isEmail(value)){
            throw new Error("Invalid email address: " + value);
          }
        }
    },
    password:{
        type:String,
        required: true,
        validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Enter a Strong Password: " + value);
        }
      },
    },
    age:{
        type:Number,
        min:18,
        max:60,
    },
    gender:{
       type:String,
       lowercase: true,
       validator(value){
         if(!['male','female','other',].includes(value)){
            throw new Error("Gender is not valid")
         }
       }
    },
    isPremium: {
      type: Boolean,
      default: false,
    },
    membershipType: {
      type: String,
    },
    photoUrl:{
       type:String,
    },
    skills:{
      type:[String],
    },
    about:{
     type:String,
     default:"Hey ! I am New User in DevTinder",
    },
},
 {timestamps: true}
);

// Middleware for set Photo with Name Character
UserSchema.pre("save", function (next) {
  if (!this.photoUrl) {
    const name = this.lastName
      ? `${this.firstName}+${this.lastName}`
      : this.firstName; // only firstName if lastName missing

    this.photoUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;
  }
  next();
});

UserSchema.methods.getJWT = async function () {
  const user = this;

  const token = jwt.sign({_id:user._id}, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  return token;
};

// UserSchema.index({email:1}); // not Required because it's uniqure:true  

UserSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const passwordHash = user.password;

  const isPasswordValid = await bcrypt.compare(
    passwordInputByUser,
    passwordHash
  );

  return isPasswordValid;
};

const User = mongoose.model("User", UserSchema);
module.exports = User;