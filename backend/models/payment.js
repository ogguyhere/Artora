const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    paymentStatus: { type: String, enum: ['success', 'failed', 'pending'], default: 'pending' },
    transactionId: String,
    method: String,
    paidAt: Date
});

module.exports = mongoose.model("Payment", paymentSchema);

