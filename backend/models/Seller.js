const mongoose = require('mongoose');

const sellerSchema = new mongoose.Schema({
    shopName: String,
    sellerName: String,
    shopDescription: String,
    location: String,
    contact: String,
    email: { type: String, unique: true },
    category: String,
    password: String,
    shopImage: String
}, {
    timestamps: true
});

module.exports = mongoose.model('Seller', sellerSchema);
