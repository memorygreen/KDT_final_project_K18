// src/components/Article/Article.js

import React from 'react';

const Article = ({ article, handleImageClick,className }) => {
    const posterPath = article.POSTER_INFO ? article.POSTER_INFO.POSTER_IMG_PATH : 'default_poster_path.jpg';
    return (
        <article onClick={(event) => handleImageClick(article, event)} className='card_art'>
            <figure>
                <img src={posterPath} alt="Poster" onClick={(event) => handleImageClick(article, event)} />
            </figure>
            <div className={className}>
                <h2>{article.MISSING_NAME}</h2>
                <p>{article.description}</p>
            </div>
        </article>
    );
};

export default Article;
