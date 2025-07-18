const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
        {
            artwork: { type: mongoose.Schema.Types.ObjectId, ref: 'Artwork',require:true },
            quantity: { type: Number, default: 1 }
        }
    ]
});


module.exports = mongoose.model("Cart", cartSchema);
