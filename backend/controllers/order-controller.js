const Order = require("../models/order");
const Artwork = require("../models/artwork");
const Cart = require("../models/cart");

 
exports.createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { items, totalAmount } = req.body;

    const orderItems = [];

    // 1. Check availability & prepare order items
    for (const item of items) {
      const artwork = await Artwork.findById(item.productId);

      if (!artwork || artwork.status === "sold") {
        return res.status(400).json({ msg: `Artwork '${item.title}' is already sold.` });
      }

      // push detailed item to order
      orderItems.push({
        artwork: artwork._id,
        title: artwork.title,
        image: artwork.imageUrl,
        price: artwork.price
      });

      // Mark artwork as sold
      await Artwork.findByIdAndUpdate(artwork._id, { status: "sold" });
    }

    // 2. Create and save the order
    const order = new Order({
      user: userId,
      items: orderItems,
      totalAmount
      // No need for createdAt — use timestamps in schema
    });
    await order.save();

    // 3. Remove ordered artworks from user's cart
    const userCart = await Cart.findOne({ user: userId });
    if (userCart) {
      userCart.items = userCart.items.filter(cartItem =>
        !orderItems.some(orderItem => orderItem.artwork.toString() === cartItem.artwork.toString())
      );
      await userCart.save();
    }

    return res.status(201).json({ msg: "Order placed successfully!", order });

  } catch (err) {
    console.error("Order creation failed:", err);
    return res.status(500).json({ msg: "Server error during order creation." });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch orders" });
  }
};
