const mongoose = require("mongoose");

const eventRegistrationSchema = new mongoose.Schema(
    {
        studentName: {
            type: String,
            required: true
        },
        studentId: {
            type: String,
            required: true
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        email: {
            type: String,
            required: true
        },
        message: {
            type: String,
            required: true
        },
        clubId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Club",
            required: true
        },
        eventId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Club.events"
        },
        eventName: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending'
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("EventRegistration", eventRegistrationSchema);
