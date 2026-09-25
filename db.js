const mongoose = require("mongoose");

mongoose
  .connect(process.env.MongoDB_URI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.log("MongoDB connection error:", err);
  });