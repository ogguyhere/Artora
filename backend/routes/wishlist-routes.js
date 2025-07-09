const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth-middleware"); // ✅ Destructure it properly
const wishlistController = require("../controllers/wishlist-controller");

// Example routes
router.get("/get", verifyToken, wishlistController.getWishlist);
router.post("/add", verifyToken, wishlistController.addToWishlist);
router.delete("/remove/:artworkId", verifyToken, wishlistController.removeFromWishlist);

module.exports = router;
