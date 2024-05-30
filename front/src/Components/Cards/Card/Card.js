import React, { useEffect, useState } from 'react';
import './Card.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';
import CardModal from '../CardModal/CardModal'; // Modal 컴포넌트 임포트
import axios from 'axios';

const Card = () => {
    const [posters, setPosters] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedArticle, setSelectedArticle] = useState(null);


    useEffect(() => {
        // 포스터 데이터 가져오기
        axios.get('/missing_info')
            .then(response => {
                // 성공적으로 데이터를 받았을 때 처리
                console.log(response.data);
                setPosters(response.data);
            })
            .catch(error => {
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

    // 개별 포스터 사진
    const Article = ({ article }) => {
        if (!article.POSTER_INFO.POSTER_IMG_PATH) return null; // 이미지 경로가 없으면 렌더링하지 않음

        return (
            <article onClick={(event) => handleImageClick(article, event)} className='card_art'>
                <figure>
                    <img src={article.POSTER_INFO.POSTER_IMG_PATH} alt="Poster" onClick={(event) => handleImageClick(article, event)} />
                </figure>
                <div className="article-preview">
                    <h2>{article.MISSING_NAME}</h2>
                    <p>{article.description}</p>
                </div>
            </article>
        );
    };

    // 전체 포스터 리스트
    const Articles = ({ posters }) => (
        <div className="Card_articles">
            {posters.map((poster, index) => (
                <Article
                    key={index}
                    article={poster}
                />
            ))}
        </div>
    );

    // 슬라이더 세팅값
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

    // 슬라이더 
    const SliderComponent = ({ posters }) => (
        <Slider {...settings}>
            {posters.map((poster, index) => (
                <div key={index} className='Acard'>
                    <Article
                        article={poster}
                    />
                </div>
            ))}
        </Slider>
    );

    return (
        <div className='Card_body'>
            <div className='Slider_size'>
                <SliderComponent posters={posters} />
            </div>
            <div className='Wanted_size'>
                <Articles posters={posters} />
            </div>
            <CardModal isOpen={showModal} onClose={handleCloseModal} selectedArticle={selectedArticle} />
        </div>
    );
};

export default Card;
