const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullName: {type: String, required: true},
  displayName: {type: String, required: true},
  gender: {type: String, enum:['male', 'female']},
  dev: {type: String},
  role: {type: String, enum:['admin', 'user', 'committee'], default:"user"}
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
