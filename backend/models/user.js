
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name : String,
    email : {type:String, required:true, unique:true},
    password : {type:String, required:true},
    role : {type:String, enum:["artist", "buyer", "admin"], default:"buyer"}, 
    profilePicture : String,
    address : String,
    contact_number : String, 
}, 
{timestamps : true});

module.exports = mongoose.model("User", userSchema);