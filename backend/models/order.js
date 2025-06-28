const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    items: [
        {
            artwork: { type: mongoose.Schema.Types.ObjectId, ref: 'Artwork' },
            price: Number
        }
    ],
    totalAmount: Number,
    shippingAddress: {
        fullName: String,
        address: String,
        city: String,
        postalCode: String,
        country: String
    },
    status: { type: String, enum: ['pending', 'shipped', 'delivered'], default: 'pending' },
    orderedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Order", orderSchema);
