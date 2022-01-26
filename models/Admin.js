const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
    // user profile data model 
    email: { 
        type: String, 
        required: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    role: { 
        type: String, 
        enum: ['admin', 'restricted'], 
        required: true },
    date: {
        type: Date,
        default: Date.now
    }
})


const Admin = mongoose.model('Admin', AdminSchema);

module.exports = Admin;