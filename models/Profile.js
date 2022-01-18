const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
    // user profile data model 
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    contact: {
        type: String,
        required: true
    },
    id: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})


const Profile = mongoose.model('Profile', ProfileSchema);

module.exports = Profile;