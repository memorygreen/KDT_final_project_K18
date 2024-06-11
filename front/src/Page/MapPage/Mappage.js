import React from 'react';
import KakaoMap from '../../Components/Map/KakaoMap';
import Sidebar from '../../Components/SideBar/SideBar';
import NevBar from '../../Components/NevBar/NevBar';
import './Mappage.css';

const Mappage = () => {
  return (
    <div className='main-main-container'>
      <header className='nevibar'> <NevBar /></header>
      <div className="main-container">
        <div className="map-container">
          <div>
            <KakaoMap />
          </div>
          <div className="sidebar1">
            {/* <Sidebar /> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mappage;
