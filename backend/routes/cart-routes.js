const express = require("express");
const router = express.Router();
const Cart = require("../models/cart");

router.post("/add", async (req, res) => {
  try {
    const { userId, artworkId, quantity = 1 } = req.body;

    if (!userId || !artworkId) {
      return res.status(400).json({ error: "Missing userId or artworkId" });
    }

    // 1. Find existing cart for this user
    let cart = await Cart.findOne({ user: userId });

    // 2. If not found, create one
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    // 3. Check if item already exists
    const existingItem = cart.items.find(
      (item) => item.artwork.toString() === artworkId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ artwork: artworkId, quantity });
    }

    // 4. Save the updated cart
    await cart.save();

    res.status(200).json({ message: "Item added to cart", cart });

  } catch (err) {
    console.error("Error in cart/add:", err);
    res.status(500).json({ error: "Failed to add to cart" });
  }
});
// GET /api/cart/:userId
router.get('/:userId', async (req, res) => {
  const cart = await Cart.findOne({ user: req.params.userId }).populate('items.artwork');
  res.json(cart);
});
router.post('/remove', async (req, res) => {
  const { userId, artworkId } = req.body;

  let cart = await Cart.findOne({ user: userId });
  if (!cart) return res.status(404).json({ error: "Cart not found" });

  cart.items = cart.items.filter(item => item.artwork.toString() !== artworkId);
  await cart.save();

  const updated = await cart.populate('items.artwork');
  res.json({ message: "Item removed", cart: updated });
});

module.exports = router;
