const express = require("express");
const { json } = require("body-parser");
const router = express.Router();
const {
  isSignedIn,
  isAuthenticated,
  isAdmin,
} = require("../controller/authentication");
const { getUserById } = require("../controller/user");
const {
  getAllCategories,
  getCategoryById,
  getCatrgory,
  updateCatrgory,
  createCategory,
  deleteCategory,
} = require("../controller/category");

// Param
router.param("userId", getUserById);
router.param("categoryId", getCategoryById);

// create === C
router.post(
  "/category/create/:userId",
  json(),
  isSignedIn,
  isAuthenticated,
  isAdmin,
  createCategory,
);

// read === R
router.get("/categories", getAllCategories);
router.get("/category/:categoryId", getCatrgory);

// update === U
router.put(
  "/category/:categoryId/:userId",
  json(),
  isSignedIn,
  isAuthenticated,
  isAdmin,
  updateCatrgory,
);

// delete === D
router.delete(
  "/category/:categoryId/:userId",
  json(),
  isSignedIn,
  isAuthenticated,
  isAdmin,
  deleteCategory,
);

module.exports = router;
