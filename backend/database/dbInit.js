require('dotenv').config()
const mongoose = require('mongoose');

const connectDB = async () =>{
    try {
        mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB database');
        } catch (error) {
        console.log(`Error in MongoDB ${error}`);
        }
    };

module.exports = { connectDB };