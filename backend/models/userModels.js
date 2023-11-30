//userModels.js
const mongoose = require('mongoose');

const userDatabase = new mongoose.Schema({
firstName: {
    type: String,
    required: true,
},
lastName: {
    type: String,
    required: true,
},
email: {
    type: String,
    required: true,
    unique: true,
},
password: {
    type: String,
    required: true,
},
teamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team', // This should match the model name of your Team model
},
profileImage: {
    type: String, // Assuming you store the image URI as a string
},
}, {timestamps: true});

module.exports = mongoose.model('User', userDatabase);
