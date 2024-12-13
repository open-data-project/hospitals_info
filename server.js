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

// 즐겨찾기 병원 추가 API
app.post('/api/favorites', (req, res) => {
  const { hospitalId } = req.body;

  const query = `
    INSERT INTO favorites (hospital_id)
    VALUES (?)
  `;

  db.run(query, [hospitalId], function (err) {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.status(201).send({ message: 'Hospital added to favorites' });
    }
  });
});

// 즐겨찾기 병원 목록 조회 API
app.get('/api/favorites', (req, res) => {
  const query = `
    SELECT h.encrypted_code, h.name, h.address, h.phone_number, h.total_doctors, h.specialists,
           r.province_name, r.city_name, r.town_name
    FROM hospitals h
    INNER JOIN favorites f ON h.encrypted_code = f.hospital_id
    INNER JOIN regions r ON h.region_id = r.id
  `;

  db.all(query, [], (err, rows) => {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.json(rows); // 즐겨찾기한 병원 목록 반환
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

  // province_name 파라미터가 있으면 조건 추가
  if (province_name) {
    query += ' AND r.province_name = ?';
    params.push(province_name);
  }

  // city_name 파라미터가 있으면 조건 추가
  if (city_name) {
    query += ' AND r.city_name = ?';
    params.push(city_name);
  }

  // specialty_name 파라미터가 있으면 조건 추가 및 specialists > 0
  if (specialty_name) {
    query += ' AND s.specialty_name = ? AND s.specialist_count > 0';
    params.push(specialty_name);
  }

  db.all(query, params, (err, rows) => {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.json(rows); // 병원 목록 반환
    }
  });
});

// 병원 상세 정보 및 해당 병원의 모든 진료과목과 전문의 수 조회 API
app.get('/api/hospitals/:id', (req, res) => {
  const { id } = req.params;

  const query = `
    SELECT h.encrypted_code, h.name, h.address, h.phone_number, h.total_doctors, h.specialists,
           r.province_name, r.city_name, r.town_name,
           s.specialty_name, s.specialist_count
    FROM hospitals h
    INNER JOIN regions r ON h.region_id = r.id
    LEFT JOIN specialties s ON h.encrypted_code = s.encrypted_code
    WHERE h.encrypted_code = ?
  `;

  db.all(query, [id], (err, rows) => {
    if (err) {
      res.status(500).send(err.message);
    } else if (!rows || rows.length === 0) {
      res.status(404).send({ error: "Hospital not found" });
    } else {
      const hospitalInfo = {
        hospital: {
          encrypted_code: rows[0].encrypted_code,
          name: rows[0].name,
          address: rows[0].address,
          phone_number: rows[0].phone_number,
          total_doctors: rows[0].total_doctors,
          specialists: rows[0].specialists,
          province_name: rows[0].province_name,
          city_name: rows[0].city_name,
          town_name: rows[0].town_name
        },
        specialties: rows.map(row => ({
          specialty_name: row.specialty_name,
          specialist_count: row.specialist_count
        }))
      };

      res.json(hospitalInfo);
    }
  });
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
