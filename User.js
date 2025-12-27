// models/User.js
const mongoose = require("mongoose");

// Create schema (structure for MongoDB collection)
const userSchema = new mongoose.Schema({
  fname: {
    type: String,
    required: true
  },
  lname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true // no two users with same email
  },
  password: {
    type: String,
    required: true
  },
});

// Export model
module.exports = mongoose.model("User", userSchema);
