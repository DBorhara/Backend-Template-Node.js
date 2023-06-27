const express = require("express");
const router = express.Router();
const { Shopper } = require("../db/models");

// Root here is localhost:8080/api/shoppers/

router.get("/", async (req, res, next) => {
  try {
    const allShoppers = await Shopper.findAll();

    allShoppers
      ? res.status(200).json(allShoppers) // if allShoppers is truthy
      : res.status(404).send("Shoppers List Not Found"); // if allShoppers is falsey
  } catch (error) {
    next(error);
  }
});

module.exports = router;
