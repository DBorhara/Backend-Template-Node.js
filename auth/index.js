const express = require("express");
const router = express.Router();
const User = require("../db/models/user");

//Error on persisting log in on refresh
// Mounted on /auth
// auth/login
router.post("/login", async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { email: req.body.email } });
    if (!user || !user.correctPassword(req.body.password)) {
      res.status(401).send("Invalid login attempt");
    } else {
      req.login(user, (err) => (err ? next(err) : res.status(200).json(user)));
    }
  } catch (err) {
    next(err);
  }
});

// auth/signup
router.post("/signup", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send("Required fields are missing");
    }
    const user = await User.create(req.body);
    req.login(user, (err) => (err ? next(err) : res.status(201).json(user)));
  } catch (err) {
    if (err.name === "SequelizeUniqueConstraintError") {
      res.status(409).send("User already exists");
    } else {
      next(err);
    }
  }
});

// auth/logout
// !! Not working or logging out of session
router.post("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

// auth/me
router.get("/me", (req, res) => {
  res.status(200).json(req.user);
});

// Mounts auth/google
router.use("/google", require("./google"));

module.exports = router;
