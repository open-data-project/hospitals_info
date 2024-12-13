import React, { useState, useEffect } from 'react';

function Favorites() {
  const [favorites, setFavorites] = useState([]);

  // 페이지 로드 시 즐겨찾기 목록 가져오기
  useEffect(() => {
    const fetchFavorites = async () => {
      const response = await fetch('http://localhost:5000/api/favorites');
      const data = await response.json();
      setFavorites(data);
    };

    fetchFavorites();
  }, []);

  return (
    <div style={{ padding: '20px', backgroundColor: '#f9f9f9' }}>
      <h1 style={{ textAlign: 'center', fontSize: '2rem', color: '#333' }}>즐겨찾기한 병원 목록</h1>
      
      {/* 병원 목록 */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
        {favorites.map((hospital) => (
          <div
            key={hospital.encrypted_code}
            style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              width: '250px',
              margin: '10px',
              padding: '15px',
              textAlign: 'center',
              transition: 'transform 0.2s',
            }}
          >
            <h3 style={{ color: '#333', fontSize: '1.25rem' }}>{hospital.name}</h3>
            <p style={{ color: '#777', fontSize: '0.9rem' }}>{hospital.address}</p>
            {/* 추가 정보나 버튼이 필요하면 여기에 넣을 수 있습니다 */}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Favorites;