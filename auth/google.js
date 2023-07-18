const express = require("express");
const router = express.Router();
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { User } = require("../db/models");
const dotenv = require("dotenv").config();

// Passport Google OAuth strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const googleId = profile.id;
        const email = profile.emails[0].value;
        const imgUrl = profile.photos[0].value;
        const firstName = profile.name.givenName;
        const lastName = profile.name.familyName;
        const fullName = profile.displayName;

        // Try to find user in database, if not present create a new user
        const [user] = await User.findOrCreate({
          where: { googleId },
          defaults: { email, imgUrl, firstName, lastName, fullName },
        });

        // Done with no errors and the user
        done(null, user);
      } catch (err) {
        // Error occurred, pass it through
        done(err);
      }
    }
  )
);

// Mounted on auth/google
// auth/google
// Trigger Google OAuth
router.get(
  "/",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// auth/google/callback
// Google OAuth callback
router.get(
  "/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:3000/login",
  }),
  (req, res) => {
    // Successful authentication, redirect home.
    res.redirect("http://localhost:3000/home");
  }
);

module.exports = router;
