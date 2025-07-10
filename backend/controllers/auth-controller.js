
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    if (!name || !email || !password) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: "Email already in use" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      profilePicture: req.file ? `/uploads/profile/${req.file.filename}` : undefined
    });

    await newUser.save();
    res.status(201).json({ msg: "Registered successfully!" });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};


const login = async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ msg: "User not found" });
  
      const match = await bcrypt.compare(password, user.password);
      if (!match) return res.status(401).json({ msg: "Invalid credentials" });
  
      const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
  
      res.json({ token, user: { id: user._id, name: user.name, role: user.role, email:user.email, profilePicture:user.profilePicture } });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
};

module.exports = { register, login };
