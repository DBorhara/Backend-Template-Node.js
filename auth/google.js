// Import necessary modules
const express = require("express");
const router = express.Router();
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { User } = require("../db/models");
require("dotenv").config();

// Set up Passport to use Google's OAuth 2.0 strategy
// This allows us to authenticate users via their Google accounts
passport.use(
  new GoogleStrategy(
    {
      // Client ID and secret are set as environment variables
      // These come from the Google API Console
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // The URL that Google will redirect to after the user has authenticated
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    // This function will be called when a user has authenticated successfully
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Extract the relevant data from the profile object
        const googleId = profile.id;
        const email = profile.emails ? profile.emails[0].value : null;
        const imgUrl = profile.photos ? profile.photos[0].value : null;
        const firstName = profile.name ? profile.name.givenName : null;
        const lastName = profile.name ? profile.name.familyName : null;
        const fullName = profile.displayName;

        // Try to find a user with the given Google ID
        // If a user doesn't exist, create a new one
        const [user] = await User.findOrCreate({
          where: { googleId },
          defaults: { email, imgUrl, firstName, lastName, fullName },
        });

        // If the user was found or created successfully, call the done function
        // with the user object
        done(null, user);
      } catch (err) {
        // If an error occurred, call the done function with the error
        done(err);
      }
    }
  )
);

// Define a route for initiating the Google OAuth process
// When a GET request is made to /auth/google, Passport will redirect the user to Google
router.get(
  "/",
  passport.authenticate("google", { scope: ["profile", "email"] }) // Requesting access to profile info and email
);

// Define a route for handling the callback from Google
// When Google redirects the user back to our app, Passport will handle the authentication
router.get(
  "/callback",
  passport.authenticate("google", {
    // If authentication fails, redirect to login page
    failureRedirect: process.env.FAILURE_REDIRECT_URL,
  }),
  // This middleware will be executed after successful authentication
  // It redirects the user to the home page
  (req, res) => {
    res.redirect(process.env.SUCCESS_REDIRECT_URL);
  }
);

// Export the router so it can be used in other files
module.exports = router;
