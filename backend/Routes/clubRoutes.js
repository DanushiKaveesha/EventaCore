const express = require("express");
const router = express.Router();

const clubController = require("../Controllers/clubController");
<<<<<<< HEAD
const upload = require("../middlewares/upload");

router.post("/", upload.single("image"), clubController.createClub);
=======

router.post("/", clubController.createClub);
>>>>>>> c2a0ea9ca9cdbaf69a3c34f73ada06cf37320e24

router.get("/", clubController.getAllClubs);

router.get("/:id", clubController.getClubById);

router.put("/:id", clubController.updateClub);

router.delete("/:id", clubController.deleteClub);

module.exports = router;