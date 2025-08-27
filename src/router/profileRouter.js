const express = require('express');
const profileRouter = express.Router();
const {auth} = require("../middleware/auth");
const {getProfile , editProfile , forgotPasswordProfile} = require("../controller/profile");


profileRouter.get('/profile/view',auth,getProfile);
profileRouter.patch('/profile/edit',auth,editProfile);
profileRouter.patch('/profile/password',auth,forgotPasswordProfile);

module.exports = profileRouter;