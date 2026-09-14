
const mongoose = require("mongoose");
const express = require("express");

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


  module.exports=db