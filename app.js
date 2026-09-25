const express = require("express");
require("dotenv").config();

const app = express();

app.use(express.json());

const userRouters = require("./routes/userRouter.js");
const cartRouter=require("./routes/cartRouter.js")
const productRouter = require("./routes/productRouter.js");
const categoryRouter = require("./routes/categoryRouter.js");
const errorMW = require("./middleware/errorMiddleware.js");

app.use("/users", userRouters);
app.use("/products", productRouter);
app.use("/category", categoryRouter);
app.use("/cart",cartRouter)
app.use(errorMW);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

require("./db.js");

