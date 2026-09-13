const Ajv = require("ajv");
const addFormats = require("ajv-formats");

const ajv = new Ajv();

addFormats(ajv);

const schema = require("../utils/userValidator.js");

const validate = ajv.compile(schema);

module.exports = (req, res, next) => {
  const valid = validate(req.body);

  if (!valid) {
    return res.status(400).json({
      message: "Invalid Data",
      errors: validate.errors
    });
  }

  
  next();
};