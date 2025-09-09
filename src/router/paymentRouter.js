const express = require("express");
const paymentRouter = express.Router();
const {
    createOrder,
    webHook,
    verifyPremium
} = require("../controller/payment");
const { auth } = require("../middleware/auth");


paymentRouter.post('/payment/create', auth, createOrder);
paymentRouter.post('/payment/webhook', webHook);
paymentRouter.get('/premium/verify', auth, verifyPremium);


module.exports = paymentRouter;