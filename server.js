const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json()); 

// SQLite 데이터베이스 초기화
const db = new sqlite3.Database('./hospital.db', err => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database.');
    db.run(
      `CREATE TABLE IF NOT EXISTS hospitals (
       id INTEGER PRIMARY KEY AUTOINCREMENT,
       name TEXT NOT NULL,
       address TEXT NOT NULL
     )`,
      err => {
        if (err) {
          console.error('Error creating table:', err);
        }
      }
    );
  }
});

// 병원 목록 가져오기
app.get('/api/hospitals', (req, res) => {
  db.all('SELECT * FROM hospitals', [], (err, rows) => {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.json(rows);
    }
  });
});

// 병원 추가
app.post('/api/hospitals', (req, res) => {
  const { name, address } = req.body;
  db.run(
    `INSERT INTO hospitals (name, address) VALUES (?, ?)`,
    [name, address],
    function (err) {
      if (err) {
        res.status(500).send(err.message);
      } else {
        res.status(201).send({ id: this.lastID });
      }
    }
  );
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
