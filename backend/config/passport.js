const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");
const jwt = require("jsonwebtoken");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL}/api/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        const name = profile.displayName;
        const photo = profile.photos?.[0]?.value;

        if (!email) return done(new Error("No email from Google"));

        let user = await User.findOne({ email });

        if (!user) {
          user = await User.create({
            email,
            name,
            photo: photo || "",
            password: "",
          });
        } else {
          if (!user.photo && photo) {
            user.photo = photo;
            await user.save();
          }
        }

        return done(null, user);
      } catch (err) {
        done(err);
      }
    }
  )
);

module.exports = passport;
