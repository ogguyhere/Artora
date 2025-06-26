const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

//Routes 
app.use("/api/auth", require("./routes/auth-routes"));
app.use("/api/user", require("./routes/user-routes"));  
app.use("/api/artworks", require("./routes/artwork-routes"));

//DB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch((err) =>console.error("Db error: ", err));

//Server Start 
const PORT = process.env.PORT || 5000; 
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
