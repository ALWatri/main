const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: true,
  },
  subCategory: {
    type: String,
    required: true,
  },
  season: {
    type: String,
    required: true,
  },
  images: {
    type: [String],
    required: true,
  },
  occasion: {
    type: [String], // Change this line
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
}, {
  timestamps: true, 
});

const Item = mongoose.model('Item', ItemSchema);

module.exports = Item;