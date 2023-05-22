require("dotenv").config();
const express = require("express");
const cors = require("express");
const mongoose = require("mongoose");
const app = express();
app.use(express.json());
const authRouter = require("./routes/auth.route");
const dashboardRouter = require("./routes/dashboard.route");
const widgetRouter = require("./routes/widget.route");
// app.use(cors())

mongoose
  .connect(process.env.MONGO_CONNSTRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("successful mongo");
  })
  .catch((er) => {
    console.log("error in mongo");
    process.exit();
  });

app.get("/", (req, res) => {
  res.status(201).send(`running on ${process.env.PORT}`);
});
app.use("/api/auth", authRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/widget", widgetRouter);
app.listen(process.env.PORT, () => {
  console.log(`on Port ${process.env.PORT}`);
});

const errorHandler = (err, req, res, next) => {
  console.log({ err });
  return res.status(err.status || 500).json({ message: err.message });
};

app.use(errorHandler);
