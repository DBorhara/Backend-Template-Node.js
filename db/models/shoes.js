const { DataTypes } = require("sequelize");
const db = require("../db");

const Shoes = db.define("shoes", {
  company: {
    type: DataTypes.STRING,
    allownull: false,
  },
  type: {
    type: DataTypes.STRING,
    allownull: false,
  },
  laces: {
    type: DataTypes.BOOLEAN,
    allownull: false,
  },
  size: {
    type: DataTypes.INTEGER,
    allownull: false,
  },
});

module.exports = Shoes;
