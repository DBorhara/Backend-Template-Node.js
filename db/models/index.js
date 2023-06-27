const Shoes = require("./shoes");
const Shopper = require("./shopper");

// Associations Go Here

// Many to Many
// We set a through table "ShopperShoes" that handles the M-M relationship
Shopper.belongsToMany(Shoes, { through: "ShopperShoes" });
Shoes.belongsToMany(Shopper, { through: "ShopperShoes" });

module.exports = {
  Shoes,
  Shopper,
};
