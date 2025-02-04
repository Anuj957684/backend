const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const path = require('path');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cors());




const MONOGO_URL = process.env.MONOG_URI;

const userRoute = require('./routes/userRoutes.js');
const blogRoute = require('./routes/blogRoutes.js');





app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// DB Code
try {
  mongoose.connect(MONOGO_URL);
  console.log('Connected to MongoDB');
} catch (error) {
  console.log(error);
}

// Define routes
app.use('/api', userRoute);
app.use('/api', blogRoute);

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
