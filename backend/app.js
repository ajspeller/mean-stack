require("dotenv").config();

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const Post = require("./models/Post.model");

mongoose
  .connect(process.env.MONGO_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(`Database connection success!`);
  })
  .catch((err) => {
    console.log(`Database connection failure!`, err);
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  next();
});

app.get("/api/posts", (req, res, next) => {
  Post.find()
    .then((documents) => {
      res.status(200).json({ message: "get posts", posts: documents });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({ error: err });
    });
});

app.post("/api/posts", (req, res, next) => {
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
});

app.delete("/api/posts/:id", (req, res, next) => {
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
});

module.exports = app;
