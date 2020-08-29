const express = require("express");
const router = express.Router();

const { postControllers } = require("../controllers/post.controllers");

const checkAuth = require("../middleware/check-auth");

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
};

const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(error, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(" ").join("-");
    const extention = MIME_TYPE_MAP[file.mimetype];
    console.log(Date.now());
    cb(null, name + "-" + Date.now() + "." + extention);
  },
});

router
  .get("/", postControllers.getAllPosts)
  .post(
    "/",
    checkAuth,
    multer({ storage: storage }).single("image"),
    postControllers.createPost
  );

router
  .get("/:id", postControllers.getPostById)
  .put(
    "/:id",
    checkAuth,
    multer({ storage: storage }).single("image"),
    postControllers.updatePostById
  )
  .delete("/:id", checkAuth, postControllers.deletePostById);

module.exports = router;
