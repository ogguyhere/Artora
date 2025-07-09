const Wishlist = require('../models/wishlist');
const Artwork = require('../models/artwork');

exports.getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user.id }).populate('artworks');
    res.json(wishlist ? wishlist.artworks : []);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching wishlist" });
  }
};

exports.addToWishlist = async (req, res) => {
  try {
    const { artworkId } = req.body;
    console.log("Received artworkId:", artworkId); // Log incoming data
    let wishlist = await Wishlist.findOne({ user: req.user.id });

    if (!wishlist) {
      wishlist = new Wishlist({ user: req.user.id, artworks: [artworkId] });
    } else if (!wishlist.artworks.includes(artworkId)) {
      wishlist.artworks.push(artworkId);
    }

    await wishlist.save();
    res.json({ msg: "Added to wishlist" });
  } catch (err) {
    console.error("Error adding to wishlist:", err); // Log real error
    res.status(500).json({ msg: "Error adding to wishlist" });
  }
};


exports.removeFromWishlist = async (req, res) => {
  try {
    const { artworkId } = req.params;
    const wishlist = await Wishlist.findOne({ user: req.user.id });

    if (wishlist) {
      wishlist.artworks = wishlist.artworks.filter(id => id.toString() !== artworkId);
      await wishlist.save();
    }

    res.json({ msg: "Removed from wishlist" });
  } catch (err) {
    res.status(500).json({ msg: "Error removing from wishlist" });
  }
};
