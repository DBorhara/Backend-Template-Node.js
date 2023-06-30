const express = require("express");
const cors = require("cors");
const db = require("./db");
const PORT = 8080;

const app = express();

// Mount on API
app.use("/api", require("./api"));
//Replaces body-parser module in express 4.x

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors);
// Syncing DB Function
const syncDB = () => db.sync();

// Run server function
const serverRun = () => {
  app.listen(PORT, () => {
    console.log(`Live on port: ${PORT}`);
  });
};

syncDB();
serverRun();

module.exports = app;
