const express = require("express");
const router = express.Router();

const clubController = require("../Controllers/clubController");
const upload = require("../middlewares/upload");

router.post("/", upload.single("image"), clubController.createClub);

router.post("/", clubController.createClub);

router.get("/", clubController.getAllClubs);

router.get("/:id", clubController.getClubById);

router.put("/:id", clubController.updateClub);

router.delete("/:id", clubController.deleteClub);

module.exports = router;