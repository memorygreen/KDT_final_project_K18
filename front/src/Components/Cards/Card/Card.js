// src/components/Card/Card.js

import React, { useEffect, useState } from 'react';
import './Card.css';
import CardModal from '../CardModal/CardModal'; // Modal 컴포넌트 임포트
import axios from 'axios';
import CardSlider from '../CardSlider/CardSlider'; // CardSlider 컴포넌트 임포트
import Article from './Article'; // Article 컴포넌트 임포트

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import imagesLoaded from 'imagesloaded';

gsap.registerPlugin(ScrollTrigger);

const Card = () => {
    const [posters, setPosters] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedArticle, setSelectedArticle] = useState(null);

    useEffect(() => {
        // 포스터 데이터 가져오기
        axios.get('/missing_info')
            .then(response => {
                console.log(response.data);
                setPosters(response.data);
            }).catch(error => {
                // 에러 처리
                console.error('There was a problem with the axios operation:', error);
            });

    }, []);

    // 모달 창 보는 기능
    const handleImageClick = (article, event) => {
        event.preventDefault(); // 드래그 방지
        setSelectedArticle(article);
        setShowModal(true);
    };

    // 모달 창 닫는 기능
    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedArticle(null);
    };


    const Columns = () => {
        useEffect(() => {
            imagesLoaded(document.querySelectorAll('.column__item-img'), { background: true }, () => {
                // 애니메이션 초기화 로직
            });
        }, []);

        return (
            <div className="Poster_columns">
                {posters.map((poster, index) => (
                    <Article
                        className="Poster_column"
                        key={index}
                        article={poster}
                        handleImageClick={handleImageClick}
                    />
                ))}
            </div>
        );
    };


    // 전체 포스터 리스트
    const Articles = ({ posters }) => (
        <div className="Card_articles">
            {posters.map((poster, index) => (
                <Article
                    className="Card_article"
                    key={index}
                    article={poster}
                    handleImageClick={handleImageClick}
                />
            ))}
        </div>
    );

    return (
        <div className='Card_body'>
            {/* <div className='Slider_size'>
                <CardSlider posters={posters} handleImageClick={handleImageClick} />
            </div> */}
            <div className='Wanted_size'>
                <Articles posters={posters} />
            </div> 
            <CardModal isOpen={showModal} onClose={handleCloseModal} selectedArticle={selectedArticle} />
            <div className='Columns_size'>
                <Columns />
            </div>
        </div>
    );
};

export default Card;
