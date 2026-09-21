const User = require("../model/userSchema.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendOTP = require("../utils/sendEmail.js");


// =========================
// REGISTER
// =========================

const register = async (req, res, next) => {
  try {
    const {
      email,
      username,
      password,
      phoneNumber
    } = req.body;

    const user = await User.findOne({
      $or: [
        { email },
        { phoneNumber }
      ]
    });

    if (user) {
      return res.status(409).json({
        message: "User email or phone number already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email,
      username,
      password: hashedPassword,
      phoneNumber
    });

    return res.status(201).json({
      message: "User registered successfully",
      user: newUser
    });

  } catch (error) {
    next(error);
  }
};


// =========================
// LOGIN
// =========================

const login = async (req, res, next) => {
  try {
    const {
      email,
      password
    } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password"
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password"
      });
    }

    const token = user.generateToken();

    res.set("x-auth-token", token);

    return res.status(200).json({
      message: "Login successful",
      user,
      token
    });

  } catch (error) {
    next(error);
  }
};


// =========================
// DELETE ALL USERS
// =========================

const deleteAllUsers = async (req, res, next) => {
  try {

    const result = await User.deleteMany({});

    return res.status(200).json({
      message: "All users deleted successfully",
      result: result.deletedCount
    });

  } catch (error) {
    next(error);
  }
};


// =========================
// FORGOT PASSWORD
// SEND OTP
// =========================

const forgotPassword = async (req, res, next) => {
  try {

    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    // Generate 6 digit OTP
    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // OTP expires after 10 minutes
    const expireTime = new Date(
      Date.now() + 10 * 60 * 1000
    );

    user.resetOTP = otp;
    user.resetOTPExpire = expireTime;

    await user.save();

    await sendOTP(email, otp);

    return res.status(200).json({
      message: "OTP sent successfully"
    });

  } catch (error) {
    next(error);
  }
};


// =========================
// VERIFY OTP
// GENERATE RESET TOKEN
// =========================

const verifyOTP = async (req, res, next) => {
  try {

    const {
      email,
      otp
    } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    // Check OTP
    if (
      !user.resetOTP ||
      user.resetOTP !== otp
    ) {
      return res.status(400).json({
        message: "Invalid OTP"
      });
    }

    // Check expiration
    if (
      !user.resetOTPExpire ||
      user.resetOTPExpire < new Date()
    ) {
      return res.status(400).json({
        message: "OTP expired"
      });
    }

    // Generate RESET TOKEN
    const resetToken = jwt.sign(
      {
        userid: user._id,
        purpose: "password-reset"
      },
      process.env.Secret_key,
      {
        expiresIn: "10m"
      }
    );

    // Clear OTP after successful verification
    user.resetOTP = null;
    user.resetOTPExpire = null;

    await user.save();

    return res.status(200).json({
      message: "OTP verified successfully",
      resetToken
    });

  } catch (error) {
    next(error);
  }
};


// =========================
// RESET PASSWORD
// =========================

const resetPassword = async (req, res, next) => {
  try {

    const {
      resetToken,
      newPassword
    } = req.body;

    if (!resetToken) {
      return res.status(401).json({
        message: "Reset token is required"
      });
    }

    // Verify reset token
    const decoded = jwt.verify(
      resetToken,
      process.env.Secret_key
    );

    // Make sure token is only for password reset
    if (
      decoded.purpose !== "password-reset"
    ) {
      return res.status(401).json({
        message: "Invalid reset token"
      });
    }

    const user = await User.findById(
      decoded.userid
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(
      newPassword,
      10
    );

    user.password = hashedPassword;

    await user.save();

    return res.status(200).json({
      message: "Password reset successfully"
    });

  } catch (error) {

    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return res.status(401).json({
        message: "Invalid or expired reset token"
      });
    }

    next(error);
  }
};




// Update  Profile 
const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.userid;

    const { username, email, phoneNumber } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    if (username) user.username = username;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;

    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        phoneNumber: user.phoneNumber
      }
    });

  } catch (err) {
    next(err);
  }
};

// =========================
// EXPORTS
// =========================

module.exports = {
  register,
  login,
  deleteAllUsers,
  forgotPassword,
  verifyOTP,
  resetPassword ,
  updateProfile
};