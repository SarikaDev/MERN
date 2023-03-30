const express = require("express");
const router = express.Router();
const { json } = require("body-parser");
const {
  isSignedIn,
  isAuthenticated,
  isAdmin,
} = require("../controller/authentication");
const { getUserById, pushOrderInPurchaseList } = require("../controller/user");
const { updateStock } = require("../controller/product");
const {
  getOrderById,
  createOrder,
  getAllOrders,
  getOrderStatus,
  updateStatus,
} = require("../controller/order");

// Param
router.param("userId", getUserById);
router.param("orderId", getOrderById);

// create === C
router.post(
  "/order/create/:userId",
  json(),
  isSignedIn,
  isAuthenticated,
  pushOrderInPurchaseList,
  updateStock,
  createOrder,
);

// read === R
router.get(
  "/order/all/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  getAllOrders,
);

// Order Status === R
router.get(
  "/order/status/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  getOrderStatus,
);

// Update === U

router.put(
  "/order/:orderId/status/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  updateStatus,
);

module.exports = router;
