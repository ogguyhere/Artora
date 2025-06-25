const express = require("express");
const { verifyToken } = require("../middleware/auth-middleware");
const router = express.Router();

// Example protected route
router.get("/dashboard", verifyToken, (req, res) => {
  res.json({ msg: `Welcome ${req.user.role} - this is your dashboard.` });
});

module.exports = router;
