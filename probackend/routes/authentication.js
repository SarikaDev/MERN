const { json } = require("body-parser");
const express = require("express");
// Route's Access
const router = express.Router();
// Validation's
const { check } = require("express-validator");
// Route
const {
  signout,
  signup,
  signin,
  isSignedIn,
} = require("../controller/authentication");

router.get("/signout", signout);

router.post(
  "/signup",
  json(),
  [
    check("firstName", "firstName should be atleastm 3 Characters").isLength({
      min: 3,
    }),
    check("email", "email is required").isEmail(),
    check("password", "Password should be atleast 3 Characters").isLength({
      min: 3,
    }),
  ],
  signup,
);
router.post(
  "/signin",
  json(),
  [
    check("email", "email is required").isEmail(),

    check("password", "Password should be atleast 3 Characters").isLength({
      min: 3,
    }),
  ],

  signin,
);

router.get("/test", isSignedIn, (req, res) => {
  res.json(req.auth);
});

module.exports = router;
