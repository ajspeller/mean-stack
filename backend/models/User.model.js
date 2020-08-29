const uniqueValidator = require("mongoose-unique-validator");

const mongoose = require("mongoose");
const { Schema } = mongoose;


const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

UserSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", UserSchema);
