require('dotenv').config();
const express = require('express');
const { connect } = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth.js');
const productRoutes = require('./routes/product.js');

const connectToDB = async () => {
  try{
    await connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');
  } 
  catch(error){
    console.error('MongoDB Connection Error:', error);
  }
};

connectToDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));