const express = require("express");
const { json } = require("body-parser");
const router = express.Router();

const {
  isAdmin,
  isAuthenticated,
  isSignedIn,
} = require("../controller/authentication");
const { getUserById } = require("../controller/user");
const {
  getProductById,
  getAllProducts,
  getProduct,
  updateProduct,
  createProduct,
  deleteProduct,
  photoProduct,
  getAllUniqueCategories,
} = require("../controller/product");

// Param
router.param("userId", getUserById);
router.param("productId", getProductById);

// create === C
router.post(
  "/product/create/:userId",
  json(),
  isSignedIn,
  isAuthenticated,
  isAdmin,
  createProduct,
);

// read === R
router.get("/products", getAllProducts);
router.get("/product/:productId", getProduct);

// update === U
router.put(
  "/product/:productId/:userId",
  json(),
  isSignedIn,
  isAuthenticated,
  isAdmin,
  updateProduct,
);

// delete === D
router.delete(
  "/product/:productId/:userId",
  json(),
  isSignedIn,
  isAuthenticated,
  isAdmin,
  deleteProduct,
);

router.get("/product/photoProduct/:productId", photoProduct);

//listing unique Categories
router.get("/products/categories", getAllUniqueCategories);

module.exports = router;
