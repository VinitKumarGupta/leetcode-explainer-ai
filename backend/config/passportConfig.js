// Environment variables loaded by server.js before this module is imported.

import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.js";

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
            scope: ["profile", "email"],
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const email = profile.emails[0].value;
                const googleId = profile.id;

                // 1. Check if user with this googleId exists
                let user = await User.findOne({ googleId });

                if (user) {
                    return done(null, user);
                }

                // 2. Check if user with this email exists (and link them)
                user = await User.findOne({ email });

                if (user) {
                    user.googleId = googleId;
                    await user.save();
                    return done(null, user);
                }

                // 3. Create new user if neither exists
                user = new User({
                    email,
                    googleId,
                });
                await user.save();
                return done(null, user);
            } catch (error) {
                return done(error, null);
            }
        },
    ),
);

// We won't use passport's standard session-based approach (serialize/deserialize)
// because we are using JWT, but passport may still expect these if sessions are enabled.
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

export default passport;
