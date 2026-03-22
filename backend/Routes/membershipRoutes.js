const express = require("express");
const router = express.Router();
const membershipController = require("../Controllers/membershipController");
const upload = require("../middlewares/upload");

router.post("/", upload.single("paymentSlip"), membershipController.requestMembership);
router.get("/", membershipController.getAllMemberships);
router.get("/my-requests", membershipController.getMyRequests);
router.put("/:id", membershipController.updateRequest);
router.patch("/:id/payment-status", membershipController.updatePaymentStatus);
router.delete("/:id", membershipController.deleteRequest);

module.exports = router;
