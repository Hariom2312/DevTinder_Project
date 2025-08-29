const { validUpdateProfile } = require("../utils/Validate");
const { hash } = require('bcrypt');

exports.getProfile = async (req, res) => {
  try {
    const user = req.user;
    if (!user || user.length === 0) {
      return res.json({ message: "User Not Found" });
    }
    res.status(200).json({
      message: "Get Profile Successfully !!",
      data: user,
    });
  } catch (error) {
    // console.log(error);
    res.status(500).json({
      message: error.message,
      error,
    });
  }
};

exports.editProfile = async (req, res) => {
  try {
    const loggedInUser = req.user;
    if (!validUpdateProfile(req)) {
      return res.status(400).json({ message: "Error in Update Profile" });
    }

    Object.keys(req.body).every((key) => (loggedInUser[key] = req.body[key]));

    let hashedPassword;
    try {
      hashedPassword = await hash(req.body.data.password, 10); // 10 number of rounds
    } catch (err) {
      throw new Error("Error in hashing Password");
    }
    loggedInUser.password = hashedPassword;
    // console.log("LoggedInUser", loggedInUser);
    const data = await loggedInUser.save();
    
    console.log("data",data);
    return res.status(200).json({
      message: `${loggedInUser.firstName} your profile updated successfully`,
      data: data,
    });
  } catch (error) {
    // console.error("Error updating user profile:", error);
    return res.status(500).json({
      message: error.message,
      error,
    });
  }
};
