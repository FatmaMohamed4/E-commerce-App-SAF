const mongoose = require("mongoose");
const express = require("express");

const app = express();
require("dotenv").config();
app.use(express.json());

const userRouters =require('./routes/userRouter.js')

const db = mongoose
  .connect(process.env.MongoDB_URI,
    // useNewUrlParser:true,

)
  .then(() => {
    console.log("created");
  })
  .catch((err) => {
    console.log("error");
  });

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.use("/users", userRouters);