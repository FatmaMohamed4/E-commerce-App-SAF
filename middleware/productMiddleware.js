const Ajv = require("ajv");
const jwt=require("jsonwebtoken")
const ajv = new Ajv();

const schema = require("../utils/productValidator.js");

const validate = ajv.compile(schema);

const productMiddleware = (req, res, next) => {
    const valid = validate(req.body);

    if (!valid) {
        return res.status(400).json({
            message: "Invalid Data in PRODUCTMW",
            errors: validate.errors
        });
    }

    next();
};

module.exports = productMiddleware;