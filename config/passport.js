const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');


passport.serializeUser((user, done) => {

    done(null, user.id);
});


passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});


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
                    email: profile.emails[0].value,
                };

                try {

                    let user = await User.findOne({ email: newUser.email });

                    if (user) {
                        if (!user.googleId) {
                            user.googleId = profile.id;
                            await user.save();
                        }
                        done(null, user); 
                    } else {
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
