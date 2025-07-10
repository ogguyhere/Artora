const express = require("express");
const {register, login} = require ("../controllers/auth-controller");
const router = express.Router();
const multer = require("multer");
const path = require("path");

// Setup multer
const fs = require("fs");
const uploadDir = path.join(__dirname, "..", "uploads", "profile");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName); // ✅ make sure this is inside the function
  }
});

const upload = multer({ storage });
router.post("/register", upload.single("profilePicture"),register);
router.post("/login",login);

module.exports = router; 