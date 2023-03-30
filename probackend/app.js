// importing from packages

const express = require("express");
const mongoose = require("mongoose");
// Parser's and Security

require("dotenv").config();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

// importing from another files :  My Route's
const authRouter = require("./routes/authentication");
const userRouter = require("./routes/user");
const categoryRouter = require("./routes/category");
const productRouter = require("./routes/product");
const orderRouter = require("./routes/order");

// Express Connection
const app = express();

// Running Port
const port = process.env.PORT || 8080;

// DB Connection
mongoose.connect(process.env.DATABASE).then(() => {
  console.log("DB CONNECTED");
});

//"express.use("commonUrl",Routes)" :  Routes

// const errorRoute = (req, res) => res.json({ message: "404 Page Not Found" });
app.use("/api", authRouter);
app.use("/api", userRouter);
app.use("/api", categoryRouter);
app.use("/api", productRouter);
app.use("/api", orderRouter);

//sol for req entity too large Error
// app.use(bodyParser.json({ limit: "10mb", extended: true }));
// app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

// Attaching Parser's
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

//All set and  Fire
app.listen(port, () => console.log(`Server is up and runningg at ${port}...`));
