const { validUpdateProfile } = require("../utils/Validate");
const { hash } = require("bcrypt");
const User = require("../model/User");

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
    const loggedInUser = req.user._id;
    console.log("Body:", req.body);

    if (!validUpdateProfile(req)) {
      return res.status(400).json({ message: "Error in Update Profile..." });
    }

    const {
      firstName,
      lastName,
      password,
      photoUrl,
      skills,
      about,
      age,
      gender,
    } = req.body;

    const updateData = {};

    // ✅ Only set if provided
    if (firstName && firstName.trim() !== "") updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (age) updateData.age = age;
    if (gender) updateData.gender = gender;
    if (photoUrl) updateData.photoUrl = photoUrl;
    if (skills) updateData.skills = skills;
    if (about) updateData.about = about;

    // ✅ Only hash and update password if provided
    if (password && password.trim() !== "") {
      try {
        const hashedPassword = await hash(password, 10);
        updateData.password = hashedPassword;
      } catch (err) {
        throw new Error("Error in hashing Password");
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      loggedInUser,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    // ✅ Don’t leak password hash back to client
    if (updatedUser) updatedUser.password = undefined;

    console.log("data:", updatedUser);
    return res.status(200).json({
      message: `${updatedUser.firstName} your profile updated successfully`,
      data: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      error,
    });
  }
};
