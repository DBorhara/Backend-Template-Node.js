const router = require("express").Router();
const { User } = require("../db/models");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

passport.use(
  "local",
  new LocalStrategy(
    {
      usernameField: "email",

      passwordField: "password",
    },
    async (username, password, done) => {
      try {
        const user = await User.findOne({ where: { email: username } });
        if (!user) {
          return done(null, false, { message: "Incorrect email" });
        }
        if (!user.correctPassword(password)) {
          return done(null, false, { message: "Incorrect password" });
        }
        return done(null, user);
      } catch (error) {
        console.log("USER AUTH ERROR", error);
      }
    }
  )
);

// Mounted on /auth

// auth/signup
router.post("/signup", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send("Required fields missing");
    }
    const user = await User.create(req.body);
    // Passport js method on request
    req.login(user, (err) =>
      err
        ? next(err)
        : res
            .status(200)
            .json({ email: user.email, id: user.id, isAdmin: user.isAdmin })
    );
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      res.status(409).send("User already exists");
    } else {
      next(error);
    }
  }
});

router.post(
  "/login",
  passport.authenticate("local"),
  function (req, res, next) {
    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user.
    res.status(200).json({
      email: req.user.email,
      id: req.user.id,
      isAdmin: req.user.isAdmin,
    });
  }
);

// auth/logout
router.post("/logout", (req, res, next) => {
  // Passport js method on the request

  req.logout((error) => {
    if (error) {
      return next(error);
    }
    res.redirect("/");
  });
});

// auth/me
router.get("/me", (req, res, next) => {
  try {
    res.status(200).json({
      id: req.user.id,
      email: req.user.email,
      isAdmin: req.user.isAdmin,
    });
  } catch (error) {
    console.error(error);
  }
});

//auth/google
router.use("/google", require("./google"));

module.exports = router;
