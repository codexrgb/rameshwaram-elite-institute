require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Connect Database
connectDB();

const app = express();

// Middleware
// Replace the CORS middleware with this:
app.use(cors({
  origin: ['http://127.0.0.1:5500', 'http://localhost:5500'], // Live Server URLs
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/admission', require('./routes/admission'));
app.use('/api/login', require('./routes/login'));
app.use('/api/students', require('./routes/students'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Rameshwaram Elite Institute API is running!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
