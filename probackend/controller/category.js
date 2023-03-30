const Category = require("../models/category");

//GET-Request
exports.getCategoryById = (req, res, next, id) => {
  Category.findById(id).exec((err, Cate) => {
    if (err || !Cate) {
      return res.status(401).json({
        error: "Category Not Found",
      });
    }
    req.category = Cate;
    next();
  });
};

//GET-Request
exports.getCatrgory = (req, res) => {
  res.json(req.category);
};
//GET-Request
exports.getAllCategories = (req, res) => {
  Category.find().exec((err, categoryItems) => {
    if (err || !categoryItems) {
      return res.status(401).json({
        error: "Not Category Found In DB",
      });
    }
    categoryItems.map(el => (el.updatedAt = undefined));
    res.json({
      items: categoryItems,
      count: categoryItems.length,
    });
  });
};

//POST-Request
exports.createCategory = (req, res) => {
  const category = new Category(req.body);
  category.save((err, category) => {
    if (err || !category) {
      return res.status(400).json({
        error: "Category is not Found in DB",
      });
    }
    res.json(category);
  });
};

// PUT-Request
exports.updateCatrgory = (req, res) => {
  const category = req.category;
  category.name = req.body.name;
  category.save((err, updatedCate) => {
    if (err || !updatedCate) {
      return res.status(4010).json({
        error: "Update Failed",
      });
    }
    res.json({ message: `Successfully updated as ${updatedCate.name}` });
  });
};

// DELETE-Request
exports.deleteCategory = (req, res) => {
  const category = req.category;
  category.remove((err, category) => {
    if (err || !category) {
      return res.send(401).json({
        error: "Failed To Delete The Category",
      });
    }
    res.json({ message: `Successfully Deleted ${category.name}` });
  });
};
