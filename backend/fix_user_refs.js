const mongoose = require('mongoose');
require('dotenv').config({ path: 'backend/.env' });

async function fixUserRefs() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    // The current active mock user ID from the system overview/context
    const mockUserId = '67d94e7732d84d1234567890';
    
    const db = mongoose.connection.db;
    
    console.log(`Updating Membership records with user: ${mockUserId}...`);
    const membershipResult = await db.collection('memberships').updateMany(
      { user: { $exists: false } },
      { $set: { user: new mongoose.Types.ObjectId(mockUserId) } }
    );
    console.log(`Matched ${membershipResult.matchedCount}, Updated ${membershipResult.modifiedCount} memberships.`);
    
    console.log(`Updating EventRegistration records with user: ${mockUserId}...`);
    const registrationResult = await db.collection('eventregistrations').updateMany(
      { user: { $exists: false } },
      { $set: { user: new mongoose.Types.ObjectId(mockUserId) } }
    );
    console.log(`Matched ${registrationResult.matchedCount}, Updated ${registrationResult.modifiedCount} registrations.`);
    
    await mongoose.disconnect();
    console.log('Done.');
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

fixUserRefs();
