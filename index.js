const express = require("express");
const app = express();
const session = require("express-session");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const passport = require("passport");
const cors = require("cors");
const db = require("./db");
const { User } = require("./db/models");
const port = 8080;
require("dotenv").config();

const sessionStore = new SequelizeStore({ db });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    credentials: true,
  })
);

app.use(
  session({
    name: "TESTAPP",
    secret: "ttp2023summer",
    store: sessionStore,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 8 * 60 * 60 * 1000, // 8 hours
    },
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);

    done(null, user);
  } catch (err) {
    done(err);
  }
});

app.use(passport.initialize());
app.use(passport.session());

app.use("/api", require("./api"));
app.use("/auth", require("./auth"));

const dbSetup = async () => {
  await db.sync();
  sessionStore.sync();
};
dbSetup();
app.listen(port, () => console.log(`Server is running on port:${port}`));
