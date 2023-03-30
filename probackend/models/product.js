const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      maxlength: 32,
      trim: true,
      require: true,
    },
    description: {
      type: String,
      trim: true,
      require: true,
      maxlength: 1200,
    },
    price: {
      type: Number,
      require: true,
      trim: true,
      maxlength: 32,
    },
    category: {
      type: ObjectId,
      ref: "Category",
    },

    sold: {
      type: Number,
      default: 0,
    },
    photo: {
      data: Buffer,
      contentType: String,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Product", productSchema);
