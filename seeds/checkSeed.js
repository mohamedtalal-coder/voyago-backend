import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const checkSeed = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    const db = conn.connection.db;

    const tourPackagesCollection = db.collection('tourPackages');
    const servicesCollection = db.collection('services');

    const tourPackagesCount = await tourPackagesCollection.countDocuments();
    const servicesCount = await servicesCollection.countDocuments();

    console.log(`Tour Packages in database: ${tourPackagesCount}`);
    console.log(`Services in database: ${servicesCount}`);

    if (tourPackagesCount > 0) {
      const sampleTourPackage = await tourPackagesCollection.findOne();
      console.log('\nSample Tour Package:', JSON.stringify(sampleTourPackage, null, 2));
    }

    if (servicesCount > 0) {
      const sampleService = await servicesCollection.findOne();
      console.log('\nSample Service:', JSON.stringify(sampleService, null, 2));
    }

  } catch (err) {
    console.error('Error checking seed:', err);
  } finally {
    mongoose.connection.close();
  }
};

checkSeed();
