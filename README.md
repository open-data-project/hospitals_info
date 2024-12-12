
# 데이터베이스 스키마 설계
1.병원정보서비스 2024.9.xlsx -> hospital_data.xlsx
5.의료기관별상세정보서비스_03_진료과목정보 2024.9.xlsx -> detail_info_data.xlsx
## 1. 병원 정보 테이블 (`hospitals`)

| **컬럼명 (영어)**    | **데이터 타입** | **제약 조건**                    | **설명 (한국어)**            |
|---------------------|----------------|----------------------------------|-----------------------------|
| `encrypted_code`    | VARCHAR(255)   | PRIMARY KEY                     | 병원의 고유 ID (암호화요양기호) |
| `name`              | VARCHAR(255)  | NOT NULL                        | 병원 이름                   |
| `address`           | TEXT          | NOT NULL                        | 병원의 상세 주소            |
| `phone_number`      | VARCHAR(50)   | NULLABLE                        | 병원의 전화번호             |
| `total_doctors`     | INT           | DEFAULT 0                       | 병원의 총 의사 수           |
| `specialists`       | INT           | DEFAULT 0                       | 병원의 전문의 수            |
| `region_id`         | INT           | FOREIGN KEY REFERENCES regions(id) | 지역 참조 ID              |

```sql
CREATE TABLE hospitals (
    encrypted_code VARCHAR(255) PRIMARY KEY,       -- 병원의 고유 ID (암호화요양기호)
    name VARCHAR(255) NOT NULL,                  -- 병원 이름
    address TEXT NOT NULL,                       -- 병원의 상세 주소
    phone_number VARCHAR(50),                    -- 병원의 전화번호
    total_doctors INT DEFAULT 0,                 -- 병원의 총 의사 수
    specialists INT DEFAULT 0,                   -- 병원의 전문의 수
    region_id INT,                               -- 지역 참조 ID
    FOREIGN KEY (region_id) REFERENCES regions(id)
);
```

---

## 2. 지역 정보 테이블 (`regions`)

| **컬럼명 (영어)**    | **데이터 타입** | **제약 조건**                    | **설명 (한국어)**            |
|---------------------|----------------|----------------------------------|-----------------------------|
| `id`               | INT           | PRIMARY KEY, AUTO_INCREMENT      | 지역 고유 ID                |
| `province_code`     | VARCHAR(10)   | NOT NULL                        | 시/도 코드                  |
| `province_name`     | VARCHAR(100)  | NOT NULL                        | 시/도 이름                  |
| `city_code`         | VARCHAR(10)   | NOT NULL                        | 시/군/구 코드               |
| `city_name`         | VARCHAR(100)  | NOT NULL                        | 시/군/구 이름               |
| `town_name`         | VARCHAR(100)  | NULLABLE                        | 읍/면/동 이름               |

```sql
CREATE TABLE regions (
    id INT PRIMARY KEY AUTO_INCREMENT,           -- 지역 고유 ID
    province_code VARCHAR(10) NOT NULL,          -- 시/도 코드
    province_name VARCHAR(100) NOT NULL,         -- 시/도 이름
    city_code VARCHAR(10) NOT NULL,              -- 시/군/구 코드
    city_name VARCHAR(100) NOT NULL,             -- 시/군/구 이름
    town_name VARCHAR(100),                      -- 읍/면/동 이름
    UNIQUE (province_code, city_code, town_name) -- 복합 고유 키로 중복 방지
);

```

---

## 3. 진료 과목 테이블 (`specialties`)

| **컬럼명 (영어)**    | **데이터 타입** | **제약 조건**                    | **설명 (한국어)**            |
|---------------------|----------------|----------------------------------|-----------------------------|
| `id`               | INT           | PRIMARY KEY, AUTO_INCREMENT      | 진료 과목 고유 ID           |
| `encrypted_code`    | VARCHAR(255)   | FOREIGN KEY REFERENCES hospitals(encrypted_code) | 병원 고유 ID (암호화요양기호) |
| `specialty_code`    | VARCHAR(10)   | NOT NULL                        | 진료 과목 코드              |
| `specialty_name`    | VARCHAR(255)  | NOT NULL                        | 진료 과목 이름              |
| `specialist_count`  | INT           | DEFAULT 0                       | 해당 과목의 전문의 수       |

```sql
CREATE TABLE specialties (
    id INT PRIMARY KEY AUTO_INCREMENT,           -- 진료 과목 고유 ID
    encrypted_code VARCHAR(255),                 -- 병원 고유 ID (암호화요양기호)
    specialty_code VARCHAR(10) NOT NULL,         -- 진료 과목 코드
    specialty_name VARCHAR(255) NOT NULL,        -- 진료 과목 이름
    specialist_count INT DEFAULT 0,              -- 해당 과목의 전문의 수
    FOREIGN KEY (encrypted_code) REFERENCES hospitals(encrypted_code)
);
```

---
