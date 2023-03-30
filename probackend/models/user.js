const mongoose = require("mongoose");
const crypto = require("crypto");
const uuid = require("uuid");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      require: true,
    },
    encry_password: {
      type: String,
    },
    salt: String,
    role: {
      type: Number,
      default: 0,
    },
    purchases: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

userSchema
  .virtual("password")
  .set(function (plainPassword) {
    this._password = plainPassword;
    this.salt = uuid.v4();
    this.encry_password = this.securePassword(this._password);
  })
  .get(function () {
    return this._password;
  });

userSchema.methods = {
  // Function 1
  securePassword: function (plainPassword) {
    try {
      const hash = crypto
        .createHmac("sha256", this.salt)
        .update(plainPassword)
        .digest("base64");
      return hash;
    } catch (error) {
      return "";
    }
  },
  // Function 2
  authenticate: function (word) {
    return this.encry_password === this.securePassword(word);
  },
};

module.exports = mongoose.model("User", userSchema);
