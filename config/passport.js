// /server/config/passport.js
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User'); // Reuse your existing User model

// 1. Serialize User (Required by Passport for session management, even if we use JWT later)
passport.serializeUser((user, done) => {
    // Only save the user ID (Mongoose ID) to the session
    done(null, user.id);
});

// 2. Deserialize User (How to retrieve the user from the ID)
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

// 3. Google Strategy Configuration
module.exports = () => {
    console.log('Configuring Google Strategy with:');
    console.log('Client ID:', process.env.GOOGLE_CLIENT_ID ? 'SET' : 'MISSING');
    console.log('Client Secret:', process.env.GOOGLE_CLIENT_SECRET ? 'SET' : 'MISSING');
    console.log('Callback URL:', process.env.GOOGLE_CALLBACK_URL);
    
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: process.env.GOOGLE_CALLBACK_URL,
            },
            async (accessToken, refreshToken, profile, done) => {
                const newUser = {
                    googleId: profile.id, 
                    name: profile.displayName,
                    email: profile.emails[0].value, // Get the primary email
                };

                try {
                    // Check if user already exists
                    let user = await User.findOne({ email: newUser.email });

                    if (user) {
                        // User found - update googleId if not set
                        if (!user.googleId) {
                            user.googleId = profile.id;
                            await user.save();
                        }
                        done(null, user); 
                    } else {
                        // User not found, create new user
                        user = await User.create(newUser);
                        done(null, user);
                    }
                } catch (err) {
                    console.error(err);
                    done(err, null);
                }
            }
        )
    );
};
