const express = require('express');
const app = express();
require('dotenv').config();

const dbConnection = require('../config/dbConnection.js');
dbConnection();

const PORT = process.env.PORT || 4000;

app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// Importing user router
const cors = require('cors');
app.use(cors());

const userRouter = require('../router/UserRouter.js');
app.use(userRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
