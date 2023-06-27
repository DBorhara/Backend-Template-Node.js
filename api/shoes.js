const express = require("express");
const router = express.Router();
const { Shoes } = require("../db/models");

// Root here is localhost:8080/api/shoes/
router.get("/", async (req, res, next) => {
  try {
    // Shoes.findAll() ===  SELECT * FROM shoes
    const allShoes = await Shoes.findAll();

    // if (allShoes) {
    //   res.status(200).json(allShoes);
    // } else {
    //   res.status(404).send("Shoes Listing Not Found");
    // }

    allShoes
      ? res.status(200).json(allShoes) // if allShoes is truthy
      : res.status(404).send("Shoes List Not Found"); // if allShoes is falsey
  } catch (error) {
    next(error);
  }
});

module.exports = router;
