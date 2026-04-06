const mongoose = require('mongoose');
require('dotenv').config({ path: 'C:/Users/ishini kavishka/OneDrive/Desktop/EventCore/EventaCore/backend/.env' });

async function migrateData() {
  const sourceUri = process.env.MONGO_URI.replace('/eventacore', '/event-management-system');
  const destUri = process.env.MONGO_URI;

  try {
    const sourceConn = await mongoose.createConnection(sourceUri).asPromise();
    const destConn = await mongoose.createConnection(destUri).asPromise();
    console.log('Connected to both databases');

    const collectionsToMigrate = ['clubs', 'memberships'];

    for (const collName of collectionsToMigrate) {
      const sourceColl = sourceConn.db.collection(collName);
      const destColl = destConn.db.collection(collName);

      const docs = await sourceColl.find({}).toArray();
      console.log(`Found ${docs.length} documents in ${collName} (source)`);

      if (docs.length > 0) {
        // Clear destination first to avoid duplicates if re-run
        // or just insert if empty. Since I saw 0 docs in dest for these, I'll just insert.
        await destColl.insertMany(docs);
        console.log(`Migrated ${docs.length} documents to ${collName} (destination)`);
      }
    }

    await sourceConn.close();
    await destConn.close();
    console.log('Migration complete');
  } catch (err) {
    console.error('Migration Error:', err);
  }
}

migrateData();
