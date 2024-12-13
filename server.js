const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json()); 

// SQLite 데이터베이스 연결
const db = new sqlite3.Database('./hospital_data.db', err => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database.');
  }
});

// 병원 정보 추가 API
app.post('/api/hospitals', (req, res) => {
  const { encrypted_code, name, address, phone_number, total_doctors, specialists, region_id } = req.body;

  const query = `
    INSERT INTO hospitals (encrypted_code, name, address, phone_number, total_doctors, specialists, region_id)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(query, [encrypted_code, name, address, phone_number, total_doctors, specialists, region_id], function (err) {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.status(201).send({ id: this.lastID });
    }
  });
});

// 진료 과목 추가 API
app.post('/api/specialties', (req, res) => {
  const { encrypted_code, specialty_code, specialty_name, specialist_count } = req.body;

  const query = `
    INSERT INTO specialties (encrypted_code, specialty_code, specialty_name, specialist_count)
    VALUES (?, ?, ?, ?)
  `;

  db.run(query, [encrypted_code, specialty_code, specialty_name, specialist_count], function (err) {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.status(201).send({ id: this.lastID });
    }
  });
});

// 지역, 진료과목 조건을 포함한 병원 검색 API
app.get('/api/hospitals', (req, res) => {
  const { province_name, city_name, specialty_name } = req.query;

  let query = `
    SELECT h.encrypted_code, h.name, h.address, h.phone_number, h.total_doctors, h.specialists,
           r.province_name, r.city_name, r.town_name,
           s.specialty_name, s.specialist_count
    FROM hospitals h
    INNER JOIN regions r ON h.region_id = r.id
    LEFT JOIN specialties s ON h.encrypted_code = s.encrypted_code
    WHERE 1=1
  `;
  const params = [];

  if (province_name) {
    query += ' AND r.province_name = ?';
    params.push(province_name);
  }

  if (city_name) {
    query += ' AND r.city_name = ?';
    params.push(city_name);
  }

  if (specialty_name) {
    query += ' AND s.specialty_name = ?';
    params.push(specialty_name);
  }

  db.all(query, params, (err, rows) => {
    if (err) {
      console.error('Database error: ', err);
      res.status(500).send(err.message);
    } else {
      res.json(rows);
    }
  });
});

// 병원 상세 정보 API
app.get('/api/hospitals/:id', (req, res) => {
  const { id } = req.params;

  const query = `
    SELECT h.encrypted_code, h.name, h.address, h.phone_number, h.total_doctors, h.specialists,
           r.province_name, r.city_name, r.town_name
    FROM hospitals h
    INNER JOIN regions r ON h.region_id = r.id
    WHERE h.encrypted_code = ?
  `;

  db.get(query, [id], (err, row) => {
    if (err) {
      res.status(500).send(err.message);
    } else if (!row) {
      res.status(404).send({ error: "Hospital not found" });
    } else {
      res.json(row);
    }
  });
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
