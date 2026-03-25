import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  passwordHash: { type: String, required: true },
  role: {
    type: String,
    enum: ['admin', 'coach', 'technician', 'customer','coaching_manager' ,'order_manager', 'ground_manager', 'service_manager', 'delivery_staff'],
    default: 'customer',
  },
  firstName: String,
  lastName: String,
  contactNumber: String,
  address: String,
  profileImageURL: String,
  status: {
    type: String,
    enum: ['active', 'suspended', 'deactivated'],
    default: 'active',
  },
  dob: Date,
  // --- ADD THESE TWO FIELDS FOR PASSWORD RESET ---
  passwordResetCode: String,
  passwordResetExpires: Date,
  // --- ADD THESE TWO FIELDS FOR EMAIL VERIFICATION ---
  emailVerificationCode: String,
  emailVerificationExpires: Date,

}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;

