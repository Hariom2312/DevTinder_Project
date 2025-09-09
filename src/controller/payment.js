const Payment = require("../model/Payment");
const { membershipAmount } = require("../utils/constants");
const RazorpayInstance = require("../utils/razorpay");
const User = require("../model/User");

const {
   validateWebhookSignature,
} = require("razorpay/dist/utils/razorpay-utils");

exports.createOrder = async (req, res) => {
   try {
      const { membershipType } = req.body;
      const { firstName, lastName, email } = req.user;

      const order = await RazorpayInstance.orders.create({
         amount: membershipAmount[membershipType] * 100, // *100 for convert in rupees
         currency: "INR",
         receipt: "order_rcptid_#1",
         notes: {
            firstName,
            lastName: lastName || "",
            email,
            membershipType: membershipType,
         },
      });
      // console.log(order);

      const paymentData = new Payment({
         userId: req.user._id,
         orderId: order.id,
         status: order.status,
         amount: order.amount,
         currency: order.currency,
         receipt: order.receipt,
         notes: order.notes,
      });

      const savedPayment = await paymentData.save();

      // console.log(order);
      res.status(200).json({
         message: "Payment Create Success",
         ...savedPayment.toJSON(),
         keyId: process.env.RAZORPAY_KEY,
      });
   } catch (error) {
      console.log(error);
      return res.status(500).json({
         message: error.message,
         error,
      });
   }
};


exports.webHook = async (req, res) => {
   try {
      //  console.log("Webhook Called...");
      const webhookSignature = req.get("X-Razorpay-Signature");
      //  console.log("Webhook Signature", webhookSignature);

      const isWebhookValid = validateWebhookSignature(
         JSON.stringify(req.body),            // webHook Body    --> and must add razorpay link this api in webhook with secret
         webhookSignature,                    // webHook Signature
         process.env.RAZORPAY_WEBHOOK_SECRET  // webHook Secret
      );

      if (!isWebhookValid) {
         // console.log("Invalid Webhook Signature");
         return res.status(400).json({ msg: "Webhook signature is invalid" });
      }
      //  console.log("Valid Webhook Signature");


      // Udpate my payment Status in DB
      const paymentDetails = req.body.payload.payment.entity;

      const payment = await Payment.findOne({ orderId: paymentDetails.order_id });
      payment.status = paymentDetails.status;   // now change status
      await payment.save();
      // console.log("Payment saved");

      const user = await User.findOne({ _id: payment.userId });
      user.isPremium = true;
      user.membershipType = payment.notes.membershipType;
      // console.log("User saved");

      await user.save();

      // Update the user as premium

      // if (req.body.event == "payment.captured") {
      // }
      // if (req.body.event == "payment.failed") {
      // }

      // return success response to razorpay

      return res.status(200).json({ msg: "Webhook received successfully" });
   } catch (err) {
      return res.status(500).json({ msg: err.message });
   }
}



exports.verifyPremium = async (req, res) => {
   const user = req.user.toJSON();
   console.log(user);
   if (user.isPremium) {
      return res.json({ ...user });
   }
   return res.json({ ...user });
};
