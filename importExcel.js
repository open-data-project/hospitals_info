const xlsx = require('xlsx');
const mysql = require('mysql2/promise');

// MySQL 데이터베이스 연결 설정
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Ppsj01!!',
  database: 'hospital_db',
});

// 지역 데이터 삽입 함수
const insertRegions = async (connection, hospitalsData) => {
  let rowIndex = 0;
  for (const row of hospitalsData) {
    rowIndex++;

    const provinceCode = row['시도코드'];
    const provinceName = row['시도코드명'];
    const cityCode = row['시군구코드'];
    const cityName = row['시군구코드명'];
    const townName = row['읍면동'];

    if (!provinceCode || !provinceName || !cityCode || !cityName) {
      console.error(`Error in regions data at row ${rowIndex}:`, row);
      continue;
    }

    const query = `
      INSERT INTO regions (province_code, province_name, city_code, city_name, town_name)
      VALUES (?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE id=id
    `;
    await connection.execute(query, [provinceCode, provinceName, cityCode, cityName, townName]);
  }
};

// 병원 데이터 삽입 함수
const insertHospitals = async (connection, hospitalsData) => {
  let rowIndex = 0;
  for (const row of hospitalsData) {
    rowIndex++;

    const encryptedCode = row['암호화요양기호'];
    const name = row['요양기관명'];
    const address = row['주소'];
    const phoneNumber = row['전화번호'] || null;
    const totalDoctors = row['총의사수'] || 0;
    const specialists = row['의과전문의 인원수'] || 0;

    const regionQuery = `
      SELECT id FROM regions WHERE province_name = ? AND city_name = ?
    `;
    const [regionRows] = await connection.execute(regionQuery, [
      row['시도코드명'],
      row['시군구코드명'],
    ]);
    const regionId = regionRows[0]?.id || null;

    if (!encryptedCode || !name || !regionId) {
      console.error(`Error in hospitals data at row ${rowIndex}:`, row);
      throw new Error(`Invalid hospital data at row ${rowIndex}`);
    }

    const query = `
      INSERT INTO hospitals (encrypted_code, name, address, phone_number, total_doctors, specialists, region_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    await connection.execute(query, [encryptedCode, name, address, phoneNumber, totalDoctors, specialists, regionId]);
  }
};

// 진료 과목 데이터 삽입 함수
const insertSpecialties = async (connection, specialtiesData) => {
  let rowIndex = 0;
  for (const row of specialtiesData) {
    rowIndex++;

    const encryptedCode = row['암호화요양기호'];
    const specialtyCode = row['진료과목코드'];
    const specialtyName = row['진료과목코드명'];
    const specialistCount = row['과목별 전문의수'] || 0;

    if (!encryptedCode || !specialtyCode || !specialtyName) {
      console.error(`Error in specialties data at row ${rowIndex}:`, row);
      throw new Error(`Invalid specialties data at row ${rowIndex}`);
    }

    const query = `
      INSERT INTO specialties (encrypted_code, specialty_code, specialty_name, specialist_count)
      VALUES (?, ?, ?, ?)
    `;
    await connection.execute(query, [encryptedCode, specialtyCode, specialtyName, specialistCount]);
  }
};

// 메인 함수: 데이터 삽입 실행
const importExcelToMySQL = async () => {
  const connection = await pool.getConnection();
  try {
    // 트랜잭션 시작
    await connection.beginTransaction();

    const workbook1 = xlsx.readFile('hospital_data.xlsx');
    const sheet1 = workbook1.Sheets[workbook1.SheetNames[0]];
    const hospitalsData = xlsx.utils.sheet_to_json(sheet1);

    const workbook2 = xlsx.readFile('detail_info_data.xlsx');
    const sheet2 = workbook2.Sheets[workbook2.SheetNames[0]];
    const specialtiesData = xlsx.utils.sheet_to_json(sheet2);

    await insertRegions(connection, hospitalsData);    // 지역 데이터 삽입
    // await insertHospitals(connection, hospitalsData); // 병원 데이터 삽입
    // await insertSpecialties(connection, specialtiesData); // 진료 과목 데이터 삽입

    // 트랜잭션 커밋
    await connection.commit();
    console.log('Regions data successfully inserted!');
  } catch (error) {
    // 에러 발생 시 롤백
    await connection.rollback();
    console.error('Error during data import, rolling back:', error.message);
  } finally {
    connection.release();
  }
};

// 실행
importExcelToMySQL();
