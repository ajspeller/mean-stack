require("dotenv").config();

const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGO_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log(`Database connection success!`);
  })
  .catch((err) => {
    console.log(`Database connection failure!`, err);
  });
