const express = require("express");
const router = express.Router();
const userController = require("../Controllers/UserController");
const { protect } = require("../Middleware/authMiddleware");

// ─── Stats (Admin) — before /:userId ─────────────────────────────────────────
router.get("/stats", userController.getUserStats);

// ─── Profile Routes ───────────────────────────────────────────────────────────
router.get("/profile", protect, userController.getUserProfile);
router.put("/profile", protect, userController.updateUserProfile);
router.patch("/profile/deactivate", protect, userController.deactivateCurrentUser);

// ─── Get All Users (Admin) ────────────────────────────────────────────────────
router.get("/", userController.getAllUsers);

// ─── Create / Register User ───────────────────────────────────────────────────
router.post("/", userController.createUser);

// ─── Get Single User ──────────────────────────────────────────────────────────
router.get("/:userId", userController.getUserById);

// ─── Update User Profile ──────────────────────────────────────────────────────
router.put("/:userId", userController.updateUser);

// ─── Change Password ──────────────────────────────────────────────────────────
router.put("/:userId/change-password", userController.changePassword);

// ─── Toggle Active/Inactive (Admin) ──────────────────────────────────────────
router.patch("/:userId/toggle-status", userController.toggleUserStatus);

// ─── Update Role (Admin) ──────────────────────────────────────────────────────
router.patch("/:userId/role", userController.updateUserRole);

// ─── Delete User (Admin) ──────────────────────────────────────────────────────
router.delete("/:userId", userController.deleteUser);

module.exports = router;
