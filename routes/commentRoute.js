const router = require("express").Router();
const dotenv = require("dotenv");
dotenv.config();
const post = require("../models/postModel");
const user = require("../models/userModel");
const comment = require("../models/commentModel");
const verifyAcc = require("../middleware/authJWT");
const { retrievePost } = require("../middleware/retriever");
const jwt = require("jsonwebtoken");

router.get("/:id/comments", [verifyAcc, retrievePost], (req, res) => {
  return res.send(res.post.comments);
});

router.post(
  "/:id/comments/create",
  [verifyAcc, retrievePost],
  async (req, res) => {
    let newComment = new comment({
      content: req.body.content,
    });
    let comments = res.post.comments;
    let addedToComments = false;
    if (!addedToComments) comments.push(newComment);
    try {
      const updatedPost = res.post.save(comments);
      res.status(200).send({ message: "Comment created" });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  }
);

router.delete(
  "/:id/comments/delete",
  [verifyAcc, retrievePost],
  async (req, res) => {
    let comments = res.post.comments;
    try {
      res.status(200).send({ message: "Comments deleted successfully." });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  }
);
module.exports = router;
