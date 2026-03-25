import User from '../models/User.js';
import bcrypt from 'bcryptjs';

// Admin endpoint to manually create a new user bypassing self-registration
const createUser = async (req, res) => {
  try {
    const {
      username,
      email,
      passwordHash,
      role,
      firstName,
      lastName,
      contactNumber,
      address,
      profileImageURL,
      status,
    } = req.body;

    const newUser = await User.create({
      username,
      email,
      passwordHash,
      role,
      firstName,
      lastName,
      contactNumber,
      address,
      profileImageURL,
      status,
    });

    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Admin endpoint to fetch a list of all registered users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select(
        '_id username email role firstName lastName contactNumber profileImageURL status createdAt'
      )
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-passwordHash');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const updatedData = { ...req.body };

    if (updatedData.password) {
      const salt = await bcrypt.genSalt(10);
      updatedData.passwordHash = await bcrypt.hash(updatedData.password, salt);
      delete updatedData.password;
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
      runValidators: true,
    }).select('-passwordHash');

    if (!updatedUser) return res.status(404).json({ message: 'User not found' });

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Admin endpoint to dynamically activate, suspend, or deactivate a user
const updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['active', 'suspended', 'deactivated'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value.' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).select(
      '_id username email role firstName lastName contactNumber profileImageURL status createdAt'
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Fetch the currently authenticated user's profile data
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-passwordHash');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error('Get User Profile Error:', err);
    res.status(500).json({ error: err.message });
  }
};

// Allow the authenticated user to update their own profile details
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.firstName = req.body.firstName ?? user.firstName;
    user.lastName = req.body.lastName ?? user.lastName;
    user.dob = req.body.dob ?? user.dob;
    user.contactNumber = req.body.contactNumber ?? user.contactNumber;
    user.address = req.body.address ?? user.address;
    user.profileImageURL = req.body.profileImageURL ?? user.profileImageURL;

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      user.passwordHash = await bcrypt.hash(req.body.password, salt);
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      role: updatedUser.role,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      dob: updatedUser.dob,
      contactNumber: updatedUser.contactNumber,
      address: updatedUser.address,
      profileImageURL: updatedUser.profileImageURL,
      status: updatedUser.status,
    });
  } catch (err) {
    console.error('Update User Profile Error:', err);
    res.status(500).json({ error: err.message });
  }
};

const deleteOwnProfile = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.user._id);

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Your account has been removed permanently.' });
  } catch (err) {
    console.error('Delete Own Profile Error:', err);
    res.status(500).json({ error: err.message });
  }
};

export default {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  updateUserStatus,
  deleteUser,
  getUserProfile,
  updateUserProfile,
  deleteOwnProfile,
};