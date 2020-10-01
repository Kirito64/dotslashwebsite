const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.serializeUser(function (user, done) {
    done(null, user.id)
})
passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user)
    })
})


passport.use(new GoogleStrategy(
    {
        clientID: '269158377921-heaqmb9v5lgrdjqjp2tv9lk3g7m0k7c2.apps.googleusercontent.com',
        clientSecret: 'FYRzIIwQbvCk0iPTLawpaTqc',
        // TODO: EDIT_URL_FROM_LOCAL_HOST_TO_ACTUAL_DOMAIN_AS_PER_YOUR_API_CREDENTIALS
        callbackURL: 'http://localhost:4000/auth/google/dotslash',
        userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo',
    },
    function (accessToken, refreshToken, profile, done) {
        User.findOne({ googleId: profile.id }, function (err, user) {
            if (err)
                return done(err);
            if (user)
                return done(null, user);
            else {
                var newUser = new User({
                    googleId: profileData.sub,
                    firstName: profileData.given_name,
                    lastName: profileData.family_name,
                    email: profileData.email,
                    verified: profileData.email_verified,
                    picture: profileData.picture,
                    language: profileData.locale
                });

                newUser.save(function (err) {
                    if (err)
                        throw err;
                    return done(err, newUser);
                });
            }
        })
    }
)
);