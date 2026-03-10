const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const notesRoutes = require('./routes/notes');
const path = require('path');

dotenv.config();

const app = express();
app.use(express.json());

// MongoDB connection
require('./config/db')();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/notes', notesRoutes);

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
