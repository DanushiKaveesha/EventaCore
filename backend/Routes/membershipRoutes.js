const express = require("express");
const router = express.Router();
const membershipController = require("../Controllers/membershipController");

router.post("/", membershipController.requestMembership);
router.get("/my-requests", membershipController.getMyRequests);
router.put("/:id", membershipController.updateRequest);
router.delete("/:id", membershipController.deleteRequest);

module.exports = router;
