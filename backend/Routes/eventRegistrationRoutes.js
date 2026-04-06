const express = require("express");
const router = express.Router();
const eventRegistrationController = require("../Controllers/eventRegistrationController");

router.post("/", eventRegistrationController.registerForEvent);
router.get("/", eventRegistrationController.getAdminEventRequests);
router.get("/my-requests", eventRegistrationController.getMyEventRequests);
router.put("/:id", eventRegistrationController.updateEventRequestStatus);
router.delete("/:id", eventRegistrationController.deleteEventRequest);

module.exports = router;
