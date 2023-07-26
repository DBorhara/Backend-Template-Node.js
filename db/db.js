// Import the required modules
const { Sequelize } = require("sequelize");
require("dotenv").config();

// Get the database details from the environment variables
const {
  DB_NAME,
  DB_USERNAME,
  DB_PASSWORD,
  DB_HOST,
  DB_DIALECT,
  USE_REMOTE_DB,
  REMOTE_DB_NAME,
  REMOTE_DB_USERNAME,
  REMOTE_DB_PASSWORD,
  REMOTE_DB_HOST,
  REMOTE_DB_DIALECT,
} = process.env;

// Use a local or remote database based on the USE_REMOTE_DB environment variable
const db = new Sequelize(
  USE_REMOTE_DB === "true" ? REMOTE_DB_NAME : DB_NAME,
  USE_REMOTE_DB === "true" ? REMOTE_DB_USERNAME : DB_USERNAME,
  USE_REMOTE_DB === "true" ? REMOTE_DB_PASSWORD : DB_PASSWORD,
  {
    host: USE_REMOTE_DB === "true" ? REMOTE_DB_HOST : DB_HOST,
    dialect: USE_REMOTE_DB === "true" ? REMOTE_DB_DIALECT : DB_DIALECT,
    logging: false,
    dialectOptions:
      USE_REMOTE_DB === "true"
        ? { ssl: { require: true, rejectUnauthorized: false } }
        : {},
  }
);

// Test the database connection
db.authenticate()
  .then(() => console.log("Database authenicated..."))
  .catch((err) => console.error("Error connecting to the database:", err));

module.exports = db;
