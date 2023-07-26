// Import User model
const User = require("../../db/models/user");

/**
 * Middleware to check if the user is authenticated.
 * It checks if the user is on the request object and if it exists in the database.
 *
 * @param {Object} req - The Express request object
 * @param {Object} res - The Express response object
 * @param {Function} next - The next middleware function in the Express middleware chain
 */
const isAuthenticated = async (req, res, next) => {
  // Check if user exists on request object
  if (!req.user) {
    const error = new Error("User not logged in.");
    error.status = 401; // Set HTTP status code to 'Unauthorized'
    return next(error); // Pass error to error-handling middleware
  }
  try {
    // Try to find user in database by primary key
    const user = await User.findByPk(req.user.id);

    // If the user does not exist in database, return error
    if (!user) {
      const error = new Error("User not found. Please log in again.");
      error.status = 401; // Set HTTP status code to 'Unauthorized'
      return next(error); // Pass error to error-handling middleware
    }

    // If user exists, continue to the next middleware or route handler
    return next();
  } catch (err) {
    // If an error occurs, pass it to the error-handling middleware
    return next(err);
  }
};

// Export the middleware function for use in other modules
module.exports = isAuthenticated;
