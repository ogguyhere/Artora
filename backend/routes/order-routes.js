const express = require("express");
const { createOrder, getUserOrders } = require("../controllers/order-controller");
const { verifyToken } = require("../middleware/auth-middleware");

const router = express.Router();

// 🛒 Place a new order
router.post("/", verifyToken, createOrder);

// 📜 Get all orders of the logged-in user
router.get("/my-orders", verifyToken, getUserOrders);

module.exports = router;
