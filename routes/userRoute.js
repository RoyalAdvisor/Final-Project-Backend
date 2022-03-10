const dotenv = require("dotenv");
dotenv.config();
const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const user = require("../models/userModel");
const verify = require("../middleware/verify");
const { retrieveUser } = require("../middleware/retriever.js");
const verifyAcc = require("../middleware/authJWT");

//Register

router.post("/signup", verify, async (req, res) => {
  try {
    const passEncryption = bcrypt.hashSync(req.body.password, 8);
    const newUser = new user({
      username: req.body.username,
      email: req.body.email,
      password: passEncryption,
    });
    await newUser.save();
    res.status(200).send({ message: "Successfully created new user" });
  } catch (error) {
    res.status(500).send({ message: "Error creating new user" });
  }
});

//Login

router.post("/signin", async (req, res) => {
  try {
    const verifyEmail = user.findOne({ email: req.body.email }, (err, user) => {
      if (!verifyEmail) return res.status(401).send({ message: err.message });
      if (!user) return res.sendStatus(404);
      const passMatch = bcrypt.compareSync(req.body.password, user.password);
      if (!passMatch) return res.sendStatus(404);
      const authToken = jwt.sign({ _id: user._id }, process.env.access);
      if (!authToken) return res.sendStatus(401);
      res.header("auth-token", authToken).send({
        _id: user._id,
        username: user.username,
        email: user.email,
        access: authToken,
      });
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

//Update

router.put("/:id", [verifyAcc, retrieveUser], async (req, res) => {
  if (req.body.username != null) res.user.username = req.body.username;
  if (req.body.email != null) res.user.email = req.body.email;
  if (req.body.password != null) res.user.password = req.body.password;
  try {
    const updateUser = await res.user.save();
    res.status(200).send({ message: "User updated successfully." });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

//Delete

router.delete("/:id", [verifyAcc, retrieveUser], async (req, res) => {
  try {
    await res.user.remove();
    res.status(200).send({ message: "User deleted successfully." });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

module.exports = router;
