const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
    // vehicle profile data model 
    name: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true
    },
    year: {
        type: String,
        required: true
    },
    vin: {
        type: String, 
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})


const Vehicle = mongoose.model('Vehicle', vehicleSchema);

module.exports = Vehicle;