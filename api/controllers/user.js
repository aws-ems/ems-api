const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then(hash => {
    const user = new User({
      email: req.body.email,
      password: hash,
      fullName: req.body.fullName,
      displayName: req.body.displayName,
      gender: req.body.gender,
      dev: req.body.dev,
      role: req.body.role
    });
    user
      .save()
      .then(result => {
        res.status(201).json({
          message: "User created!",
          result: result
        });
      })
      .catch(err => {
        res.status(500).json({
          message: "Invalid authentication credentials!"
        });
      });
  });
}

exports.changePassword = (req, res, next) => {
  let fetchedUser;
  User.findOne({ _id: req.body.id })
    .then(user => {
      if (!user) {
        throw new Error("User not found!");
      } else {
        fetchedUser = user;
        return bcrypt.compare(req.body.oldPassword, user.password);
      }
    })
    .then(result => {
      if (!result || req.userData.userId !== req.body.id) {
        throw new Error("Invalid Authentication Credentials!");
      } else {
        return bcrypt.hash(req.body.newPassword, 10);
      }
    }).then(newPassword => {
      fetchedUser.password = newPassword;
      User.updateOne({_id: req.userData.userId}, fetchedUser)
      .then(result => {
        if (result.n > 0) {
          res.status(200).json({
            header: 'Change Password',
            message: 'Your password has been changed successfully!'
          });
        } else {
          res.status(401).json({
            message: 'Password change failed!'
          });
        };
      });
    }).catch(err => {
        res.status(401).json({
          message: err.message
        });
    });;
}

exports.userLogin = (req, res, next) => {
  let fetchedUser;
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        res.status(401).json({
          message: "Auth failed"
        });
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {
      if (!result) {
        res.status(401).json({
          message: "Auth failed"
        });
      }
      const token = jwt.sign(
        { email: fetchedUser.email, userId: fetchedUser._id },
        process.env.AUTH_TOKEN,
        { expiresIn: "1h" },
      );
      res.status(200).json({
        token: token,
        expiresIn: 3600,
        user: fetchedUser
      });
    })
    .catch(err => {
      if(!res.headersSent) {
        res.status(401).json({
          message: "Invalid Credentials!"
        });
      }
    });
}

exports.getUsers = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const userQuery = User.find();

  let fetchedUser;
  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }

  userQuery
    .then(docs => {
      fetchedUser = docs;
      return User.countDocuments();
    })
    .then(count => {
      res.status(200).json({
        message: "Users fetched successfully!",
        users: fetchedUser,
        maxUsers: count
      });
    })
    .catch(err => {
      res.status(500).json({
        message: "Fetching users failed!"
      });
    });
}

exports.getUser =  (req, res, next) => {
  User.findById(req.params.id)
    .then(doc => {
      if (doc) {
        res.status(200).json(doc);
      } else {
        res.status(404).json({ message: "User not found!" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching User failed!"
      });
    })
}

exports.deleteUser = (req, res, next) => {
    User.deleteOne({_id: req.params.id})
      .then(result => {
        if (result.n > 0) {
          res.status(200).json({ message: "Deletion successful!" });
        } else {
          res.status(401).json({ message: "Not authorized!" });
        }
      }
    );
}
