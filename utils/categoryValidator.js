const categoryValidator = {
    type: "object",

    properties: {
        name: {
            type: "string",
            minLength: 2,
            maxLength: 50,
            
        }
    },

    required: ["name"],

    
};

module.exports = categoryValidator