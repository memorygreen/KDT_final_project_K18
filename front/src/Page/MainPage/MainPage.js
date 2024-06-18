import React, { useState } from 'react';
import NevBar from '../../Components/NevBar/NevBar';
import './MainPage.css';
import Card from '../../Components/Cards/Card/Card';
import AnimatedLinks from '../../Components/AnimatedLinks/AnimatedLinks';
import CardModal from '../../Components/Cards/CardModal/CardModal';

const MainPage = () => {
    const [showModal, setShowModal] = useState(false);
    const [selectedArticle, setSelectedArticle] = useState(null);

    const handleOpenModal = (article) => {
        setSelectedArticle(article);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    return (
        <div className="Nev-Card">
            <header className='nevibar_card'> <NevBar /></header>
            <div className='Main_start'>
                <AnimatedLinks />
            </div>
            <div className='Main_card' >
                <Card onImageClick={handleOpenModal} />
            </div>
            <div className='Card_modals'>
                <CardModal isOpen={showModal} onClose={handleCloseModal} selectedArticle={selectedArticle} />
            </div>
        </div>
    );
};

export default MainPage;
