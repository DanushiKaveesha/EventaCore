const mongoose = require("mongoose");

const clubSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },

        description: {
            type: String,
            required: true
        },

        president: {
            type: String,
            required: true
        },

        category: {
            type: String,
            required: true
        },

        location: {
            type: String,
            required: true
        },

        contact_information: {
            type: String,
            required: true
        },

        image: {
            type: String,
            required: false
        },
        
        events: [
            {
                name: { type: String, required: true },
                date: { type: Date, required: true },
                startTime: { type: String, required: false },
                description: { type: String, required: true },
                location: { type: String, required: false }
            }
        ]

    },
    { timestamps: true }
);

module.exports = mongoose.model("Club", clubSchema);