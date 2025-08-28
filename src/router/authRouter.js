const express = require('express');
const {
  signup,
  login,
  logout,
  forgotPasswordProfile,
} = require("../controller/auth.js");

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);


router.post("/forgot_password", forgotPasswordProfile);      // send reset mail 
router.put("/new_password/:token", forgotPasswordProfile);   // update new password


module.exports = router;