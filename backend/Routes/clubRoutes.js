const express = require("express");
const router = express.Router();

const clubController = require("../Controllers/clubController");
const upload = require("../middlewares/upload");

router.post("/", upload.single("image"), clubController.createClub);

router.get("/", clubController.getAllClubs);

router.get("/:id", clubController.getClubById);

router.put("/:id", upload.single("image"), clubController.updateClub);

router.delete("/:id", clubController.deleteClub);

router.post("/:id/events", clubController.addEvent);

module.exports = router;