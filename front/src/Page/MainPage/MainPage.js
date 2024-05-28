import React from 'react';
import NevBar from '../../Components/NevBar/NevBar';
import './MainPage.css';
import Card from '../../Components/Cards/Card';

const MainPage = () => {
    return (
        <div className="Nev-Card">
            <header className='nevibar_card'> <NevBar /></header>
            <div className='Main_card' >
            <Card />
            </div>
        </div>
    );
};

export default MainPage;
