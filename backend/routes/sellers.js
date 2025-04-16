// routes/sellers.js
router.post('/register', async (req, res) => {
    const { shopName, sellerName, shopDescription, location, contact, email, category, password } = req.body;

    try {
        // Check if the seller already exists
        const existingSeller = await Seller.findOne({ email });
        if (existingSeller) {
            return res.status(400).json({ message: 'Seller already exists' });
        }

        // Create new seller
        const seller = new Seller({
            shopName,
            sellerName,
            shopDescription,
            location,
            contact,
            email,
            category,
            password: await bcrypt.hash(password, 10) // Hash the password before saving
        });

        await seller.save();
        
        res.status(201).json({ message: 'Seller registered successfully' });
    } catch (error) {
        console.error('Error registering seller:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
