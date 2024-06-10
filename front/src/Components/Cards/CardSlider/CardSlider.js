// src/components/CardSlider/CardSlider.js

import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './CardSlider.css';
import Article from '../Card/Article'; // Article 컴포넌트 경로에 맞게 수정

const CardSlider = ({ posters, handleImageClick }) => {
    const settings = {
        dots: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        centerMode: true,
        infinite: true,
        arrows: true,
        centerPadding: '50px',
        autoplaySpeed: 2000,
        swipeToSlide: true,
        draggable: true,
        responsive: [
            {
                breakpoint: 1140,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    centerPadding: '30px',
                },
            },
            {
                breakpoint: 750,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    centerPadding: '30px',
                },
            },
        ],
    };

    return (
        <Slider {...settings}>
            {posters.filter(poster => poster.POSTER_INFO && poster.POSTER_INFO.POSTER_IMG_PATH).map((poster, index) => (
                <div key={index} className='Acard'>
                    <Article article={poster} handleImageClick={handleImageClick} />
                </div>
            ))}
        </Slider>
    );
};

export default CardSlider;
