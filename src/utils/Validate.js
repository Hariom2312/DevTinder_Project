const validator = require('validator');

const validSignup = (req)=>{
    const {firstName,email,password} = req.body;
    if(!firstName || !email || !password){
       throw new Error("Required all fields !!");
    }
}

const validUpdateProfile = (req)=>{
    const allowedEditFields = [
    "firstName",
    "lastName",
    "emailId",
    "photoUrl",
    "gender",
    "age",
    "about",
    "skills",
  ];

  const isEditAllowed = Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field)
  );
//  console.log(isEditAllowed)
  return isEditAllowed;
}

module.exports = {validSignup , validUpdateProfile};
