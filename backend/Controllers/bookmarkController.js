const Bookmark = require("../Models/bookmarkModel");

exports.toggleBookmark = async (req, res) => {
    try {
        const { clubId } = req.body;
        // In reality, this would be extraced from an auth token (e.g. req.user.studentId)
        const studentId = 'ST12345'; 

        const existingBookmark = await Bookmark.findOne({ studentId, clubId });

        if (existingBookmark) {
            // Un-bookmark
            await Bookmark.findByIdAndDelete(existingBookmark._id);
            return res.status(200).json({ message: "Bookmark removed", bookmarked: false });
        } else {
            // Bookmark
            const newBookmark = new Bookmark({ studentId, clubId });
            await newBookmark.save();
            return res.status(201).json({ message: "Bookmark added", bookmarked: true });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getMyBookmarks = async (req, res) => {
    try {
        const studentId = 'ST12345'; // Extracted from session
        
        // Find bookmarks and populate the club details natively
        const bookmarks = await Bookmark.find({ studentId }).populate('clubId');
        
        res.status(200).json(bookmarks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
