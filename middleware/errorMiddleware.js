module.exports =(error,req,res,next)=>{

    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
}