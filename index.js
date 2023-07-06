const express = require("express");
const session = require("express-session");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const passport = require("passport");
const cors = require("cors");
const db = require("./db");

const sessionStore = new SequelizeStore({ db });

//Helper functions
const serializeUser = (user, done) => done(null, user.id);
const deserializeUser = async (id, done) => {
  try {
    const user = await db.models.user.findByPk(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
};

//Configs
const configSession = () => ({
  secret: "ttp2023summer",
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 2 * 60 * 60 * 1000,
  }, // 8 hours
  httpOnly: true,
});

// Middleware setup
const setupMiddleware = (app) => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(
    cors({
      origin: "http://localhost:3000", // allow to server to accept request from different origin
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      credentials: true,
    })
  );
  app.use(session(configSession()));
  app.use(passport.initialize());
  app.use(passport.session());
  return app;
};

// Passport Setup
const setupPassport = () => {
  passport.serializeUser(serializeUser);
  passport.deserializeUser(deserializeUser);
};

// Routes
const setupRoutes = (app) => {
  app.use("/api", require("./api"));
  app.use("/auth", require("./auth"));
};

// Start server and sync the db
const startServer = async (app, port) => {
  await db.sync();
  app.listen(port, () => console.log(`Server is on port:${port}`));
  return app;
};

// Configure all functions in one major funtion
const configureApp = async (port) => {
  const app = express();
  setupPassport();
  setupMiddleware(app);
  await sessionStore.sync();
  setupRoutes(app);
  return startServer(app, port);
};

module.exports = configureApp(8080);
