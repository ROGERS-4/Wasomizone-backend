const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  universityEmail: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  university: { type: String, required: true },
  faculty: { type: String, required: true },
  isVerified: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);