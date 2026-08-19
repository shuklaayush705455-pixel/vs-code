const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

// ✅ serve uploaded images
app.use("/uploads", express.static("uploads"));

mongoose.connect("mongodb://127.0.0.1:27017/farmDB")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.use("/auth", require("./routes/auth"));
app.use("/equipment", require("./routes/equipment"));

app.listen(5000, () => {
  console.log("Server running on port 5000");
});