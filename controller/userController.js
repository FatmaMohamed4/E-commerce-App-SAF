const User = require("../model/userSchema.js");
const bcrypt =require("bcrypt")

const register = async (req, res) => {
  try {
    const { email, username, password,phoneNumber } = req.body;

    const user = await User.findOne({
      $or: [
    { email },
    { phoneNumber }
  ]
    })

    console.log("FOUND USER:", user);

    if (user) {
      return res.status(409).json({
        message: "User email or phone number already exists",
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
      user: newUser,
    });

  } catch (error) {
    console.log("REGISTER ERROR:", error);

    // // Duplicate email from MongoDB unique index
    // if (error.code === 11000) {
    //   return res.status(409).json({
    //     message: "Email already exists",
    //   });
    // }

    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password"
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password"
      });
    }
    const token = user.generateToken()
  res.set("x-auth-token", token);

    return res.status(200).json({
      message: "Login successful",
      user,
      token
    });
   
  } catch (error) {
    console.log("LOGIN ERROR:", error);

    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message
    });
  }
};


const deleteAllUsers=async(req,res)=>{
  try{
    const result = await User.deleteMany({});
    res.status(200).json({
      message:"deleted",
      result:result.deletedCount
    })
  }catch (error) {
    console.log("LOGIN ERROR:", error);

    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message
    });
  }
}


module.exports = {
  register,
  login,
  deleteAllUsers
};