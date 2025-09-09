const mongoose = require("mongoose");
require('dotenv').config();

// console.log("DB URL:", process.env.MONGODB_URL);

const dbConnection = async (server) => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    server.listen(process.env.PORT, () => {
      console.log(`Server is running on port: ${process.env.PORT}`);
    });
    console.log(`Database connected successfully on PORT : ${process.env.PORT}`);
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
};

module.exports = dbConnection;
