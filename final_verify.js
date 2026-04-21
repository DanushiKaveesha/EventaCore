const mongoose = require('mongoose');
require('dotenv').config({ path: 'backend/.env' });

async function verify() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const db = mongoose.connection.db;
    
    // Check clubs count
    const clubsCount = await db.collection('clubs').countDocuments();
    console.log(`Clubs: ${clubsCount}`);
    
    // Check registrations tied to user
    const mockUserId = '67d94e7732d84d1234567890';
    const regCount = await db.collection('eventregistrations').countDocuments({ user: new mongoose.Types.ObjectId(mockUserId) });
    console.log(`Registrations for user: ${regCount}`);
    
    // Check memberships tied to user
    const memCount = await db.collection('memberships').countDocuments({ user: new mongoose.Types.ObjectId(mockUserId) });
    console.log(`Memberships for user: ${memCount}`);
    
    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
}

verify();
