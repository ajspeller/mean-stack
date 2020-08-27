const Post = require("../models/Post.model");

exports.postControllers = {
  getAllPosts: (req, res, next) => {
    Post.find()
      .then((documents) => {
        res.status(200).json({ message: "get posts", posts: documents });
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json({ error: err });
      });
  },
  getPostById: (req, res, next) => {
    const { id } = req.params;
    Post.findById(id)
      .then((post) => {
        console.log(post);
        res.status(200).json({ message: "get post by id", post: post });
      })
      .catch((err) => {
        res.status(400).json({ error: err });
      });
  },
  createPost: (req, res, next) => {
    const { title, content } = req.body;
    const newPost = new Post({ title, content });
    newPost
      .save()
      .then((post) => {
        console.log(post);
        res.status(201).json({ message: "post added successfully", post });
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json({ error: err });
      });
  },
  updatePostById: (req, res, next) => {
    const { id } = req.params;
    const { title, content } = req.body;
    const post = new Post({ _id: id, title, content });
    Post.updateOne({ _id: id }, post)
      .then((document) => {
        console.log(document);
        res
          .status(200)
          .json({ message: "updated successfully", post: document });
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json({ error: err });
      });
  },
  deletePostById: (req, res, next) => {
    const { id } = req.params;
    Post.deleteOne({ _id: id })
      .then((result) => {
        console.log(result);
        res.status(200).json({ message: "Post deleted" });
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json({ error: err });
      });
  },
};
