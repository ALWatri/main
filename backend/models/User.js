const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    sparse: true,
  },
  password: {
    type: String,
    required: true,
  },
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }], // New wishlist field
}, {
  timestamps: true,
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
