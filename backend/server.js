const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config');
const sellerRoutes = require('./routes/sellerRoutes');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/sellers', sellerRoutes);

app.get('/api', (req, res) => {
    res.send('API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});