import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { tours, services, reviews, stats } from './seedData.js'; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const seedDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    const db = conn.connection.db;

    // Tour Packages
    const tourPackagesCollection = db.collection('tourPackages');
    await tourPackagesCollection.deleteMany({});
    await tourPackagesCollection.insertMany(tours);
    console.log('✅ Tour Packages seeded');

    // Services
    const servicesCollection = db.collection('services');
    await servicesCollection.deleteMany({});
    await servicesCollection.insertMany(services);
    console.log('✅ Services seeded');

    // Reviews
    const reviewsCollection = db.collection('reviews');
    await reviewsCollection.deleteMany({});
    await reviewsCollection.insertMany(reviews.map(r => ({ ...r, isApproved: true, createdAt: new Date(), updatedAt: new Date() })));
    console.log('✅ Reviews seeded');

    // Stats
    const statsCollection = db.collection('stats');
    await statsCollection.deleteMany({});
    await statsCollection.insertMany(stats.map(s => ({ ...s, createdAt: new Date(), updatedAt: new Date() })));
    console.log('✅ Stats seeded');

    console.log('\n🎉 All seed data inserted successfully!');
  } catch (err) {
    console.error('❌ Seed error:', err);
  } finally {
    mongoose.connection.close();
  }
};

seedDB();
