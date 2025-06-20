
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) =>
{
    const { name, email, password, role } = req.body;
    try{
        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({msg: "User alr exists"});

        const hash = await bcrypt.hash(password,10);
        const newUser = new User({name, email, password: hash, role});
        await newUser.save();
        res.status(201).json({msg:"User created"});
    }
    catch(err){
        res.status(500).json({msg: err.message});
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ msg: "User not found" });
  
      const match = await bcrypt.compare(password, user.password);
      if (!match) return res.status(401).json({ msg: "Invalid credentials" });
  
      const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
  
      res.json({ token, user: { id: user._id, name: user.name, role: user.role } });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
};