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
    SELECT 
      h.encrypted_code, 
      h.name, 
      h.address, 
      h.phone_number, 
      h.total_doctors, 
      h.specialists,
      r.province_name, 
      r.city_name, 
      r.town_name,
      GROUP_CONCAT(s.specialty_name) AS specialties, -- 병원 진료 과목을 하나의 문자열로 결합
      GROUP_CONCAT(s.specialist_count) AS specialist_counts -- 진료 과목별 전문의 수를 하나의 문자열로 결합
    FROM hospitals h
    INNER JOIN favorites f ON h.encrypted_code = f.hospital_id
    INNER JOIN regions r ON h.region_id = r.id
    LEFT JOIN specialties s ON h.encrypted_code = s.encrypted_code
    GROUP BY h.encrypted_code, h.name, h.address, h.phone_number, h.total_doctors, h.specialists, r.province_name, r.city_name, r.town_name
  `;

  db.all(query, [], (err, rows) => {
    if (err) {
      res.status(500).send(err.message);
    } else {
      const formattedRows = rows.map(row => {
        const specialtiesArray = row.specialties ? row.specialties.split(',') : [];
        const specialistCountsArray = row.specialist_counts ? row.specialist_counts.split(',').map(Number) : [];

        // Combine specialties and specialist counts into [["진료 과목", 전문의 수], ...] format
        const combinedSpecialties = specialtiesArray.map((specialty, index) => [
          specialty,
          specialistCountsArray[index] || 0
        ]);

        return {
          encrypted_code: row.encrypted_code,
          name: row.name,
          address: row.address,
          phone_number: row.phone_number,
          total_doctors: row.total_doctors,
          specialists: row.specialists,
          province_name: row.province_name,
          city_name: row.city_name,
          town_name: row.town_name,
          specialties: combinedSpecialties // Combined data
        };
      });

      res.json(formattedRows); // 변환된 데이터를 반환
    }
  });
});


// 병원 검색 API (이름, 지역, 진료 과목 포함)
app.get('/api/hospitals', (req, res) => {
  const { hospital_name, province_name, city_name, specialty_name } = req.query;

  let query = `
    SELECT h.encrypted_code, h.name, h.address, h.phone_number, h.total_doctors, h.specialists,
           r.province_name, r.city_name, r.town_name
    FROM hospitals h
    INNER JOIN regions r ON h.region_id = r.id
    LEFT JOIN specialties s ON h.encrypted_code = s.encrypted_code
    WHERE 1=1
  `;

  const params = [];

  // 병원 이름 조건 추가
  if (hospital_name) {
    query += ' AND h.name LIKE ?';
    params.push(`%${hospital_name}%`);
  }

  // 지역 조건 추가
  if (province_name) {
    query += ' AND r.province_name = ?';
    params.push(province_name);
  }

  if (city_name) {
    query += ' AND r.city_name = ?';
    params.push(city_name);
  }

  // 진료 과목 조건 추가
  if (specialty_name) {
    query += ' AND s.specialty_name = ? AND s.specialist_count > 0';
    params.push(specialty_name);
  }

  query += ` GROUP BY h.encrypted_code, h.name, h.address, h.phone_number, h.total_doctors, h.specialists, r.province_name, r.city_name, r.town_name`;

  db.all(query, params, (err, rows) => {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.json(rows); // 검색 결과 반환
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
