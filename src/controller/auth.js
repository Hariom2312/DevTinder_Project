const User = require("../model/User");
const {hash} = require('bcrypt');
const { validSignup } = require("../utils/Validate");
require("dotenv").config();

exports.signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    validSignup(req);
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("Email Already Exists.. try another emailId");
    }

    let hashedPassword;
    try {
      hashedPassword = await hash(password, 10); // 10 number of rounds
    } catch (err) {
      throw new Error("Error in hashing Password");
    }

    // user Create
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    // console.log(user);
    return res.status(200).json({
      success: true,
      message: "User Created Succesfully !!",
      data: user,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      sucess: false,
      message: "Signup Failed",
      data: err,
    });
  }
};

exports.login = async (req, res) => {
try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Invalid credentials");
    }
    
    const isPasswordValid = await user.validatePassword(password);
   
    if (isPasswordValid) {
      const token = await user.getJWT();
      
      res.cookie("loginToken", token, {
        expires: new Date(Date.now() + 8 * 3600000),
        httpOnly:true,
        secure:true,
      });
      user.password = undefined;

      res.send(user);
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
};

exports.logout = (req, res) => {
  try {
    res
      .cookie("loginToken", null, { expires: new Date(Date.now()) })
      .status(200)
      .json({ message: "Logout Successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error in logout" + error });
  }
};
