const User = require('../models/User');
const bcrypt = require('bcrypt');
const Item = require('../models/Item'); // Add this line to require the Item model

// Create and Save a new user
exports.create = async (req, res) => {
  if (!req.body.username) {
    return res.status(400).send({
      message: 'User name cannot be empty',
    });
  }

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

  const user = new User({
    username: req.body.username,
    password: hashedPassword,
  });

  user
    .save()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'An error occurred while creating the user.',
      });
    });
};

// Find a single user with a id
exports.findOne = (req, res) => {
  User.findById(req.params.id)
    .then(user => {
      if (!user) {
        return res.status(404).send({
          message: `User not found with id ${req.params.id}`
        });
      }
      res.send(user);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || 'An error occurred while finding the user.'
      });
    });
};

// Find all users
exports.findAll = (req, res) => {
  User.find()
    .then((users) => {
      res.send(users);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving users.',
      });
    });
};

// Delete a user by its ID
exports.delete = (req, res) => {
  User.findByIdAndRemove(req.params.id)
    .then((user) => {
      if (!user) {
        return res.status(404).send({
          message: `User not found with id ${req.params.id}`,
        });
      }
      res.send({ message: 'User deleted successfully!' });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'An error occurred while deleting the user.',
      });
    });
};

// Update a user
exports.update = (req, res) => {
  if (!req.body.username) {
    return res.status(400).send({
      message: 'User name cannot be empty',
    });
  }

  const updateUser = {
    username: req.body.username,
  };

  if (req.body.password) {
    const saltRounds = 10;
    const hashedPassword = bcrypt.hashSync(req.body.password, saltRounds);
    updateUser.password = hashedPassword;
  }

  User.findByIdAndUpdate(req.params.id, updateUser, { new: true })
    .then(user => {
      if (!user) {
        return res.status(404).send({
          message: `User not found with id ${req.params.id}`,
        });
      }
      res.send(user);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || 'An error occurred while updating the user.',
      });
    });
};

// Add an item to a user's wishlist
exports.addItemToWishlist = async (req, res) => {
  try {
    if(!req.user.id || !req.body.itemId) {
      return res.status(400).send({
        message: 'Both user and item IDs must be provided'
      });
    }

    const user = await User.findById(req.user.id);
    const item = await Item.findById(req.body.itemId);

    if (!user || !item) {
      return res.status(404).send({
        message: `User or Item not found with provided id`
      });
    }

    if (!user.wishlist.includes(item._id)) {
      user.wishlist.push(item._id);
      await user.save();
    }

    res.send(user.wishlist);
  } catch (err) {
    res.status(500).send({
      message: err.message || 'An error occurred while adding the item to the wishlist.'
    });
  }
};

// Remove an item from a user's wishlist
exports.removeItemFromWishlist = async (req, res) => {
  try {
    if(!req.user.id || !req.body.itemId) {
      return res.status(400).send({
        message: 'Both user and item IDs must be provided'
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).send({
        message: `User not found with provided id`
      });
    }

    user.wishlist = user.wishlist.filter((itemId) => itemId.toString() !== req.body.itemId);
    await user.save();

    res.send(user.wishlist);
  } catch (err) {
    res.status(500).send({
      message: err.message || 'An error occurred while removing the item from the wishlist.'
    });
  }
};

// Get a user's wishlist
exports.getWishlist = async (req, res) => {
  try {
    if(!req.userId) {
      return res.status(400).send({
        message: 'No user is logged in'
      });
    }
    
    const user = await User.findById(req.userId).populate('wishlist');
    if (!user) {
      return res.status(404).send({
        message: `User not found with id ${req.userId}`
      });
    }
    res.send(user.wishlist);
  } catch (err) {
    res.status(500).send({
      message: err.message || 'An error occurred while getting the wishlist.'
    });
  }
};


module.exports = {
  create: exports.create,
  findAll: exports.findAll,
  delete: exports.delete,
  update: exports.update,
  addItemToWishlist: exports.addItemToWishlist,
  removeItemFromWishlist: exports.removeItemFromWishlist,
  getWishlist: exports.getWishlist,
};