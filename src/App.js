import React, { useState } from 'react';

function App() {
  const [province, setProvince] = useState('');
  const [city, setCity] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [hospitals, setHospitals] = useState([]);

  const cityOptions = {
    부산: [
      '부산서구', '부산진구', '부산북구', '부산동래구', '부산기장군',
      '부산연제구', '부산남구', '부산수영구', '부산영도구', '부산해운대구',
      '부산사상구', '부산동구', '부산중구', '부산강서구', '부산사하구', '부산금정구'
    ],
    대전: [
      '대전중구', '대전서구', '대전대덕구', '대전동구', '대전유성구'
    ],
    광주: [
      '광주동구', '광주광산구', '광주남구', '광주북구', '광주서구'
    ],
    대구: [
      '대구중구', '대구달서구', '대구남구', '대구북구', '대구수성구',
      '대구동구', '대구서구', '대구달성구', '대구군위구'
    ],
    강원: [
      '강릉시', '원주시', '춘천시', '삼척시', '속초시', '영월군', '동해시', 
      '태백시', '홍천군', '정선군', '양구군', '인제군', '철원군', '횡성군', 
      '평창군', '화천군', '고성군', '양양군'
    ],
    경기: [
      '수원시', '성남시', '안양시', '고양시', '용인시', '화성시', '평택시', 
      '남양주시', '부천시', '광명시', '하남시', '오산시', '군포시', '이천시', 
      '안성시', '포천시', '구리시', '김포시', '광주시', '여주시'
    ],
    경남: [
      '진주시', '양산시', '창원마산회원구', '김해시', '창원마산합포구', '창원성산구', 
      '통영시', '창원진해구', '거제시', '창원의창구', '고성군', '거창군', '밀양시', 
      '사천시', '합천군', '함안군', '의령군', '남해군', '창녕군', '하동군', 
      '함양군', '산청군'
    ],
    충남: [
      '천안동남구', '당진시', '서산시', '아산시', '논산시', '천안서북구', '예산군', 
      '보령시', '공주시', '홍성군', '금산군', '계룡시', '서천군', '부여군', '청양군', 
      '태안군'
    ],
    전남: [
      '익산시', '전주덕진구', '부안군', '군산시', '고창군', '전주완산구', '정읍시', 
      '남원시', '김제시', '진안군', '임실군', '완주군', '순창군', '무주군', '장수군'
    ],
    충북: ['청주서원구', '충주시', '진천군', '제천시', '청주상당구', '옥천군', '청주흥덕구',
      '청주청원구', '음성군', '괴산군', '보은군', '영동군', '단양군', '증평군'],
    울산: ['울산동구', '울산울주군', '울산남구', '울산북구', '울산중구'],
    전남: ['화순군', '광양시', '순천시', '나주시', '목포시', '여수시', '영광군', '장흥군',
      '무안군', '고흥군', '해남군', '구례군', '함평군', '담양군', '영암군', '보성군',
      '완도군', '진도군', '곡성군', '신안군', '장성군', '강진군'],
    경북: ['김천시', '안동시', '포항북구', '구미시', '경주시', '상주시', '포항남구', '영천시',
      '영주시', '경산시', '문경시', '봉화군', '영덕군', '울진군', '의성군', '칠곡군',
      '청도군', '영양군', '예천군', '성주군', '고령군', '청송군', '울릉군'],
    세종시: ['세종시'],
    제주: ['제주시', '서귀포시']
  
  
  
  };



  // 검색 버튼 클릭 시 API 호출
  const handleSearch = () => {
    let query = '';
    if (province) query += `province_name=${province}&`;
    if (city) query += `city_name=${city}&`;
    if (specialty) query += `specialty_name=${specialty}`;
    console.log(query);
    
    // 쿼리 파라미터가 있으면 API 요청
    if (query) {
      fetch(`http://localhost:5000/api/hospitals?${query}`)
        .then(response => response.json())
        .then(data => setHospitals(data))
        .catch(error => console.error('Error fetching hospitals:', error));
    }
  };

  return (
    <div style={{ padding: '20px', backgroundColor: 'white', height: '100vh',fontSize: '40px' }}>
      <h1 style={{ textAlign: 'center' }}>병원 검색</h1>

      <div style={{ marginBottom: '20px', fontSize: '30px'}}>
        <label style={{ marginLeft: '10px', fontSize: '30px' }}>
          <strong style={{ marginLeft: '10px', fontSize: '30px' }}>지역:</strong>
          <select value={province} onChange={(e) => setProvince(e.target.value)} style={{ fontSize: '30px', padding: '3px' }} >
            <option value="">전체</option>            
            <option value="경기">경기</option>
            <option value="인천">인천</option>
            <option value="강원">강원</option>
            <option value="서울">서울</option>
            <option value="대구">대구</option>
            <option value="경남">경남</option>
            <option value="부산">부산</option>
            <option value="충남">충남</option>
            <option value="전북">전북</option>
            <option value="광주">광주</option>
            <option value="대전">대전</option>
            <option value="충북">충북</option>
            <option value="울산">울산</option>
            <option value="전남">전남</option>
            <option value="경북">경북</option>
            <option value="세종시">세종시</option>
            <option value="제주">제주</option>
          </select>
        </label>

        <label style={{ marginLeft: '10px' }}>
        <strong style={{ fontSize: '30px' }}>시/구:</strong>
        <select value={city} onChange={(e) => setCity(e.target.value)} disabled={!province} style={{ fontSize: '30px', padding: '3px' }}>
          <option value="">전체</option>
          {province && cityOptions[province]?.map((cityName) => (
            <option key={cityName} value={cityName}>
              {cityName}
            </option>
          ))}
        </select>
      </label>

        <label style={{ marginLeft: '10px' }}>
          <strong style={{ fontSize: '30px' }}>진료 과목:</strong>
          <select value={specialty} onChange={(e) => setSpecialty(e.target.value)} style={{ fontSize: '30px', padding: '3px' }}>
            <option value="">전체</option>
            <option value="내과">내과</option>
            <option value="신경과">신경과</option>
            <option value="정신건강의학과">정신건강의학과</option>
            <option value="외과">외과</option>
            <option value="정형외과">정형외과</option>
            <option value="신경외과">신경외과</option>
            <option value="심장혈관흉부외과">심장혈관흉부외과</option>
            <option value="성형외과">성형외과</option>
            <option value="마취통증의학과">마취통증의학과</option>
            <option value="산부인과">산부인과</option>
            <option value="소아청소년과">소아청소년과</option>
            <option value="안과">안과</option>
            <option value="이비인후과">이비인후과</option>
            <option value="피부과">피부과</option>
            <option value="비뇨의학과">비뇨의학과</option>
            <option value="영상의학과">영상의학과</option>
            <option value="방사선종양학과">방사선종양학과</option>
            <option value="병리과">병리과</option>
            <option value="진단검사의학과">진단검사의학과</option>
            <option value="결핵과">결핵과</option>
            <option value="재활의학과">재활의학과</option>
            <option value="핵의학과">핵의학과</option>
            <option value="가정의학과">가정의학과</option>
            <option value="응급의학과">응급의학과</option>
            <option value="직업환경의학과">직업환경의학과</option>
            <option value="예방의학과">예방의학과</option>
            <option value="치과">치과</option>
            <option value="구강악안면외과">구강악안면외과</option>
            <option value="치과보철과">치과보철과</option>
            <option value="치과교정과">치과교정과</option>
            <option value="소아치과">소아치과</option>
            <option value="치주과">치주과</option>
            <option value="치과보존과">치과보존과</option>
            <option value="구강내과">구강내과</option>
            <option value="영상치의학과">영상치의학과</option>
            <option value="구강병리과">구강병리과</option>
            <option value="예방치과">예방치과</option>
            <option value="통합치의학과">통합치의학과</option>
            <option value="한방내과">한방내과</option>
            <option value="한방부인과">한방부인과</option>
            <option value="한방소아과">한방소아과</option>
            <option value="한방안·이비인후·피부과">한방안·이비인후·피부과</option>
            <option value="한방신경정신과">한방신경정신과</option>
            <option value="침구과">침구과</option>
            <option value="한방재활의학과">한방재활의학과</option>
            <option value="사상체질과">사상체질과</option>
            <option value="한방응급">한방응급</option>

            {/* 다른 진료 과목 옵션 추가 */}
          </select>
        </label>

        <button 
          onClick={handleSearch} 
          style={{ padding: '5px', marginLeft: '15px', fontSize: '25px' }}
        >검색</button>
      </div>

      <div>
        {hospitals.length > 0 ? (
          hospitals.map((hospital, index) => (
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
          ))
        ) : (
          <p>검색된 병원이 없습니다.</p>
        )}
      </div>
    </div>
  );
}

export default App;
