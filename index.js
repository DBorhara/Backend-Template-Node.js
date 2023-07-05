const express = require("express");
const session = require("express-session");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const passport = require("passport");
const cors = require("cors");
const db = require("./db");

const sessionStore = new SequelizeStore({ db });

// Helper functions
const serializeUser = (user, done) => done(null, user.id);
const deserializeUser = async (id, done) => {
  try {
    const user = await db.models.user.findByPk(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
};

// Configuration
const configSession = () => ({
  secret: "keyboard cat",
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 8 * 60 * 60 * 1000, sameSite: true }, // 8 hours
});

// Middleware setup
const setupMiddleware = (app) => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors());
  app.use(session(configSession()));
  app.use(passport.initialize());
  app.use(passport.session());
  return app;
};

// Passport setup
const setupPassport = () => {
  passport.serializeUser(serializeUser);
  passport.deserializeUser(deserializeUser);
};

// Routes
const setupRoutes = (app) => {
  app.use("/api", require("./api"));
  app.use("/auth", require("./auth"));
  return app;
};

// Start the server and sync the database
const startServer = (app, port) => {
  return db.sync().then(() => {
    app.listen(port, () => console.log(`Server is live on port: ${port}`));
    return app;
  });
};

// Configure app
const configureApp = async (port) => {
  const app = express();
  setupPassport();
  setupMiddleware(app);
  await sessionStore.sync();
  setupRoutes(app);
  return startServer(app, port);
};

module.exports = configureApp(8080);
