const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./Models/User'); // assumed

require('dotenv').config();

async function seedTestUsers() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://eventraUser:Eventra123@cluster0.j9nqcwj.mongodb.net/eventacore');
    console.log('Connected to DB');

    const hashedPassword = await bcrypt.hash('Password123!', 10);

    // 1. Create Playwright Admin
    await User.findOneAndUpdate(
      { email: 'admin-playwright@eventacore.com' },
      {
        name: 'Playwright Admin',
        email: 'admin-playwright@eventacore.com',
        username: 'playwrightadmin',
        password: hashedPassword,
        role: 'admin'
      },
      { upsert: true, new: true }
    );
    console.log('Playwright Admin seeded.');

    // 2. Create Playwright User
    await User.findOneAndUpdate(
      { email: 'user-playwright@example.com' },
      {
        name: 'Playwright Normal User',
        email: 'user-playwright@example.com',
        username: 'playwrightuser',
        password: hashedPassword,
        role: 'user' // or 'student' depending on their schema
      },
      { upsert: true, new: true }
    );
    console.log('Playwright User seeded.');

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seedTestUsers();
