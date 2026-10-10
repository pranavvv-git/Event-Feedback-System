const fs = require('fs');
const path = require('path');

let db = null;
let useJsonFallback = false;
const DB_PATH = path.join(__dirname, 'feedback.db');
const JSON_DB_PATH = path.join(__dirname, 'feedback.json');

// Get sample events for database seeding
function getSampleEvents() {
  return [
    {
      title: "Web Development Bootcamp",
      description: "Learn the fundamentals of HTML, CSS, and modern Javascript. Perfect for beginners starting their full stack journey.",
      date: "2026-08-10",
      location: "Online / Zoom",
      category: "Frontend"
    },
    {
      title: "AI & Machine Learning Seminar",
      description: "Explore cutting-edge developments in artificial intelligence, neural networks, and machine learning models.",
      date: "2026-08-18",
      location: "Main Auditorium, Tech Park",
      category: "AI/ML"
    },
    {
      title: "Cloud Architecture Masterclass",
      description: "Design and implement highly scalable, fault-tolerant cloud infrastructures using modern DevOps and containerization.",
      date: "2026-09-05",
      location: "Hybrid / Microsoft Teams",
      category: "Cloud"
    },
    {
      title: "Blockchain & Decentralized Web",
      description: "Dive deep into smart contracts, decentralized applications (dApps), and the future of web3 protocols.",
      date: "2026-09-22",
      location: "Seminar Hall B, Block 4",
      category: "Blockchain"
    }
  ];
}

// Setup fallback JSON database
function setupJsonFallback(resolve) {
  useJsonFallback = true;
  if (!fs.existsSync(JSON_DB_PATH)) {
    const initialData = {
      events: getSampleEvents().map((e, index) => ({ id: index + 1, ...e })),
      feedback: []
    };
    fs.writeFileSync(JSON_DB_PATH, JSON.stringify(initialData, null, 2), 'utf8');
    console.log('Initialized fallback JSON database with sample events.');
  } else {
    console.log('Using existing fallback JSON database.');
  }
  resolve();
}

// Setup SQLite schemas
function setupSqliteSchema(resolve) {
  db.serialize(() => {
    // Create events table
    db.run(`
      CREATE TABLE IF NOT EXISTS events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        date TEXT,
        location TEXT,
        category TEXT
      )
    `);

    // Create feedback table
    db.run(`
      CREATE TABLE IF NOT EXISTS feedback (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        event_id INTEGER,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        rating INTEGER NOT NULL,
        comments TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (event_id) REFERENCES events (id)
      )
    `);

    // Seed events if empty
    db.get("SELECT COUNT(*) as count FROM events", (err, row) => {
      if (err) {
        console.error("Error checking events count in SQLite, falling back to JSON:", err);
        setupJsonFallback(resolve);
        return;
      }

      if (row.count === 0) {
        const stmt = db.prepare("INSERT INTO events (title, description, date, location, category) VALUES (?, ?, ?, ?, ?)");
        const sampleEvents = getSampleEvents();
        for (const ev of sampleEvents) {
          stmt.run(ev.title, ev.description, ev.date, ev.location, ev.category);
        }
        stmt.finalize();
        console.log('Seeded sample events in SQLite database.');
      }
      resolve();
    });
  });
}

// Initialize database connection
function init() {
  return new Promise((resolve) => {
    try {
      const sqlite3 = require('sqlite3').verbose();
      db = new sqlite3.Database(DB_PATH, (err) => {
        if (err) {
          console.error('Failed to connect to SQLite. Falling back to JSON file database.', err);
          setupJsonFallback(resolve);
        } else {
          console.log('Connected to SQLite database.');
          setupSqliteSchema(resolve);
        }
      });
    } catch (e) {
      console.warn('sqlite3 module not available or failed to load. Falling back to JSON database:', e.message);
      setupJsonFallback(resolve);
    }
  });
}

// Get all events
function getEvents() {
  return new Promise((resolve, reject) => {
    if (useJsonFallback) {
      try {
        const data = JSON.parse(fs.readFileSync(JSON_DB_PATH, 'utf8'));
        resolve(data.events);
      } catch (err) {
        reject(err);
      }
      return;
    }
    db.all("SELECT * FROM events", [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

// Get all feedback records with event titles
function getFeedback() {
  return new Promise((resolve, reject) => {
    if (useJsonFallback) {
      try {
        const data = JSON.parse(fs.readFileSync(JSON_DB_PATH, 'utf8'));
        const feedbackWithEvents = data.feedback.map(f => {
          const event = data.events.find(e => e.id === Number(f.event_id));
          return {
            ...f,
            event_title: event ? event.title : 'Unknown Event'
          };
        });
        // Sort descending by created_at
        feedbackWithEvents.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        resolve(feedbackWithEvents);
      } catch (err) {
        reject(err);
      }
      return;
    }
    db.all(`
      SELECT f.*, e.title as event_title 
      FROM feedback f 
      LEFT JOIN events e ON f.event_id = e.id
      ORDER BY f.created_at DESC
    `, [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

// Save a feedback submission
function saveFeedback(fb) {
  return new Promise((resolve, reject) => {
    const rating = parseInt(fb.rating, 10);
    const event_id = parseInt(fb.event_id, 10);
    
    if (!fb.name || !fb.email || isNaN(rating) || isNaN(event_id)) {
      return reject(new Error("Invalid feedback data. Fill out all required fields."));
    }

    if (useJsonFallback) {
      try {
        const data = JSON.parse(fs.readFileSync(JSON_DB_PATH, 'utf8'));
        
        // Ensure event exists
        const eventExists = data.events.some(e => e.id === event_id);
        if (!eventExists) {
          return reject(new Error("Selected event does not exist."));
        }

        const newFb = {
          id: data.feedback.length > 0 ? Math.max(...data.feedback.map(f => f.id)) + 1 : 1,
          event_id,
          name: fb.name,
          email: fb.email,
          rating,
          comments: fb.comments || '',
          created_at: new Date().toISOString()
        };
        data.feedback.push(newFb);
        fs.writeFileSync(JSON_DB_PATH, JSON.stringify(data, null, 2), 'utf8');
        resolve(newFb);
      } catch (err) {
        reject(err);
      }
      return;
    }

    // Check if event exists in SQLite first
    db.get("SELECT id FROM events WHERE id = ?", [event_id], (err, row) => {
      if (err) return reject(err);
      if (!row) return reject(new Error("Selected event does not exist."));

      const stmt = db.prepare("INSERT INTO feedback (event_id, name, email, rating, comments) VALUES (?, ?, ?, ?, ?)");
      stmt.run(event_id, fb.name, fb.email, rating, fb.comments || '', function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({
            id: this.lastID,
            event_id,
            name: fb.name,
            email: fb.email,
            rating,
            comments: fb.comments || '',
            created_at: new Date().toISOString()
          });
        }
      });
      stmt.finalize();
    });
  });
}

module.exports = {
  init,
  getEvents,
  getFeedback,
  saveFeedback
};
