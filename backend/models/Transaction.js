const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  type: String,
  user: String,
  amount: Number,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Transaction", schema);