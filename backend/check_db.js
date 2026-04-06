const mongoose = require('mongoose');
require('dotenv').config({ path: 'C:/Users/ishini kavishka/OneDrive/Desktop/EventCore/EventaCore/backend/.env' });

async function checkDb() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    const admin = mongoose.connection.db.admin();
    const dbsResult = await admin.listDatabases();
    const dbNames = dbsResult.databases.map(db => db.name);
    console.log('Databases on Cluster:', dbNames);
    
    for (const dbName of dbNames) {
      if (['admin', 'local', 'config'].includes(dbName)) continue;
      
      const db = mongoose.connection.useDb(dbName);
      const collections = await db.db.listCollections().toArray();
      console.log(`\n--- Database: ${dbName} ---`);
      
      for (const coll of collections) {
        const count = await db.db.collection(coll.name).countDocuments();
        console.log(`Collection [${coll.name}]: ${count} documents`);
      }
    }
    
    await mongoose.disconnect();
  } catch (err) {
    console.error('Error:', err);
  }
}

checkDb();
