const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
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
    type: [String],
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Item', ItemSchema);
