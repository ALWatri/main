const Category = require('../models/Category');

// Create and Save a new Category
exports.create = (req, res) => {
  if (!req.body.name || !req.body.image) {
    return res.status(400).send({
      message: 'Category name and image cannot be empty',
    });
  }

  const category = new Category({
    name: req.body.name,
    image: req.body.image,
  });

  category
    .save()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'An error occurred while creating the category.',
      });
    });
};


// Retrieve all Categories
exports.findAll = (req, res) => {
  Category.find()
    .then((categories) => {
      res.send(categories);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'An error occurred while retrieving categories.',
      });
    });
};

// Update a Category by its ID
exports.update = (req, res) => {
  if (!req.body.name || !req.body.image) {
    return res.status(400).send({
      message: 'Category name and image cannot be empty',
    });
  }

  Category.findByIdAndUpdate(req.params.id, {
    name: req.body.name,
    image: req.body.image,
  })
    .then((category) => {
      if (!category) {
        return res.status(404).send({
          message: `Category not found with id ${req.params.id}`,
        });
      }
      res.send(category);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'An error occurred while updating the category.',
      });
    });
};

// Delete a Category by its ID
exports.delete = (req, res) => {
  Category.findByIdAndRemove(req.params.id)
    .then((category) => {
      if (!category) {
        return res.status(404).send({
          message: `Category not found with id ${req.params.id}`,
        });
      }
      res.send({ message: 'Category deleted successfully!' });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'An error occurred while deleting the category.',
      });
    });
};
