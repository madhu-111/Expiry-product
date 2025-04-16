const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const Seller = require('../models/Seller');
const auth = require('../middleware/auth'); // Import auth middleware

const router = express.Router();

// Multer setup for file uploads
const storage = multer.memoryStorage(); // optionally change to disk storage
const upload = multer({ storage });

// Register Seller
router.post('/register', upload.single('shopImage'), async (req, res) => {
    const { shopName, sellerName, shopDescription, location, contact, email, category, password } = req.body;

    try {
        const existingSeller = await Seller.findOne({ email });
        if (existingSeller) {
            return res.status(400).json({ message: 'Seller already registered' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newSeller = new Seller({
            shopName,
            sellerName,
            shopDescription,
            location,
            contact,
            email,
            category,
            password: hashedPassword,
            shopImage: req.file ? req.file.path : 'uploads/default-shop.jpg'
        });

        await newSeller.save();
        res.status(201).json({ message: 'Seller registered successfully' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
});

// Login Seller
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        let seller = await Seller.findOne({ email });
        if (!seller) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, seller.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const payload = {
            seller: {
                id: seller.id
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '5 days' },
            (err, token) => {
                if (err) throw err;
                res.json({
                    token,
                    seller: {
                        id: seller._id,
                        sellerName: seller.sellerName,
                        shopName: seller.shopName,
                        email: seller.email,
                        shopImage: seller.shopImage,
                        location: seller.location,
                        contact: seller.contact
                    }
                });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get seller profile
router.get('/me', auth, async (req, res) => {
    try {
        const seller = await Seller.findById(req.seller.id).select('-password');

        if (!seller) {
            return res.status(404).json({ message: 'Seller not found' });
        }

        res.json(seller);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
