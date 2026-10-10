const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// API Routes

// Welcome message route (Level 2: Task 2)
app.get('/api/welcome', (req, res) => {
  res.json({ message: "Welcome to the Sysslan IT Solutions Event Feedback API!" });
});

// Get all events
app.get('/api/events', async (req, res) => {
  try {
    const events = await db.getEvents();
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve events.", details: err.message });
  }
});

// Get all feedback (Level 2: Task 4, Level 3: Task 4)
app.get('/api/feedback', async (req, res) => {
  try {
    const feedbacks = await db.getFeedback();
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve feedback.", details: err.message });
  }
});

// Receive feedback form data (Level 2: Task 3, Level 4: Task 1)
app.post('/api/feedback', async (req, res) => {
  try {
    const { name, email, event_id, rating, comments } = req.body;
    
    // Server-side validation (Level 4: Task 4)
    if (!name || !name.trim()) {
      return res.status(400).json({ error: "Name is required." });
    }
    if (!email || !email.trim()) {
      return res.status(400).json({ error: "Email is required." });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Please enter a valid email address." });
    }
    if (!event_id) {
      return res.status(400).json({ error: "Event selection is required." });
    }
    const ratingNum = parseInt(rating, 10);
    if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5." });
    }

    const savedFb = await db.saveFeedback({
      name: name.trim(),
      email: email.trim(),
      event_id,
      rating: ratingNum,
      comments: comments ? comments.trim() : ''
    });

    res.status(201).json({
      success: true,
      message: "Feedback submitted successfully!",
      feedback: savedFb
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to save feedback.", details: err.message });
  }
});

// Initialize database and start the server
db.init().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error("Failed to initialize database:", err);
  process.exit(1);
});
