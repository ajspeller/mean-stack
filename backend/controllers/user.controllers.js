require("dotenv").config();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User.model");

exports.userControllers = {
  signup: (req, res, next) => {
    const { email, password } = req.body;
    bcrypt
      .hash(password, Number(process.env.SALT_OR_ROUNDS))
      .then((hash) => {
        const user = new User({ email, password: hash });
        return user.save();
      })
      .then((result) => {
        res.status(201).json({ message: "User Created", result });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ error: err });
      });
  },

  login: (req, res, next) => {
    const { email, password } = req.body;
    let fetchedUser;
    User.findOne({ email })
      .then((user) => {
        if (!user) {
          return res.status(401).json({ message: "Auth failed1" });
        }
        fetchedUser = user;
        return bcrypt.compare(password, user.password);
      })
      .then((result) => {
        if (!result) {
          return res.status(401).json({ message: "Auth failed2" });
        }
        const token = jwt.sign(
          { email, userId: fetchedUser._id },
          process.env.JWT_SECRET,
          { expiresIn: Number(process.env.ACCESS_TOKEN_EXPIRESIN) }
        );
        res.status(200).json({
          token,
          expiresIn: Number(process.env.ACCESS_TOKEN_EXPIRESIN),
        });
      })
      .catch((err) => {
        return res.status(401).json({ message: "Auth failed3", error: err });
      });
  },
};
