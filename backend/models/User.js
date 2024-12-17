const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  profileImage: { type: String, default: "https://via.placeholder.com/60" },
  role: { type: String, enum: ['admin', 'user'], default: 'user' }, // Role field
});

const User = mongoose.model('User', userSchema);
module.exports = User;
