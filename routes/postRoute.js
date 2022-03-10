const router = require("express").Router();
const post = require("../models/postModel");
const user = require("../models/userModel");
const comment = require("../models/commentModel");
const { retrievePost } = require("../middleware/retriever");
const { retrieveUser } = require("../middleware/retriever");
const verifyAcc = require("../middleware/authJWT");
const dotenv = require("dotenv");
dotenv.config();

//Blog posts

router.get("/", verifyAcc, async (req, res) => {
  try {
    const posts = await post.find();
    res.send(posts);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

router.get("/:id", [verifyAcc, retrievePost], (req, res) => {
  res.send(res.post);
});

router.post("/", [verifyAcc, retrieveUser], async (req, res) => {
  let userName = res.user.username;
  const newPost = new post({
    main_image: req.body.main_image,
    title: req.body.title,
    subtitle: req.body.subtitle,
    catergory: req.body.catergory,
    desc: req.body.desc,
    created_by: userName,
  });
  try {
    await newPost.save();
    res.status(200).send(newPost);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

router.put(
  "/:id",
  [verifyAcc, retrievePost, retrieveUser],
  async (req, res) => {
    if (res.user.username !== res.post.created_by) {
      return res
        .status(401)
        .send({ message: "You are not authorized to delete this post." });
    }
    if (req.body.main_image != null) res.post.main_image = req.body.main_image;
    if (req.body.title != null) res.post.title = req.body.title;
    if (req.body.subtitle != null) res.post.subtitle = req.body.subtitle;
    if (req.body.catergory != null) res.post.catergory = req.body.catergory;
    if (req.body.desc != null) res.post.desc = req.body.desc;
    if (req.body.created_by != null) res.post.created_by = res.user.username;
    try {
      const updatedPost = await res.post.save();
      res.send(updatedPost);
    } catch (error) {
      res.status(400).send({ message: error.message });
    }
  }
);

router.delete(
  "/:id",
  [verifyAcc, retrievePost, retrieveUser],
  async (req, res) => {
    if (res.user.username !== res.post.created_by) {
      return res
        .status(401)
        .send({ message: "You are not authorized to delete this post." });
    }
    try {
      await res.post.remove();
      res.status(200).send({ message: "Post deleted successfully." });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  }
);

//Comment Section

router.get("/:id/comments", [verifyAcc, retrievePost], (req, res) => {
  return res.send(res.post.comments);
});

router.post(
  "/:id/comments/create",
  [verifyAcc, retrievePost, retrieveUser],
  async (req, res) => {
    let userName = res.user.username;
    let newComment = new comment({
      content: req.body.content,
      posted_by: userName,
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
    let commentList = res.post.comments;
    let index = commentList
      .forEach((comment) => {
        console.log(comment._id);
      })
      .indexOf(comment._id);
    try {
      commentList.splice(index, 1);
      console.log(commentList);
      const updatedPost = res.post.save(commentList);
      res.status(200).send({ message: "Comment deleted successfully." });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  }
);

module.exports = router;
