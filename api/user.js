// Import required modules
const router = require("express").Router();
const { User } = require("../db/models");
const requireAdminRole = require("../auth/middlewares/requireAdminRole");

/**
 * Router mounted on /user
 *
 * GET /user/allUsers
 * Retrieve all users from the database
 * Only the id and email are returned for each user for privacy reasons
 * This endpoint requires admin access
 */
router.get("/allUsers", requireAdminRole, async (req, res, next) => {
  try {
    // Get all users from the database, but only their id and email
    const allUsers = await User.findAll({ attributes: ["id", "email"] });

    // Send the retrieved users as a JSON response
    res.status(200).json(allUsers);
  } catch (error) {
    // Pass any errors to the error-handling middleware
    next(error);
  }
});

// Export the router for use in other modules
module.exports = router;
