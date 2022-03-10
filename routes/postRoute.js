const router = require("express").Router();
const post = require("../models/postModel");
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
        .send({ message: "You are not authorized to edit this post." });
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

module.exports = router;
