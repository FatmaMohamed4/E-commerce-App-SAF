
const jwt = require("jsonwebtoken");
require("dotenv").config();

const adminPermission= (req, res, next) => {
  try {
    // Get token from request headers
    const token = req.header("x-auth-token");

    // No token
    if (!token) {
      return res.status(401).json({
        message: "Access Denied"
      });
    }

    // Verify token
    const decodedPayload = jwt.verify(
      token,
      process.env.Secret_key
    );

  
    if (!decodedPayload){
        return res.status(401).json({
        message: "Access Denied"
      });
    }
    // Continue to the next middleware/controller
    next();

  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token"
    });
  }
};

module.exports = adminPermission;