const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [
    {
      artwork: { type: mongoose.Schema.Types.ObjectId, ref: 'Artwork' },
      title: String,
      image: String,
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
  status: { type: String, enum: ['pending', 'shipped', 'delivered'], default: 'pending' }
}, {
  timestamps: true // ✅ createdAt and updatedAt are auto-managed
});

module.exports = mongoose.model("Order", orderSchema);
