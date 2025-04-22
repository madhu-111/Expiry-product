const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  category: { type: String, required: true },
  image: { type: String, required: true }, // Path to the uploaded image
  expiryDate: { type: Date, required: true },
  sellerId: { type: String, required: true },
  sellerName: { type: String, required: true },
  sellerLocation: { type: String, required: true }
});

module.exports = mongoose.model('Product', productSchema);