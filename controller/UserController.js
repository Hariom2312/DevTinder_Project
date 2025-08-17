const User = require("../model/User");
const { hash } = require("bcryptjs");

const adduser = async(req, res)=>{
  try {
    const { name,email, password ,phone} = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const hashedPassword = await hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      phone,
    });
    await user.save();
    console.log("User added successfully:", user);

    return res.status(200).json(user);
  } catch (error) {
    console.error("Error adding user:", error);
    return res.status(500).json({
      message: "Error fetching user information",
      error,
    });
  }
}

const getUserInfo = async (req, res)=>{
  try {
    const users = await User.find({});
    if (!users || users.length === 0) {
      return res.status(404).json({
        message: "No users found",
      });
    }   
    console.log("User information fetched successfully:", users);
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching user information",
      error,
    });
  }
}

module.exports = {getUserInfo, adduser};
