const { Order, ProductCart } = require("../models/order");

// param Route
exports.getOrderById = (req, res, id, next) => {
  Order.findById(id)
    .populate("products.product", "name price")
    .exec((err, ord) => {
      if (err || !ord) {
        return res.status(401).json({
          Error: "No Order Found In DB",
        });
      }
      req.order = ord;
      next();
    });
};

//POST-Request  === C
exports.createOrder = (req, res) => {
  req.body.order.user = req.profile;
  const order = new Order(req.body.order);
  order.save((err, order) => {
    if (err || !order) {
      console.log("error", err);
      return res.status(401).json({
        Error: "Failed to Save your Order  In DB",
      });
    }
    res.json(order);
    console.log("pass", order);
  });
};

exports.getAllOrders = (req, res) => {
  Order.find()
    .populate("user", "_id name")
    .exec((err, orders) => {
      if (err || !orders) {
        return res.status(401).json({
          Error: "NO Orders Found  In DB",
        });
      }
      res.json(orders);
    });
};

//GET-Request  === R
exports.getOrderStatus = (req, res) => {
  res.json(Order.schema.path("status").enumValues);
  // ! Doubt
};

//PUT-Request  === U

exports.updateStatus = (req, res) => {
  Order.update(
    { _id: req.body.orderId },
    { $set: { status: req.body.status } },
    (err, order) => {
      if (err || !order) {
        return res.status(401).json({
          error: "Cannot Update Order Status",
        });
      }
      res.json(order);
    },
  );
};
