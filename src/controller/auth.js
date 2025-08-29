const User = require("../model/User");
const { hash } = require("bcrypt");
const { validSignup } = require("../utils/Validate");
require("dotenv").config();
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

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
      message: "Signup Failed " + err.message,
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

      user.password = undefined;
      
      res.cookie("loginToken", token, {
        expires: new Date(Date.now() + 8 * 3600000),
        httpOnly: true,
        secure: true,
      });

      res.status(200).json({
        message: "User logged in successfully",
        token,
        data: user,
      });
    } else {
      throw new Error("Error in login");
    }
  } catch (err) {
    res.status(500).json({
      message:err.message,
      err,
    });
  }
};

exports.logout = (req, res) => {
  try {
    res
      .cookie("loginToken", null, { expires: new Date(Date.now()) })
      .status(200)
      .json({ message: "Logout Successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error in logout" + error.message });
  }
};

exports.forgotPasswordProfile = async (req, res) => {
  // POST /forgot_password  → send reset mail
  // PUT  /new_password/:token → reset password
  try {
    // ✅ Case 1: Send reset email (when only email is sent)
    if (req.method === "POST") {
      const { email } = req.body;
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ message: "User not found" });

      const resetToken = user.getResetPasswordToken();
      await user.save({ validateBeforeSave: false });

      const resetUrl = `${process.env.FRONTEND_URL}/new_password/${resetToken}`;
      const message = `You requested a password reset. Click below:\n\n${resetUrl}`;

      await sendEmail({
        email: user.email,
        subject: "Password Reset",
        message,
      });

      return res.json({ success: true, message: "Reset email sent ✅" });
    }

    // ✅ Case 2: Reset password (when token is in URL)
    if (req.method === "PUT") {
      const resetPasswordToken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");

      console.log("Token from URL:", req.params.token);
      console.log("Hashed token:", resetPasswordToken);

      const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
      });

      console.log(user);

      if (!user)
        return res.status(400).json({ message: "Invalid or expired token" });

      let hashedPassword;
      try {
        hashedPassword = await hash(req.body.password, 10);
      } catch (err) {
        throw new Error("Error in hashing Password");
      }

      user.password = hashedPassword;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save();

      return res.json({
        success: true,
        message: "Password updated successfully 🚀",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error " + err.message });
  }
};
