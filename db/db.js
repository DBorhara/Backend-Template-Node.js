const { Sequelize } = require("sequelize");
const { name } = require("../package.json");
require("dotenv").config();
// name === ttpbackend2023

const db = new Sequelize(
  process.env.DATABASE_URL || `postgres://localhost:5432/${name}`,
  {
    logging: false,
  }
);

module.exports = db;
