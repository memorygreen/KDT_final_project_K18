import React from 'react';
import NevBar from '../../Components/NevBar/NevBar';
import './MainPage.css';
import Card from '../../Components/Cards/Card/Card';
import AnimatedLinks from '../../Components/AnimatedLinks/AnimatedLinks';

const MainPage = () => {
    return (
        <div className="Nev-Card">
            <header className='nevibar_card'> <NevBar /></header>
            <div className='Main_start'>
                <AnimatedLinks />
            </div>
            <div className='Main_card' >
                <Card />
            </div>
        </div>
    );
};

export default MainPage;
