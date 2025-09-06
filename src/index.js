const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

app.use(
  cors({
    origin:"http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));       // for JSON payloads
app.use(express.urlencoded({ limit: "10mb", extended: true })); // for form data


const authRouter = require("./router/authRouter.js");
const profileRouter  = require("./router/profileRouter.js");
const requestRouter  = require("./router/requestRouter.js");
const userRouter  = require("./router/userRouter.js");


app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

const dbConnection = require("./config/dbConnection.js");
dbConnection();

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
