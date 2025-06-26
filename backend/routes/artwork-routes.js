const express = require("express");
const router = express.Router();
const Artwork = require("../models/artwork");
const { verifyToken } = require("../middleware/auth-middleware");

// Upload new artwork (by artist)
router.post("/upload", verifyToken, async (req, res) => {
  try {
    const { title, imageUrl, description, price, publishingstatus } = req.body;

    const newArt = new Artwork({
      title,
      imageUrl,
      description,
      price,
      artist: req.user.id,  // this comes from verifyToken
      publishingstatus,
    });

    await newArt.save();
    res.status(201).json({ msg: "Artwork uploaded successfully", artwork: newArt });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Get all artworks (admin use)
router.get("/", async (req, res) => {
  try {
    const artworks = await Artwork.find().populate("artist", "name email role");
    res.json(artworks);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Get artworks of logged-in artist
router.get("/my-artworks", verifyToken, async (req, res) => {
  try {
    const artworks = await Artwork.find({ artist: req.user.id });
    res.json(artworks);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Get scheduled artworks
router.get("/scheduled", async (req, res) => {
  try {
    const scheduled = await Artwork.find({ publishingstatus: "scheduled" });
    res.json(scheduled);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
