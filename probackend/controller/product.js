const Product = require("../models/product");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");

//POST-Request  === C
exports.createProduct = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, files) => {
    if (err || !fields || !files) {
      return res.status(400).json({
        error: "Problem with Image",
      });
    }

    // destructure the field
    const { name, description, price, stock, category } = fields;
    if (!name || !description || !price || !stock || !category) {
      res.status(400).json({
        error: "Please include all Fields",
      });
    }
    const product = new Product(fields);

    if (files.photo) {
      if (files.photo.size > 3000000) {
        return res.status(400).json({
          error: "files Size Should Not  Be More Than 3MB",
        });
      }
      product.photo.data = fs.readFileSync(files.photo.filepath);
      product.photo.contentType = files.photo.mimetype;
    }
    // Save to DB
    product.save((err, pro) => {
      if (err || !pro) {
        return res.status(400).json({
          error: "Product Saving  in DB got Failed",
        });
      }
      res.json(pro);
    });
  });
};

//GET-Request === R
exports.getProductById = (req, res, next, id) => {
  Product.findById(id).exec((err, pro) => {
    if (err || !pro) {
      return res.status(401).json({
        error: "product Not Found",
      });
    }
    pro.photo = undefined;
    req.product = pro;
    next();
  });
};

//GET-Request  === R
exports.getProduct = (req, res) => {
  req.product.photo = undefined;
  res.json(req.product);
};

//GET-Request  === R
exports.getAllProducts = (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 5;
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  Product.find()
    .select("-photo")
    .populate("category")
    .sort([[sortBy, "asc"]])
    .limit(limit)
    .exec((err, productItems) => {
      if (err || !productItems) {
        return res.status(401).json({
          error: "Not Product Found In DB",
        });
      }
      productItems.map(
        el => ((el.updatedAt = undefined), (el.photo = undefined)),
      );
      res.json({
        items: productItems,
        count: productItems.length,
      });
    });
};

// PUT-Request  === U
exports.updateProduct = (req, res) => {
  // ! Method 01 without Form Data
  // const product = req.product;
  // product.name = req.body.name;
  // product.description = req.body.description;
  // product.save((err, updatedPro) => {
  //   if (err || !updatedPro) {
  //     return res.status(4010).json({
  //       error: "Update Failed",
  //     });
  //   }
  //   res.json({ message: `Successfully updated as ${updatedPro.name}` });
  // });
  // ! Method 02
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err || !fields || !files) {
      return res.status(400).json({
        error: "Image is Not Found ",
      });
    }

    // Updation of Code
    const product = req.product;
    const PRO = _.extend(product, fields);

    if (files.photo) {
      if (files.photo.size > 3000000) {
        return res.status(400).json({
          error: "files Size Should Not  Be More Than 3MB",
        });
      }
      PRO.photo.data = fs.readFileSync(files.photo.filepath);
      PRO.photo.contentType = files.photo.mimetype;
    }
    // Save to DB
    PRO.save((err, pro) => {
      if (err || !pro) {
        return res.status(400).json({
          error: "Product Updation  in DB got Failed",
        });
      }
      res.json(pro);
    });
  });
};

// DELETE-Request
exports.deleteProduct = (req, res) => {
  const product = req.product;
  product.remove((err, product) => {
    if (err || !product) {
      return res.send(401).json({
        error: "Failed To Delete The Category",
      });
    }
    res.json({ message: `Successfully Deleted ${product.name}` });
  });
};

exports.photoProduct = (req, res, next) => {
  res.json({
    msg: "Front End Purpose Acts like MiddleWare and Optimization",
  });
  if (req.product.photo.data) {
    res.set("Content-Type", req.product.photo.contentType);
    return res.send(req.prosuct.photo.data);
  }
  next();
};

exports.updateStock = (req, res, next) => {
  let myOperations = req.body.order.products.map(prod => {
    return {
      updateOne: {
        filter: { _id: prod._id },
        update: {
          $inc: {
            stock: (prod.stock = prod.stock - 1),
            sold: (prod.sold = prod.sold + 1),
          },
        },
      },
    };
  });
  Product.bulkWrite(myOperations, {}, (err, products) => {
    if (err || !products) {
      return res.status(400).json({
        err: "Bulk Operation Failed",
      });
    }
    next();
  });
};

//listing unique Categories

exports.getAllUniqueCategories = (req, res) => {
  Product.distinct("category", {}, (err, cate) => {
    if (err || !cate) {
      return res.status(400).json({
        err: "No unique Category Found",
      });
    }
    res.json(cate);
  });
};
