const validator = require('validator');
const {hash} = require('bcrypt');
const {validUpdateProfile} = require('../utils/Validate');

exports.getProfile = async(req,res)=>{
  try{
    const user = req.user;
    if (!user || user.length === 0) {
      throw new Error("No users found");
    }

    res.status(200).json({
      message:"Get Profile Successfully !!",
      data:user,
    })
  } catch (error) {
    console.log(error)
     res.status(500).json({
      message:"Error in get profile",
      error,
     })
  }
}


exports.editProfile = async(req, res) => {
  try {
    const loggedInUser = req.user;
    if(!validUpdateProfile(req)){
      throw new Error("Error in Update Profile");
    }

    Object.keys(req.body).every((key) => (loggedInUser[key] = req.body[key]));
    await loggedInUser.save();

    return res.status(200).json({
      message:`${loggedInUser.firstName} your profile updated successfully`,
      user: loggedInUser,
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    return res.status(500).json({
      message: "Error updating user profile",
      error,
    });
  }
};

exports.forgotPasswordProfile = async(req,res)=>{
  try{
    const {password} = req.body;
    if(!validator.isStrongPassword(password)){
      throw new Error("Please Enter a Strong Password");
    }
    
    const user = req.user;
    console.log(user);

    user.password = await hash(password,10);

    await user.save();
    user.password = undefined;
    res.status(200).json({
      message:"Password Update Successfully !!",
    })
  } catch (error) {
    console.log(error)
     res.status(500).json({
      message:"Error in Update password",
      error,
     })
  }
}
