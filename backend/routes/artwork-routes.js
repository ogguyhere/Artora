const express = require("express");
const router = express.Router();
const Artwork = require("../models/artwork");
const { verifyToken } = require("../middleware/auth-middleware");
const multer = require("multer");
const path = require("path");

// === Multer Setup for Local Upload ===
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // save in /uploads folder
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// === Upload new artwork ===
router.post("/upload", verifyToken, upload.single("artwork"), async (req, res) => {
  try {
    const { title, description, price, publishingstatus } = req.body;

    const newArt = new Artwork({
      title,
      description,
      price,
      publishingstatus,
      imageUrl: `/uploads/${req.file.filename}`,
      artist: req.user.id,
    });

    await newArt.save();
    res.status(201).json({ msg: "Artwork uploaded successfully", artwork: newArt });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// === Get all artworks for admin or public feed ===
router.get("/", async (req, res) => {
  try {
    const artworks = await Artwork.find().populate("artist", "name email role");
    res.json(artworks);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// === Get artworks for logged-in artist ===
router.get("/my-artworks", verifyToken, async (req, res) => {
  try {
    const artworks = await Artwork.find({ artist: req.user.id });
    res.json(artworks);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// === Update specific artwork (artist only) ===
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.id);
    if (!artwork) return res.status(404).json({ msg: "Artwork not found" });

    if (artwork.artist.toString() !== req.user.id)
      return res.status(403).json({ msg: "Unauthorized" });

    const { title, description, price, publishingstatus, status } = req.body;

    // Optional updates
    if (title) artwork.title = title;
    if (description) artwork.description = description;
    if (price) artwork.price = price;
    if (publishingstatus) artwork.publishingstatus = publishingstatus;
    if (status) artwork.status = status;

    await artwork.save();
    res.json({ msg: "Artwork updated", artwork });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// === Delete specific artwork ===
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.id);
    if (!artwork) return res.status(404).json({ msg: "Artwork not found" });

    if (artwork.artist.toString() !== req.user.id)
      return res.status(403).json({ msg: "Unauthorized" });

    await artwork.deleteOne();
    res.json({ msg: "Artwork deleted" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
