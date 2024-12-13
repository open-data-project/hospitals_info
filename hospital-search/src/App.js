import React, { useState } from 'react';

function App() {
  const [search, setSearch] = useState('');
  const hospitals = [
    { name: 'Seoul Hospital', address: '123 Main St' },
    { name: 'Busan Clinic', address: '456 Ocean Rd' },
    { name: 'Daegu Medical Center', address: '789 Forest Ln' },
  ];

  const filteredHospitals = hospitals.filter(hospital =>
    hospital.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: '20px', backgroundColor: 'white', height: '100vh' }}>
      <h1 style={{ textAlign: 'center' }}>병원 검색</h1>
      <input
        type="text"
        placeholder="병원 이름 검색"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ padding: '10px', marginBottom: '20px', fontSize: '16px' }}
      />
      <div>
        {filteredHospitals.map((hospital, index) => (
          <div
            key={index}
            style={{
              border: '1px solid black',
              padding: '10px',
              marginBottom: '10px',
            }}
          >
            <h2 style={{ margin: '0', fontSize: '18px' }}>{hospital.name}</h2>
            <p style={{ margin: '0', fontSize: '14px' }}>{hospital.address}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
