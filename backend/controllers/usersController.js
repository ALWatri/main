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

// Add an item to the wishlist
exports.addItemToWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const item = await Item.findById(req.params.itemId);

    if (!user || !item) {
      return res.status(404).json({ message: 'User or item not found' });
    }

    if (user.wishlist.indexOf(item._id) !== -1) {
      return res.status(400).json({ message: 'Item already in wishlist' });
    }

    user.wishlist.push(item._id);
    await user.save();
    res.status(200).json({ message: 'Item added to wishlist', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Remove an item from the wishlist
exports.removeItemFromWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const itemIndex = user.wishlist.indexOf(req.params.itemId);

    if (itemIndex === -1) {
      return res.status(400).json({ message: 'Item not in wishlist' });
    }

    user.wishlist.splice(itemIndex, 1);
    await user.save();
    res.status(200).json({ message: 'Item removed from wishlist', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get the user's wishlist
exports.getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate('wishlist');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ wishlist: user.wishlist });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
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