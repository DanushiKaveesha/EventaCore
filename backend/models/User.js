const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // New schema fields from UserManagement DB
  username: { type: String, unique: true, sparse: true },
  firstName: String,
  lastName: String,
  contactNumber: String,
  address: String,
  profileImageURL: String,
  dob: Date,
  status: { type: String, enum: ['active', 'deactivated', 'suspended'], default: 'active' },
  passwordHash: String, // DB has passwordHash instead of password

  // Old schema fields (legacy support)
  name: String, 
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true
  },
  password: { 
    type: String, 
  },
  role: {
    type: String,
    // Accommodate both lowercase (DB) and Titlecase (Frontend)
    enum: ['Student', 'Organizer', 'Admin', 'student', 'organizer', 'admin'],
    default: 'Student'
  },
  // We keep isActive in schema so legacy records still load it
  isActive: { 
    type: Boolean, 
    default: true 
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtuals to bridge the gap between DB fields and what frontend expects
userSchema.virtual('normalizedName').get(function() {
  if (this.firstName && this.lastName) return `${this.firstName} ${this.lastName}`;
  if (this.username) return this.username;
  return this.name || 'Unknown User';
});

// We override "name" for the frontend if the frontend queries it
// Wait, we already have a path `name`, so defining a virtual named `name` might conflict.
// Let's rely on the frontend modifying the rendering, or we can just populate it here.
userSchema.post('find', function(docs) {
  docs.forEach(doc => {
    if (!doc.name) {
      doc.name = doc.firstName && doc.lastName ? `${doc.firstName} ${doc.lastName}` : (doc.username || 'Unknown');
    }
  });
});

// Hash password before saving
userSchema.pre('save', async function() {
  // If editing the old `password` field or syncing with passwordHash
  if (this.isModified('password') && this.password) {
    // Only hash if it's not already a bcrypt hash (starts with $2a$, $2b$, or $2y$)
    const isAlreadyHashed = /^\$2[aby]\$\d+\$/.test(this.password);
    
    if (!isAlreadyHashed) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
    this.passwordHash = this.password; // always sync it
  } else if (this.isModified('passwordHash') && !this.password) {
    // If only passwordHash updated, keep it synced to password field
    this.password = this.passwordHash;
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(enteredPassword) {
  const hashToCompare = this.passwordHash || this.password;
  if (!hashToCompare) return false;
  return await bcrypt.compare(enteredPassword, hashToCompare);
};

module.exports = mongoose.model('User', userSchema);