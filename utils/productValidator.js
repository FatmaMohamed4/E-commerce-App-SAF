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
            type: "string",
            minLength: 5
        },

        category: {
            type: "string",
            minLength: 2
        },

        stock: {
            type: "number",
            minimum: 0
        },

        images: {
            type: "array",
            items: {
                type: "string"
            }
        },

        colors: {
            type: "array",
            items: {
                type: "string"
            }
        },

        sizes: {
            type: "array",
            items: {
                type: "string"
            }
        },

        discount: {
            type: "number",
            minimum: 0,
            maximum: 100
        }
    },

    required: [
        "productName",
        "brand",
        "price",
        "description",
        "category",
        "stock"
    ],

    additionalProperties: false
};

module.exports = productValidator;