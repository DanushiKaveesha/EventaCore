const mongoose = require("mongoose");

const bookmarkSchema = new mongoose.Schema(
    {
        studentId: {
            type: String,
            required: true,
            default: 'ST12345' // Default mock user
        },
        clubId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Club",
            required: true
        }
    },
    { timestamps: true }
);

// Prevent duplicate bookmarks for the same club by the same user
bookmarkSchema.index({ studentId: 1, clubId: 1 }, { unique: true });

module.exports = mongoose.model("Bookmark", bookmarkSchema);
