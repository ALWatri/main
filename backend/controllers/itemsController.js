const Item = require('../models/Item');

// Get all items for a specific user
exports.getUserItems = (req, res) => {
  Item.find({ userId: req.query.userId }) 
    .then((items) => {
      res.send(items);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'An error occurred while retrieving user items.',
      });
    });
};

// Create and Save a new item
exports.addItem = (req, res) => {
  console.log('req.body:', req.body); 

  const item = new Item({
    userId: req.body.userId,
    category: req.body.category,
    subCategory: req.body.subCategory,
    season: req.body.season,
    images: req.body.images,
    occasion: req.body.occasion, 
    color: req.body.color, 
  });

  item
    .save()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'An error occurred while creating the item.',
      });
    });
};

// Find a single item with a given id
exports.findOne = (req, res) => {
  Item.findById(req.params.id)
    .then((item) => {
      if (!item) {
        return res.status(404).send({
          message: `Item not found with id ${req.params.id}`,
        });
      }
      res.send(item);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'An error occurred while retrieving the item.',
      });
    });
};

// Find items by subcategory
exports.findBySubCategory = (req, res) => {
  console.log('req.query.userId:', req.query.userId); 
  console.log('req.query.subCategory:', req.query.subCategory); 

  const limit = parseInt(req.query.limit) || 6;
  const page = parseInt(req.query.page) || 1;

  Item.find({
    $and: [
      { userId: req.query.userId },
      { subCategory: req.query.subCategory }
    ]
  }) 
    .sort({ createdAt: -1 }) 
    .skip((page - 1) * limit)
    .limit(limit)
    .then((items) => {
      console.log('Retrieved items:', items);
      res.send(items);
    })
    .catch((err) => {
      console.log('Error:', err); 
      res.status(500).send({
        message: err.message || 'An error occurred while retrieving items.',
      });
    });
};


// Retrieve and return all items from the database.
exports.findAll = (req, res) => {
  Item.find({ userId: req.body.userId }) 
    .then((items) => {
      res.send(items);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'An error occurred while retrieving items.',
      });
    });
};

// Delete an item with the specified id in the request
exports.delete = (req, res) => {
  Item.findByIdAndRemove(req.params.id)
    .then((item) => {
      if (!item) {
        return res.status(404).send({
          message: `Item not found with id ${req.params.id}`,
        });
      }
      res.send({ message: 'Item deleted successfully!' });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'An error occurred while deleting the item.',
      });
    });
};


// Update an item by its ID
exports.update = (req, res) => {
  Item.findByIdAndUpdate(req.params.id, {
    category: req.body.category,
    subCategory: req.body.subCategory,
    season: req.body.season,
    images: req.body.images,
    occasion: req.body.occasion, 
    color: req.body.color, 
  }, { new: true })
    .then((item) => {
      if (!item) {
        return res.status(404).send({
          message: `Item not found with id ${req.params.id}`,
        });
      }
      res.send(item);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'An error occurred while updating the item.',
      });
    });
};