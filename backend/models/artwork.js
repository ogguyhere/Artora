const mongoose = require('mongoose');

const artworkSchema = new mongoose.Schema({
  title: { type: String, required: true },
  imageUrl: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  artist: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // 'User' instead of 'Artist'
  status: { type: String, enum: ["sold", "available"], default: "available" }, // fixed enum typo
  date: { type: Date, default: Date.now },
  publishingstatus: { type: String, enum: ["scheduled", "published"], default: "published" }
}, {
  timestamps: true
});

module.exports = mongoose.model("Artwork", artworkSchema);
