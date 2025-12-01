const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
    eventId: {
        type: String,
        required: true
    },
    summary: {
        type: String,
        required: false
    },
    description: {
        type: String,
        required: false
    },
    creator: {
        type: String, 
        required: true,
    },
    status: {
        type: String,
        required: true
    },
    startTime: {
        type: String,
        required: true,
    },
    endTime: {
        type: String,
        required: true
    },
    created: {
        type: String,
        required: true
    },
    updated: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Event', EventSchema);