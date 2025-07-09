const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const adminRoutes = require('./routes/admin-routes');
const wishlistRoutes = require('./routes/wishlist-routes');
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

//Routes 
app.use("/api/auth", require("./routes/auth-routes"));
app.use("/api/user", require("./routes/user-routes"));  
const fs = require("fs");
const uploadsDir = path.join(__dirname, "uploads");

app.use("/uploads", express.static(uploadsDir));
app.use("/api/artworks", require("./routes/artwork-routes"));
app.use("/api/cart", require("./routes/cart-routes"));
app.use('/api/admin', adminRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/uploads/pro', express.static('uploads'));
//DB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch((err) =>console.error("Db error: ", err));

//Server Start 
const PORT = process.env.PORT || 5000; 
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
