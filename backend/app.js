const express = require("express");
const app = express();
const bodyParser = require("body-parser");

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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/api/posts", (req, res, next) => {
  const posts = [
    { id: 0, title: "post 1", content: "post 1 content" },
    { id: 1, title: "post 2", content: "post 2 content" },
    { id: 3, title: "post 3", content: "post 3 content" },
  ];
  res.status(200).json({ message: "get posts", posts });
});

app.post("/api/posts", (req, res, next) => {
  res.status(201).json({ message: "post added successfully" });
});

module.exports = app;
