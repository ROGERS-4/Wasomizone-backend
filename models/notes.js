const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  university: { type: String, required: true },
  faculty: { type: String, required: true },
  course: { type: String, required: true },
  year: { type: Number, required: true },
  fileURL: { type: String, required: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Note', NoteSchema);