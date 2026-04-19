const express = require("express");
const router = express.Router();
const bookmarkController = require("../Controllers/bookmarkController");

router.post("/toggle", bookmarkController.toggleBookmark);
router.get("/my-bookmarks", bookmarkController.getMyBookmarks);

module.exports = router;
