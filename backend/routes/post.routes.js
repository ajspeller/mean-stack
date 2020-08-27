const express = require("express");
const router = express.Router();

const { postControllers } = require("../controllers/post.controllers");

router
  .get("/", postControllers.getAllPosts)
  .post("/", postControllers.createPost);

router
  .get("/:id", postControllers.getPostById)
  .put("/:id", postControllers.updatePostById)
  .delete("/:id", postControllers.deletePostById);

module.exports = router;
