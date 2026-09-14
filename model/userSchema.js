const mongoose = require("mongoose");
const jwt=require("jsonwebtoken")
require("dotenv").config();


const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true,
    maxlength: 11,
    unique:true
  },
  isAdmin:{
    type: Boolean,
    default: false
  } ,
  resetOTP: {
    type: String,
    default: null
  },

  resetOTPExpire: {
    type: Date,
    default: null
  }
});


userSchema.methods.generateToken = function () {
  const token = jwt.sign(
    { userid: this._id },
    process.env.Secret_key,
    { expiresIn: "1m" }
  );

  return token;
};




module.exports = mongoose.model("User", userSchema);