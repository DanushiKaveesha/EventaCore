const mongoose = require("mongoose");

const membershipSchema = new mongoose.Schema(
    {
        clubId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Club',
            required: true
        },
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
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending'
        },
        bankName: {
            type: String,
            required: true
        },
        branchName: {
            type: String,
            required: true
        },
        paymentSlip: {
            type: String,
            required: true
        },
        paymentStatus: {
            type: String,
            enum: ['pending', 'verified', 'rejected'],
            default: 'pending'
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Membership", membershipSchema);
