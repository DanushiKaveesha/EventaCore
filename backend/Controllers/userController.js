const User = require("../Models/User");
const bcrypt = require("bcryptjs");

// ─── GET ALL USERS (Admin) ────────────────────────────────────────────────────
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── GET SINGLE USER ──────────────────────────────────────────────────────────
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── CREATE USER (Register) ───────────────────────────────────────────────────
const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required." });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: "A user with this email already exists." });
    }

    const newUser = new User({ name, email, password, role: role || "Student" });
    const saved = await newUser.save();

    const { password: _, ...userWithoutPassword } = saved.toObject();
    res.status(201).json(userWithoutPassword);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── UPDATE USER ──────────────────────────────────────────────────────────────
const updateUser = async (req, res) => {
  try {
    const { name, email, role, isActive } = req.body;

    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (name !== undefined)     user.name = name;
    if (email !== undefined)    user.email = email.toLowerCase();
    if (role !== undefined)     user.role = role;
    if (isActive !== undefined) user.isActive = isActive;

    const updated = await user.save();
    const { password: _, ...userWithoutPassword } = updated.toObject();
    res.status(200).json(userWithoutPassword);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── CHANGE PASSWORD ──────────────────────────────────────────────────────────
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) return res.status(401).json({ message: "Current password is incorrect." });

    user.password = newPassword;
    await user.save();
    res.status(200).json({ message: "Password updated successfully." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── TOGGLE ACTIVE STATUS (Admin) ────────────────────────────────────────────
const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isActive = !user.isActive;
    await user.save();
    res.status(200).json({ message: `User ${user.isActive ? "activated" : "deactivated"} successfully.`, isActive: user.isActive });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── UPDATE ROLE (Admin) ─────────────────────────────────────────────────────
const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const validRoles = ["Student", "Organizer", "Admin"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: `Invalid role. Must be one of: ${validRoles.join(", ")}` });
    }

    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { role },
      { new: true, select: "-password" }
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── DELETE USER (Admin) ─────────────────────────────────────────────────────
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User deleted successfully." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── GET USER PROFILE ─────────────────────────────────────────────────────────
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password -passwordHash");
    if (!user) return res.status(404).json({ message: "User not found" });

    const obj = user.toObject();
    obj.name = obj.firstName && obj.lastName ? `${obj.firstName} ${obj.lastName}` : (obj.username || obj.name || 'Unknown');

    res.status(200).json(obj);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── UPDATE USER PROFILE ──────────────────────────────────────────────────────
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { name, firstName, lastName, email, contactNumber, address, dob, profileImageURL, username, password } = req.body;

    if (name !== undefined) user.name = name;
    if (username !== undefined) user.username = username;

    let passwordChanged = false;
    if (password !== undefined && password !== '') {
      user.password = password;
      passwordChanged = true;
    }

    if (firstName !== undefined) user.firstName = firstName;
    if (lastName !== undefined) user.lastName = lastName;
    if (email !== undefined) user.email = email.toLowerCase();
    if (contactNumber !== undefined) user.contactNumber = contactNumber;
    if (address !== undefined) user.address = address;
    if (dob !== undefined) user.dob = dob;
    if (profileImageURL !== undefined) user.profileImageURL = profileImageURL;

    const updatedUser = await user.save();

    const obj = updatedUser.toObject();
    delete obj.password;
    delete obj.passwordHash;
    obj.name = obj.firstName && obj.lastName ? `${obj.firstName} ${obj.lastName}` : (obj.username || obj.name || 'Unknown');

    res.status(200).json(obj);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── DEACTIVATE OWN ACCOUNT ────────────────────────────────────────────────────
const deactivateCurrentUser = async (req, res) => {
  try {
    // req.user is populated by the 'protect' middleware
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized to perform this action." });
    }

    const user = await User.findByIdAndDelete(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User account not found." });
    }

    res.status(200).json({ message: "Your account has been deleted successfully." });
  } catch (err) {
    console.error('Account deletion error:', err);
    res.status(500).json({ message: err.message || "Failed to delete account due to server error." });
  }
};

// ─── USER STATS (Admin Dashboard) ────────────────────────────────────────────
const getUserStats = async (req, res) => {
  try {
    const total = await User.countDocuments();
    const active = await User.countDocuments({ isActive: true });
    const byRole = await User.aggregate([
      { $group: { _id: "$role", count: { $sum: 1 } } }
    ]);
    res.status(200).json({ total, active, inactive: total - active, byRole });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  getUserProfile,
  updateUserProfile,
  createUser,
  updateUser,
  changePassword,
  toggleUserStatus,
  updateUserRole,
  deleteUser,
  getUserStats,
  deactivateCurrentUser,
};
