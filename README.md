
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
    encrypted_code VARCHAR(255) PRIMARY KEY,   -- 병원의 고유 ID (암호화요양기호)
    name VARCHAR(255) NOT NULL,                -- 병원 이름
    address TEXT NOT NULL,                     -- 병원의 상세 주소
    phone_number VARCHAR(50),                  -- 병원의 전화번호
    total_doctors INT DEFAULT 0,               -- 병원의 총 의사 수
    specialists INT DEFAULT 0,                 -- 병원의 전문의 수
    region_id INTEGER NOT NULL,                -- 지역 참조 ID
    FOREIGN KEY (region_id) REFERENCES regions(id) 
    ON DELETE CASCADE 
    ON UPDATE CASCADE
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
    id INTEGER PRIMARY KEY AUTOINCREMENT,  -- 지역 고유 ID
    province_code VARCHAR(10) NOT NULL,   -- 시/도 코드
    province_name VARCHAR(100) NOT NULL,  -- 시/도 이름
    city_code VARCHAR(10) NOT NULL,       -- 시/군/구 코드
    city_name VARCHAR(100) NOT NULL,      -- 시/군/구 이름
    town_name VARCHAR(100),               -- 읍/면/동 이름
    UNIQUE (province_code, city_code, town_name) -- 중복 방지
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
    id INTEGER PRIMARY KEY AUTOINCREMENT,   -- 진료 과목 고유 ID
    encrypted_code VARCHAR(255) NOT NULL,  -- 병원 고유 ID (암호화요양기호)
    specialty_code VARCHAR(10) NOT NULL,   -- 진료 과목 코드
    specialty_name VARCHAR(255) NOT NULL,  -- 진료 과목 이름
    specialist_count INT DEFAULT 0,        -- 해당 과목의 전문의 수
    FOREIGN KEY (encrypted_code) REFERENCES hospitals(encrypted_code)
    ON DELETE CASCADE 
    ON UPDATE CASCADE
);
```

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
