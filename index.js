const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Crearea unei instanțe Express
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Ruta pentru servirea fișierelor statice
app.use(express.static(path.join(__dirname, 'public')));

// Conexiunea la baza de date SQLite
const dbPath = 'C:/Users/emili_puf0yfz/OneDrive/Desktop/tamagotchi.db';
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error('Eroare la conectarea la baza de date SQLite:', err.message);
  } else {
    console.log('Conectat la baza de date SQLite');
  }
});

// Get current pet status
app.get('/api/pet', (req, res) => {
  db.get('SELECT * FROM Pet WHERE id = 1', (err, row) => {
    if (err) {
      res.status(500).json({ message: err.message });
      return;
    }
    res.json(row);
  });
});

// Update pet's health and happiness
app.post('/api/update', (req, res) => {
  const { health, happiness, name } = req.body;
  db.run('UPDATE Pet SET health = ?, happiness = ?, name = ? WHERE id = 1', [health, happiness, name], (err) => {
    if (err) {
      res.status(400).json({ message: err.message });
      return;
    }
    res.json({ health, happiness, name });
  });
});

// Create a new pet (reset pet's health and happiness)
app.post('/api/new-pet', (req, res) => {
  const newName = 'New Pet';
  const newHealth = 100;
  const newHappiness = 100;

  db.get('SELECT * FROM Pet WHERE id = 1', (err, row) => {
    if (err) {
      res.status(500).json({ message: err.message });
      return;
    }

    if (!row) {
      db.run('INSERT INTO Pet (id, name, health, happiness) VALUES (1, ?, ?, ?)', [newName, newHealth, newHappiness], (err) => {
        if (err) {
          res.status(500).json({ message: err.message });
          return;
        }
        res.json({ name: newName, health: newHealth, happiness: newHappiness });
      });
    } else {
      db.run('UPDATE Pet SET name = ?, health = ?, happiness = ? WHERE id = 1', [newName, newHealth, newHappiness], (err) => {
        if (err) {
          res.status(400).json({ message: err.message });
          return;
        }
        res.json({ name: newName, health: newHealth, happiness: newHappiness });
      });
    }
  });
});

// Pornirea serverului
app.listen(port, () => {
  console.log(`Serverul rulează pe portul ${port}`);
});

// Închiderea conexiunii SQLite la ieșirea procesului
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Conexiunea la baza de date SQLite a fost închisă');
    process.exit(0);
  });
});
