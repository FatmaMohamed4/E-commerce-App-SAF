const Ajv = require("ajv");

const ajv = new Ajv();

const categorySchema = require("../utils/categoryValidator.js");

const validate = ajv.compile(categorySchema);

module.exports = (req, res, next) => {
    const valid = validate(req.body);

    if (!valid) {
        return res.status(400).json({
            message: "Invalid Category Data",
            errors: validate.errors
        });
    }

    next();
};