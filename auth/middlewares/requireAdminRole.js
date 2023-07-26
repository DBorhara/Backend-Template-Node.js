// Import User model
const User = require("../../db/models/user");

/**
 * Middleware to check if the user has an admin role.
 * It checks if the user is on the request object and if the isAdmin property is true.
 *
 * @param {Object} req - The Express request object
 * @param {Object} res - The Express response object
 * @param {Function} next - The next middleware function in the Express middleware chain
 */
const requireAdminRole = (req, res, next) => {
  // Check if user exists on request object and if the user has admin rights
  if (!req.user || !req.user.isAdmin) {
    const error = new Error("User not authorized.");
    error.status = 403; // Set HTTP status code to 'Forbidden'
    return next(error); // Pass error to error-handling middleware
  }

  // If user is an admin, continue to the next middleware or route handler
  return next();
};

// Export the middleware function for use in other modules
module.exports = requireAdminRole;
