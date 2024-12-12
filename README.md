
## **1. 정규화된 테이블 설계**

### **1.1 병원 테이블 (`hospitals`)**
병원의 기본 정보를 저장합니다.

| 컬럼명              | 데이터 타입    | 제약 조건               | 설명                     |
|---------------------|---------------|-------------------------|--------------------------|
| `id`               | INT           | PRIMARY KEY, AUTO_INCREMENT | 병원 고유 ID            |
| `name`             | VARCHAR(255)  | NOT NULL               | 병원 이름                |
| `category_code`    | VARCHAR(10)   | NOT NULL               | 병원 종별코드            |
| `category_name`    | VARCHAR(100)  | NOT NULL               | 병원 분류명              |
| `region_id`        | INT           | FOREIGN KEY (`region_id`) REFERENCES `regions`(`id`) | 지역 참조 ID            |
| `address`          | TEXT          | NOT NULL               | 병원 주소                |
| `phone_number`     | VARCHAR(50)   | NULLABLE               | 병원 전화번호            |
| `website`          | TEXT          | NULLABLE               | 병원 홈페이지 URL         |


### **1.2 지역 테이블 (`regions`)**
병원이 속한 지역 정보를 저장합니다.

| 컬럼명              | 데이터 타입    | 제약 조건               | 설명                     |
|---------------------|---------------|-------------------------|--------------------------|
| `id`               | INT           | PRIMARY KEY, AUTO_INCREMENT | 지역 고유 ID            |
| `province_code`    | VARCHAR(10)   | NOT NULL               | 시/도 코드               |
| `province_name`    | VARCHAR(100)  | NOT NULL               | 시/도 이름               |
| `city_code`        | VARCHAR(10)   | NOT NULL               | 시/군/구 코드            |
| `city_name`        | VARCHAR(100)  | NOT NULL               | 시/군/구 이름            |
| `town_name`        | VARCHAR(100)  | NULLABLE               | 읍/면/동 이름            |


### **1.3 의료 인력 테이블 (`medical_staff`)**
병원의 의료 인력 정보를 저장합니다.

| 컬럼명                  | 데이터 타입    | 제약 조건               | 설명                     |
|-------------------------|---------------|-------------------------|--------------------------|
| `id`                   | INT           | PRIMARY KEY, AUTO_INCREMENT | 인력 정보 고유 ID        |
| `hospital_id`          | INT           | FOREIGN KEY (`hospital_id`) REFERENCES `hospitals`(`id`) | 병원 참조 ID            |
| `general_doctors`      | INT           | DEFAULT 0              | 일반 의사 수             |
| `interns`              | INT           | DEFAULT 0              | 인턴 수                  |
| `residents`            | INT           | DEFAULT 0              | 레지던트 수              |
| `specialists`          | INT           | DEFAULT 0              | 전문의 수                |
| `dentists`             | INT           | DEFAULT 0              | 치과 의사 수             |
| `oriental_doctors`     | INT           | DEFAULT 0              | 한방 의사 수             |
| `midwives`             | INT           | DEFAULT 0              | 조산사 수                |


### **1.4 진료 과목 테이블 (`specialties`)**
병원이 제공하는 진료 과목 정보를 저장합니다.

| 컬럼명                  | 데이터 타입    | 제약 조건               | 설명                     |
|-------------------------|---------------|-------------------------|--------------------------|
| `id`                   | INT           | PRIMARY KEY, AUTO_INCREMENT | 진료 과목 고유 ID       |
| `specialty_name`       | VARCHAR(255)  | UNIQUE, NOT NULL        | 진료 과목 이름            |


### **1.5 병원-진료 과목 관계 테이블 (`hospital_specialties`)**
병원과 진료 과목 간의 관계를 저장합니다.

| 컬럼명                  | 데이터 타입    | 제약 조건               | 설명                     |
|-------------------------|---------------|-------------------------|--------------------------|
| `id`                   | INT           | PRIMARY KEY, AUTO_INCREMENT | 고유 ID                 |
| `hospital_id`          | INT           | FOREIGN KEY (`hospital_id`) REFERENCES `hospitals`(`id`) | 병원 참조 ID            |
| `specialty_id`         | INT           | FOREIGN KEY (`specialty_id`) REFERENCES `specialties`(`id`) | 진료 과목 참조 ID       |

---

## **2. 정규화된 데이터 관계**

1. **`hospitals` ↔ `regions`**:
   - 병원이 속한 지역 정보를 `region_id`로 참조.

2. **`hospitals` ↔ `medical_staff`**:
   - 병원의 의료 인력 정보를 `hospital_id`로 연결.

3. **`hospitals` ↔ `specialties`** (다대다 관계):
   - 병원이 제공하는 진료 과목 정보를 `hospital_specialties`로 연결.

---

## **3. SQL 스키마**

## **3.1. 병원 테이블 (`hospitals`)**

```sql
CREATE TABLE hospitals (
    id INT AUTO_INCREMENT PRIMARY KEY,          -- 병원 고유 ID
    name VARCHAR(255) NOT NULL,                 -- 병원 이름
    category_code VARCHAR(10) NOT NULL,         -- 병원 종별코드
    category_name VARCHAR(100) NOT NULL,        -- 병원 분류명
    region_id INT,                              -- 지역 참조 ID
    address TEXT NOT NULL,                      -- 병원 주소
    phone_number VARCHAR(50),                   -- 병원 전화번호
    website TEXT,                               -- 병원 홈페이지 URL
    FOREIGN KEY (region_id) REFERENCES regions(id) -- 지역 테이블 참조
);
```

## **3.2. 지역 테이블 (`regions`)**

```sql
CREATE TABLE regions (
    id INT AUTO_INCREMENT PRIMARY KEY,          -- 지역 고유 ID
    province_code VARCHAR(10) NOT NULL,         -- 시/도 코드
    province_name VARCHAR(100) NOT NULL,        -- 시/도 이름
    city_code VARCHAR(10) NOT NULL,             -- 시/군/구 코드
    city_name VARCHAR(100) NOT NULL,            -- 시/군/구 이름
    town_name VARCHAR(100)                      -- 읍/면/동 이름 (NULL 허용)
);
```

## **3.3. 의료 인력 테이블 (`medical_staff`)**

```sql
CREATE TABLE medical_staff (
    id INT AUTO_INCREMENT PRIMARY KEY,          -- 인력 정보 고유 ID
    hospital_id INT,                            -- 병원 참조 ID
    general_doctors INT DEFAULT 0,              -- 일반 의사 수
    interns INT DEFAULT 0,                      -- 인턴 수
    residents INT DEFAULT 0,                    -- 레지던트 수
    specialists INT DEFAULT 0,                  -- 전문의 수
    dentists INT DEFAULT 0,                     -- 치과 의사 수
    oriental_doctors INT DEFAULT 0,             -- 한방 의사 수
    midwives INT DEFAULT 0,                     -- 조산사 수
    FOREIGN KEY (hospital_id) REFERENCES hospitals(id) -- 병원 테이블 참조
);
```

## **3.4. 진료 과목 테이블 (`specialties`)**

```sql
CREATE TABLE specialties (
    id INT AUTO_INCREMENT PRIMARY KEY,          -- 진료 과목 고유 ID
    specialty_name VARCHAR(255) UNIQUE NOT NULL -- 진료 과목 이름
);
```

## **3.5. 병원-진료 과목 관계 테이블 (`hospital_specialties`)**

```sql
CREATE TABLE hospital_specialties (
    id INT AUTO_INCREMENT PRIMARY KEY,          -- 고유 ID
    hospital_id INT,                            -- 병원 참조 ID
    specialty_id INT,                           -- 진료 과목 참조 ID
    FOREIGN KEY (hospital_id) REFERENCES hospitals(id), -- 병원 테이블 참조
    FOREIGN KEY (specialty_id) REFERENCES specialties(id) -- 진료 과목 테이블 참조
);
```
