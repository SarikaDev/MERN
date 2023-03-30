const express = require("express");
const router = express.Router();
const { json } = require("body-parser");

const {
  getUserById,
  getUser,
  updateUser,
  getAllUsers,
  userPurchaseList,
} = require("../controller/user");
const {
  isSignedIn,
  isAuthenticated,
  isAdmin,
} = require("../controller/authentication");

// param
router.param("userId", getUserById);

// create === C @ "../routes/authentication.js"

// read === R
router.get("/users", getAllUsers);
router.get("/user/:userId", isSignedIn, isAuthenticated, getUser);
router.get(
  "/orders/user/:userId",
  json(),
  isSignedIn,
  isAuthenticated,
  userPurchaseList,
);

// update === U
router.put("/user/:userId", json(), isSignedIn, isAuthenticated, updateUser);

module.exports = router;

// NOTE :
// if we are passing any request in api , then we should set json()
