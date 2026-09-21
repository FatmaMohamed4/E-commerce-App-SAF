const Ajv = require("ajv");
const addFormats = require("ajv-formats");
require("dotenv").config();

const ajv = new Ajv();

addFormats(ajv);

const schema = require("../utils/userValidator.js");

const validate = ajv.compile(schema);

const validateRegister = (req, res, next) => {
  const valid = validate(req.body);

  if (!valid) {
    return res.status(400).json({
      message: "Invalid Data in USERMW",
      errors: validate.errors
    });
  }

  
  next();
};


const authMiddleware = (req, res, next) => {
    try {

        const token = req.header("x-auth-token");

        if (!token) {
            return res.status(401).json({
                message: "Access Denied. No token provided"
            });
        }

        const decodedPayload = jwt.verify(
            token,
            process.env.Secret_key
        );

        req.user = decodedPayload;

        next();

    } catch (error) {

        next(error)

    }
};

module.exports = {authMiddleware,validateRegister};