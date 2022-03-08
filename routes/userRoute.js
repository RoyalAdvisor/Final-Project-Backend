const dotenv = require("dotenv");
dotenv.config();
const router = require("express").Router();
const { retrieveUser } = require("../middleware/retriever.js");
const verifyAcc = require("../middleware/authJWT");

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

router.delete("/:id", [verifyAcc, retrieveUser], async (req, res) => {
  try {
    await res.user.remove();
    res.status(200).send({ message: "User deleted successfully." });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

module.exports = router;
