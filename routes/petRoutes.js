const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();

// SQLite Database Connection
const dbPath = 'C:/Users/emili_puf0yfz/OneDrive/Desktop/tamagotchi.db';
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE);

// Get current pet status
router.get('/pet', (req, res) => {
  db.get('SELECT * FROM Pet', (err, row) => {
    if (err) {
      res.status(500).json({ message: err.message });
      return;
    }
    res.json(row);
  });
});

// Update pet's health and happiness
router.post('/update', (req, res) => {
  const { health, happiness, name } = req.body;
  db.run('UPDATE Pet SET health = ?, happiness = ?, name = ? WHERE id = 1', [health, happiness, name], (err) => {
    if (err) {
      res.status(400).json({ message: err.message });
      return;
    }
    res.json({ health, happiness, name });
  });
});

// Create a new pet (reset , pet's health and happiness)
router.post('/new-pet', (req, res) => {
  const { name } = req.body;
  const newHealth = 100;
  const newHappiness = 100;

  // exista deja animal in baza de date? verificare
  db.get('SELECT * FROM Pet WHERE id = 1', (err, row) => {
    if (err) {
      res.status(500).json({ message: err.message });
      return;
    }

    if (!row) {
      
      res.status(404).json({ message: 'No pet found with id 1. Create a new pet first.' });
      return;
    }

  
    db.run('UPDATE Pet SET name = ? WHERE id = 1', [name || 'New Pet'], (err) => {
      if (err) {
        res.status(400).json({ message: err.message });
        return;
      }
      res.json({ name: name || 'New Pet', health: newHealth, happiness: newHappiness });
    });
  });
});

module.exports = router;
