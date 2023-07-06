const router = require("express").Router();
const { User } = require("../db/models");

// Mounted on /auth

// auth/login
router.post("/login", async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { email: req.body.email } });
    if (!user || !user.correctPassword(req.body.password)) {
      res.status(401).send("Invalid login attempt");
    } else {
      // Passport.js method attached to request
      req.login(user, (err) => (err ? next(err) : res.status(200).json(user)));
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// auth/signup
router.post("/signup", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send("Required fields missing");
    }
    const user = await User.create(req.body);
    // Passport js method on request
    req.login(user, (err) => (err ? next(err) : res.status(200).json(user)));
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      res.status(409).send("User already exists");
    } else {
      next(error);
    }
  }
});

// auth/logout
router.post("/logout", (req, res, next) => {
  // Passport js method on the request

  req.logout((error) => {
    if (error) {
      return next(error);
    }
    res.redirect("/");
  });
  req.session.destroy();
});

// auth/me
router.get("/me", (req, res, next) => {
  res.status(200).json(req.user);
});

//auth/google
router.use("/google", require("./google"));

module.exports = router;
