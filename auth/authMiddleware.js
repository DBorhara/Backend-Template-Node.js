const isAuthorized = async (req, res, next) => {
  const user = await User.findByPK(req.session.id);

  if (!user) {
    const error = new Error("User not authorized. Please log in.");
    error.status = 401;
    return next(error);
  }
  return next();
};

module.exports = isAuthorized;
