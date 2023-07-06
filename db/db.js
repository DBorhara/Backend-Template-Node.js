const { Sequelize } = require("sequelize");
const { name } = require("../package.json");
require("pg");
const dotenv = require("dotenv");
dotenv.config();
// name === ttpbackend2023

// const db = new Sequelize(
//   "postgres://dborhara:FYR065wSqSIJNzNbOTJoyEcRWdZQ7tSh@dpg-cijhg7p8g3nc2g8ki9f0-a.ohio-postgres.render.com/ttpbackend",
//   {
//     logging: false,
//     ssl: false,
//   }
// );

const db = new Sequelize(
  "ttpbackend",
  "dborhara",
  "FYR065wSqSIJNzNbOTJoyEcRWdZQ7tSh",
  {
    host: "dpg-cijhg7p8g3nc2g8ki9f0-a.ohio-postgres.render.com",
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  }
);

module.exports = db;
