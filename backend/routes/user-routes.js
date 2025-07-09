const express = require("express");
const { verifyToken } = require("../middleware/auth-middleware");
const router = express.Router();
const userController = require("../controllers/user-controller");
const upload = require("../middleware/profile");
const User = require("../models/user");
// Example protected route
router.get("/dashboard", verifyToken, (req, res) => {
  res.json({ msg: `Welcome ${req.user.role} - this is your dashboard.` });
});

router.get("/profile", verifyToken, userController.getProfile);
router.put("/profile", verifyToken, userController.updateProfile);


router.put(
  "/profile/picture",
  verifyToken,
  upload.single("profilePicture"),
  async (req, res) => {
    try {
      const profilePath = `/uploads/profiles/${req.file.filename}`;
      const user = await User.findByIdAndUpdate(
        req.user.id,
        { profilePicture: profilePath },
        { new: true }
      ).select("-password");
      res.json({ msg: "Profile picture updated", user });
    } catch (err) {
      res.status(500).json({ msg: "Upload failed", error: err.message });
    }
  }
);


module.exports = router;
