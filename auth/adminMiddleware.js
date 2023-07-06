const isAdmin = async (req, res, next) => {
  const user = await User.findByPK(req.session.id);

  if (!user.isAdmin) {
    const error = new Error("User not authorized.");
    error.status = 403;
    return next(error);
  }

  return next();
};

module.exports = isAdmin;
