// Import the necessary modules
const router = require("express").Router();
const { User } = require("../db/models");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

// Passport local strategy configuration
passport.use(
  "local",
  new LocalStrategy(
    {
      // Define the fields that will be used for authentication
      usernameField: "email",
      passwordField: "password",
    },
    async (username, password, done) => {
      try {
        // Find a user in the database with the given email (username)
        const user = await User.findOne({ where: { email: username } });

        // If the user isn't found, return an error message
        if (!user) {
          return done(null, false, { message: "Incorrect email" });
        }
        // If the user's password isn't correct, return an error message
        if (!user.correctPassword(password)) {
          return done(null, false, { message: "Incorrect password" });
        }
        // If both checks pass, return the user object
        return done(null, user);
      } catch (error) {
        // If an error occurred, pass it to the done callback
        done(error);
      }
    }
  )
);

// Sign up route
router.post("/signup", async (req, res, next) => {
  try {
    // Destructure the email and password from the request body
    const { email, password } = req.body;

    // If either field is missing, return an error
    if (!email || !password) {
      return res.status(400).json({ error: "Required fields missing" });
    }

    // Create a new user in the database with the request body
    const user = await User.create(req.body);

    // Log in the new user with Passport
    req.login(user, (err) =>
      err
        ? next(err)
        : res.json({ email: user.email, id: user.id, isAdmin: user.isAdmin })
    );
  } catch (error) {
    // If a SequelizeUniqueConstraintError occurred, a user with the given
    // email already exists in the database
    if (error.name === "SequelizeUniqueConstraintError") {
      res.status(409).json({ error: "User already exists" });
    } else {
      // If a different error occurred, pass it to the next middleware
      next(error);
    }
  }
});

// Login route
router.post(
  "/login",
  passport.authenticate("local"), // Use Passport's local strategy for authentication
  (req, res, next) => {
    // If authentication was successful, respond with the user's information
    res.json({
      email: req.user.email,
      id: req.user.id,
      isAdmin: req.user.isAdmin,
    });
  }
);

// Logout route
router.post("/logout", (req, res, next) => {
  // Log out the user with Passport
  req.logout((error) => {
    if (error) {
      // If an error occurred, pass it to the next middleware
      return next(error);
    }
    // If logging out was successful, respond with a success message
    res.json({ message: "LOGGED OUT" });
  });
});

// Route to get the current user's information
router.get("/me", (req, res, next) => {
  try {
    // If the user isn't logged in, respond with an error
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    // If the user is logged in, respond with their information
    res.json({
      id: req.user.id,
      email: req.user.email,
      isAdmin: req.user.isAdmin,
    });
  } catch (error) {
    // If an error occurred, pass it to the next middleware
    next(error);
  }
});

// Mount the Google authentication routes at /auth/google
router.use("/google", require("./google"));

// Export the router to be used in other files
module.exports = router;
