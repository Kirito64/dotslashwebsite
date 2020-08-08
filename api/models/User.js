const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    verified: Boolean,
    password: String,
    googleId: String,
    picture: String,
    language: String
});

const User = mongoose.model('user', userSchema);

module.exports = User;