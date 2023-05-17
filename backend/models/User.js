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
    email: { // add this line
      type: String,
      required: true, // or false, depending on your needs
      unique: true, // or false, depending on your needs
    },
      wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }], // New wishlist field
    }, {
      timestamps: true,
    });


const User = mongoose.model('User', UserSchema);

module.exports = User;
