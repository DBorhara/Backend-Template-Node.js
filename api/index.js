// Import required modules
const router = require("express").Router();

/**
 * Router mounted on /api
 *
 * All routes are here defined as a middleware.
 * Each route file will further define its own routes.
 *
 * Middleware for /api/user
 * Requires the user router from the './user' file
 * Further routing is defined in the 'user' router file
 */
router.use("/user", require("./user"));

/**
 * Middleware for handling 404 errors.
 * This middleware is invoked if no prior route handler or middleware has sent a response or
 * called `next` without arguments.
 *
 * It creates an error with status 404 and passes it to the next middleware,
 * which should be an error-handling middleware.
 *
 * @param {Object} req - The Express request object
 * @param {Object} res - The Express response object
 * @param {Function} next - The next middleware function in the Express middleware chain
 */
router.use((req, res, next) => {
  const error = new Error("404 Not Found");
  error.status = 404;
  next(error);
});

// Export the router for use in other modules
module.exports = router;
