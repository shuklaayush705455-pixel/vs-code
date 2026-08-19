const express = require("express");
const router = express.Router();

const Equipment = require("../models/Equipment");
const Transaction = require("../models/Transaction");
const contract = require("../blockchain");

const multer = require("multer");

// ================= MULTER CONFIG =================
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

// ================= GET ALL =================
router.get("/", async (req, res) => {
  try {
    const data = await Equipment.find();
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Error fetching data" });
  }
});

// ================= ADD EQUIPMENT =================
router.post("/add", upload.single("image"), async (req, res) => {
  try {
    const item = new Equipment({
      name: req.body.name,
      price: req.body.price,
      owner: req.body.owner,
      image: req.file ? req.file.filename : ""
    });

    await item.save();
    res.json(item);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Error adding equipment" });
  }
});

// ================= DELETE =================
router.delete("/:id", async (req, res) => {
  try {
    await Equipment.findByIdAndDelete(req.params.id);
    res.json({ msg: "Deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Error deleting" });
  }
});

// ================= RENT =================
router.put("/rent/:id", async (req, res) => {
  try {
    const item = await Equipment.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ msg: "Item not found" });
    }

    item.status = "rented";
    item.rentedBy = req.body.user;

    await item.save();

    // MongoDB Transaction
    await Transaction.create({
      type: "rent",
      user: req.body.user,
      amount: item.price
    });

    // Blockchain (SAFE)
    try {
      await contract.addTransaction(req.body.user, "rent", item.price);
    } catch (err) {
      console.log("Blockchain error:", err.message);
    }

    res.json({ msg: "Rented Successfully" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Server error in rent" });
  }
});

// ================= BUY =================
router.put("/buy/:id", async (req, res) => {
  try {
    const item = await Equipment.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ msg: "Item not found" });
    }

    item.status = "sold";
    item.isSold = true;
    item.owner = req.body.user;

    await item.save();

    // MongoDB Transaction
    await Transaction.create({
      type: "buy",
      user: req.body.user,
      amount: item.price
    });

    // Blockchain (SAFE)
    try {
      await contract.addTransaction(req.body.user, "buy", item.price);
    } catch (err) {
      console.log("Blockchain error:", err.message);
    }

    res.json({ msg: "Bought Successfully" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Server error in buy" });
  }
});

// ================= TRANSACTIONS =================
router.get("/transactions", async (req, res) => {
  try {
    const data = await Transaction.find();
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Error fetching transactions" });
  }
});

module.exports = router;