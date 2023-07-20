const User = require("../db/models/user");

const isAuthorized = async (req, res, next) => {
  const user = await User.findByPK(req.user.id);

  if (!user) {
    const error = new Error("User not authorized. Please log in.");
    error.status = 401;
    return next(error);
  }
  return next();
};

module.exports = isAuthorized;
