const userSchema = {
  type: "object",

  properties: {
    username: {
      type: "string",
      minLength: 2
    },

    email: {
      type: "string",
      format: "email"
    },



    password: {
      type: "string",
      minLength: 6
    },

    phoneNumber: {
      type: "string",
      maxLength: 11,
      
    }
  },

  // required: [
  //   "username",
  //   "email",
  //   "password",
  //   "phoneNumber"
  // ],

  additionalProperties: false
};

module.exports = userSchema;