const express = require("express");
require("dotenv").config();

const db = require("./db.js");
const userRouters = require("./routes/userRouter.js");
const errorMW = require("./middleware/errorMiddleware.js");

const app = express();

app.use(express.json());

// Routes
app.use("/users", userRouters);

// Error Middleware
app.use(errorMW);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});