const mysql = require('mysql2/promise');

// MySQL 연결 풀 생성
const pool = mysql.createPool({
    host: 'localhost',          // MySQL 서버 호스트
    user: 'root',               // MySQL 사용자 이름
    password: 'Ppsj01!!',  // MySQL 비밀번호
    database: 'hospital_db'     // 사용할 데이터베이스 이름
});

module.exports = pool;
