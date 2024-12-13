import pandas as pd
import sqlite3

# SQLite 데이터베이스 연결
db_path = 'hospital_data.db'  # SQLite 데이터베이스 경로
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# 엑셀 파일에서 데이터 읽기
xlsx_path = './hospital_data.xlsx'  # 엑셀 파일 경로
df = pd.read_excel(xlsx_path)

# 1. hospital_types 테이블 업데이트
# 종별코드와 종별코드명 컬럼 추출 및 중복 제거
hospital_types_df = df[['종별코드', '종별코드명']].drop_duplicates()

# hospital_types 테이블에 데이터 삽입
for _, row in hospital_types_df.iterrows():
    cursor.execute("""
        INSERT OR IGNORE INTO hospital_types (type_code, type_name)
        VALUES (?, ?)
    """, (row['종별코드'], row['종별코드명']))

# 2. hospitals 테이블의 type_code 업데이트
# 암호화요양기호와 종별코드 기준으로 업데이트
for _, row in df.iterrows():
    cursor.execute("""
        UPDATE hospitals
        SET type_code = ?
        WHERE encrypted_code = ?
    """, (row['종별코드'], row['암호화요양기호']))

# 변경 사항 커밋 및 연결 종료
conn.commit()
conn.close()

print("hospital_types 테이블이 업데이트되고, hospitals 테이블의 type_code가 갱신되었습니다.")
