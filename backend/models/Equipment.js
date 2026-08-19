const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: String,
  price: Number,
  owner: String,
  image: String, // ✅ image added
  status: { type: String, default: "available" },
  rentedBy: { type: String, default: "" },
  isSold: { type: Boolean, default: false }
});

module.exports = mongoose.model("Equipment", schema);