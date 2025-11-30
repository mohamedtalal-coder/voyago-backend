// Script to make a user admin
// Run with: node makeAdmin.js <email> (from server directory)

const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const User = require('./models/user');

const makeAdmin = async () => {
  const email = process.argv[2];
  
  if (!email) {
    console.log('Usage: node server/makeAdmin.js <email>');
    console.log('Example: node server/makeAdmin.js admin@example.com');
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const user = await User.findOne({ email });
    
    if (!user) {
      console.log(`User with email "${email}" not found`);
      process.exit(1);
    }

    if (user.isAdmin) {
      console.log(`User "${user.firstName} ${user.lastName}" is already an admin`);
    } else {
      user.isAdmin = true;
      await user.save();
      console.log(`✅ Successfully made "${user.firstName} ${user.lastName}" (${email}) an admin!`);
    }

    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

makeAdmin();
