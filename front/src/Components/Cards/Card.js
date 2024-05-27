import React, { useState } from 'react';
import './Card.css';
import img1 from './assets/1.jpg';
import img2 from './assets/2.jpg';
import img3 from './assets/3.jpg';
import img4 from './assets/4.jpg';
import img5 from './assets/5.jpg';
import img6 from './assets/6.jpg';
import img7 from './assets/7.jpg';
import img8 from './assets/8.jpg';
import img9 from './assets/9.jpg';
import closeIcon from './assets/xxx.png';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';

const articles = [
    {
        imgSrc: img1,
        imgAlt: "Monkey D. Luffy",
        title: "Monkey D. Luffy",
        description: "현상금 3,000,000,000 베리. 스트로하트 해적단 단장. 세계정부가 가장 주시하는 초영급 인물.",
    },
    {
        imgSrc: img2,
        imgAlt: "Roronoa Zoro",
        title: "Roronoa Zoro",
        description: "현상금 1,111,000,000 베리. 스트로하트 해적단 부단장. 세계 최강의 검객을 꿈꾸는 삼검류 사용자.",
    },
    {
        imgSrc: img3,
        imgAlt: "Nami",
        title: "Nami",
        description: "현상금 366,000,000 베리. 스트로하트 해적단 항해사. 뛰어난 내비게이션 실력을 가진 천재 항해사.",
    },
    {
        imgSrc: img4,
        imgAlt: "Vinsmoke Sanji",
        title: "Vinsmoke Sanji",
        description: "현상금 1,032,000,000 베리. 스트로하트 해적단 요리사. 뛰어난 발기술과 요리 실력을 가진 블루노의 후계자.",
    },
    {
        imgSrc: img5,
        imgAlt: "Usopp",
        title: "Usopp",
        description: "현상금 200,000,000 베리. 스트로하트 해적단 저격수. 뛰어난 저격 실력과 함께 거짓말쟁이로 유명하다.",
    },
    {
        imgSrc: img6,
        imgAlt: "Brook",
        title: "Brook",
        description: "현상금 183,000,000 베리. 스트로하트 해적단 음유시인. 해골 되살아난 자로, 뛰어난 검술과 음악 실력을 가지고 있다.",
    },
    {
        imgSrc: img7,
        imgAlt: "Tony Tony Chopper",
        title: "Tony Tony Chopper",
        description: "현상금 1,000 베리. 스트로하트 해적단 의사. 인간형 토나카이로, 다양한 변신 능력을 가지고 있다.",
    },
    {
        imgSrc: img8,
        imgAlt: "Nico Robin",
        title: "Nico Robin",
        description: "현상금 930,000,000 베리. 스트로하트 해적단 고고학자. 세계정부가 가장 주시하는 초영급 인물.",
    },
    {
        imgSrc: img9,
        imgAlt: "Jinbe",
        title: "Jinbe",
        description: "현상금 1,038,000,000 베리. 스트로하트 해적단 선장. 전 해군본부 중장으로, 물고기인간족의 대표격이다.",
    },
];

const Card = () => {
    const [showModal, setShowModal] = useState(false);
    const [selectedArticle, setSelectedArticle] = useState(null);

    const handleImageClick = (article, event) => {
        event.preventDefault(); // 드래그 방지
        setSelectedArticle(article);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedArticle(null);
    };

    // 슬라이드 세팅값
    const settings = {
        dots: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        centerMode: true,
        infinite : true,
        arrows : true,
        centerPadding :'50px',
        autoplaySpeed: 2000,
        swipeToSlide: true,
        draggable: true,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 300,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
        ],
    };

    // 카드
    const Article = ({ article, handleImageClick }) => (
        <article onClick={(event) => handleImageClick(article, event)} className='card_art'>
            <figure>
                <img src={article.imgSrc} alt={article.imgAlt} onClick={(event) => handleImageClick(article, event)} />
            </figure>
            <div className="article-preview">
                <h2>{article.title}</h2>
                <p>{article.description}</p>
            </div>
        </article>
    );

    // 리스트 
    const Articles = ({ articles, handleImageClick }) => (
        <div className="articles123">
            {articles.map((article, index) => (
                <Article
                    key={index}
                    article={article}
                    handleImageClick={handleImageClick}
                />
            ))}
        </div>
    );

    // 모달 컴포넌트    
    const Modal = ({ isOpen, onClose, selectedArticle }) => {
        if (!isOpen) return null;
        return (
            <div className="modal-overlay">
                <div className="modal">
                    <button onClick={onClose} className="close-btn">
                        <img src={closeIcon} alt="Close" />
                    </button>
                    {selectedArticle && (
                        <div className='modal_detail'>
                            <img src={selectedArticle.imgSrc} alt={selectedArticle.imgAlt} className='detailImg' />
                            <div className='detailsss'>
                                <h2>{selectedArticle.title}</h2>
                                <p>{selectedArticle.description}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    // 슬라이더
    const SliderComponent = ({ articles, handleImageClick, settings }) => (
        <Slider {...settings}>
            {articles.map((article, index) => (
                <div key={index} className='Acard'>
                    <Article
                        article={article}
                        handleImageClick={handleImageClick}
                    />
                </div>
            ))}
        </Slider>
    );

    return (
        <div className='Card_body'>
            <div className='Slider_size'>
                <SliderComponent articles={articles} handleImageClick={handleImageClick} settings={settings} />
            </div>
            <div className='Wanted_size'>
                <Articles articles={articles} handleImageClick={handleImageClick} />
            </div>
            <Modal isOpen={showModal} onClose={handleCloseModal} selectedArticle={selectedArticle} />
        </div>
    );
};

export default Card;
