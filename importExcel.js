const xlsx = require('xlsx');
const mysql = require('mysql2/promise');

// MySQL 데이터베이스 연결 설정
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Ppsj01!!',
  database: 'hospital_db',
});

// 엑셀 데이터를 MySQL 테이블에 삽입하는 함수
const importExcelToMySQL = async () => {
    try {
      // 엑셀 데이터를 읽는 부분은 기존 코드와 동일
      const workbook1 = xlsx.readFile('hospital_data.xlsx');
      const sheet1 = workbook1.Sheets[workbook1.SheetNames[0]];
      const hospitalsData = xlsx.utils.sheet_to_json(sheet1);
  
      const workbook2 = xlsx.readFile('detail_info_data.xlsx');
      const sheet2 = workbook2.Sheets[workbook2.SheetNames[0]];
      const specialtiesData = xlsx.utils.sheet_to_json(sheet2);
  
      const connection = await pool.getConnection();
  
      // 병원 데이터 삽입
      let rowIndex = 0; // 데이터의 행 번호 추적
      for (const row of hospitalsData) {
        rowIndex++; // 현재 행 번호 증가
  
        // province_code 값 확인
        if (!row['시도코드']) {
          console.error(`Error: province_code is missing at row ${rowIndex}`);
          console.error(`Row Data: ${JSON.stringify(row)}`);
          continue; // 다음 데이터로 넘어감
        }
  
        const regionQuery = `
          INSERT INTO regions (province_code, province_name, city_code, city_name, town_name)
          VALUES (?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE id=id
        `;
        await connection.execute(regionQuery, [
          row['시도코드'],         // province_code
          row['시도코드명'],       // province_name
          row['시군구코드'],       // city_code
          row['시군구코드명'],     // city_name
          row['읍면동'] || null,   // town_name
        ]);
      }
  
      console.log('데이터가 성공적으로 삽입되었습니다!');
      connection.release();
    } catch (error) {
      console.error('데이터 삽입 중 오류 발생:', error.message);
    }
  };
  
  

//const importExcelToMySQL = async () => {
//   try {
//     // 1. 병원정보서비스 엑셀 데이터 읽기
//     const workbook1 = xlsx.readFile('hospital_data.xlsx');
//     const sheet1 = workbook1.Sheets[workbook1.SheetNames[0]];
//     const hospitalsData = xlsx.utils.sheet_to_json(sheet1);

//     // 2. 의료기관별상세정보서비스 엑셀 데이터 읽기
//     const workbook2 = xlsx.readFile('detail_info_data.xlsx');
//     const sheet2 = workbook2.Sheets[workbook2.SheetNames[0]];
//     const specialtiesData = xlsx.utils.sheet_to_json(sheet2);

//     const connection = await pool.getConnection();

//     // 3. 병원 데이터 삽입
//     for (const row of hospitalsData) {
//       const regionQuery = `
//         SELECT id FROM regions WHERE province_name = ? AND city_name = ?
//       `;
//       const [regionRows] = await connection.execute(regionQuery, [
//         row['시도코드명'],
//         row['시군구코드명'],
//       ]);

//       const regionId = regionRows[0]?.id || null;

//       const hospitalQuery = `
//         INSERT INTO hospitals (
//           encrypted_code, name, address, phone_number, total_doctors, specialists, region_id
//         ) VALUES (?, ?, ?, ?, ?, ?, ?)
//       `;
//       await connection.execute(hospitalQuery, [
//         row['암호화요양기호'],
//         row['요양기관명'],
//         row['주소'],
//         row['전화번호'],
//         row['총의사수'],
//         row['의과전문의 인원수'],
//         regionId,
//       ]);
//     }

//     // 4. 진료 과목 데이터 삽입
//     for (const row of specialtiesData) {
//       const specialtyQuery = `
//         INSERT INTO specialties (
//           encrypted_code, specialty_code, specialty_name, specialist_count
//         ) VALUES (?, ?, ?, ?)
//       `;
//       await connection.execute(specialtyQuery, [
//         row['암호화요양기호'],
//         row['진료과목코드'],
//         row['진료과목코드명'],
//         row['과목별 전문의수'],
//       ]);
//     }

//     console.log('데이터가 성공적으로 삽입되었습니다!');
//     connection.release();
//   } catch (error) {
//     console.error('데이터 삽입 중 오류 발생:', error.message);
//   }
// };

importExcelToMySQL();
