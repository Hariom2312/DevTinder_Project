const mongoose = require("mongoose");
require("dotenv").config();

const dbConnection = async() => {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewURLParser: true,
      useUnifiedTopology: true,
    });
    console.log(`Database connected successfully on PORT : ${process.env.PORT}`);
  } catch (error) {
    console.error("Database connection failed:", error);
  }
};

module.exports = dbConnection;
