const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

app.use(cors({
  origin: "http://localhost:5173",
  credentials:true,
}));

app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));       // for JSON payloads
app.use(express.urlencoded({ limit: "10mb", extended: true })); // for form data


const authRouter = require("./router/authRouter.js");
const profileRouter = require("./router/profileRouter.js");
const requestRouter = require("./router/requestRouter.js");
const userRouter = require("./router/userRouter.js");
const paymentRouter = require("./router/paymentRouter.js");
const chatRouter = require("./router/chatRouter.js");
const initiliseSocket = require("./utils/socket.js");
const dbConnection = require("./config/dbConnection.js");


app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", paymentRouter);
app.use("/", chatRouter);

// Chat using websocket
const http = require('http');
const server = http.createServer(app);
initiliseSocket(server);

// in server is listen in db
dbConnection(server);

