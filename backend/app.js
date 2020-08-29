require("./database/db");

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");

const postRoutes = require("./routes/post.routes");
const userRoutes = require("./routes/user.routes");

const { corsMiddleware } = require("./middleware/cors.middleware");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/images", express.static(path.join("backend/images")));

app.use(corsMiddleware.cors);

app.use("/api/posts", postRoutes);
app.use("/api/user", userRoutes);

module.exports = app;
