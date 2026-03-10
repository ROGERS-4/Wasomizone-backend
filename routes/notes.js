const express = require('express');
const multer = require('multer');
const Note = require('../models/Note');
const auth = require('../middleware/authMiddleware');
const router = express.Router();
const path = require('path');

// File upload configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Upload note
router.post('/upload', auth, upload.single('file'), async (req, res) => {
  const { title, university, faculty, course, year } = req.body;
  try {
    const note = new Note({
      title,
      university,
      faculty,
      course,
      year,
      fileURL: `/uploads/${req.file.filename}`,
      uploadedBy: req.user.id
    });
    await note.save();
    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all notes
router.get('/', async (req, res) => {
  const { faculty, university, course } = req.query;
  const filter = {};
  if (faculty) filter.faculty = faculty;
  if (university) filter.university = university;
  if (course) filter.course = course;

  try {
    const notes = await Note.find(filter).populate('uploadedBy', 'name university');
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single note
router.get('/:id', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id).populate('uploadedBy', 'name university');
    if (!note) return res.status(404).json({ msg: 'Note not found' });
    res.json(note);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;