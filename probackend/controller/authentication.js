const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
require("dotenv").config();

const { expressjwt } = expressJwt;
const User = require("../models/user");

// signup === Creating a account
exports.signup = (req, res) => {
  const user = new User(req.body);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      errors: errors.array()[0].msg,
    });
  }

  user.save((error, user) => {
    if (error) {
      return res.status(400).json({
        error: error.message,
      });
    }
    res.status(200).json({
      userDetails: user,
    });
  });
};

// signin === Entering into the account
exports.signin = (req, res) => {
  const errors = validationResult(req);
  const { email, password } = req.body;
  if (!errors.isEmpty()) {
    return res.status(422).json({
      errors: errors.array()[0].msg,
    });
  }

  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        err: "USER EMAIL DOESN'T EXIST",
      });
    }
    if (!user.authenticate(password)) {
      return res.status(400).json({
        err: "email and password do not match",
      });
    }
    // create token
    const token = jwt.sign({ _id: user._id }, process.env.SECRET);
    // put token in cookie
    res.cookie("token", token, { expire: new Date() + 9999 });
    // send response to front end
    const { _id, firstName, email, role, encry_password } = user;
    return res.json({
      token,
      user: { _id, firstName, email, role, encry_password },
    });
  });
};

//  signout === Leave the Accont
exports.signout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({
    message: "successfully sign out",
  });
};

//! Protected Route

exports.isSignedIn = expressjwt({
  secret: process.env.SECRET,
  userProperty: "auth",
  algorithms: ["HS256"],
});

//! Custom MiddleWare
exports.isAuthenticated = (req, res, next) => {
  // req.profile #FrontEnd side we should mention
  const checker = req.profile && req.auth && req.profile._id == req.auth?._id;

  //! instead of "===" use "==" boc we are check only not with dataType
  if (!checker) {
    return res.status(403).json({
      error: " User is not Authenticated",
    });
  }

  next();
};

exports.isAdmin = (req, res, next) => {
  const checker = req.profile.role === 0;
  if (checker) {
    return res.status(403).json({
      error: "You are not allowed to Make Request #only Admin",
    });
  }
  next();
};
