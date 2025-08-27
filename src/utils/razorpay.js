const razorpay = require('razorpay');
require('dotenv').config();

const instance = new razorpay({
    key:process.env.RAZORPAY_KEY,
    key_secret:process.env.RAZORPAY_SECRET
});

module.exports = {instance};