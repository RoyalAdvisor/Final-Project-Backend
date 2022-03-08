const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const userRoute = require("./routes/userRoute");
const postRoute = require("./routes/postRoute");
const authRoute = require("./routes/authRoute");
const commentRoute = require("./routes/commentRoute");

app.use(express.json());

mongoose.connect(process.env.connection, { useNewUrlParser: true }, () => {
  console.log("Connected to MongoDB database.");
});

app.use("/auth", authRoute);
app.use("/users", userRoute);
app.use("/posts", postRoute);
app.use("/posts", commentRoute);

app.get("/", (req, res) => {
  res.send("Rest API for The Random Blog.");
});
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is active on port ${port}`);
});
