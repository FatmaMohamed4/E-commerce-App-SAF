const productValidator = {
    type: "object",

    properties: {
        productName: {
            type: "string",
            minLength: 2
        },

        brand: {
            type: "string",
            minLength: 2
        },

        price: {
            type: "number",
            minimum: 0
        },

        description: {
            type: "string"
        },

        category: {
            type: "string"
        },

        stock: {
            type: "integer",
            minimum: 0
        }
    },

    required: [
        "productName",
        "brand",
        // "price",
        "description",
       
        "stock"
    ],

    additionalProperties: false
};

module.exports = productValidator;