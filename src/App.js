import React, { useState, useEffect } from 'react';

function App() {
  const [hospitals, setHospitals] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetch(`http://localhost:5000/api/hospitals?page=${page}`)
      .then(response => response.json())
      .then(data => {
        setHospitals(prevHospitals => [...prevHospitals, ...data]);
  })
      .catch(error => console.error('Error fetching hospitals:', error));
  }, [page]);

  console.log(hospitals);

  const nextpage = () => {
    setPage(prevPage => prevPage + 1);
  };

  return (
    <div style={{ padding: '20px', backgroundColor: 'white', height: '100vh' }}>
      <h1 style={{textAlign: 'center'}}>병원 검색</h1>
      <div>
        {hospitals.map((hospital, index) => (
          <div
            key={index}
            style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '15px',
              marginBottom: '15px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          }}
          >
            <h2 style={{ margin: '0', fontSize: '18px', color: '#333' }}>{hospital.name}</h2>
            <p style={{ margin: '0', fontSize: '14px', color: '#555' }}>{hospital.address}</p>
          </div>
        ))}
  
      </div>
      <button
        onClick={nextpage}
        style={{
          display: 'block',
          width: '100%',
          padding: '10px',
          marginTop: '20px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          fontSize: '16px',
          cursor: 'pointer',
        }}
      >
        더 보기
      </button>
    </div>
  );
}
 
export default App;
