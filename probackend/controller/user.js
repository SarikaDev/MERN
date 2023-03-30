const User = require("../models/user");
const Order = require("../models/order");

exports.getUserById = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err || !user) {
      return res.status(401).json({
        error: "NO USER WAS FOUND IN DB @ getUserById",
      });
    }
    req.profile = user;
    next();
  });
};

exports.getUser = (req, res) => {
  // TODO: get back here  for Password
  //   to hide sensitive info we can send undefined to that particular key
  //   Note createdAt cant be hide as of now
  req.profile.salt = undefined;
  req.profile.encry_password = undefined;
  req.profile.updatedAt = undefined;
  return res.json(req.profile);
};

// ! QUICK ASSIGNMENT
exports.getAllUsers = (req, res) => {
  User.find().exec((err, users) => {
    if (err || !users) {
      return res.send(400).json({
        error: "NO USER WAS FOUND IN DB",
      });
    }
    users.map(el => ((el.salt = undefined), (el.encry_password = undefined)));
    res.json(users);
  });
};

//! findOneAndUpdate
exports.updateUser = (req, res) => {
  User.findByIdAndUpdate(
    { _id: req.profile._id },
    { $set: req.body },
    { new: true },
    (err, user) => {
      if (err || !user) {
        return res.status(401).json({
          error: "Update Failed",
        });
      }
      user.salt = undefined;
      user.encry_password = undefined;
      res.json(user);
    },
  );
};

// * PART-02

// ! populate
exports.userPurchaseList = (req, res) => {
  Order.find({ user: req.profile._id })
    .populate("user", "_id firstName")
    .exec((err, order) => {
      if (err || !order) {
        return res.status(400).json({
          error: "No Order Found",
        });
      }
      return res.json(order);
    });
};

exports.pushOrderInPurchaseList = (req, res, next) => {
  let purchases = [];
  req.body.order.products.forEach(element => {
    purchases.push({
      _id: element._id,
      name: element.name,
      description: element.description,
      category: element.category,
      stock: element.stock,
      price: element.price,
      transaction_Id: req.body.order.transaction_Id,
    });
  });
  //   STORE THIS IN DB
  User.findOneAndUpdate(
    { _id: req.profile._id },
    {
      $push: { purchases: purchases },
    },
    { new: true },
    (err, purchases) => {
      if (err || !purchases) {
        return res.status(400).json({
          error: "Unable to save Purchase List",
        });
      }
      res.product = purchases;
      next();
    },
  );
};
