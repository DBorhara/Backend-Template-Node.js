const { DataTypes } = require("sequelize");
const db = require("../db");

const Shopper = db.define("shopper", {
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  size: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = Shopper;
