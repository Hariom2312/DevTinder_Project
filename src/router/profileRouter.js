const express = require('express');
const profileRouter = express.Router();
const {auth} = require("../middleware/auth");
const {getProfile , editProfile } = require("../controller/profile");

profileRouter.get('/profile/view',auth,getProfile);
profileRouter.patch('/profile/edit',auth,editProfile);

module.exports = profileRouter;