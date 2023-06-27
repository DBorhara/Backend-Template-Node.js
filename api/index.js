const router = require("express").Router();

// Already mounted on /api/
router.use("/shoppers", require("./shoppers"));
router.use("/shoes", require("./shoes"));

// 404 Handling
router.use((req, res, next) => {
  const error = new Error("404 Not Found");
  error.status = 404;
  next(error);
});

module.exports = router;
