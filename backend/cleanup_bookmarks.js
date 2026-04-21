const mongoose = require('mongoose');
require('dotenv').config({ path: 'backend/.env' });

async function cleanupBookmarks() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    const db = mongoose.connection.db;
    
    // Find all bookmarks
    const bookmarks = await db.collection('bookmarks').find({}).toArray();
    console.log(`Found ${bookmarks.length} total bookmarks.`);
    
    let deletedCount = 0;
    for (const bookmark of bookmarks) {
      if (!bookmark.clubId) {
        console.log(`Removing bookmark ${bookmark._id} (missing clubId)`);
        await db.collection('bookmarks').deleteOne({ _id: bookmark._id });
        deletedCount++;
        continue;
      }
      
      const club = await db.collection('clubs').findOne({ _id: bookmark.clubId });
      if (!club) {
        console.log(`Removing bookmark ${bookmark._id} (club ${bookmark.clubId} not found)`);
        await db.collection('bookmarks').deleteOne({ _id: bookmark._id });
        deletedCount++;
      }
    }
    
    console.log(`Cleanup complete. Removed ${deletedCount} invalid bookmarks.`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error during cleanup:', err);
    process.exit(1);
  }
}

cleanupBookmarks();
