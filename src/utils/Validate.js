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
    "password",
    "photoUrl",
    "gender",
    "age",
    "about",
    "skills",
  ];
  console.log("Req.Body:",req.body);
  const isEditAllowed = Object.keys(req.body.data).every((field) =>
     allowedEditFields.includes(field)
  );
//  console.log(isEditAllowed);
  return isEditAllowed;
}

module.exports = {validSignup , validUpdateProfile};
