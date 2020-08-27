require("dotenv").config();

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const postRoutes = require("./routes/post.routes");

const { corsMiddleware } = require("./middleware/cors.middleware");

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

app.use(corsMiddleware.cors);

app.use("/api/posts", postRoutes);

module.exports = app;
