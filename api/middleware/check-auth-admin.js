const User = require("../models/user");

module.exports = (req, res, next) => {
    User.findOne({ _id: req.userData.userId })
    .then(user => {
      if (!user || user.role !== 'admin') {
        throw new Error('User is not authorized for this action');
      }
      next();
    }).catch(error => {
      res.status(401).json({ message: error.message });
    });
};
