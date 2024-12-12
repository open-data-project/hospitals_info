# hospitals_info

아래는 데이터베이스 스키마를 **마크다운 형식**으로 작성한 내용입니다.

---

# **병원 정보 조회 시스템 데이터베이스 스키마**

## **1. hospitals (병원 정보)**

| 컬럼명               | 데이터 타입    | 제약 조건                                           | 설명                     |
|---------------------|---------------|---------------------------------------------------|--------------------------|
| `id`               | INT           | PRIMARY KEY, AUTO_INCREMENT                       | 고유 병원 ID             |
| `encrypted_code`   | VARCHAR(50)   | NULLABLE                                          | 암호화 요양기호          |
| `name`             | VARCHAR(255)  | NOT NULL                                          | 병원 이름                |
| `category_name`    | VARCHAR(100)  | NOT NULL                                          | 병원 분류 (예: 종합병원)  |
| `region_id`        | INT           | FOREIGN KEY (`region_id`) REFERENCES `regions`(`id`) | 지역 참조 ID            |
| `address`          | TEXT          | NOT NULL                                          | 병원 주소                |
| `phone_number`     | VARCHAR(50)   | NULLABLE                                          | 병원 전화번호            |
| `website`          | TEXT          | NULLABLE                                          | 병원 홈페이지 URL         |
| `specialists`      | INT           | DEFAULT 0                                         | 의과 전문의 수            |
| `dentist_specialists` | INT        | DEFAULT 0                                         | 치과 전문의 수            |
| `oriental_specialists` | INT       | DEFAULT 0                                         | 한방 전문의 수            |

---

## **2. regions (지역 정보)**

| 컬럼명               | 데이터 타입    | 제약 조건               | 설명                     |
|---------------------|---------------|-------------------------|--------------------------|
| `id`               | INT           | PRIMARY KEY, AUTO_INCREMENT | 고유 지역 ID            |
| `province_name`    | VARCHAR(100)  | NOT NULL               | 시/도 이름               |
| `city_name`        | VARCHAR(100)  | NOT NULL               | 시/군/구 이름            |

---

## **3. specialties (진료 과목 정보)**

| 컬럼명               | 데이터 타입    | 제약 조건               | 설명                     |
|---------------------|---------------|-------------------------|--------------------------|
| `id`               | INT           | PRIMARY KEY, AUTO_INCREMENT | 고유 진료 과목 ID       |
| `specialty_name`   | VARCHAR(255)  | UNIQUE, NOT NULL        | 진료 과목 이름 (예: 내과, 치과) |

---

## **4. hospital_specialties (병원-진료 과목 관계)**

| 컬럼명               | 데이터 타입    | 제약 조건                                           | 설명                     |
|---------------------|---------------|---------------------------------------------------|--------------------------|
| `id`               | INT           | PRIMARY KEY, AUTO_INCREMENT                       | 고유 관계 ID             |
| `hospital_id`      | INT           | FOREIGN KEY (`hospital_id`) REFERENCES `hospitals`(`id`) | 병원 참조 ID            |
| `specialty_id`     | INT           | FOREIGN KEY (`specialty_id`) REFERENCES `specialties`(`id`) | 진료 과목 참조 ID       |

