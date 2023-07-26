// Import required modules
const express = require("express");
const session = require("express-session");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const passport = require("passport");
const cors = require("cors");
const db = require("./db");
const { User } = require("./db/models");
require("dotenv").config();

// Create a new Express application
const app = express();

// Create a new session store with Sequelize
const sessionStore = new SequelizeStore({ db });

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

/**
 * Middleware to handle Cross-Origin Resource Sharing (CORS)
 * Allows methods: GET, HEAD, PUT, PATCH, POST, DELETE
 */
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    credentials: true,
  })
);

/**
 * Middleware to handle sessions
 * Session name, secret and cookie maxAge should be stored in environment variables for security
 */
app.use(
  session({
    name: process.env.SESSION_NAME,
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: parseInt(process.env.SESSION_MAX_AGE),
    },
  })
);

// Serialize user instance to the session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user instance from the session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// Initialize passport
app.use(passport.initialize());

// Restore session
app.use(passport.session());

// Define main route handlers
app.use("/api", require("./api"));
app.use("/auth", require("./auth"));

// Function to sync the database and session store
const dbSetup = async () => {
  try {
    await db.sync();
    sessionStore.sync();
  } catch (err) {
    console.error(err);
  }
};

// Setup database and start server
dbSetup().then(() => {
  const port = process.env.PORT || 8080;
  app.listen(port, () => console.log(`Server is running on port:${port}`));
});
