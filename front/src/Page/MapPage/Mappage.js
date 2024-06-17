import React, { useState, useEffect } from 'react';
import KakaoMap from '../../Components/Map/KakaoMap';
import Sidebar from '../../Components/SideBar/SideBar';
import MissingSidebar from '../../Components/SideBar/MissingSideBar';
import NevBar from '../../Components/NevBar/NevBar';
import './Mappage.css';
import axios from 'axios';

const Mappage = () => {
  const [missingIdx, setMissingIdx] = useState(null);
  const [missingList, setMissingList] = useState([]);

  // 실종자 목록 불러오기
  const fetchMissingData = () => {
    const sessionId = sessionStorage.getItem('userId'); // 세션 스토리지에서 userId 가져오기
    console.log('sessionId:', sessionId);
    axios.post('/missing_info_oneuser', { user_id: sessionId })  
      .then(response => {
        console.log('Missing data:', response.data);
        setMissingList(response.data);
      })
      .catch(error => {
        console.error('Error fetching missing data:', error);
      });
  };

  useEffect(() => {
    fetchMissingData();
  }, []);

  return (
    <div className='main-main-container'>
      <header className='nevibar'> <NevBar /></header>
      <div className="main-container">
      <div className="map-container">
          <KakaoMap missingIdx={missingIdx} />
          <div className="missing-sidebar-container">
            <MissingSidebar missingList={missingList} setMissingIdx={setMissingIdx} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mappage;