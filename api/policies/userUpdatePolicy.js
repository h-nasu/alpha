module.exports = function (req, res, next) {
  if (req.user) {
    if ((req.user.admin != 1 && req.user.id == req.body.user) | 
    req.user.admin == 1) {
      return next();
    }
    return res.forbidden('You are not permitted to perform this action.');
  } else {
    res.send("You Must Be Logged In", 403);
  }
};